$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"patient@hospital.com","password":"Patient@123"}'
$token = $loginRes.data.token
$headers = @{ "Authorization" = "Bearer $token" }
Write-Host "Patient token acquired successfully: $($token.Substring(0, 20))..."

$docRes = Invoke-RestMethod -Uri "http://localhost:8080/api/doctors" -Method Get -Headers $headers
$doc = $docRes.data[0]
Write-Host "Testing with Doctor: $($doc.fullName) (ID: $($doc.id))"

# 1. Test booking for tomorrow
$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$slot = "10:00 AM - 10:30 AM"
$body1 = @{
    doctorId = $doc.id
    departmentId = $doc.departmentId
    appointmentDate = $tomorrow
    timeSlot = $slot
    reasonForVisit = "Routine Heart Checkup"
} | ConvertTo-Json

Write-Host "Booking slot for tomorrow ($tomorrow) at $slot..."
try {
    $appt1 = Invoke-RestMethod -Uri "http://localhost:8080/api/appointments" -Method Post -ContentType "application/json" -Headers $headers -Body $body1
    Write-Host "[SUCCESS] Appointment 1 booked! Token: $($appt1.tokenNumber), Slot: $($appt1.timeSlot)"
} catch {
    Write-Host "Appointment 1 error: $($_.Exception.Message)"
}

# 2. Test duplicate booking for same doctor + date + slot (should be rejected)
Write-Host "Attempting duplicate booking for exact same doctor, date, and slot..."
try {
    $appt2 = Invoke-RestMethod -Uri "http://localhost:8080/api/appointments" -Method Post -ContentType "application/json" -Headers $headers -Body $body1
    Write-Host "[ERROR] Duplicate booking unexpectedly succeeded!"
} catch {
    Write-Host "[EXPECTED REJECTION] Duplicate rejected: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Host "Response Details: $($_.ErrorDetails.Message)"
    }
}

# 3. Test booked slots endpoint
$bookedUrl = "http://localhost:8080/api/appointments/booked-slots?doctorId=" + $doc.id + "`&date=" + $tomorrow
$booked = Invoke-RestMethod -Uri $bookedUrl -Method Get -Headers $headers
Write-Host "Booked slots for Dr. $($doc.fullName) on $($tomorrow):"
$booked | ForEach-Object { Write-Host " - $_" }

# 4. Test same-day booking when time is after 9 PM (current time is ~23:30)
$today = (Get-Date).ToString("yyyy-MM-dd")
$bodyToday = @{
    doctorId = $doc.id
    departmentId = $doc.departmentId
    appointmentDate = $today
    timeSlot = "09:00 AM - 09:30 AM"
    reasonForVisit = "Late Same-Day Test"
} | ConvertTo-Json

Write-Host "`nTesting same-day booking after 9 PM ($today)..."
try {
    $apptToday = Invoke-RestMethod -Uri "http://localhost:8080/api/appointments" -Method Post -ContentType "application/json" -Headers $headers -Body $bodyToday
    Write-Host "[ERROR] Late booking unexpectedly succeeded!"
} catch {
    Write-Host "[EXPECTED REJECTION] Late same-day booking rejected as expected: $($_.Exception.Message)"
}

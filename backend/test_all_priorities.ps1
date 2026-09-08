# 1. Login Patient
$patRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"patient@hospital.com","password":"Patient@123"}'
$patToken = $patRes.data.token
$patHeaders = @{ "Authorization" = "Bearer $patToken" }
Write-Host "Patient logged in: $($patRes.data.fullName)"

# 2. Get Doctor
$doc = (Invoke-RestMethod -Uri "http://localhost:8080/api/doctors" -Method Get -Headers $patHeaders).data[0]
Write-Host "Doctor: $($doc.fullName) (Doc ID: $($doc.id), Dept: $($doc.departmentName))"

$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$today = (Get-Date).ToString("yyyy-MM-dd")

# 3. Test NORMAL booking
Write-Host "`n--- 1. Testing NORMAL Priority Booking ---"
$normalPayload = @{
    departmentId = $doc.departmentId
    doctorId = $doc.id
    appointmentDate = $tomorrow
    timeSlot = "09:00 AM - 09:30 AM"
    priority = "NORMAL"
    symptoms = "Routine cardiovascular checkup"
} | ConvertTo-Json

try {
    $apptNormal = Invoke-RestMethod -Uri "http://localhost:8080/api/appointments" -Method Post -ContentType "application/json" -Headers $patHeaders -Body $normalPayload
    Write-Host "[SUCCESS] NORMAL booked! Token: $($apptNormal.data.tokenNumber), Date: $($apptNormal.data.appointmentDate), Priority: $($apptNormal.data.priority)"
} catch {
    Write-Host "[ERROR] Normal booking failed: $($_.Exception.Message)"
}

# 4. Test SENIOR_CITIZEN booking
Write-Host "`n--- 2. Testing SENIOR_CITIZEN Priority Booking ---"
$seniorPayload = @{
    departmentId = $doc.departmentId
    doctorId = $doc.id
    appointmentDate = $tomorrow
    timeSlot = "09:30 AM - 10:00 AM"
    priority = "SENIOR_CITIZEN"
    symptoms = "Geriatric heart rhythm assessment"
} | ConvertTo-Json

try {
    $apptSenior = Invoke-RestMethod -Uri "http://localhost:8080/api/appointments" -Method Post -ContentType "application/json" -Headers $patHeaders -Body $seniorPayload
    Write-Host "[SUCCESS] SENIOR_CITIZEN booked! Token: $($apptSenior.data.tokenNumber), Date: $($apptSenior.data.appointmentDate), Priority: $($apptSenior.data.priority)"
} catch {
    Write-Host "[ERROR] Senior booking failed: $($_.Exception.Message)"
}

# 5. Test EMERGENCY booking
Write-Host "`n--- 3. Testing EMERGENCY Priority Booking ---"
$emergPayload = @{
    departmentId = $doc.departmentId
    doctorId = $doc.id
    appointmentDate = $today
    timeSlot = "10:00 AM - 10:30 AM"
    priority = "EMERGENCY"
    symptoms = "Acute severe chest tightness"
} | ConvertTo-Json

try {
    $apptEmerg = Invoke-RestMethod -Uri "http://localhost:8080/api/appointments" -Method Post -ContentType "application/json" -Headers $patHeaders -Body $emergPayload
    Write-Host "[SUCCESS] EMERGENCY booked! Token: $($apptEmerg.data.tokenNumber), Date: $($apptEmerg.data.appointmentDate), Priority: $($apptEmerg.data.priority)"
} catch {
    Write-Host "[ERROR] Emergency booking failed: $($_.Exception.Message)"
}

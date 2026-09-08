# 1. Login Patient
$patRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"patient@hospital.com","password":"Patient@123"}'
$patToken = $patRes.data.token
$patId = $patRes.data.id
$patHeaders = @{ "Authorization" = "Bearer $patToken" }
Write-Host "Patient logged in: $patId"

# 2. Get Doctor
$docRes = Invoke-RestMethod -Uri "http://localhost:8080/api/doctors" -Method Get -Headers $patHeaders
$doc = $docRes.data[0]
Write-Host "Selected Doctor: $($doc.fullName) (Doc ID: $($doc.id), Room: $($doc.roomNumber))"

# 3. Book Normal Appointment first
$today = (Get-Date).ToString("yyyy-MM-dd")
$normalBody = @{
    doctorId = $doc.id
    departmentId = $doc.departmentId
    appointmentDate = $today
    timeSlot = "04:00 PM - 04:30 PM"
    priority = "NORMAL"
    reasonForVisit = "Regular Checkup"
} | ConvertTo-Json

# 4. Book Emergency Appointment
$emergencyBody = @{
    doctorId = $doc.id
    departmentId = $doc.departmentId
    appointmentDate = $today
    timeSlot = "04:30 PM - 05:00 PM"
    priority = "EMERGENCY"
    symptoms = "Severe acute chest pain radiating to left arm (Triage Priority 1)"
} | ConvertTo-Json

Write-Host "Booking Emergency Priority Appointment..."
$emergAppt = Invoke-RestMethod -Uri "http://localhost:8080/api/appointments" -Method Post -ContentType "application/json" -Headers $patHeaders -Body $emergencyBody
Write-Host "[SUCCESS] Emergency Appointment Booked! Token: $($emergAppt.data.tokenNumber), Priority: $($emergAppt.data.priority)"

# 5. Doctor logs in and inspects live queue
$docLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"doctor.sarah@hospital.com","password":"Doctor@123"}'
$docToken = $docLogin.data.token
$docHeaders = @{ "Authorization" = "Bearer $docToken" }

$queueRes = Invoke-RestMethod -Uri "http://localhost:8080/api/queues/doctor/$($doc.id)?date=$today" -Method Get -Headers $docHeaders
Write-Host "`n--- Doctor Live Queue Order for Today ($today) ---"
$pos = 1
foreach ($ticket in $queueRes.data) {
    Write-Host "Position #$($pos): Token $($ticket.tokenNumber) | Patient: $($ticket.patientName) | Priority: $($ticket.priority) | Status: $($ticket.status) | Score: $($ticket.priorityScore)"
    $pos++
}

# 6. Check Doctor Notifications
$notifs = Invoke-RestMethod -Uri "http://localhost:8080/api/notifications/my" -Method Get -Headers $docHeaders
Write-Host "`n--- Doctor Emergency Notifications Received ---"
foreach ($n in $notifs.data) {
    if ($n.type -eq "EMERGENCY_ALERT" -or $n.title -like "*EMERGENCY*") {
        Write-Host "🚨 Alert: $($n.title) | Message: $($n.message)"
    }
}

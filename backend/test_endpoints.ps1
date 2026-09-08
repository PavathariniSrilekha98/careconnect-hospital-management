$ErrorActionPreference = "Stop"

Write-Host "=== 1. Testing Departments Endpoint ==="
$depts = Invoke-RestMethod -Uri "http://localhost:8080/api/departments" -Method Get
Write-Host "Departments Count:" $depts.data.Count
foreach ($d in $depts.data) {
    Write-Host " - Department:" $d.name "Code:" $d.code "Doctors:" $d.doctorCount "Active Queue:" $d.activeQueueCount
}

Write-Host "`n=== 2. Testing Admin Login ==="
$adminBody = '{"email":"admin@hospital.com","password":"Admin@123"}'
$adminLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $adminBody
Write-Host "Admin Logged In:" $adminLogin.data.fullName "Role:" $adminLogin.data.role
$adminToken = $adminLogin.data.token

Write-Host "`n=== 3. Testing Doctor Login ==="
$docBody = '{"email":"doctor.sarah@hospital.com","password":"Doctor@123"}'
$docLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $docBody
$doctorId = $docLogin.data.doctorId
Write-Host "Doctor Logged In:" $docLogin.data.fullName "Doctor ID:" $doctorId "Dept:" $docLogin.data.departmentName "Room:" $docLogin.data.roomNumber
$docToken = $docLogin.data.token

Write-Host "`n=== 4. Testing Patient Login ==="
$patientBody = '{"email":"patient@hospital.com","password":"Patient@123"}'
$patLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $patientBody
Write-Host "Patient Logged In:" $patLogin.data.fullName "Role:" $patLogin.data.role
$patToken = $patLogin.data.token

Write-Host "`n=== 5. Testing Public Live Queue TV Display ==="
$display = Invoke-RestMethod -Uri "http://localhost:8080/api/display/live" -Method Get
Write-Host "Live Display Summary: Total Waiting:" $display.data.totalWaiting "Total In-Consultation:" $display.data.totalInConsultation "Total Completed:" $display.data.totalCompletedToday

Write-Host "`n=== 6. Testing Admin Dashboard Stats ==="
$adminHeaders = @{ "Authorization" = "Bearer $adminToken" }
$adminStats = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/dashboard" -Method Get -Headers $adminHeaders
Write-Host "Admin Stats Total Patients:" $adminStats.data.totalPatients "Total Doctors:" $adminStats.data.totalDoctors "Active Queues:" $adminStats.data.activeQueues "Waiting:" $adminStats.data.waitingPatients

Write-Host "`n=== 7. Testing Doctor Live Queue by Doctor ID ==="
$docHeaders = @{ "Authorization" = "Bearer $docToken" }
$docQueue = Invoke-RestMethod -Uri "http://localhost:8080/api/queues/doctor/$doctorId" -Method Get -Headers $docHeaders
Write-Host "Doctor Queue Count:" $docQueue.data.Count
foreach ($t in $docQueue.data) {
    Write-Host " - Ticket:" $t.tokenNumber "Patient:" $t.patientName "Status:" $t.status "Priority:" $t.priority "Est. Wait:" $t.estimatedWaitMinutes "mins"
}

Write-Host "`n=== 8. Testing Doctor Calling Next Patient ==="
$nextCall = Invoke-RestMethod -Uri "http://localhost:8080/api/queues/doctor/$doctorId/next" -Method Post -Headers $docHeaders
Write-Host "Called Next Patient Token:" $nextCall.data.tokenNumber "Patient:" $nextCall.data.patientName "New Status:" $nextCall.data.status

Write-Host "`n=== 9. Testing Audit Logs (Admin Only) ==="
$auditLogs = Invoke-RestMethod -Uri "http://localhost:8080/api/audit-logs" -Method Get -Headers $adminHeaders
Write-Host "Audit Logs Count:" $auditLogs.data.content.Count
Write-Host "Latest Action:" $auditLogs.data.content[0].action "By:" $auditLogs.data.content[0].userEmail

Write-Host "`n========================================================"
Write-Host "🎉 ALL BACKEND & REST API INTEGRATION TESTS PASSED 100%!"
Write-Host "========================================================"

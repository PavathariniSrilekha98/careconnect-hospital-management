$loginBody = @{
    email = "patient@hospital.com"
    password = "Patient@123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$patientToken = $loginRes.data.token
$patientId = $loginRes.data.id

Write-Output "Patient Logged In: $($loginRes.data.fullName) (ID: $patientId)"

# Fetch patient consultations
$headers = @{
    Authorization = "Bearer $patientToken"
}
$consRes = Invoke-RestMethod -Uri "http://localhost:8080/api/consultations/patient/$patientId" -Method Get -Headers $headers
Write-Output "Patient Consultations Count: $($consRes.data.Count)"
foreach ($c in $consRes.data) {
    Write-Output "  - Token: $($c.tokenNumber) | Doctor: Dr. $($c.doctorName) | Diagnosis: $($c.diagnosis) | Meds: $($c.prescriptionItems.Count)"
}

# Doctor login
$docLoginBody = @{
    email = "doctor.sarah@hospital.com"
    password = "Doctor@123"
} | ConvertTo-Json
$docLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $docLoginBody -ContentType "application/json"
$docToken = $docLoginRes.data.token
$doctorId = $docLoginRes.data.doctorId

Write-Output "`nDoctor Logged In: $($docLoginRes.data.fullName) (Doc ID: $doctorId)"
$docHeaders = @{
    Authorization = "Bearer $docToken"
}
$docConsRes = Invoke-RestMethod -Uri "http://localhost:8080/api/consultations/doctor/$doctorId" -Method Get -Headers $docHeaders
Write-Output "Doctor Consultations Count: $($docConsRes.data.Count)"
foreach ($c in $docConsRes.data) {
    Write-Output "  - Token: $($c.tokenNumber) | Patient: $($c.patientName) | Diagnosis: $($c.diagnosis) | Meds: $($c.prescriptionItems.Count)"
}

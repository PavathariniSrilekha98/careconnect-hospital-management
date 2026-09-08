$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"patient@hospital.com","password":"Patient@123"}'
$token = $loginRes.data.token
$headers = @{ "Authorization" = "Bearer $token" }
$doc = (Invoke-RestMethod -Uri "http://localhost:8080/api/doctors" -Method Get -Headers $headers).data[0]

$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$body = @{
    doctorId = $doc.id
    departmentId = $doc.departmentId
    appointmentDate = $tomorrow
    timeSlot = "10:00 AM - 10:30 AM"
    reasonForVisit = "Duplicate Test"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/appointments" -Method Post -ContentType "application/json" -Headers $headers -Body $body
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    Write-Host "Duplicate Slot Error Response: " $reader.ReadToEnd()
}

$today = (Get-Date).ToString("yyyy-MM-dd")
$bodyToday = @{
    doctorId = $doc.id
    departmentId = $doc.departmentId
    appointmentDate = $today
    timeSlot = "09:00 AM - 09:30 AM"
    reasonForVisit = "Late Booking Test"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/appointments" -Method Post -ContentType "application/json" -Headers $headers -Body $bodyToday
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    Write-Host "Late Booking Error Response: " $reader.ReadToEnd()
}

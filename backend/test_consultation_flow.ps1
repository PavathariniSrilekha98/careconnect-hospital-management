# 1. Login Patient
$patRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"patient@hospital.com","password":"Patient@123"}'
$patToken = $patRes.data.token
$patId = $patRes.data.id
$patHeaders = @{ "Authorization" = "Bearer $patToken" }
Write-Host "Patient logged in: $patId"

# 2. Get Doctor
$docRes = Invoke-RestMethod -Uri "http://localhost:8080/api/doctors" -Method Get -Headers $patHeaders
$doc = $docRes.data[0]
Write-Host "Doctor: $($doc.fullName) (Doc ID: $($doc.id), User ID: $($doc.userId))"

# 3. Book Appointment for tomorrow (or check existing)
$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$body = @{
    doctorId = $doc.id
    departmentId = $doc.departmentId
    appointmentDate = $tomorrow
    timeSlot = "11:00 AM - 11:30 AM"
    reasonForVisit = "Chest Pain and ECG Checkup"
} | ConvertTo-Json

$appt = Invoke-RestMethod -Uri "http://localhost:8080/api/appointments" -Method Post -ContentType "application/json" -Headers $patHeaders -Body $body
Write-Host "Appointment booked: ID $($appt.data.id), Token: $($appt.data.tokenNumber)"

# 4. Check in / Create queue ticket
$ticketRes = Invoke-RestMethod -Uri "http://localhost:8080/api/check-in" -Method Post -ContentType "application/json" -Headers $patHeaders -Body (@{ appointmentId = $appt.data.id } | ConvertTo-Json)
Write-Host "Checked in, Queue Ticket created: $($ticketRes.data.tokenNumber)"

# 5. Login Doctor (doctor.sarah@hospital.com)
$docLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"doctor.sarah@hospital.com","password":"Doctor@123"}'
$docToken = $docLogin.data.token
$docHeaders = @{ "Authorization" = "Bearer $docToken" }
Write-Host "Doctor logged in successfully."

# 6. Doctor fetches queue for tomorrow
$docQueue = Invoke-RestMethod -Uri "http://localhost:8080/api/queues/doctor/$($doc.id)?date=$tomorrow" -Method Get -Headers $docHeaders
Write-Host "Doctor Queue Count on $($tomorrow): $($docQueue.data.Count)"

# 7. Doctor submits Consultation & EMR prescription
$consBody = @{
    appointmentId = $appt.data.id
    symptoms = "Mild chest discomfort on exertion"
    diagnosis = "Early stage hypertension, normal sinus rhythm"
    clinicalNotes = "Patient advised low sodium diet, 30 mins brisk walking daily."
    prescriptionItems = @(
        @{
            medicineName = "Amlodipine 5mg"
            dosage = "1 Tablet"
            frequency = "Once daily in the morning"
            durationDays = 30
            instructions = "Take after breakfast"
        },
        @{
            medicineName = "Aspirin 75mg"
            dosage = "1 Tablet"
            frequency = "Once daily after dinner"
            durationDays = 30
            instructions = "Take with water"
        }
    )
    followUpDate = (Get-Date).AddDays(14).ToString("yyyy-MM-dd")
    durationMinutes = 15
} | ConvertTo-Json

Write-Host "Doctor submitting consultation..."
$savedCons = Invoke-RestMethod -Uri "http://localhost:8080/api/consultations" -Method Post -ContentType "application/json" -Headers $docHeaders -Body $consBody
Write-Host "Consultation saved successfully! ID: $($savedCons.data.id), Diagnosis: $($savedCons.data.diagnosis)"

# 8. Patient fetches Consultation records
$patCons = Invoke-RestMethod -Uri "http://localhost:8080/api/consultations/patient/$patId" -Method Get -Headers $patHeaders
Write-Host "Patient Consultation History records count: $($patCons.data.Count)"
$patCons.data | ForEach-Object {
    Write-Host " - Rec ID: $($_.id) | Doctor: $($_.doctorName) | Diagnosis: $($_.diagnosis) | Medicines: $($_.prescriptionItems.Count)"
}

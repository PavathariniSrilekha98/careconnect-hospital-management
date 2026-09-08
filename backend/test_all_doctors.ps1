$doctors = @(
    @{ email = "doctor.sarah@hospital.com"; name = "Dr. Sarah Jenkins" },
    @{ email = "doctor.david@hospital.com"; name = "Dr. David Reynolds" },
    @{ email = "doctor.marcus@hospital.com"; name = "Dr. Marcus Vance" },
    @{ email = "doctor.priya@hospital.com"; name = "Dr. Priya Sharma" },
    @{ email = "doctor.elena@hospital.com"; name = "Dr. Elena Rostova" },
    @{ email = "doctor.alex@hospital.com"; name = "Dr. Alexander Wright" },
    @{ email = "doctor.maya@hospital.com"; name = "Dr. Maya Lin" },
    @{ email = "doctor.robert@hospital.com"; name = "Dr. Robert Chen" },
    @{ email = "doctor.aisha@hospital.com"; name = "Dr. Aisha Patel" }
)

Write-Host "--- Testing Login for all 9 Seeded Doctors ---"
foreach ($d in $doctors) {
    try {
        $body = @{ email = $d.email; password = "Doctor@123" } | ConvertTo-Json
        $res = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $body
        $docName = $d.name
        $docEmail = $d.email
        $docId = $res.data.doctorId
        $dept = $res.data.departmentName
        Write-Host "[SUCCESS] $docName ($docEmail) logged in! DoctorID: $docId, Dept: $dept"
    } catch {
        Write-Host "[ERROR] $($d.name) login failed: $($_.Exception.Message)"
    }
}

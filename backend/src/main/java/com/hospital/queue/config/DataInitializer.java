package com.hospital.queue.config;

import com.hospital.queue.model.*;
import com.hospital.queue.repository.*;
import com.hospital.queue.service.QrCodeService;
import com.hospital.queue.service.QueueService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final QueueTicketRepository queueTicketRepository;
    private final ConsultationRepository consultationRepository;
    private final PasswordEncoder passwordEncoder;
    private final QrCodeService qrCodeService;
    private final QueueService queueService;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           DoctorRepository doctorRepository,
                           AppointmentRepository appointmentRepository,
                           QueueTicketRepository queueTicketRepository,
                           ConsultationRepository consultationRepository,
                           PasswordEncoder passwordEncoder,
                           QrCodeService qrCodeService,
                           QueueService queueService) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.queueTicketRepository = queueTicketRepository;
        this.consultationRepository = consultationRepository;
        this.passwordEncoder = passwordEncoder;
        this.qrCodeService = qrCodeService;
        this.queueService = queueService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized. Ensuring consultation records...");
            seedConsultationsIfEmpty();
            return;
        }

        log.info("Starting initial sample database seeding...");

        // 1. Seed Admin
        User admin = User.builder()
                .email("admin@hospital.com")
                .password(passwordEncoder.encode("Admin@123"))
                .fullName("System Administrator")
                .phoneNumber("+1 (555) 019-2831")
                .role(Role.ADMIN)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        userRepository.save(admin);
        log.info("Created Admin user: admin@hospital.com / Admin@123");

        // 2. Seed Departments
        Department cardio = Department.builder()
                .name("Cardiology")
                .code("CARD")
                .description("Comprehensive heart care, cardiovascular diagnostics and consultations")
                .icon("HeartPulse")
                .roomBlock("Block A - 2nd Floor")
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Department ortho = Department.builder()
                .name("Orthopedics")
                .code("ORTH")
                .description("Bone, joint, ligament and spinal care specializing in mobility")
                .icon("Bone")
                .roomBlock("Block B - 1st Floor")
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Department genMed = Department.builder()
                .name("General Medicine")
                .code("GEN")
                .description("Primary outpatient consultations, health screenings and chronic care")
                .icon("Stethoscope")
                .roomBlock("Block A - Ground Floor")
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Department dental = Department.builder()
                .name("Dental")
                .code("DENT")
                .description("Oral health, preventative hygiene, orthodontic and dental treatments")
                .icon("Smile")
                .roomBlock("Block C - 2nd Floor")
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Department derm = Department.builder()
                .name("Dermatology")
                .code("DERM")
                .description("Skin health, dermatological therapies and allergy management")
                .icon("Sparkles")
                .roomBlock("Block B - 3rd Floor")
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Department ped = Department.builder()
                .name("Pediatrics")
                .code("PED")
                .description("Newborn to adolescent specialized healthcare and pediatric immunizations")
                .icon("Baby")
                .roomBlock("Block A - 1st Floor")
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        cardio = departmentRepository.save(cardio);
        ortho = departmentRepository.save(ortho);
        genMed = departmentRepository.save(genMed);
        dental = departmentRepository.save(dental);
        derm = departmentRepository.save(derm);
        ped = departmentRepository.save(ped);

        // 3. Seed Doctors & their User Accounts
        Doctor docSarah = createDoctorWithUser(
                "doctor.sarah@hospital.com",
                "Doctor@123",
                "Dr. Sarah Jenkins",
                "+1 (555) 012-3456",
                cardio,
                "Senior Cardiologist & Interventional Heart Specialist",
                "MBBS, MD (Cardiology), FACC",
                "Room 204",
                14,
                10
        );

        Doctor docDavid = createDoctorWithUser(
                "doctor.david@hospital.com",
                "Doctor@123",
                "Dr. David Reynolds",
                "+1 (555) 012-7788",
                cardio,
                "Cardiovascular Surgeon & Heart Rhythm Specialist",
                "MBBS, MS (Cardiothoracic), FACS",
                "Room 206",
                16,
                15
        );

        Doctor docMarcus = createDoctorWithUser(
                "doctor.marcus@hospital.com",
                "Doctor@123",
                "Dr. Marcus Vance",
                "+1 (555) 014-9821",
                ortho,
                "Orthopedic Surgeon & Joint Replacement",
                "MBBS, MS (Ortho), FRCS",
                "Room 102",
                11,
                10
        );

        Doctor docPriya = createDoctorWithUser(
                "doctor.priya@hospital.com",
                "Doctor@123",
                "Dr. Priya Sharma",
                "+1 (555) 014-3322",
                ortho,
                "Spine & Sports Injury Specialist",
                "MBBS, D.Ortho, M.Ch (Ortho)",
                "Room 105",
                9,
                10
        );

        Doctor docElena = createDoctorWithUser(
                "doctor.elena@hospital.com",
                "Doctor@123",
                "Dr. Elena Rostova",
                "+1 (555) 018-7744",
                genMed,
                "Lead Consultant Physician & Diabetologist",
                "MBBS, MD (Internal Medicine)",
                "Room 003",
                8,
                10
        );

        Doctor docAlex = createDoctorWithUser(
                "doctor.alex@hospital.com",
                "Doctor@123",
                "Dr. Alexander Wright",
                "+1 (555) 018-9900",
                genMed,
                "Senior Consultant - Internal Medicine & Preventive Health",
                "MBBS, MD, FACP",
                "Room 005",
                12,
                10
        );

        Doctor docRobert = createDoctorWithUser(
                "doctor.robert@hospital.com",
                "Doctor@123",
                "Dr. Robert Chen",
                "+1 (555) 013-6622",
                dental,
                "Chief Dental Surgeon & Orthodontist",
                "BDS, MDS (Prosthodontics)",
                "Room 209",
                12,
                15
        );

        Doctor docAisha = createDoctorWithUser(
                "doctor.aisha@hospital.com",
                "Doctor@123",
                "Dr. Aisha Patel",
                "+1 (555) 017-5533",
                derm,
                "Consultant Dermatologist & Cosmetologist",
                "MBBS, MD (Dermatology)",
                "Room 302",
                9,
                10
        );

        Doctor docMaya = createDoctorWithUser(
                "doctor.maya@hospital.com",
                "Doctor@123",
                "Dr. Maya Lin",
                "+1 (555) 019-4411",
                ped,
                "Pediatrician & Child Health Specialist",
                "MBBS, MD (Pediatrics), DCH",
                "Room 110",
                10,
                10
        );

        // 4. Seed Patients
        User patientJohn = User.builder()
                .email("patient@hospital.com")
                .password(passwordEncoder.encode("Patient@123"))
                .fullName("John Doe")
                .phoneNumber("+1 (555) 011-2233")
                .role(Role.PATIENT)
                .active(true)
                .age(36)
                .gender("Male")
                .bloodGroup("O+")
                .address("452 Elm Street, Cityville")
                .emergencyContact("+1 (555) 011-9988")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        patientJohn = userRepository.save(patientJohn);

        User patientAlice = User.builder()
                .email("alice.smith@example.com")
                .password(passwordEncoder.encode("Patient@123"))
                .fullName("Alice Smith")
                .phoneNumber("+1 (555) 012-7788")
                .role(Role.PATIENT)
                .active(true)
                .age(68)
                .gender("Female")
                .bloodGroup("A+")
                .address("108 Pine Avenue")
                .emergencyContact("+1 (555) 012-9900")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        patientAlice = userRepository.save(patientAlice);

        User patientDavid = User.builder()
                .email("david.miller@example.com")
                .password(passwordEncoder.encode("Patient@123"))
                .fullName("David Miller")
                .phoneNumber("+1 (555) 013-4455")
                .role(Role.PATIENT)
                .active(true)
                .age(42)
                .gender("Male")
                .bloodGroup("B+")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        patientDavid = userRepository.save(patientDavid);

        User patientEmily = User.builder()
                .email("emily.watson@example.com")
                .password(passwordEncoder.encode("Patient@123"))
                .fullName("Emily Watson")
                .phoneNumber("+1 (555) 015-8899")
                .role(Role.PATIENT)
                .active(true)
                .age(29)
                .gender("Female")
                .bloodGroup("AB+")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        patientEmily = userRepository.save(patientEmily);

        // 5. Seed Sample Appointments for Today with Live Queue Tickets
        LocalDate today = LocalDate.now();

        // Appointment 1: Senior Citizen Alice in Cardiology (Token: CARD-001) - CALLED
        Appointment app1 = createAppointment(
                patientAlice, docSarah, cardio, today, "09:00 - 10:00",
                "CARD-001", 1, PriorityLevel.SENIOR_CITIZEN, AppointmentStatus.CALLED, "Routine cardiac checkup"
        );
        QueueTicket ticket1 = queueService.createQueueTicketForAppointment(app1);
        ticket1.setStatus(QueueStatus.CALLED);
        ticket1.setCalledTime(Instant.now().minusSeconds(180));
        queueTicketRepository.save(ticket1);

        // Appointment 2: John Doe in Cardiology (Token: CARD-002) - WAITING
        Appointment app2 = createAppointment(
                patientJohn, docSarah, cardio, today, "09:00 - 10:00",
                "CARD-002", 2, PriorityLevel.NORMAL, AppointmentStatus.IN_QUEUE, "Mild chest tightness upon exertion"
        );
        queueService.createQueueTicketForAppointment(app2);

        // Appointment 3: David Miller in Cardiology (Token: CARD-003) - WAITING
        Appointment app3 = createAppointment(
                patientDavid, docSarah, cardio, today, "10:00 - 11:00",
                "CARD-003", 3, PriorityLevel.NORMAL, AppointmentStatus.IN_QUEUE, "High blood pressure follow up"
        );
        queueService.createQueueTicketForAppointment(app3);

        // Appointment 4: Emily Watson in Orthopedics (Token: ORTH-001) - WAITING
        Appointment app4 = createAppointment(
                patientEmily, docMarcus, ortho, today, "09:00 - 10:00",
                "ORTH-001", 1, PriorityLevel.NORMAL, AppointmentStatus.IN_QUEUE, "Knee pain after sports"
        );
        QueueTicket ticket4 = queueService.createQueueTicketForAppointment(app4);
        ticket4.setStatus(QueueStatus.CALLED);
        ticket4.setCalledTime(Instant.now().minusSeconds(120));
        queueTicketRepository.save(ticket4);

        // Appointment 5: John Doe in General Medicine (Token: GEN-001) - WAITING
        Appointment app5 = createAppointment(
                patientJohn, docElena, genMed, today, "11:00 - 12:00",
                "GEN-001", 1, PriorityLevel.NORMAL, AppointmentStatus.IN_QUEUE, "General annual health screening"
        );
        queueService.createQueueTicketForAppointment(app5);

        // 6. Seed Permanent Completed Consultations & EMR Records
        seedConsultationsIfEmpty();

        log.info("Database seeding complete! Seeded Admin, Doctors, Departments, Patients, Live Queue Tickets, and Consultation Records.");
    }

    private Doctor createDoctorWithUser(String email, String rawPassword, String fullName, String phone,
                                       Department dept, String spec, String qual, String room, int exp, int duration) {
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .fullName(fullName)
                .phoneNumber(phone)
                .role(Role.DOCTOR)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        user = userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .userId(user.getId())
                .fullName(fullName)
                .email(email)
                .phoneNumber(phone)
                .departmentId(dept.getId())
                .departmentName(dept.getName())
                .departmentCode(dept.getCode())
                .specialization(spec)
                .qualification(qual)
                .roomNumber(room)
                .experienceYears(exp)
                .consultationDurationMinutes(duration)
                .availabilityStatus("AVAILABLE")
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return doctorRepository.save(doctor);
    }

    private Appointment createAppointment(User patient, Doctor doctor, Department dept, LocalDate date,
                                          String slot, String tokenNum, int seq, PriorityLevel priority,
                                          AppointmentStatus status, String notes) {
        Appointment app = Appointment.builder()
                .patientId(patient.getId())
                .patientName(patient.getFullName())
                .patientEmail(patient.getEmail())
                .patientPhone(patient.getPhoneNumber())
                .patientAge(patient.getAge())
                .patientGender(patient.getGender())
                .doctorId(doctor.getId())
                .doctorName(doctor.getFullName())
                .doctorSpecialization(doctor.getSpecialization())
                .doctorRoom(doctor.getRoomNumber())
                .departmentId(dept.getId())
                .departmentName(dept.getName())
                .departmentCode(dept.getCode())
                .appointmentDate(date)
                .timeSlot(slot)
                .tokenNumber(tokenNum)
                .tokenSequence(seq)
                .priority(priority)
                .status(status)
                .checkedIn(true)
                .checkedInTime(Instant.now())
                .notes(notes)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        var qr = qrCodeService.generateAppointmentQr(app);
        app.setQrCodeData(qr.qrCodeData());
        app.setQrCodeImageBase64(qr.qrCodeImageBase64());

        return appointmentRepository.save(app);
    }

    private void seedConsultationsIfEmpty() {
        List<Doctor> doctors = doctorRepository.findAll();
        List<User> patients = userRepository.findByRole(Role.PATIENT);
        if (doctors.isEmpty() || patients.isEmpty()) {
            return;
        }

        User john = patients.stream().filter(p -> "patient@hospital.com".equalsIgnoreCase(p.getEmail()) || "john.doe@example.com".equalsIgnoreCase(p.getEmail())).findFirst().orElse(patients.get(0));
        User alice = patients.stream().filter(p -> "alice.smith@example.com".equalsIgnoreCase(p.getEmail())).findFirst().orElse(patients.get(0));
        User david = patients.stream().filter(p -> "david.miller@example.com".equalsIgnoreCase(p.getEmail())).findFirst().orElse(patients.get(0));

        Doctor sarah = doctors.stream().filter(d -> d.getFullName() != null && d.getFullName().contains("Sarah")).findFirst().orElse(doctors.get(0));
        Doctor docSecond = doctors.size() > 1 ? doctors.get(1) : sarah;

        if (consultationRepository.findByPatientIdOrderByCreatedAtDesc(john.getId()).isEmpty()) {
            log.info("Seeding permanent consultation & EMR records for John Doe...");

            Appointment pastAppt1 = Appointment.builder()
                    .patientId(john.getId())
                    .patientName(john.getFullName())
                    .patientEmail(john.getEmail())
                    .patientPhone(john.getPhoneNumber())
                    .doctorId(sarah.getId())
                    .doctorName(sarah.getFullName())
                    .doctorSpecialization(sarah.getSpecialization())
                    .doctorRoom(sarah.getRoomNumber())
                    .departmentId(sarah.getDepartmentId())
                    .departmentName(sarah.getDepartmentName())
                    .departmentCode(sarah.getDepartmentCode())
                    .appointmentDate(LocalDate.now().minusDays(5))
                    .timeSlot("10:00 - 11:00")
                    .tokenNumber("CARD-099")
                    .tokenSequence(1)
                    .priority(PriorityLevel.NORMAL)
                    .status(AppointmentStatus.COMPLETED)
                    .checkedIn(true)
                    .notes("Mild chest discomfort after brisk walk")
                    .createdAt(Instant.now().minusSeconds(86400 * 5))
                    .updatedAt(Instant.now().minusSeconds(86400 * 5))
                    .build();
            pastAppt1 = appointmentRepository.save(pastAppt1);

            Consultation c1 = Consultation.builder()
                    .appointmentId(pastAppt1.getId())
                    .patientId(john.getId())
                    .patientName(john.getFullName())
                    .doctorId(sarah.getId())
                    .doctorName(sarah.getFullName())
                    .departmentName(sarah.getDepartmentName())
                    .tokenNumber(pastAppt1.getTokenNumber())
                    .symptoms("Mild retrosternal chest discomfort on heavy exertion, normal at rest.")
                    .diagnosis("Stage 1 Essential Hypertension & Exertional Angina Prophylaxis")
                    .clinicalNotes("Resting ECG normal, sinus rhythm. Advised low sodium DASH diet, 30 min daily walking, avoid sudden strenuous lifting. Recheck lipid panel in 4 weeks.")
                    .vitals("BP: 138/88 mmHg | Heart Rate: 76 bpm | SpO2: 99% | Weight: 74 kg | Temp: 98.4 F")
                    .prescriptionItems(List.of(
                            new Consultation.PrescriptionItem("Amlodipine 5mg", "1 Tablet", "Once daily in the morning", "30", "Take with water after breakfast"),
                            new Consultation.PrescriptionItem("Atorvastatin 10mg", "1 Tablet", "Once daily at bedtime", "30", "Take after dinner")
                    ))
                    .followUpDate(LocalDate.now().plusDays(25))
                    .durationMinutes(15)
                    .createdAt(Instant.now().minusSeconds(86400 * 5))
                    .updatedAt(Instant.now().minusSeconds(86400 * 5))
                    .build();
            consultationRepository.save(c1);
        }

        if (consultationRepository.findByPatientIdOrderByCreatedAtDesc(alice.getId()).isEmpty()) {
            log.info("Seeding permanent consultation & EMR records for Alice Smith...");

            Appointment pastAppt2 = Appointment.builder()
                    .patientId(alice.getId())
                    .patientName(alice.getFullName())
                    .patientEmail(alice.getEmail())
                    .patientPhone(alice.getPhoneNumber())
                    .doctorId(sarah.getId())
                    .doctorName(sarah.getFullName())
                    .doctorSpecialization(sarah.getSpecialization())
                    .doctorRoom(sarah.getRoomNumber())
                    .departmentId(sarah.getDepartmentId())
                    .departmentName(sarah.getDepartmentName())
                    .departmentCode(sarah.getDepartmentCode())
                    .appointmentDate(LocalDate.now().minusDays(2))
                    .timeSlot("09:00 - 10:00")
                    .tokenNumber("CARD-098")
                    .tokenSequence(1)
                    .priority(PriorityLevel.SENIOR_CITIZEN)
                    .status(AppointmentStatus.COMPLETED)
                    .checkedIn(true)
                    .notes("Routine cardiac follow up")
                    .createdAt(Instant.now().minusSeconds(86400 * 2))
                    .updatedAt(Instant.now().minusSeconds(86400 * 2))
                    .build();
            pastAppt2 = appointmentRepository.save(pastAppt2);

            Consultation c2 = Consultation.builder()
                    .appointmentId(pastAppt2.getId())
                    .patientId(alice.getId())
                    .patientName(alice.getFullName())
                    .doctorId(sarah.getId())
                    .doctorName(sarah.getFullName())
                    .departmentName(sarah.getDepartmentName())
                    .tokenNumber(pastAppt2.getTokenNumber())
                    .symptoms("Occasional morning dizziness, routine heart health review.")
                    .diagnosis("Controlled Hypertension - Geriatric Wellness Review")
                    .clinicalNotes("Blood pressure well controlled. Maintained good medication compliance. Continue current regimen with regular hydration.")
                    .vitals("BP: 124/80 mmHg | Heart Rate: 68 bpm | SpO2: 98% | Weight: 62 kg | Temp: 98.6 F")
                    .prescriptionItems(List.of(
                            new Consultation.PrescriptionItem("Telmisartan 40mg", "1 Tablet", "Once daily in the morning", "30", "Take with water"),
                            new Consultation.PrescriptionItem("Multivitamin & Minerals", "1 Capsule", "Once daily after lunch", "30", "Take after lunch")
                    ))
                    .followUpDate(LocalDate.now().plusDays(60))
                    .durationMinutes(20)
                    .createdAt(Instant.now().minusSeconds(86400 * 2))
                    .updatedAt(Instant.now().minusSeconds(86400 * 2))
                    .build();
            consultationRepository.save(c2);
        }

        if (consultationRepository.findByPatientIdOrderByCreatedAtDesc(david.getId()).isEmpty()) {
            log.info("Seeding permanent consultation & EMR records for David Miller...");

            Appointment pastAppt3 = Appointment.builder()
                    .patientId(david.getId())
                    .patientName(david.getFullName())
                    .patientEmail(david.getEmail())
                    .patientPhone(david.getPhoneNumber())
                    .doctorId(docSecond.getId())
                    .doctorName(docSecond.getFullName())
                    .doctorSpecialization(docSecond.getSpecialization())
                    .doctorRoom(docSecond.getRoomNumber())
                    .departmentId(docSecond.getDepartmentId())
                    .departmentName(docSecond.getDepartmentName())
                    .departmentCode(docSecond.getDepartmentCode())
                    .appointmentDate(LocalDate.now().minusDays(1))
                    .timeSlot("11:00 - 12:00")
                    .tokenNumber("ORTH-095")
                    .tokenSequence(1)
                    .priority(PriorityLevel.NORMAL)
                    .status(AppointmentStatus.COMPLETED)
                    .checkedIn(true)
                    .notes("Right shoulder pain when lifting")
                    .createdAt(Instant.now().minusSeconds(86400))
                    .updatedAt(Instant.now().minusSeconds(86400))
                    .build();
            pastAppt3 = appointmentRepository.save(pastAppt3);

            Consultation c3 = Consultation.builder()
                    .appointmentId(pastAppt3.getId())
                    .patientId(david.getId())
                    .patientName(david.getFullName())
                    .doctorId(docSecond.getId())
                    .doctorName(docSecond.getFullName())
                    .departmentName(docSecond.getDepartmentName())
                    .tokenNumber(pastAppt3.getTokenNumber())
                    .symptoms("Pain in right anterior shoulder upon abduction and elevation.")
                    .diagnosis("Right Rotator Cuff Tendinitis (Subacromial Impingement)")
                    .clinicalNotes("Positive Neer test. Advised physical therapy 3x/week, rotator cuff strengthening exercises, avoid overhead lifting for 2 weeks, ice pack application for 15 mins twice daily.")
                    .vitals("BP: 122/78 mmHg | Heart Rate: 74 bpm | SpO2: 99% | Weight: 80 kg | Temp: 98.6 F")
                    .prescriptionItems(List.of(
                            new Consultation.PrescriptionItem("Aceclofenac 100mg + Paracetamol 325mg", "1 Tablet", "Twice daily after meals", "5", "Take after food, SOS for acute pain"),
                            new Consultation.PrescriptionItem("Pantoprazole 40mg", "1 Tablet", "Once daily before breakfast", "7", "Take 30 mins before breakfast")
                    ))
                    .followUpDate(LocalDate.now().plusDays(14))
                    .durationMinutes(15)
                    .createdAt(Instant.now().minusSeconds(86400))
                    .updatedAt(Instant.now().minusSeconds(86400))
                    .build();
            consultationRepository.save(c3);
        }

        log.info("Ensured comprehensive persistent consultation records for patients and doctors.");
    }
}


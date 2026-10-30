# CareConnect - Real-Time Smart Hospital Queue & EMR Management System 🏥⚡

CareConnect is an enterprise-grade, real-time Hospital Outpatient Department (OPD) Queue Management and Electronic Medical Records (EMR) System. Built with **Spring Boot 3 (Java 17+)** and **React (Vite + Modern Bootstrap)**, it features dynamic priority scheduling (Normal, Senior Citizen, Emergency Direct Room Escalation), live WebSocket queue synchronization, QR code self check-in kiosks, digital consultation prescriptions, and role-based portal security.

---

## 🌟 Key Features

### 1. 👥 Multi-Role Portals
- **Patient Portal**: Instant OPD appointment booking, time slot selection, category-based priority queuing (Normal, Senior Citizen, Emergency), live queue token tracker, and persistent Consultation & Digital Prescription records.
- **Doctor Portal**: Real-time Queue Controller (Call Next, Start Consultation, Mark Completed, Skip/No-Show), comprehensive Consultation & Diagnosis EMR form with vitals and multi-drug prescription writer, and permanent Consultation History log.
- **Admin Console**: Department & Doctor management, real-time hospital-wide queue monitoring, queue manual override/reordering, reports & analytics, and audit logging.

### 2. ⚡ Priority Engine & Emergency Direct Escalation
- **Emergency Priority**: Immediately bypasses standard waiting lines and directly schedules/escalates patients into active consulting room queue with audio-visual alerts.
- **Senior Citizen Priority**: Preemptively prioritizes senior citizens ahead of regular queues.
- **Normal OPD**: Standard sequential appointment tokens.

### 3. 📄 Permanent EMR & Medical Records
- Full clinical vitals tracking (BP, Heart Rate, SpO2, Body Temp, Weight).
- Symptoms, diagnosis, clinical advice, and itemized multi-drug prescriptions.
- Print prescription support and persistent consultation history for patients and doctors.

### 4. 🔄 Real-Time WebSockets
- STOMP/WebSocket event broadcasting for live token status updates, room transitions, and emergency notifications.

---

## 🛠️ Tech Stack

- **Backend**: Java 17+, Spring Boot 3.3, Spring Security with JWT, Spring Data MongoDB, Spring WebSocket (STOMP), embedded zero-config in-memory MongoDB fallback.
- **Frontend**: React 18, Vite, React Router v6, Bootstrap 5 + Vanilla CSS, Lucide Icons, SockJS & STOMP client.

---

## 🚀 Getting Started

### Prerequisites
- **Java JDK (17+)**
- **Node.js (18+) & npm**
- **Git**

### Running the Application

#### Option 1: Quick Batch Launcher (Windows)
Double-click `run_all.bat` in the project root to start both backend and frontend servers automatically.

#### Option 2: Manual Terminal Execution

1. **Start the Backend (Port 8080)**:
   ```bash
   cd backend
   .\mvnw.cmd spring-boot:run
   ```

2. **Start the Frontend (Port 5173)**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open your browser at **http://localhost:5173**.

---

4.Live link
**https://careconnect-backend-bg3s.onrender.com/
https://careconnect-frontend-26ju.onrender.com

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@hospital.com` | `Admin@123` |
| **Doctor** | `doctor.sarah@hospital.com` | `Doctor@123` |
| **Patient** | `patient@hospital.com` | `Patient@123` |

---

## 📜 License
This project is open-source and available under the MIT License.

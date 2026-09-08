package com.hospital.queue.dto;

import com.hospital.queue.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Role role;
    private String phoneNumber;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String address;
    private String emergencyContact;

    // Doctor specific fields if applicable
    private String departmentId;
    private String specialization;
    private String qualification;
    private String roomNumber;
    private Integer consultationDurationMinutes;

    public RegisterRequest() {}

    public RegisterRequest(String fullName, String email, String password, Role role, String phoneNumber,
                           Integer age, String gender, String bloodGroup, String address, String emergencyContact,
                           String departmentId, String specialization, String qualification, String roomNumber,
                           Integer consultationDurationMinutes) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.departmentId = departmentId;
        this.specialization = specialization;
        this.qualification = qualification;
        this.roomNumber = roomNumber;
        this.consultationDurationMinutes = consultationDurationMinutes;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String fullName;
        private String email;
        private String password;
        private Role role;
        private String phoneNumber;
        private Integer age;
        private String gender;
        private String bloodGroup;
        private String address;
        private String emergencyContact;
        private String departmentId;
        private String specialization;
        private String qualification;
        private String roomNumber;
        private Integer consultationDurationMinutes;

        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public Builder age(Integer age) { this.age = age; return this; }
        public Builder gender(String gender) { this.gender = gender; return this; }
        public Builder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public Builder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public Builder specialization(String specialization) { this.specialization = specialization; return this; }
        public Builder qualification(String qualification) { this.qualification = qualification; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder consultationDurationMinutes(Integer consultationDurationMinutes) { this.consultationDurationMinutes = consultationDurationMinutes; return this; }

        public RegisterRequest build() {
            return new RegisterRequest(fullName, email, password, role, phoneNumber, age, gender, bloodGroup,
                    address, emergencyContact, departmentId, specialization, qualification, roomNumber,
                    consultationDurationMinutes);
        }
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public Integer getConsultationDurationMinutes() { return consultationDurationMinutes; }
    public void setConsultationDurationMinutes(Integer consultationDurationMinutes) { this.consultationDurationMinutes = consultationDurationMinutes; }
}

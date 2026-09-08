package com.hospital.queue.dto;

import com.hospital.queue.model.Role;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private String id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private String doctorId;
    private String departmentId;
    private String departmentName;
    private String roomNumber;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String emergencyContact;

    public AuthResponse() {}

    public AuthResponse(String token, String type, String id, String email, String fullName, String phoneNumber,
                        Role role, String doctorId, String departmentId, String departmentName, String roomNumber,
                        Integer age, String gender, String bloodGroup, String emergencyContact) {
        this.token = token;
        this.type = type != null ? type : "Bearer";
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.doctorId = doctorId;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.roomNumber = roomNumber;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.emergencyContact = emergencyContact;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String type = "Bearer";
        private String id;
        private String email;
        private String fullName;
        private String phoneNumber;
        private Role role;
        private String doctorId;
        private String departmentId;
        private String departmentName;
        private String roomNumber;
        private Integer age;
        private String gender;
        private String bloodGroup;
        private String emergencyContact;

        public Builder token(String token) { this.token = token; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder id(String id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public Builder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder age(Integer age) { this.age = age; return this; }
        public Builder gender(String gender) { this.gender = gender; return this; }
        public Builder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public Builder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, type, id, email, fullName, phoneNumber, role, doctorId, departmentId,
                    departmentName, roomNumber, age, gender, bloodGroup, emergencyContact);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
}

package com.hospital.queue.dto;

import com.hospital.queue.model.Role;
import java.time.Instant;

public class UserDto {

    private String id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private boolean active;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String address;
    private String emergencyContact;
    private Instant createdAt;

    public UserDto() {}

    public UserDto(String id, String email, String fullName, String phoneNumber, Role role, boolean active,
                   Integer age, String gender, String bloodGroup, String address, String emergencyContact,
                   Instant createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.active = active;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String email;
        private String fullName;
        private String phoneNumber;
        private Role role;
        private boolean active;
        private Integer age;
        private String gender;
        private String bloodGroup;
        private String address;
        private String emergencyContact;
        private Instant createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder age(Integer age) { this.age = age; return this; }
        public Builder gender(String gender) { this.gender = gender; return this; }
        public Builder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public UserDto build() {
            return new UserDto(id, email, fullName, phoneNumber, role, active, age, gender, bloodGroup, address, emergencyContact, createdAt);
        }
    }

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

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

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

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

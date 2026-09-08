package com.hospital.queue.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hospital.queue.model.Role;
import com.hospital.queue.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private String id;
    private String email;

    @JsonIgnore
    private String password;

    private String fullName;
    private Role role;
    private boolean active;
    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal() {}

    public UserPrincipal(String id, String email, String password, String fullName, Role role, boolean active,
                         Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.active = active;
        this.authorities = authorities;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String email;
        private String password;
        private String fullName;
        private Role role;
        private boolean active;
        private Collection<? extends GrantedAuthority> authorities;

        public Builder id(String id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder authorities(Collection<? extends GrantedAuthority> authorities) { this.authorities = authorities; return this; }

        public UserPrincipal build() {
            return new UserPrincipal(id, email, password, fullName, role, active, authorities);
        }
    }

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        return UserPrincipal.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .fullName(user.getFullName())
                .role(user.getRole())
                .active(user.isActive())
                .authorities(authorities)
                .build();
    }

    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public Role getRole() { return role; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}

package com.room.backend.auth.dto;

import com.room.backend.auth.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name ;
    private String email ;
     private String password;
    private  Role role;
}
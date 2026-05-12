package com.room.backend.auth;


import com.room.backend.auth.dto.AuthResponse;
import com.room.backend.auth.dto.LoginRequest;
import com.room.backend.auth.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService ;

    @PostMapping("/login" )
    public ResponseEntity<AuthResponse> login( @RequestBody LoginRequest request  ) {
        return  ResponseEntity.ok(authService.login(request)) ;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return ResponseEntity .ok(authService.register(request ));
    }
}
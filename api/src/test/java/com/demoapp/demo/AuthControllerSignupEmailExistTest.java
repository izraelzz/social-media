package com.demoapp.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import com.demoapp.demo.controller.AuthController;
import com.demoapp.demo.dto.ErrorResponse;
import com.demoapp.demo.dto.UserDTO;
import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

public class AuthControllerSignupEmailExistTest {

    @Test
    void shouldReturnEmailAlreadyRegisteredMessage() {

        UserService service = mock(UserService.class);
        AuthController controller = new AuthController(service);

        UserDTO dto = new UserDTO();
        dto.setEmail("teste@gmail.com");
        dto.setPassword("FakePassword@123");

        User existingUser = new User();

        when(service.isEmailValid(dto.getEmail())).thenReturn(true);
        when(service.isPasswordValid(dto.getPassword())).thenReturn(true);
        when(service.findByEmail(dto.getEmail())).thenReturn(existingUser);

        ResponseEntity<?> response = controller.signup(dto);

        ErrorResponse body = (ErrorResponse) response.getBody();

        assertEquals(409, response.getStatusCode().value());

        assertEquals(
            "E-mail já está em uso",
            body.getMessage()
        );
    }
}
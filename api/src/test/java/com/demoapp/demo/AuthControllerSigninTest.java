package com.demoapp.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import com.demoapp.demo.controller.AuthController;
import com.demoapp.demo.dto.UserDTO;
import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

public class AuthControllerSigninTest {

    @Test
    void shouldLoginSuccessfully() {

        UserService service = mock(UserService.class);
        AuthController controller = new AuthController(service);

        UserDTO dto = new UserDTO(); // dados enviados pelo usuario
        dto.setEmail("teste@gmail.com");
        dto.setPassword("FakePassword@123");

        User user = new User(); // usuario falso
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        when(service.isEmailValid(dto.getEmail())).thenReturn(true);
        when(service.isPasswordValid(dto.getPassword())).thenReturn(true);
        when(service.findByEmail(dto.getEmail())).thenReturn(user);

        ResponseEntity<?> response = controller.signin(dto);

        assertEquals(200, response.getStatusCode().value());
    }
}
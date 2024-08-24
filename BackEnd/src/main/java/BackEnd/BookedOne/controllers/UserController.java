package BackEnd.BookedOne.controllers;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import BackEnd.BookedOne.dto.User;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.User.request.CreateUser;
import BackEnd.BookedOne.jwt.JwtUtil;
import BackEnd.BookedOne.services.UserService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtTokenService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) throws ExceptionBackend {
        try {
            String token = request.getHeader("Authorization");
            String id = jwtTokenService.decode(token);
            Optional<User> customer = userService.getProfile(id);
            return customer.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } 
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore inatteso: " + e.getMessage());
        }
    }

    @PutMapping("/update-user")
    public ResponseEntity<?> updateUser(HttpServletRequest request, @RequestBody CreateUser updatedUser) throws ExceptionBackend {

        try{
            String token = request.getHeader("Authorization");
            String id = jwtTokenService.decode(token);
            User newUser = userService.updateUser(id,updatedUser);
            return ResponseEntity.ok(newUser);
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore inatteso: " + e.getMessage());
        }  
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<?> deleteUser(HttpServletRequest request) throws ExceptionBackend   {
        
        try{
            String token = request.getHeader("Authorization");
            String id = jwtTokenService.decode(token);
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore inatteso: " + e.getMessage());
        }
    }
}


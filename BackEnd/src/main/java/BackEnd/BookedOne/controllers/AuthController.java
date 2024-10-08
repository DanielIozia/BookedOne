package BackEnd.BookedOne.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import BackEnd.BookedOne.exception.ErrorResponse;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.User.request.CreateUser;
import BackEnd.BookedOne.interfaces.User.request.LoginUser;
import BackEnd.BookedOne.interfaces.User.response.RegisterResponse;
import BackEnd.BookedOne.services.UserService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/registration")
    public ResponseEntity<?> registration(@Validated @RequestBody CreateUser userRequest) throws ExceptionBackend{
        try{
            RegisterResponse createdUser = userService.createUser(userRequest);
            return ResponseEntity.ok(createdUser);
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Errore interno","Si è verificato un errore nel server"));        
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginUser userRequest) throws ExceptionBackend{
        try{
            return ResponseEntity.ok(userService.login(userRequest));
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Errore interno","Si è verificato un errore nel server"));        
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) throws ExceptionBackend{
        try{
            return ResponseEntity.ok(userService.me(request.getHeader("Authorization")));
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Errore interno","Si è verificato un errore nel server"));        
        }
    }
      
}

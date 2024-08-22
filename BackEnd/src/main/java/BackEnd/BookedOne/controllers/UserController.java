package BackEnd.BookedOne.controllers;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import BackEnd.BookedOne.dto.User;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.request.CreateUser;
import BackEnd.BookedOne.services.Argon2PasswordEncoderService;
import BackEnd.BookedOne.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private Argon2PasswordEncoderService passwordEncoder;


    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable String id) throws ExceptionBackend {
        try {
            Optional<User> customer = userService.getUserById(id);
            return customer.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } 
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore inatteso: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody CreateUser updatedUser) throws ExceptionBackend {

        Optional<User> user = userService.getUserById(id);

        if(!user.isPresent()){
            throw new ExceptionBackend(
                "Utente non trovato",
                "L'utente con ID " + id + " non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }

        if(updatedUser.getRole() != null){
            throw new ExceptionBackend(
                "Ruolo non modificabile",
                "Il ruolo non è modificabile.",
                HttpStatus.BAD_REQUEST
            );
        }

        try {
            User existingUser = user.get();
            String firstName = (updatedUser.getFirstName() == null)  ? existingUser.getFirstName() : updatedUser.getFirstName();
            String lastName = (updatedUser.getLastName() == null)  ? existingUser.getLastName() : updatedUser.getLastName();
            String email = (updatedUser.getEmail() == null)  ? existingUser.getEmail() : updatedUser.getEmail();
            String role = existingUser.getRole();
            
            existingUser.setFirstName(firstName);
            existingUser.setLastName(lastName);
            existingUser.setRole(role);
           
            // Verifica se l'email è già in uso da un altro utente
           if (updatedUser.getEmail() != null) {
               
               User emailOwner = userService.findByEmail(updatedUser.getEmail());

               if (emailOwner != null && !emailOwner.getId().equals(id)) {
                   throw new ExceptionBackend(
                       "Email già in uso",
                       "L'email " + updatedUser.getEmail() + " è già in uso da un altro utente.",
                       HttpStatus.CONFLICT
                   );
               }
               

               existingUser.setEmail(email);
           }
           
           if (updatedUser.getPassword() != null) {
               existingUser.setPassword(
                   passwordEncoder.hashPassword(updatedUser.getPassword().toCharArray())
               );
           }
   
           userService.save(existingUser); // Salva le modifiche
   
           return existingUser; // Ritorna l'utente aggiornato
           }
           catch(Exception e){
               throw new ExceptionBackend(
                   "Errore inatteso",
                   "Errore inatteso: " + e.getMessage(),
                   HttpStatus.INTERNAL_SERVER_ERROR
               );
           }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) throws ExceptionBackend   {

        Optional<User> user = userService.getUserById(id);

        try{
            if (user.isPresent()) {
                userService.delete(user.get());
                return ResponseEntity.noContent().build();
            } 
            else {
                throw new ExceptionBackend(
                    "Utente non trovato",
                    "L'utente con ID " + id + " non è stato trovato.",
                    HttpStatus.NOT_FOUND
                );
            }
        }
        catch(Exception e){
            throw new ExceptionBackend(
                "Errore inatteso",
                "Errore inatteso: " + e.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}


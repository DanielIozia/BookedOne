package BackEnd.BookedOne.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private UserService userService;

    @Autowired
    private Argon2PasswordEncoderService passwordEncoder;

      
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable String id) throws ExceptionBackend {
        try {
            Optional<User> customer = userService.findByIdAndRole(id,"customer");
            return customer.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } 
        catch (ExceptionBackend e) {
            // Gestione dell'eccezione specifica ExceptionBackend
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            // Gestione di eventuali altre eccezioni non previste
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore inatteso: " + e.getMessage());
        }
    }
 
    // Aggiornare le informazioni di un customer
    @PutMapping("/{id}")
    public User updateCustomer(@PathVariable String id, @RequestBody CreateUser updatedCustomer) throws ExceptionBackend {

        Optional<User> customer = userService.findById(id);

        if(customer.get().getRole().equals("seller")){
            throw new ExceptionBackend(
                "L'utente è un seller",
                "L'utente con ID " + id + " non è un customer.",
                HttpStatus.NOT_FOUND
            );
        }

        if(!customer.isPresent()){
            throw new ExceptionBackend(
                "Utente non trovato",
                "L'utente con ID " + id + " non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }

        try{User existingCustomer = customer.get();

            String firstName = (updatedCustomer.getFirstName() == null)  ? existingCustomer.getFirstName() : updatedCustomer.getFirstName();
            String lastName = (updatedCustomer.getLastName() == null)  ? existingCustomer.getLastName() : updatedCustomer.getLastName();
            String role = "customer";
   
            existingCustomer.setFirstName(firstName);
            existingCustomer.setLastName(lastName);
            existingCustomer.setRole(role);
           
           if (updatedCustomer.getEmail() != null) {
               // Verifica se l'email è già in uso da un altro utente
               User emailOwner = userService.findByEmail(updatedCustomer.getEmail());
               if (emailOwner != null && !emailOwner.getId().equals(id)) {
                   throw new ExceptionBackend(
                       "Email già in uso",
                       "L'email " + updatedCustomer.getEmail() + " è già in uso da un altro utente.",
                       HttpStatus.CONFLICT
                   );
               }
               existingCustomer.setEmail(updatedCustomer.getEmail());
           }
           
           if (updatedCustomer.getPassword() != null) {
               existingCustomer.setPassword(
                   passwordEncoder.hashPassword(updatedCustomer.getPassword().toCharArray())
               );
           }
   
           userService.save(existingCustomer); // Salva le modifiche
   
           return existingCustomer; // Ritorna l'utente aggiornato
           }
           catch(Exception e){
               throw new ExceptionBackend(
                   "Errore inatteso",
                   "Errore inatteso: " + e.getMessage(),
                   HttpStatus.INTERNAL_SERVER_ERROR
               );
           }
    }
/*
    // Cancellare un customer
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) throws ExceptionBackend  {
        Optional<User> customer = userService.findById(id);
        if (customer.isPresent()) {
            userService.delete(customer.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Ottenere le prenotazioni di un customer
    @GetMapping("/{id}/reservations")
    public ResponseEntity<List<String>> getReservationsCustomer(@PathVariable String id) throws ExceptionBackend  {
        Optional<User> customer = userService.findById(id);
        if (customer.isPresent()) {
            List<String> reservations = userService.findReservationsByCustomerId(id);  // Supponendo che questo metodo esista nel servizio
            return ResponseEntity.ok(reservations);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

*/

    
}

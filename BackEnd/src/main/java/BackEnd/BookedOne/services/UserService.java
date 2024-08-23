package BackEnd.BookedOne.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import BackEnd.BookedOne.dto.User;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.User.request.CreateUser;
import BackEnd.BookedOne.interfaces.User.request.LoginUser;
import BackEnd.BookedOne.interfaces.User.response.LoginResponse;
import BackEnd.BookedOne.jwt.JwtUtil;
import BackEnd.BookedOne.repositories.UserRepository;
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Argon2PasswordEncoderService argon2PasswordEncoderService;

    @Autowired
    private JwtUtil jwtTokenService;

    public User createUser(CreateUser userRequest) throws ExceptionBackend {

        if (userRepository.findByEmail(userRequest.getEmail()) != null) {
            throw new ExceptionBackend(
                    "Credenziali non valide",
                    "L'email inserita è stata usata precedentemente.",  
                    HttpStatus.PRECONDITION_FAILED
            );
        }
        
        if(!userRequest.getRole().equals("seller") && !userRequest.getRole().equals("customer") ){
            throw new ExceptionBackend(
                    "Ruolo non valido",
                    "I ruoli validi sono seller e customer.",  
                    HttpStatus.BAD_REQUEST
            );
        }

        User user = new User(
            userRequest.getFirstName(),
            userRequest.getLastName(),
            userRequest.getEmail(),
            argon2PasswordEncoderService.hashPassword(userRequest.getPassword().toCharArray()),
            userRequest.getRole()
        );

        try{
            userRepository.save(user);
            return user;
        }
        catch (Exception e) {
            throw new ExceptionBackend(
                "Errore durante la registrazione",
                "Si è verificato un errore durante la registrazione.",  
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public LoginResponse login(LoginUser userRequest) throws ExceptionBackend {
        
        if(userRepository.findByEmail(userRequest.getEmail()) == null){
            throw new ExceptionBackend(
                "Credenziali non valide",
                "L'email non esiste.",  
                HttpStatus.NOT_FOUND
            );
        }

        User user = userRepository.findByEmailAndPassword(userRequest.getEmail(), argon2PasswordEncoderService.hashPassword(userRequest.getPassword().toCharArray()));
        if (user == null) {
            throw new ExceptionBackend(
                "Credenziali non valide",
                "Credenziali non valide.",  
                HttpStatus.BAD_REQUEST
            );
        }

        return new LoginResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole(),
            jwtTokenService.generateToken(user.getId(), 86400000L) //1 giorno
        );

        
    }

    public LoginResponse me(String token) throws ExceptionBackend {
        String userID = jwtTokenService.decode(token);

        User user = userRepository.findById(userID).get();

        if (user == null) {
            throw new ExceptionBackend(
                "Utente non trovato",
                "L'utente non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }

        return new LoginResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole(),
            token.substring(7)
        );

    }

    public Optional<User> getUserById(String id) throws ExceptionBackend {

        Optional<User> user = userRepository.findById(id);
    
        if (!user.isPresent()) {
            throw new ExceptionBackend(
                "Utente non trovato",
                "L'utente con ID " + id + " non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }
    
        return user;
    }

    public Optional<User> findByIdAndRole(String id, String role) throws ExceptionBackend {
        Optional<User> user = userRepository.findByIdAndRole(id,role);
        
        //non succederà mai
        if(role != "customer"){
            throw new ExceptionBackend(
                "Ruolo non valido",
                "Il ruolo deve essere customer",  
                HttpStatus.NOT_FOUND
            );
        }

        if (!user.isPresent()) {
            throw new ExceptionBackend(
                "Utente non esistente",
                "Non esiste un customer con questo id",  
                HttpStatus.NOT_FOUND
            );
        }

        // L'utente esiste, quindi ritorno l'utente
        return user;
    }

    public User findByEmail(String email) throws ExceptionBackend {

        User user = userRepository.findByEmail(email);

        if (user != null) {
            throw new ExceptionBackend(
                "Email già esistente",
                "Scegliere un'altra email",  
                HttpStatus.NOT_FOUND
            );
        }

        // L'utente esiste, quindi ritorno l'utente
        return user;
    }



    public User updateUser(String id, CreateUser user) throws ExceptionBackend {

        User existingUser = userRepository.findById(id).get();

        if(existingUser == null){
            throw new ExceptionBackend(
                "Utente non trovato",
                "L'utente non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }

        if(user.getRole() != null){
            throw new ExceptionBackend(
                "Ruolo non modificabile",
                "Il ruolo non può essere modificato",  
                HttpStatus.NOT_FOUND
            );
        }

        String firstName = (user.getFirstName() == null)  ? existingUser.getFirstName() : user.getFirstName();
        String lastName = (user.getLastName() == null)  ? existingUser.getLastName() : user.getLastName();
        String email = (user.getEmail() == null)  ? existingUser.getEmail() : user.getEmail();
        String role = existingUser.getRole();
        existingUser.setFirstName(firstName);
        existingUser.setLastName(lastName);
        existingUser.setRole(role);

        if (user.getEmail() != null) {
            User emailOwner = userRepository.findByEmail(user.getEmail());
            if (emailOwner != null && !emailOwner.getId().equals(id)) {
                throw new ExceptionBackend(
                    "Email già in uso",
                    "L'email " + user.getEmail() + " è già in uso da un altro utente.",
                    HttpStatus.CONFLICT
                );
            }
            existingUser.setEmail(email);
        }

        if (user.getPassword() != null) {
            existingUser.setPassword(
                argon2PasswordEncoderService.hashPassword(user.getPassword().toCharArray())
            );
        }
        userRepository.save(existingUser);
        return existingUser;
    }
    

    public void deleteUser(String id) throws ExceptionBackend {
        User user = userRepository.findById(id).get();
        if(user == null){
            throw new ExceptionBackend(
                "Utente non trovato",
                "L'utente non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }
        userRepository.delete(user);
    }
}
package BackEnd.BookedOne.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import BackEnd.BookedOne.dto.User;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.User.request.CreateUser;
import BackEnd.BookedOne.interfaces.User.request.LoginUser;
import BackEnd.BookedOne.interfaces.User.request.UpdateUser;
import BackEnd.BookedOne.interfaces.User.response.LoginResponse;
import BackEnd.BookedOne.interfaces.User.response.RegisterResponse;
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

    public RegisterResponse createUser(CreateUser userRequest) throws ExceptionBackend {

        if (userRepository.findByEmail(userRequest.getEmail()) != null) {
            throw new ExceptionBackend(
                    "Email già esistente",
                    "L'email inserita è già in uso",  
                    HttpStatus.PRECONDITION_FAILED
            );
        }
        
        if(!userRequest.getRole().equals("seller") && !userRequest.getRole().equals("customer") ){
            throw new ExceptionBackend(
                    "Ruolo non valido",
                    "I ruoli validi sono `seller` e `customer`.",  
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

            return new RegisterResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                argon2PasswordEncoderService.hashPassword(userRequest.getPassword().toCharArray()),
                jwtTokenService.generateToken(user.getId(), 86400000L) //1 giorno
        );
        }
        catch (Exception e) {
            throw new ExceptionBackend(
                "Errore interno",
                "Si è verificato un errore nel server durante la registrazione.",  
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public LoginResponse login(LoginUser userRequest) throws ExceptionBackend {
        
        if(userRepository.findByEmail(userRequest.getEmail()) == null){
            throw new ExceptionBackend(
                "Credenziali non valide",
                "Email non valida.",  
                HttpStatus.NOT_FOUND
            );
        }

        User user = userRepository.findByEmailAndPassword(userRequest.getEmail(), argon2PasswordEncoderService.hashPassword(userRequest.getPassword().toCharArray()));
        if (user == null) {
            throw new ExceptionBackend(
                "Credenziali non valide",
                "Password errata",  
                HttpStatus.BAD_REQUEST
            );
        }

        return new LoginResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole(),
            jwtTokenService.generateToken(user.getId(), 86400000L), //1 giorno
            argon2PasswordEncoderService.hashPassword(userRequest.getPassword().toCharArray())
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
            token.substring(7),
            user.getPassword()
        );
    }

    public Optional<User> getProfile(String id) throws ExceptionBackend {

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
    
    public User updateUser(String id, UpdateUser user) throws ExceptionBackend {

        User existingUser = userRepository.findById(id).orElseThrow(() ->
            new ExceptionBackend(
                "Utente non trovato",
                "L'utente non è stato trovato.",
                HttpStatus.NOT_FOUND
            )
        );

        
        String firstName = (user.getFirstName() == null) ? existingUser.getFirstName() : user.getFirstName();
        String lastName = (user.getLastName() == null) ? existingUser.getLastName() : user.getLastName();
        existingUser.setFirstName(firstName);
        existingUser.setLastName(lastName);
        
    
        // Se la password non è nulla, aggiorna la password
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

    public boolean verifyPassword(String userId, char[] password) throws ExceptionBackend {
    
        User user = userRepository.findById(userId).orElseThrow(() ->
            new ExceptionBackend(
                "Utente non trovato",
                "L'utente non è stato trovato.",
                HttpStatus.NOT_FOUND
            )
        );
    
        if (password.length == 0) {
            throw new ExceptionBackend(
                "Password non valida",
                "Inserisci una password valida",  
                HttpStatus.NOT_ACCEPTABLE
            );
        }
    
        boolean isPasswordCorrect = argon2PasswordEncoderService.verifyPassword(user.getPassword(), password);
    
        return isPasswordCorrect;
    }
}
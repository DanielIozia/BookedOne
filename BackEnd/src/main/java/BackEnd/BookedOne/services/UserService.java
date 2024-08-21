package BackEnd.BookedOne.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import BackEnd.BookedOne.dto.User;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.request.CreateUser;
import BackEnd.BookedOne.interfaces.request.LoginUser;
import BackEnd.BookedOne.interfaces.response.LoginResponse;
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

    public void createUser(CreateUser userRequest) throws ExceptionBackend {

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
            //voglio passare la password come char[]
            argon2PasswordEncoderService.hashPassword(userRequest.getPassword().toCharArray()),
            userRequest.getRole()
        );
        try{
            userRepository.save(user);
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
                "L'email non esistre.",  
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
            jwtTokenService.generateToken(user.getId(), 900000L) //15 minuti
        );
        
    }


    public LoginResponse me(String token) throws ExceptionBackend {
        String useriD = jwtTokenService.decode(token);

        User user = userRepository.findById(useriD).get();

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
}

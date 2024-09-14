package BackEnd.BookedOne.interfaces.User.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterResponse {

    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String password;
    private String token;
}

package BackEnd.BookedOne.interfaces.User.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String token;
    private String password;
}

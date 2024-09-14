package BackEnd.BookedOne.interfaces.User.request;

import lombok.Data;

@Data
public class LoginUser {
    private String email;
    private String password;
}

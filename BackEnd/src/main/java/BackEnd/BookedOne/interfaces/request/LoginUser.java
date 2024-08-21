package BackEnd.BookedOne.interfaces.request;

import lombok.Data;

@Data
public class LoginUser {
    private String email;
    private String password;
}

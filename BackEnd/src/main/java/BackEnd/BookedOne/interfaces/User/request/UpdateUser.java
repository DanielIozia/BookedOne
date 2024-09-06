package BackEnd.BookedOne.interfaces.User.request;

import lombok.Data;
@Data
public class UpdateUser {
    private String firstName;
    private String lastName;
    private String password;
}

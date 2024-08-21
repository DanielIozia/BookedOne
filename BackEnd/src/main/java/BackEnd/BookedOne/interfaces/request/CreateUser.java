package BackEnd.BookedOne.interfaces.request;
import lombok.Data;


@Data
public class CreateUser {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
}

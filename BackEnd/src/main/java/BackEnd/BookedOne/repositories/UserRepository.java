package BackEnd.BookedOne.repositories;
import org.springframework.data.mongodb.repository.MongoRepository;
import BackEnd.BookedOne.dto.User;

public interface UserRepository extends MongoRepository<User, String>  {

    User findByEmail(String email);

    User findByEmailAndPassword(String email, String password);

    
    

}

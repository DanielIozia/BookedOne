package BackEnd.BookedOne.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import BackEnd.BookedOne.dto.Reservation;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    
    @Query("{ 'userId' : :#{#userId} }")
    List<Reservation> findByUserId(@Param("userId") String userId);
    
}

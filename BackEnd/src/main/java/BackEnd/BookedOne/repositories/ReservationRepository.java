package BackEnd.BookedOne.repositories;
import org.springframework.data.mongodb.repository.MongoRepository;

import BackEnd.BookedOne.dto.Reservation;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    
}

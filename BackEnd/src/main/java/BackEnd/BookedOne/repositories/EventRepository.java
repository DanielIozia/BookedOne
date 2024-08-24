package BackEnd.BookedOne.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import BackEnd.BookedOne.dto.Event;




public interface EventRepository extends MongoRepository<Event, String> {
    
    Optional<Event> findByName(String name);

    Optional<Event> findById(String id);

    Optional<Event> findByLocationAndDateAndTime(String location, String date, String time);

    List<Event> findByIdSeller(String id);
    
}

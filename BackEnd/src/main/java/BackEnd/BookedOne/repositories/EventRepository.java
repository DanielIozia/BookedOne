package BackEnd.BookedOne.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import BackEnd.BookedOne.dto.Event;

public interface EventRepository extends MongoRepository<Event, String> {
    
}

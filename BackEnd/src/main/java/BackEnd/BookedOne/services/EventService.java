package BackEnd.BookedOne.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import BackEnd.BookedOne.repositories.EventRepository;


@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    
}
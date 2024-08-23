package BackEnd.BookedOne.services;


import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import BackEnd.BookedOne.dto.Event;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.Event.CreateEvent;
import BackEnd.BookedOne.interfaces.Event.UpdateEvent;
import BackEnd.BookedOne.repositories.EventRepository;
import BackEnd.BookedOne.repositories.UserRepository;

import BackEnd.BookedOne.dto.User;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public Event createEvent(CreateEvent event) throws ExceptionBackend  {

        if(event == null){
            throw new ExceptionBackend(
                "Corpo evento vuoto",  
                "Si è verificato un errore durante la registrazione dell'evento.",  
                HttpStatus.BAD_REQUEST
            );
        }

        if(eventRepository.findByLocationAndDateAndTime(event.getLocation(), event.getDate().toString(), event.getTime().toString()).isPresent()){
            throw new ExceptionBackend(
                "Errore Evento",  
                "C'è già un evento registrato nella stessa data e luogo.",  
                HttpStatus.PRECONDITION_FAILED
            );
        }

        if(!userRepository.findById(event.getIdSeller()).isPresent()){
            throw new ExceptionBackend(
                "Venditore non trovato",  
                "L'utente non è stato trovato.",  
                HttpStatus.NOT_FOUND
            );
        }

        if(!userRepository.findById(event.getIdSeller()).get().getRole().equals("seller")){
            throw new ExceptionBackend(
                "L'utente non è un venditore",  
                "La creazione di un evento può essere fatta solo se l'utente è un venditore",  
                HttpStatus.FORBIDDEN
            );  
        }

        if(event.getDate().isBefore(LocalDate.now())){
            throw new ExceptionBackend(
                "Errore Data",  
                "L'orario dell'evento è passato.",  
                HttpStatus.PRECONDITION_FAILED
            );
        }

    

        Event newEvent = new Event(
            event.getName(),
            event.getDescription(),
            event.getLocation(),
            event.getDate(),
            event.getTime(),
            event.getPrice(),
            event.getCategory(),
            event.getAvailableTickets(),
            event.getIdSeller()
        );

        try{
            eventRepository.save(newEvent);
            return newEvent;
        }
        catch (Exception e) {
            throw new ExceptionBackend(
                "Errore Evento",  
                "Si è verificato un errore durante la registrazione dell'evento.",  
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public Event updateEvent(String idUser,UpdateEvent event) throws ExceptionBackend  {

        Optional<Event> existingEvent = eventRepository.findById(event.getId());

        if(!existingEvent.isPresent()){
            throw new ExceptionBackend( 
                "Errore Evento",  
                "Evento non trovato",  
                HttpStatus.NOT_FOUND    
            );
        }

        if(!existingEvent.get().getIdSeller().equals(idUser)){
            throw new ExceptionBackend(
                "Errore Evento",  
                "Non sei autorizzato a modificare questo evento",  
                HttpStatus.FORBIDDEN
            );
        }

        if(eventRepository.findByLocationAndDateAndTime(
            event.getLocation(), 
            event.getDate().toString(), 
            event.getTime().toString()).isPresent()){

            throw new ExceptionBackend(
                "Errore Evento",  
                "C'è già un evento registrato nella stessa data e luogo.",  
                HttpStatus.PRECONDITION_FAILED
            );
        }

        Optional<User> seller = userRepository.findById(existingEvent.get().getIdSeller());

        if(!seller.isPresent()){
            throw new ExceptionBackend(
                "Venditore non trovato",  
                "L'utente non è stato trovato.",  
                HttpStatus.NOT_FOUND
            );
        }

        if(!seller.get().getRole().equals("seller")){
            throw new ExceptionBackend(
                "L'utente non è un venditore",  
                "L'aggiornamento di un evento è consentito solo se l'utente è un venditore",  
                HttpStatus.FORBIDDEN
            );  
        }

        if(event.getIdSeller() != null){
            throw new ExceptionBackend(
                "L'id del venditore non può essere modificato",  
                "L'aggiornamento di un evento è consentito solo se l'utente è colui che ha creato l'evento",  
                HttpStatus.FORBIDDEN
            );
        }

         
        if (event.getDate() != null && LocalDate.parse(event.getDate()).isBefore(LocalDate.now())) {
            throw new ExceptionBackend(
                "Data non valida",
                "La data dell'evento deve essere futura rispetto ad oggi",
                HttpStatus.BAD_REQUEST
            );
        }
        try{
            String name = (event.getName() == null) ? existingEvent.get().getName() : event.getName();
            String description = (event.getDescription() == null) ? existingEvent.get().getDescription() : event.getDescription();
            String location = (event.getLocation() == null) ? existingEvent.get().getLocation() : event.getLocation();
            String date = (event.getDate() == null) ? existingEvent.get().getDate() : event.getDate().toString();        
            String time = (event.getTime() == null) ? existingEvent.get().getTime() : event.getTime().toString();
            double price = (event.getPrice() == -1) ? existingEvent.get().getPrice() : event.getPrice();
            String category = (event.getCategory() == null) ? existingEvent.get().getCategory() : event.getCategory();
            int availableTickets = (event.getAvailableTickets() == 0) ? existingEvent.get().getAvailableTickets() : event.getAvailableTickets();
            String idSeller = (event.getIdSeller() == null) ? existingEvent.get().getIdSeller() : event.getIdSeller();

            existingEvent.get().setName(name);
            existingEvent.get().setDescription(description);
            existingEvent.get().setLocation(location);
            existingEvent.get().setDate(date);
            existingEvent.get().setTime(time);
            existingEvent.get().setPrice(price);
            existingEvent.get().setCategory(category);
            existingEvent.get().setAvailableTickets(availableTickets);
            existingEvent.get().setIdSeller(idSeller);

            eventRepository.save(existingEvent.get());
            return existingEvent.get();
        }
        catch (Exception e) {
            throw new ExceptionBackend(
                "Errore Interno",
                "Si è verificato un errore nel server durante l'aggiornamento dell'evento.",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public void deleteEvent(String idUser, String eventId) throws ExceptionBackend {

        Optional<Event> existingEvent = eventRepository.findById(eventId);
    
        if (!existingEvent.isPresent()) {
            throw new ExceptionBackend(
                "Errore Evento",
                "Evento non trovato",
                HttpStatus.NOT_FOUND
            );
        }
    
        if (!existingEvent.get().getIdSeller().equals(idUser)) {
            throw new ExceptionBackend(
                "Errore Evento",
                "Non sei autorizzato a eliminare questo evento",
                HttpStatus.FORBIDDEN
            );
        }
    
        try {
            eventRepository.delete(existingEvent.get());
        } 
        catch (Exception e) {
            throw new ExceptionBackend(
                "Errore Interno",
                "Si è verificato un errore nel server durante l'eliminazione dell'evento.",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
            
}   
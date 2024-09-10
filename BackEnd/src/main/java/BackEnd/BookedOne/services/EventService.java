package BackEnd.BookedOne.services;


import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import BackEnd.BookedOne.dto.Event;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.Event.CreateEvent;
import BackEnd.BookedOne.interfaces.Event.UpdateEvent;
import BackEnd.BookedOne.interfaces.Reservation.GetEvents;
import BackEnd.BookedOne.repositories.EventRepository;
import BackEnd.BookedOne.repositories.UserRepository;
import BackEnd.BookedOne.dto.User;
import java.util.List;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

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
                "Evento Esistente",  
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
                "La data dell'evento è passata.",  
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

    public void deleteEvent(String idUser, Event event) throws ExceptionBackend {

        Optional<Event> existingEvent = eventRepository.findById(event.getId());
        Optional<User> user = userRepository.findById(idUser);

    
        if (!existingEvent.isPresent()) {
            throw new ExceptionBackend(
                "Errore Evento",
                "Evento non trovato",
                HttpStatus.NOT_FOUND
            );
        }

        if(!user.isPresent()){
            throw new ExceptionBackend(
                "Errore Utente",
                "L'utente non è stato trovato",
                HttpStatus.NOT_FOUND
            );
        }
        
        if (!existingEvent.get().getIdSeller().equals(idUser)) {
            throw new ExceptionBackend(
                "Errore Evento",
                "L'evento può essere eliminato solo da chi l'ha creato",
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
         
     public Page<Event> getAllEvents(String userId,GetEvents events) throws ExceptionBackend {
        
        //controlla se l'utente esiste ed è un customer
        Optional<User> user = userRepository.findById(userId);

        if(!user.isPresent()){
            throw new ExceptionBackend(
                "Errore Utente",
                "L'utente non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }

        if(!user.get().getRole().equals("customer")){
            throw new ExceptionBackend(
                "Errore Utente",
                "L'utente non è un customer.",
                HttpStatus.FORBIDDEN
            );
        }
        
        // Recupera tutti gli eventi dal repository
        List<Event> allEvents = eventRepository.findAll();

        // Crea un formatter per la data (adatta il formato alla tua data se necessario)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Ottieni la data odierna
        LocalDate today = LocalDate.now();

        // Filtra gli eventi in base alla data maggiore di oggi e agli altri criteri forniti
        List<Event> filteredEvents = allEvents.stream()
            .filter(event -> {
                LocalDate eventDate = LocalDate.parse(event.getDate(), formatter);
                return (eventDate.isEqual(today)||eventDate.isAfter(today)) && // Filtra eventi con data maggiore di oggi
                    (events.getCategory() == null || event.getCategory().toLowerCase().contains(events.getCategory().toLowerCase())) &&
                    (events.getLocation() == null || event.getLocation().toLowerCase().contains(events.getLocation().toLowerCase())) &&
                    (events.getName() == null || event.getName().toLowerCase().contains(events.getName().toLowerCase())) &&
                    (events.getDate() == null || event.getDate().equalsIgnoreCase(events.getDate()));
            })
            .sorted((e1, e2) -> {
                LocalDate date1 = LocalDate.parse(e1.getDate(), formatter);
                LocalDate date2 = LocalDate.parse(e2.getDate(), formatter);
                return date1.compareTo(date2); // Ordinamento crescente per data
            })
            .collect(Collectors.toList());

        // Calcola la paginazione dopo il filtraggio e ordinamento
        int start = (int) PageRequest.of(events.getPage(), events.getSize()).getOffset();
        int end = Math.min((start + events.getSize()), filteredEvents.size());

        if(start > end){
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(events.getPage(), events.getSize()), filteredEvents.size());
        }

        List<Event> paginatedEvents = filteredEvents.subList(start, end);

        // Restituisci gli eventi paginati
        return new PageImpl<>(paginatedEvents, PageRequest.of(events.getPage(), events.getSize()), filteredEvents.size());
        
    }

    public Page<Event> getAllSellerEvents(String userId,GetEvents allEventsBySeller) throws ExceptionBackend {
        
        //controlla se l'utente esiste ed è un customer
        Optional<User> user = userRepository.findById(userId);

        if(!user.isPresent()){
            throw new ExceptionBackend(
                "Errore Utente",
                "L'utente non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }

        if(!user.get().getRole().equals("seller")){
            throw new ExceptionBackend(
                "Errore Utente",
                "L'utente non è un seller.",
                HttpStatus.FORBIDDEN
            );
        }

        
        // Recupera tutti gli eventi che hanno idSeller = userId dal repository
        List<Event> allEvents = eventRepository.findByIdSeller(userId);

        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Filtraggio degli eventi
        List<Event> filteredEvents = allEvents.stream()
            .filter(event -> {
                return
                    (allEventsBySeller.getCategory() == null || event.getCategory().toLowerCase().contains(allEventsBySeller.getCategory().toLowerCase())) &&
                    (allEventsBySeller.getLocation() == null || event.getLocation().toLowerCase().contains(allEventsBySeller.getLocation().toLowerCase())) &&
                    (allEventsBySeller.getName() == null || event.getName().toLowerCase().contains(allEventsBySeller.getName().toLowerCase())) &&
                    (allEventsBySeller.getDate() == null || event.getDate().equalsIgnoreCase(allEventsBySeller.getDate()));
            })
            .sorted((e1, e2) -> {
                LocalDate date1 = LocalDate.parse(e1.getDate(), formatter);
                LocalDate date2 = LocalDate.parse(e2.getDate(), formatter);
                return date2.compareTo(date1); // Ordinamento decrescente per data
            })
            .collect(Collectors.toList());

        // Calcola la paginazione dopo il filtraggio e ordinamento
        int start = (int) PageRequest.of(allEventsBySeller.getPage(), allEventsBySeller.getSize()).getOffset();
        int end = Math.min((start + allEventsBySeller.getSize()), filteredEvents.size());

        if(start > end){
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(allEventsBySeller.getPage(), allEventsBySeller.getSize()), filteredEvents.size());
        }

        List<Event> paginatedEvents = filteredEvents.subList(start, end);

        // Restituisci gli eventi paginati
        return new PageImpl<>(paginatedEvents, PageRequest.of(allEventsBySeller.getPage(), allEventsBySeller.getSize()), filteredEvents.size());
        
    }
}   
package BackEnd.BookedOne.services;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import BackEnd.BookedOne.dto.Event;
import BackEnd.BookedOne.dto.Reservation;
import BackEnd.BookedOne.dto.User;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.Reservation.GetEvents;
import BackEnd.BookedOne.interfaces.Reservation.ReservationEvent;
import BackEnd.BookedOne.interfaces.Reservation.ReserveEvent;
import BackEnd.BookedOne.repositories.EventRepository;
import BackEnd.BookedOne.repositories.ReservationRepository;
import BackEnd.BookedOne.repositories.UserRepository;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@Service
public class ReservationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public Reservation reserveEvent(String customerId, ReserveEvent event) throws ExceptionBackend {

        if (event == null) {
            throw new ExceptionBackend(
                "Errore evento",
                "L'oggetto evento è vuoto.",
                HttpStatus.BAD_REQUEST
            );
        }

        Optional<Event> optionalEvent = eventRepository.findById(event.getEvent().getId());

        if(!optionalEvent.isPresent()){
            throw new ExceptionBackend(
                "Errore evento",
                "L'evento non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }

        
        if (event.getNumberOfTickets() <= 0) {
            throw new ExceptionBackend(
                "Errore richiesta",
                "Il numero di biglietti da prenotare non può essere negativo.",
                HttpStatus.BAD_REQUEST
            );
        }
    
        Optional<User> optionalUser = userRepository.findById(customerId);

        if (!optionalUser.isPresent()) {
            throw new ExceptionBackend(
                "Errore utente",
                "L'utente non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }
    
        if (!optionalUser.get().getRole().equals("customer")) {
            throw new ExceptionBackend(
                "Errore utente",
                "L'utente non è un customer.",
                HttpStatus.FORBIDDEN
            );
        }
    
        if (event.getEvent().getAvailableTickets() <= 0) {
            throw new ExceptionBackend(
                "Errore evento",
                "L'evento è esaurito. Non ci sono biglietti disponibili",
                HttpStatus.BAD_REQUEST
            );
        }
    
        if (event.getNumberOfTickets() > event.getEvent().getAvailableTickets()) {
            throw new ExceptionBackend(
                "Errore evento",
                "Non ci sono abbastanza biglietti disponibili per la quantità richiesta.",
                HttpStatus.BAD_REQUEST
            );
        }
    
        double totalPrice = event.getNumberOfTickets() * event.getEvent().getPrice();
    
        Reservation newReservation = new Reservation(
            customerId,
            event.getEvent().getId(),
            event.getNumberOfTickets(),
            LocalDate.now().toString(),
            totalPrice
        );
    
        try {
            event.getEvent().setAvailableTickets(event.getEvent().getAvailableTickets() - event.getNumberOfTickets());
            eventRepository.save(event.getEvent());
            reservationRepository.save(newReservation);
            return newReservation;

        } 
        catch (Exception e) {
            throw new ExceptionBackend(
                "Errore Interno",
                "Si è verificato un errore nel server durante la prenotazione dell'evento.",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public void deleteReservation(String customerId, Reservation reservation) throws ExceptionBackend {

        Optional<User> user = userRepository.findById(customerId);
        Optional<Reservation> existingReservation = reservationRepository.findById(reservation.getId());

        if (!user.isPresent()) {
            throw new ExceptionBackend(
                "Utente non trovato",
                "L'utente non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }

        if (!user.get().getRole().equals("customer")) {
            throw new ExceptionBackend(
                "Errore utente",
                "L'utente non è un customer.",
                HttpStatus.FORBIDDEN
            );
        }

        if (!existingReservation.isPresent()) {
            throw new ExceptionBackend(
                "Errore prenotazione",
                "La prenotazione non è stata trovata.",
                HttpStatus.NOT_FOUND
            );
        }

        if (!existingReservation.get().getUserId().equals(customerId)) {
            throw new ExceptionBackend(
                "Errore prenotazione",
                "L'utente non è il proprietario della prenotazione, quindi non può eliminarla.",
                HttpStatus.FORBIDDEN
            );
        }

        //sommo il numero di biglietti e li rendo disponibili
        int number = existingReservation.get().getNumberOfTickets();
        Event event = eventRepository.findById(existingReservation.get().getEventId()).get();
        event.setAvailableTickets(event.getAvailableTickets() + number);
        eventRepository.save(event);

        try {
            reservationRepository.deleteById(reservation.getId());
        } 
        catch (Exception e) {
            throw new ExceptionBackend(
                "Errore Interno",
                "Si è verificato un errore nel server durante la cancellazione della prenotazione.",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public Page<ReservationEvent> getMyReservations(String userId, GetEvents myRes) throws ExceptionBackend {

        if(!userRepository.findById(userId).isPresent()){
            throw new ExceptionBackend(
                "Errore Utente",
                "L'utente non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }
        
        // Trova tutte le prenotazioni dell'utente
        List<Reservation> reservations = reservationRepository.findByUserId(userId);
    
        // Estrai tutti gli ID degli eventi dalle prenotazioni
        List<String> eventIds = reservations.stream()
            .map(Reservation::getEventId)
            .collect(Collectors.toList());
    
        // Recupera tutti gli eventi associati agli ID estratti
        List<Event> allEvents = eventRepository.findAllById(eventIds);
    
        // Crea una mappa degli eventi per un rapido accesso basato su eventId
        Map<String, Event> eventMap = allEvents.stream()
            .collect(Collectors.toMap(Event::getId, event -> event));
    
        // Crea un formatter per la data se necessario (adatta il formato alla tua data)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = LocalDate.now(); // Data di oggi
    
        // Filtra e ordina le prenotazioni
        List<ReservationEvent> filteredReservationsWithEvents = reservations.stream()
            .map(reservation -> {
                Event event = eventMap.get(reservation.getEventId());
                return new ReservationEvent(reservation, event);
            })
            .filter(reservationEvent -> {
                Event event = reservationEvent.getEvent();
                if (event == null) {
                    return false;
                }
                // Filtra per categoria, location, nome, data, etc.
                boolean matchesFilter = 
                    (myRes.getCategory() == null || event.getCategory().toLowerCase().contains(myRes.getCategory().toLowerCase())) &&
                    (myRes.getLocation() == null || event.getLocation().toLowerCase().contains(myRes.getLocation().toLowerCase())) &&
                    (myRes.getName() == null || event.getName().toLowerCase().contains(myRes.getName().toLowerCase())) &&
                    (myRes.getDate() == null || event.getDate().equalsIgnoreCase(myRes.getDate()));
    
                // Filtra per eventi "scaduti" (se richiesto)
                if (myRes.isExpired()) {
                    LocalDate eventDate = LocalDate.parse(event.getDate(), formatter);
                    return matchesFilter && eventDate.isBefore(today); // Se scaduto, deve essere prima di oggi
                }
    
                return matchesFilter;
            })
            .sorted((re1, re2) -> {
                LocalDate date1 = LocalDate.parse(re1.getReservation().getBookingDate(), formatter);
                LocalDate date2 = LocalDate.parse(re2.getReservation().getBookingDate(), formatter);
                return date2.compareTo(date1); // Ordinamento decrescente
            })
            .collect(Collectors.toList());
    
        // Calcola la paginazione dopo il filtraggio e ordinamento
        int start = (int) PageRequest.of(myRes.getPage(), myRes.getSize()).getOffset();
        int end = Math.min((start + myRes.getSize()), filteredReservationsWithEvents.size());
        if(start > end){
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(myRes.getPage(), myRes.getSize()), filteredReservationsWithEvents.size());
        }
    
        List<ReservationEvent> paginatedReservationsWithEvents = filteredReservationsWithEvents.subList(start, end);
    
        return new PageImpl<>(paginatedReservationsWithEvents, PageRequest.of(myRes.getPage(), myRes.getSize()), filteredReservationsWithEvents.size());
    }
    

   
}

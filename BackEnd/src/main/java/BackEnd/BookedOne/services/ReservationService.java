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
import BackEnd.BookedOne.interfaces.Reservation.NumberTicket;
import BackEnd.BookedOne.interfaces.Reservation.ReservationEvent;
import BackEnd.BookedOne.repositories.EventRepository;
import BackEnd.BookedOne.repositories.ReservationRepository;
import BackEnd.BookedOne.repositories.UserRepository;
import java.time.format.DateTimeFormatter;

@Service
public class ReservationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public Reservation ReserveEvent(String customerId, String eventId, NumberTicket reservation) throws ExceptionBackend {

        if (reservation == null) {
            throw new ExceptionBackend(
                "Errore richiesta",
                "Il corpo della richiesta è vuoto.",
                HttpStatus.BAD_REQUEST
            );
        }
    
        if (reservation.getNumberOfTickets() <= 0) {
            throw new ExceptionBackend(
                "Errore richiesta",
                "Il numero di biglietti da prenotare non può essere negativo.",
                HttpStatus.BAD_REQUEST
            );
        }
    
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (!optionalEvent.isPresent()) {
            throw new ExceptionBackend(
                "Errore evento",
                "L'evento non è stato trovato.",
                HttpStatus.NOT_FOUND
            );
        }
    
        Event event = optionalEvent.get();
    
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
    
        if (event.getAvailableTickets() <= 0) {
            throw new ExceptionBackend(
                "Errore evento",
                "L'evento è esaurito. Non ci sono biglietti disponibili",
                HttpStatus.BAD_REQUEST
            );
        }
    
        if (reservation.getNumberOfTickets() > event.getAvailableTickets()) {
            throw new ExceptionBackend(
                "Errore evento",
                "Non ci sono abbastanza biglietti disponibili per la quantità richiesta.",
                HttpStatus.BAD_REQUEST
            );
        }
    
        double totalPrice = reservation.getNumberOfTickets() * event.getPrice();
    
        Reservation newReservation = new Reservation(
            customerId,
            event.getId(),
            reservation.getNumberOfTickets(),
            LocalDate.now().toString(),
            totalPrice
        );
    
        try {
            event.setAvailableTickets(event.getAvailableTickets() - reservation.getNumberOfTickets());
            eventRepository.save(event);
            reservationRepository.save(newReservation);
            return newReservation;

        } catch (Exception e) {
            throw new ExceptionBackend(
                "Errore Interno",
                "Si è verificato un errore nel server durante la prenotazione dell'evento.",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public void deleteReservation(String customerId, String reservationId) throws ExceptionBackend {

        Optional<User> user = userRepository.findById(customerId);
        Optional<Reservation> reservation = reservationRepository.findById(reservationId);

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

        if (!reservation.isPresent()) {
            throw new ExceptionBackend(
                "Errore prenotazione",
                "La prenotazione non è stata trovata.",
                HttpStatus.NOT_FOUND
            );
        }

        if (!reservation.get().getUserId().equals(customerId)) {
            throw new ExceptionBackend(
                "Errore prenotazione",
                "L'utente non è il proprietario della prenotazione.",
                HttpStatus.FORBIDDEN
            );
        }

        //sommo il numero di biglietti e li rendo disponibili
        int number = reservation.get().getNumberOfTickets();
        Event event = eventRepository.findById(reservation.get().getEventId()).get();
        event.setAvailableTickets(event.getAvailableTickets() + number);
        eventRepository.save(event);

        try {
            reservationRepository.deleteById(reservationId);
        } 
        catch (Exception e) {
            throw new ExceptionBackend(
                "Errore Interno",
                "Si è verificato un errore nel server durante la cancellazione della prenotazione.",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

    }


    public Page<ReservationEvent> getMyReservations(String userId, int page, int size, String category, String location, String name, 
    String date) throws ExceptionBackend {

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

        // Filtra e ordina le prenotazioni
        List<ReservationEvent> filteredReservationsWithEvents = reservations.stream()
            .map(reservation -> {
                Event event = eventMap.get(reservation.getEventId());
                return new ReservationEvent(reservation, event);
            })
            .filter(reservationEvent -> {
                Event event = reservationEvent.getEvent();
                return (event != null &&
                        (category == null || event.getCategory().toLowerCase().contains(category.toLowerCase())) &&
                        (location == null || event.getLocation().toLowerCase().contains(location.toLowerCase())) &&
                        (name == null || event.getName().toLowerCase().contains(name.toLowerCase())) &&
                        (date == null || event.getDate().equalsIgnoreCase(date)));
            })
            .sorted((re1, re2) -> {
                LocalDate date1 = LocalDate.parse(re1.getReservation().getBookingDate(), formatter);
                LocalDate date2 = LocalDate.parse(re2.getReservation().getBookingDate(), formatter);
                return date2.compareTo(date1); // Ordinamento decrescente
            })
            .collect(Collectors.toList());

        // Calcola la paginazione dopo il filtraggio e ordinamento
        int start = (int) PageRequest.of(page, size).getOffset();
        int end = Math.min((start + size), filteredReservationsWithEvents.size());
        List<ReservationEvent> paginatedReservationsWithEvents = filteredReservationsWithEvents.subList(start, end);

        return new PageImpl<>(paginatedReservationsWithEvents, PageRequest.of(page, size), filteredReservationsWithEvents.size());
    }
}

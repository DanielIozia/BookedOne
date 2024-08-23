package BackEnd.BookedOne.services;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import BackEnd.BookedOne.dto.Event;
import BackEnd.BookedOne.dto.Reservation;
import BackEnd.BookedOne.dto.User;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.Reservation.NumberTicket;
import BackEnd.BookedOne.repositories.EventRepository;
import BackEnd.BookedOne.repositories.ReservationRepository;
import BackEnd.BookedOne.repositories.UserRepository;

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
            totalPrice,
            false
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
    
    
}

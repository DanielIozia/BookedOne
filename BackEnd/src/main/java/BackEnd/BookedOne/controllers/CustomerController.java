package BackEnd.BookedOne.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import BackEnd.BookedOne.dto.Event;
import BackEnd.BookedOne.dto.Reservation;
import BackEnd.BookedOne.exception.ErrorResponse;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.Reservation.GetEvents;
import BackEnd.BookedOne.interfaces.Reservation.ReservationEvent;
import BackEnd.BookedOne.interfaces.Reservation.ReserveEvent;
import BackEnd.BookedOne.jwt.JwtUtil;
import BackEnd.BookedOne.services.EventService;
import BackEnd.BookedOne.services.ReservationService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private EventService eventService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private JwtUtil jwtTokenService;


    @PostMapping("/reserve-event")
    public ResponseEntity<?> bookEvent(HttpServletRequest request, @RequestBody ReserveEvent event) throws ExceptionBackend {
        try{
            String token = request.getHeader("Authorization");
            String customerId = jwtTokenService.decode(token);
            Reservation res = reservationService.ReserveEvent(customerId,event);
            return ResponseEntity.ok(res);
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Errore interno","Si è verificato un errore nel server"));        
        }
    }

    @DeleteMapping("/delete-reservation")
    public ResponseEntity<?> deleteReservation(HttpServletRequest request, @RequestBody Reservation reservation) throws ExceptionBackend {
        try{
            String token = request.getHeader("Authorization");
            String customerId = jwtTokenService.decode(token);
            reservationService.deleteReservation(customerId,reservation);
            return ResponseEntity.ok("Prenotazione eliminata con successo");
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Errore interno","Si è verificato un errore nel server"));        
        }
    }

    @PostMapping("/my-reservations")//post perchè paginata
    public ResponseEntity<?> getMyReservations(HttpServletRequest request, @RequestBody GetEvents myRes) throws ExceptionBackend {
        try{
            String token = request.getHeader("Authorization");
            String customerId = jwtTokenService.decode(token);
            Page<ReservationEvent> res = reservationService.getMyReservations(customerId,myRes);
            return ResponseEntity.ok(res);
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Errore interno","Si è verificato un errore nel server"));        
        }
    }
   
    @PostMapping("/all-events")//post perchè paginata
    public ResponseEntity<?> getAllEvents(HttpServletRequest request, @RequestBody GetEvents allEvents) throws ExceptionBackend {
        try{
            String token = request.getHeader("Authorization");
            String customerId = jwtTokenService.decode(token);
            Page<Event> events = eventService.getAllEvents(customerId,allEvents);
            return ResponseEntity.ok(events);
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Errore interno","Si è verificato un errore nel server"));        
        }
    }
}

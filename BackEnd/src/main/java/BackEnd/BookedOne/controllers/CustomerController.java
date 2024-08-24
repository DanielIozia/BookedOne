package BackEnd.BookedOne.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import BackEnd.BookedOne.dto.Reservation;
import BackEnd.BookedOne.exception.ErrorResponse;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.Reservation.GetMyReservation;
import BackEnd.BookedOne.interfaces.Reservation.NumberTicket;
import BackEnd.BookedOne.interfaces.Reservation.ReservationEvent;
import BackEnd.BookedOne.jwt.JwtUtil;
import BackEnd.BookedOne.services.ReservationService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private JwtUtil jwtTokenService;


    @PostMapping("/reserve-event/{eventId}")
    public ResponseEntity<?> bookEvent(HttpServletRequest request, @PathVariable String eventId, @RequestBody NumberTicket number) throws ExceptionBackend {
        try{
            String token = request.getHeader("Authorization");
            String customerId = jwtTokenService.decode(token);
            Reservation res = reservationService.ReserveEvent(customerId,eventId,number);
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

    @DeleteMapping("/delete-reservation/{reservationId}")
    public ResponseEntity<?> deleteReservation(HttpServletRequest request, @PathVariable String reservationId) throws ExceptionBackend {
        try{
            String token = request.getHeader("Authorization");
            String customerId = jwtTokenService.decode(token);
            reservationService.deleteReservation(customerId,reservationId);
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

    @PostMapping("/my-reservations")//vedere la paginazione
    public ResponseEntity<?> getMyReservations(HttpServletRequest request,@RequestBody GetMyReservation myRes) throws ExceptionBackend {
        try{
            String token = request.getHeader("Authorization");
            String customerId = jwtTokenService.decode(token);
            Page<ReservationEvent> res = reservationService.getMyReservations(customerId,myRes.getPage(),myRes.getSize(),myRes.getCategory(),myRes.getLocation(),myRes.getName(),myRes.getDate());
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
   
    
}

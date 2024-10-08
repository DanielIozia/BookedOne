package BackEnd.BookedOne.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import BackEnd.BookedOne.dto.Event;
import BackEnd.BookedOne.exception.ErrorResponse;
import BackEnd.BookedOne.exception.ExceptionBackend;
import BackEnd.BookedOne.interfaces.Event.CreateEvent;
import BackEnd.BookedOne.interfaces.Event.UpdateEvent;
import BackEnd.BookedOne.interfaces.Reservation.GetEvents;
import BackEnd.BookedOne.jwt.JwtUtil;
import BackEnd.BookedOne.services.EventService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api/seller")
public class SellerController {

    @Autowired
    private EventService eventService;

    @Autowired
    private JwtUtil jwtTokenService;

    @PostMapping("/create-event")
    public ResponseEntity<?> createEvent(HttpServletRequest request, @Validated @RequestBody CreateEvent event) throws ExceptionBackend { 
        try{
            String token = request.getHeader("Authorization");
            String id = jwtTokenService.decode(token);
            event.setIdSeller(id);
            Event createdEvent = eventService.createEvent(event);
            return ResponseEntity.ok(createdEvent);
        }

        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Errore interno","Si è verificato un errore nel server"));        
        }
    }

    @PutMapping("/update-event")
    public ResponseEntity<?> updateEvent(HttpServletRequest request, @Validated @RequestBody UpdateEvent event) throws ExceptionBackend {
        try{
            String token = request.getHeader("Authorization");
            String idUser = jwtTokenService.decode(token);
            Event updatedEvent = eventService.updateEvent(idUser,event);
            return ResponseEntity.ok(updatedEvent);
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Errore interno","Si è verificato un errore nel server"));        
        }
    }

    @DeleteMapping("delete-event")
    public ResponseEntity<?> deleteEvent(HttpServletRequest request,  @Validated @RequestBody Event event) throws ExceptionBackend {
        try{
            String token = request.getHeader("Authorization");
            String idUser = jwtTokenService.decode(token);
            eventService.deleteEvent(idUser,event);
            return ResponseEntity.ok("Evento eliminato con successo");
        }
        catch (ExceptionBackend e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrorResponse());
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Errore interno","Si è verificato un errore nel server"));        
        }
    }

     @PostMapping("/seller-events")//ritorna tutti gli eventi che ha pubblicato un seller
    public ResponseEntity<?> getAllEvents(HttpServletRequest request, @RequestBody GetEvents allEventsBySeller) throws ExceptionBackend {
        try{
            String token = request.getHeader("Authorization");
            String sellerId = jwtTokenService.decode(token);
            Page<Event> events = eventService.getAllSellerEvents(sellerId,allEventsBySeller);
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

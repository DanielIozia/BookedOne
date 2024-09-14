package BackEnd.BookedOne.interfaces.Reservation;

import BackEnd.BookedOne.dto.Event;
import BackEnd.BookedOne.dto.Reservation;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReservationEvent {
    private Reservation reservation;
    private Event event;
}

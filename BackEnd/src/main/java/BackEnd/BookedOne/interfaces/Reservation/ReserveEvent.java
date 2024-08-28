package BackEnd.BookedOne.interfaces.Reservation;

import BackEnd.BookedOne.dto.Event;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReserveEvent {

    private Event event;
    private int numberOfTickets;
}

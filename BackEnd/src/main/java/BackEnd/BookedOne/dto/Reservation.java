package BackEnd.BookedOne.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reservations")
public class Reservation {

    @Id
    private String id;

    private String userId;
    private String eventId;
    private int numberOfTickets;
    private String bookingDate;
    private double totalPrice;
    private boolean isCancelled;

    public Reservation(String userId, String eventId, int numberOfTickets, String bookingDate, double totalPrice, boolean isCancelled) {
        this.userId = userId;
        this.eventId = eventId;
        this.numberOfTickets = numberOfTickets;
        this.bookingDate = bookingDate;
        this.totalPrice = totalPrice;
        this.isCancelled = isCancelled;
    }
}

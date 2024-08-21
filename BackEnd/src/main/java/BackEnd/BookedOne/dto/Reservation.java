package BackEnd.BookedOne.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

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
    private Date bookingDate;
    private double totalPrice;
    private boolean isCancelled;
}

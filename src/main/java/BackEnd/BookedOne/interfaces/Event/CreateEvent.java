package BackEnd.BookedOne.interfaces.Event;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
public class CreateEvent {
    private String name;
    private String description;
    private String location;
    private LocalDate date;
    private LocalTime time;
    private double price;
    private String category;
    private int availableTickets;
    String idSeller;
}

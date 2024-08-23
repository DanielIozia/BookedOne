package BackEnd.BookedOne.interfaces.Event;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
public class UpdateEvent {
    @NotNull()
    private String id;
    private String name;
    private String description;
    private String location;
    private String date;
    private String time;
    private double price;
    private String category;
    private int availableTickets;
    String idSeller;
}

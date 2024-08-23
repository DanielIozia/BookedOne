package BackEnd.BookedOne.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "events")
public class Event {

    @Id
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
    List<String> idCustomer = new ArrayList<>();


    public Event(String name, String description,String location,LocalDate date,LocalTime time,double price, String category, int availableTickets, String idSeller) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.date = date.toString();
        this.time = time.toString();
        this.price = price;
        this.category = category;
        this.availableTickets = availableTickets;
        this.idSeller = idSeller;


    }
}
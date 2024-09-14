package BackEnd.BookedOne.interfaces.Reservation;

import lombok.Data;

@Data
public class GetEvents {
    private int page;
    private int size;
    private String category;
    private String location;
    private String name;
    private String date;
    private Boolean expired;
}

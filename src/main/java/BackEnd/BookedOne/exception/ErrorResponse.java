package BackEnd.BookedOne.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ErrorResponse  {
    private final String title;
    private final String message;
}

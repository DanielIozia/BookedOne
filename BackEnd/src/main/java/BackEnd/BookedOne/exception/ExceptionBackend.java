package BackEnd.BookedOne.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class ExceptionBackend extends Exception {
    
    private final ErrorResponse errorResponse ;
    private final HttpStatus status;

    public ExceptionBackend(String title, String detailMessage, HttpStatus status) {
        super(detailMessage);
        this.errorResponse = new ErrorResponse(title, detailMessage);
        this.status = status;
    }
}

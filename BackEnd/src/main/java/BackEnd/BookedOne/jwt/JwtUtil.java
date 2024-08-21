package BackEnd.BookedOne.jwt;

import java.sql.Date;
import org.springframework.stereotype.Service;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.JWTVerifier;



@Service
public class JwtUtil {

    private String secretKey = System.getenv("JWT_SECRET");

    public String generateToken(String value, Long duration){
        long currentTimeMillis = System.currentTimeMillis();
        // 15 minutes = 900000
        //3 ore = 10800000
        return JWT.create()
                .withSubject(value) 
                .withIssuedAt(new Date(currentTimeMillis))
                .withExpiresAt(new Date(currentTimeMillis + duration))  
                .sign(Algorithm.HMAC256(secretKey));
    }

    public boolean validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            JWTVerifier verifier = JWT.require(algorithm).build();
            verifier.verify(token);
            return true;
        } 
        catch (JWTVerificationException exception) {
            return false;
        }
    }

    public String decode(String token) {
        return JWT.decode(token).getSubject();
    }



}

package BackEnd.BookedOne.jwt;

import java.sql.Date;
import org.springframework.stereotype.Service;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.JWTVerifier;

/*
La classe JwtUtil serve come utilità per gestire i token JWT. Consente di:
1) Generare token JWT con un soggetto specifico e una durata di validità definita.
2) Validare i token JWT per verificare che siano corretti e non scaduti.
3) Decodificare un token JWT per estrarne il soggetto, che solitamente rappresenta l'identità dell'utente.
*/

@Service
public class JwtUtil {

    //Non nell'env così chi lo clona può usarlo. (so che dovrebbe essere nascosto)
    private String secretKey = "owijdoiwansd09o8hf12wsaid129883428392..//@";

    public String generateToken(String value, Long duration){
        long currentTimeMillis = System.currentTimeMillis();
        //15 minutes = 900000
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
        return JWT.decode(token.substring(7)).getSubject();
    }



}

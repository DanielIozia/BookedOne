package BackEnd.BookedOne.jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/*
 Questo interceptor serve a proteggere le API del backend assicurando che ogni richiesta HTTP 
 abbia un token JWT valido. Se il token non è presente o non è valido, la richiesta viene bloccata
 con un errore adeguato. Questo è fondamentale per garantire che solo gli utenti autenticati 
 possano accedere a certe risorse o funzioni dell'applicazione.
 */



@Component
public class JwtTokenInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{
        
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            response.sendError(HttpStatus.NOT_FOUND.value(), "Non è stato trovato alcun token JWT");
            return false;
        }

        String token = header.substring(7);
        if (!jwtUtil.validateToken(token)) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Il token JWT non è valido");
            return false;
        }

        
        return true;
    }
}


# Backend

## Panoramica

Questo progetto fornisce funzionalità per l'autenticazione degli utenti, la gestione degli eventi e delle prenotazioni. L'API del backend supporta varie operazioni tramite controller specifici per clienti, venditori e gestione degli utenti.

## Struttura del Progetto

1. **Controllers**
   - **AuthController**: Gestisce l'autenticazione e la registrazione degli utenti.
   - **CustomerController**: Gestisce le operazioni specifiche dei clienti, come prenotazioni e recupero degli eventi.
   - **SellerController**: Gestisce le operazioni dei venditori, inclusa la creazione, l'aggiornamento e la cancellazione degli eventi.
   - **UserController**: Gestisce le operazioni relative ai profili utente, inclusa la visualizzazione, l'aggiornamento e la cancellazione degli utenti.

2. **Gestione delle Eccezioni**
   - Le eccezioni personalizzate vengono gestite per restituire i codici di stato HTTP e i messaggi di errore appropriati.

3. **Database**
   - **MongoDB**: Utilizzato come sistema di gestione del database NoSQL per memorizzare eventi, prenotazioni e utenti.

4. **DTOs**
   - **Event**: Rappresenta un evento con dettagli come nome, descrizione, data, ora, prezzo, categoria e numero di biglietti disponibili.
   - **Reservation**: Rappresenta una prenotazione con dettagli come ID utente, ID evento, numero di biglietti e prezzo totale.
   - **User**: Rappresenta un utente con dettagli come nome, cognome, email, password e ruolo.

5. **JWT**
   - **JwtUtil**: Gestisce la generazione, validazione e decodifica dei token JWT.
   - **JwtTokenInterceptor**: Interceptor che verifica la validità del token JWT per le richieste protette.
   - **WebMvcConfig**: Configura le rotte per le quali non è necessario un token JWT.

6. **Servizi di Sicurezza**
   - **Argon2PasswordEncoderService**: Fornisce funzionalità di hashing e verifica delle password utilizzando l'algoritmo Argon2.

## Controllers

### AuthController

- **Endpoint:** `/api/auth/registration`
  - **Metodo:** POST
  - **Descrizione:** Registra un nuovo utente.
  - **Corpo della Richiesta:** `CreateUser` (dettagli dell'utente)
  - **Risposte:**
    - 200 OK: Restituisce `RegisterResponse` con i dettagli dell'utente.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

- **Endpoint:** `/api/auth/login`
  - **Metodo:** POST
  - **Descrizione:** Esegue il login di un utente esistente.
  - **Corpo della Richiesta:** `LoginUser` (credenziali di login)
  - **Risposte:**
    - 200 OK: Restituisce il token di autenticazione.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

- **Endpoint:** `/api/auth/me`
  - **Metodo:** GET
  - **Descrizione:** Recupera i dettagli dell'utente attualmente autenticato.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Risposte:**
    - 200 OK: Restituisce i dettagli dell'utente.
    - 401 Unauthorized: Restituisce i dettagli dell'errore se il token è invalido o mancante.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

### CustomerController

- **Endpoint:** `/api/customer/reserve-event`
  - **Metodo:** POST
  - **Descrizione:** Prenota un evento per il cliente.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Corpo della Richiesta:** `ReserveEvent` (dettagli dell'evento)
  - **Risposte:**
    - 200 OK: Restituisce i dettagli della prenotazione.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

- **Endpoint:** `/api/customer/delete-reservation`
  - **Metodo:** DELETE
  - **Descrizione:** Elimina una prenotazione esistente.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Corpo della Richiesta:** `Reservation` (dettagli della prenotazione)
  - **Risposte:**
    - 200 OK: Conferma l'eliminazione della prenotazione.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

- **Endpoint:** `/api/customer/my-reservations`
  - **Metodo:** POST
  - **Descrizione:** Recupera le prenotazioni del cliente.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Corpo della Richiesta:** `GetEvents` (parametri di paginazione)
  - **Risposte:**
    - 200 OK: Restituisce le prenotazioni del cliente.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

- **Endpoint:** `/api/customer/all-events`
  - **Metodo:** POST
  - **Descrizione:** Recupera tutti gli eventi disponibili.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Corpo della Richiesta:** `GetEvents` (parametri di paginazione)
  - **Risposte:**
    - 200 OK: Restituisce la lista degli eventi.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

### SellerController

- **Endpoint:** `/api/seller/create-event`
  - **Metodo:** POST
  - **Descrizione:** Crea un nuovo evento.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Corpo della Richiesta:** `CreateEvent` (dettagli dell'evento)
  - **Risposte:**
    - 200 OK: Restituisce i dettagli dell'evento creato.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

- **Endpoint:** `/api/seller/update-event`
  - **Metodo:** PUT
  - **Descrizione:** Aggiorna un evento esistente.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Corpo della Richiesta:** `UpdateEvent` (dettagli dell'evento)
  - **Risposte:**
    - 200 OK: Restituisce i dettagli dell'evento aggiornato.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

- **Endpoint:** `/api/seller/delete-event`
  - **Metodo:** DELETE
  - **Descrizione:** Elimina un evento esistente.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Corpo della Richiesta:** `Event` (dettagli dell'evento)
  - **Risposte:**
    - 200 OK: Conferma l'eliminazione dell'evento.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

- **Endpoint:** `/api/seller/seller-events`
  - **Metodo:** POST
  - **Descrizione:** Recupera tutti gli eventi pubblicati da un venditore.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Corpo della Richiesta:** `GetEvents` (parametri di paginazione)
  - **Risposte:**
    - 200 OK: Restituisce gli eventi pubblicati dal venditore.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore del server.

### UserController

- **Endpoint:** `/api/users/profile`
  - **Metodo:** GET
  - **Descrizione:** Recupera il profilo dell'utente autenticato.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Risposte:**
    - 200 OK: Restituisce i dettagli del profilo dell'utente.
    - 404 Not Found: Restituisce un errore se il profilo non esiste.
    - 500 Internal Server Error: Restituisce un messaggio di errore inatteso.

- **Endpoint:** `/api/users/update-user`
  - **Metodo:** PUT
  - **Descrizione:** Aggiorna i dettagli dell'utente.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Corpo della Richiesta:** `UpdateUser` (dettagli aggiornati dell'utente)
  - **Risposte:**
    - 200 OK: Restituisce i dettagli aggiornati dell'utente.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore inatteso.

- **Endpoint:** `/api/users/delete-user`
  - **Metodo:** DELETE
  - **Descrizione:** Elimina un utente.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Risposte:**
    - 204 No Content: Conferma l'eliminazione dell'utente.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore inatteso.

- **Endpoint:** `/api/users/verify-password`
  - **Metodo:** POST
  - **Descrizione:** Verifica la password dell'utente.
  - **Intestazione della Richiesta:** `Authorization` (token Bearer)
  - **Corpo della Richiesta:** Stringa (password da verificare)
  - **Risposte:**
    - 200 OK: Restituisce `true` se la password è corretta, `false` altrimenti.
    - 400 Bad Request: Restituisce i dettagli dell'errore in caso di problemi di convalida.
    - 500 Internal Server Error: Restituisce un messaggio di errore inatteso.

## Servizi di Sicurezza

### Argon2PasswordEncoderService

Questo servizio gestisce l'hashing e la verifica delle password utilizzando l'algoritmo Argon2, noto per la sua robustezza nella protezione delle password.

- **Hashing Password**: 
  - **Funzione**: `hashPassword(char[] password)`
  - **Descrizione**: Genera un hash sicuro della password fornita utilizzando l'algoritmo Argon2.
  - **Output**: Restituisce l'hash della password come una stringa esadecimale.

- **Verifica Password**:
  - **Funzione**: `verifyPassword(String hash, char[] password)`
  - **Descrizione**: Verifica se una password fornita corrisponde all'hash memorizzato. Rigenera l'hash della password e lo confronta con quello fornito.
  - **Output**: Restituisce `true` se l'hash corrisponde, `false` altrimenti.

## Tecnologie Utilizzate

- **Java Spring Boot:** Framework per lo sviluppo di applicazioni web basato su Java.
- **JWT (JSON Web Token):** Utilizzato per l'autenticazione e la gestione delle sessioni utente.
- **Exception Handling Personalizzato:** Per una gestione degli errori più chiara e dettagliata.

## Setup e Avvio

1. **Installazione delle Dipendenze:**
   Assicurati di avere Maven per la gestione delle dipendenze e il build del progetto.

2. **Avvio del Server:**
   Esegui l'applicazione utilizzando il comando `mvn clean install
mvn spring-boot:run`.

---
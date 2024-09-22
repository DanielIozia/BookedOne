# BookedOne

Benvenuto nel progetto BookedOne! Questo progetto è un'applicazione full-stack che gestisce eventi, prenotazioni e profili utente. È composto da due principali sezioni: il frontend e il backend. Di seguito trovi una panoramica di ciascuna sezione e delle istruzioni per iniziare.

## Struttura del Progetto

Il progetto è organizzato come segue:


### FrontEnd

La sezione **FrontEnd** contiene il codice dell'interfaccia utente, costruito con Angular. Per dettagli su come configurare e avviare il frontend, consulta il file [FrontEnd/README.md](./FrontEnd/README.md).

### BackEnd

La sezione **BackEnd** include il codice per il server e la gestione dell'API, costruito con Java Spring Boot. Per dettagli su come configurare e avviare il backend, consulta il file [BackEnd/README.md](./BackEnd/README.md).

## Panoramica del Progetto

### Funzionalità

- **Registrazione e Login**: Permettono agli utenti di creare un account e accedere all'applicazione.
- **Gestione Eventi**: Per visualizzare, creare, modificare e cancellare eventi (Venditori).
- **Prenotazioni**: Per gestire le prenotazioni degli eventi da parte degli utenti (Clienti).
- **Gestione Profili**: Permette agli utenti e ai venditori di visualizzare e aggiornare i propri profili.

### Tecnologie Utilizzate

- **Frontend**: Angular per la costruzione dell'interfaccia utente.
- **Backend**: Java Spring Boot per la logica di business e l'API.
- **Autenticazione**: JWT (JSON Web Token) per la gestione della sicurezza e delle sessioni utente.

## Setup e Avvio

Clona il progetto eseguendo il comando `git clone https://github.com/DanielIozia/BookedOne.git`

1. **Configura il Backend:**
   1. **Installazione delle Dipendenze:**
   Assicurati di avere Maven per la gestione delle dipendenze e il build del progetto.

   2. **Avvio del Server:**
   Esegui l'applicazione utilizzando il comando `mvn clean install
mvn spring-boot:run`.

2. **Configura il Frontend:**
   1. **Installa le dipendenze**: `npm install`
   2. **Avvio in locale**:
   - Prima di avviare il progetto in locale, bisogna modificare l'endpoint `BASE_URL` in **ogni servizio** tranne `auth.service`.
   - In ogni servizio (`user.service`, `seller.service`, `customer.service` e `event.service`) è già presente la stringa `BASE_URL` per la prova in locale. Seguire questi passaggi:
     - **Scommentare** la riga con l'endpoint locale.
     - **Commentare** la riga con l'endpoint online.

   Esempio:

   ```typescript
   //locale
   //private BASE_URL:string = "http://localhost:8080/api/customer"
   private BASE_URL:string = 'https://bookedone.onrender.com/api/customer';
---

   3. **Avvia il progetto**: `ng serve`
   4. **Accedi all'applicazione**: Apri `http://localhost:4200` nel tuo browser.


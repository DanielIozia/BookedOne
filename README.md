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
   2. **Avvia il progetto**: `ng serve`
   3. **Accedi all'applicazione**: Apri `http://localhost:4200` nel tuo browser.
---


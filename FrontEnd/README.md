# FrontEnd

## Panoramica
Funzionalità: 
-  Registrazione 
- Login 
- Gestione eventi 
- Prenotazioni

## Componente Principali

### SignUp e SignIn

- **SignUp**: Permette agli utenti di registrarsi creando un nuovo account.
- **SignIn**: Permette agli utenti di accedere al loro account esistente.

## Clienti

### Events

- **Descrizione**: Mostra tutti gli eventi disponibili.
- **Funzionalità**:
  - Visualizzazione dell'elenco degli eventi.
  - Possibilità di acquistare biglietti per gli eventi.
  - Filtri e opzioni di ricerca per facilitare la navigazione.

### Profile

- **Descrizione**: Mostra le informazioni del profilo dell'utente.
- **Funzionalità**:
  - Visualizzazione delle statistiche del profilo: numero totale di eventi prenotati, eventi scaduti e eventi futuri.
  - Possibilità di modificare il profilo tramite un bottone "Modifica Profilo".
  - Opzione per eliminare il profilo tramite un bottone "Elimina Profilo".

### Reservations

- **Descrizione**: Visualizza tutte le prenotazioni dell'utente.
- **Funzionalità**:
  - Visualizzazione di tutti gli eventi prenotati.
  - Per gli eventi passati:
    - Bottone "Elimina Evento" per rimuovere la prenotazione.
    - Annotazione "Scaduto" accanto agli eventi scaduti.
  - Per gli eventi futuri:
    - Bottone "Annulla Prenotazione" per cancellare la prenotazione.

## Venditori

### Profile

- **Descrizione**: Mostra le informazioni del profilo del venditore.
- **Funzionalità**:
  - Visualizzazione delle statistiche del profilo: numero totale di eventi emessi, eventi scaduti e eventi futuri.
  - Possibilità di modificare il profilo tramite un bottone "Modifica Profilo".
  - Opzione per eliminare il profilo tramite un bottone "Elimina Profilo".


### Events

- **Descrizione**: Visualizza tutti gli eventi emessi dal venditore.
- **Funzionalità**:
  - Visualizzazione dell'elenco degli eventi.
  - Possibilità di modificare un evento non scaduto.
  - Possibilità di eliminare un evento.

### Create-Event

- **Descrizione**: Permette al venditore di creare un nuovo evento.
- **Funzionalità**:
  - Inserimento dei dettagli dell'evento:
    - **Titolo Evento**
    - **Descrizione**
    - **Luogo**
    - **Data**: gg/mm/aaaa
    - **Ora**: --:--
    - **Categoria**
    - **Prezzo**
    - **Biglietti Disponibili**

## Tecnologie Utilizzate

- **Angular**: Framework per lo sviluppo dell'interfaccia utente.

## Setup e Avvio

1. **Clona il repository**: `git clone <https://github.com/DanielIozia/BookedOne.git>`
2. **Installa le dipendenze**: `npm install`
3. **Avvio in locale**:
   - Prima di avviare il progetto in locale, bisogna modificare l'endpoint `BASE_URL` in **ogni servizio** tranne `auth.service`.
   - In ogni servizio (`user.service`, `seller.service`, `customer.service` e `event.service`) è già presente la stringa `BASE_URL` per la prova in locale. Seguire questi passaggi:
     - **Scommentare** la riga con l'endpoint locale.
     - **Commentare** la riga con l'endpoint online.
     
   Esempio:

   ```typescript
   //locale
   //private BASE_URL:string = "http://localhost:8080/api/customer"
   private BASE_URL:string = 'https://bookedone.onrender.com/api/customer';
3. **Avvia il progetto**: `ng serve`
4. **Accedi all'applicazione**: Apri `http://localhost:4200` nel tuo browser.



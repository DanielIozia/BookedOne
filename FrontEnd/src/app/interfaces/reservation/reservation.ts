export interface Reservation {
    id: string;
    userId: string;
    eventId: string;
    numberOfTickets: number;
    bookingDate: string; // Anche qui, considera l'utilizzo di Date
    totalPrice: number;
  }
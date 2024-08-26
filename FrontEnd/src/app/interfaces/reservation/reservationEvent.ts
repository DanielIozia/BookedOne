import { EventDetails } from '../event/event';
import { Reservation } from './reservation';
  
  export interface ReservationEvent {
    reservation: Reservation;
    event: EventDetails;
  }
  
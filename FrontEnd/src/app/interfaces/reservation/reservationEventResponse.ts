import { Pageable } from "./pageable";
import { ReservationEvent } from "./reservationEvent";

export interface ReservationEventResponse {
    content: ReservationEvent[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  }
  
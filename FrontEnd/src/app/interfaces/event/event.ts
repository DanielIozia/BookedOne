
export interface EventDetails {
    id?:string;
    name:string;
    description:string;
    location:string;
    date:Date;
    time:Date;
    price:number;
    category:string;
    availableTickets:number;
    idSeller:string;
}

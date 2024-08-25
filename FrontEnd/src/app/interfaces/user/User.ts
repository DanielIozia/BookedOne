export interface User {
    id?: string;
    email: string;
    password:string;
    role: 'customer' | 'seller';
    token?: string;
    firstName:string;
    lastName:string;
}
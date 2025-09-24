export interface User {
    id: number;
    email: string;
    username: string;
    first_login: boolean;
}

export interface LoggedUser {
    username: string;
    email: string;
}
export interface Loan {
    id: string;
    dateBorrowed?: Date;
    dueDate?: Date;
    dateReturned?: Date;
    loanStatus: string;

    accessionNo: string;
    title: string;
    callNumber: string;
    author: string;

    uncIdNumber: string;
    department: string;

}

export interface Reservations {
    reservationId: number;
    reservationDate: Date;
    expirationDate: Date;
    reservationStatus: string;

    title: string;
    accessionNo: string;
    callNum: string;
    author: string;

    uncIdNumber: string;
    department: string;

}

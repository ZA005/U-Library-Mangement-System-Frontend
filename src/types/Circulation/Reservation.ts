export interface Reservation {
    id: number
    book_id: number
    book_title: string;
    book_accession_no: string;

    account_id: number
    user_id: string

    reservationDateTime: string
    expirationDate: string

    status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'EXPIRED' | 'NOTIFIED'
}
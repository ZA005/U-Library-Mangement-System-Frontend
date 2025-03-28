export interface Reservation {
    id: number
    book_id: number

    account_id: number
    user_id: number

    reservationDateTime: string
    expirationDate: string

    status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'EXPIRED' | 'NOTIFIED'
}
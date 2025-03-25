export interface Transaction {
    id: number;

    type: 'LOAN' | 'RETURNED' | 'RENEWED' | 'RESERVATION' | 'FINE_PAYMENT' | 'OVERDUE'

    loan_id: number;
    reservation_id: number;
    fine_id: number;

    user_id: string;

    transDateTime: string;
}
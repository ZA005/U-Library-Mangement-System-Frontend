export interface Loan {
    id: number;
    book_id: number;
    book_accession_no: string;
    book_title: string
    account_id: number
    user_id: string
    email: string
    firstName: string
    middleName: string
    lastName: string
    suffix: string
    role: string
    loanDate: string
    dueDate: string
    returnDate: string
    status: 'LOANED_OUT' | 'RETURNED' | 'OVERDUE'
}
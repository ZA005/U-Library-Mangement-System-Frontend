export interface Fine {
    id: number;

    // LOAN
    loan_id: number;
    loanDate: string;
    dueDate: string;
    fullName: string;

    // ACCOUNT
    account_id: number;
    user_id: string;

    fine_amount: number;
    status: number;

    fineDate: string;
    paymentDate: string;
}
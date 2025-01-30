export interface Loan {
    loanId: string;
    accessionNo: string;
    title: string;
    callNumber: string;
    authorName: string;
    borrower: string;
    departmentName: string;
    borrowDate?: string;
    returnDate?: string;
    dueDate?: string;
    status: string;
}
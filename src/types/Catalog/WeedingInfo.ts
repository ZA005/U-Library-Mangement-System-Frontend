export interface WeedingInfo {

    id: number;
    bookWeedingStatusNotes: string;
    reviewDate: string;
    weedStatus: string;

    bookId: number;
    accessionNumber: string;
    callNumber: string;
    bookTitle: string;
    authors: string[];

    weedingCriteriaDdc: string;

    weedProcessId: number;
    processStartDate: string;
    processEndDate: string;
    processInitiator: string;
    processNotes: string;
    processStatus: string;
}; 
export interface WeedingCriteria {
    id?: number;
    ddc: string;
    minYearsOld: number;
    conditionThreshold: string;
    usageThreshold: number;
    language: string;
    duplicationCheck: boolean;
    criteriaStatus: boolean;
}

export interface WeedInfos {
    id: number;
    bookWeedingStatusNotes: string;
    reviewDate: Date;
    weedStatus: string;


    bookId: number;
    accessionNo: string;
    callNumber: string;
    bookTitle: string;
    authors: string;

    weedingCriteriaDdc: string;

    weedProcessId: number;
    processStartDate: Date;
    processEndDate: Date | null;
    processInitiator: string;
    processNotes: string | null;
    processStatus: string;
}

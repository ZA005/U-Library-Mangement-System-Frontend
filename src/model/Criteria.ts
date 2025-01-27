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
    bookId: number;
    accessionNo: string;
    callNumber: string;
    bookTitle: string;
    authors: string;
    weedingCriteriaDdc: string;
    bookWeedingStatusNotes: string;
    reviewDate: Date;
    weedStatus: string;
    weedProcessId: number;
    processEndDate: string | null;
    processNotes: string | null;
    processStatus: string;
}

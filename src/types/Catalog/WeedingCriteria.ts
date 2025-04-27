export interface WeedingCriteria {

    id?: number;
    ddcCategory: string;
    yearsBeforeWeeding: number;
    conditionThreshold: string;
    usageThreshold: number;
    language: string;
    duplicationCheck: boolean;
    criteriaStatus: boolean;
}
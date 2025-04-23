export interface WeedingCriteria {

    id?: number;
    ddcCategory: string;
    yearsBeforeWeeding: number;
    conditionThreshold: number;
    usageThreshold: number;
    language: string;
    duplicationCheck: boolean;
    criteriaStatus: boolean;
}
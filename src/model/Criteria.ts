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
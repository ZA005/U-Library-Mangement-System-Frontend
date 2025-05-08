export interface AdvanceSearchParams {
    criteria: Array<{
        idx: string;
        searchTerm: string;
        operator: string;
    }>;
    yearRange: string;
    language: string | null;
    isAvailableOnly: boolean;
    library: string;
    sortOrder: string;
    sections: string[];
    collection: string[];
}
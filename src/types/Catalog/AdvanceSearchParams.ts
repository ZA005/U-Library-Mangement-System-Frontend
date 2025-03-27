export interface AdvanceSearchParams {
    criteria: Array<{
        idx: string;
        searchTerm: string;
        operator: 'AND' | 'OR';
    }>;
    library: string | undefined;
}
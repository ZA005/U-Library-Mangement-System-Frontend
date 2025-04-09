export interface SearchParams {
    criteria: Array<{
        idx: string;
        searchTerm: string;
        operator: 'AND' | 'OR' | 'NOT';
    }>;
    library: string | undefined;
}
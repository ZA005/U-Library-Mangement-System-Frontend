/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdvanceSearchParams } from "../types/Catalog/advanceSearchParams";

export const generateSearchMessage = (query: AdvanceSearchParams | string | null) => {
    // Start building the criteria message
    const criteria = [];

    // Check if query is a string, if so, use it directly
    if (typeof query === "string") {
        criteria.push(query);
    } else if (query?.criteria) {
        // Add filtered criteria (ignore null, isAvailableOnly, and sortOrder)
        query.criteria.forEach((criterion: any) => {
            if (criterion.searchTerm && criterion.idx !== "isAvailableOnly" && criterion.idx !== "sortOrder") {
                if (criterion.idx === "q") {
                    criteria.push(`inkeyword: ${criterion.searchTerm}`);
                } else {
                    criteria.push(`${criterion.idx}: ${criterion.searchTerm}`);
                }
            }
        });
    }

    // Join criteria with a separator and return the message
    return criteria.length > 0 ? `Searching for ${criteria.join(", ")}` : "No search criteria specified";
};
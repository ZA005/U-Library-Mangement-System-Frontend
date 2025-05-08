/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchParams } from "../types/Catalog/SearchParams";

export const generateSearchMessage = (
    query: SearchParams | string | null,
    bookCount: number = 0
) => {
    const criteria: string[] = [];

    // Check if query is a string, if so, use it directly
    if (typeof query === "string") {
        criteria.push(query);
    } else if (query?.criteria) {
        query.criteria.forEach((criterion: any) => {
            if (
                criterion.searchTerm &&
                criterion.idx !== "isAvailableOnly" &&
                criterion.idx !== "sortOrder"
            ) {
                if (criterion.idx === "q") {
                    criteria.push(`inkeyword: ${criterion.searchTerm}`);
                } else {
                    criteria.push(`${criterion.idx}: ${criterion.searchTerm}`);
                }
            }
        });
    }

    const searchMessage =
        criteria.length > 0
            ? `Searching for ${criteria.join(", ")}`
            : "No search criteria specified";

    if (bookCount === 0) {
        return `${searchMessage}\nNo books found.`;
    }

    return `${searchMessage}\nYour query returned ${bookCount} result${bookCount === 1 ? "" : "s"}.`;
};
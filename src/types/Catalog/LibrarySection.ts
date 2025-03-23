import { LibraryLocations } from "./LibraryLocation";

export interface LibrarySections {
    id?: number;
    sectionName: string;
    status: boolean;
    location: LibraryLocations;
}
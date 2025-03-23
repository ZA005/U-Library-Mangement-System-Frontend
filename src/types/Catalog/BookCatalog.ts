import { AcquisitionDetails } from "../AcquisitionDetails";
import { LibrarySections } from "./LibrarySection";

export interface BookCatalog {
    id?: number;
    callNumber: string;
    copies: number;
    collectionType: string;
    section: LibrarySections;
    acquisitionDetails: AcquisitionDetails;

}
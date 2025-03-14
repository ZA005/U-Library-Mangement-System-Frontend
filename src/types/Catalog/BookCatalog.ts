import { AcquisitionDetails } from "../AcquisitionDetails";

export interface BookCatalog {
    id: number;
    callNumber: string;
    copies: number;
    collectionType: string;
    section: string;
    acquisitionDetails: AcquisitionDetails;

}
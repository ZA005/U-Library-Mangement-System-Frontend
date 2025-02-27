export interface Book {
    id: string;
    accessionNo: string;
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    isbn10?: string;
    isbn13?: string;
    thumbnail: string;
    description: string;
    pageCount: number;
    categories: string[];
    language: string;
    printType: string;
    status: string;
    callNumber: string;
    purchasePrice: string;
    section: string;
    dateAcquired: Date;
    notes: string;
    location: string;
    vendor: string;
    fundingSource: string;
    subjects: string;
}

export interface Locations {
    id?: number;
    locationCodeName: string;
    locationName: string;
    status: boolean;
}

export interface Sections {
    id?: number;
    locationId: number;
    sectionName: string;
}

export interface BarcodeLabels {
    accessionNo: string;
    section: string;
}
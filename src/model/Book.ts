export interface Book {
    id: string;
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    isbn10?: string;
    isbn13?: string;
    thumbnail: string;
    description: string;
    pageCount: string;
    categories: string;
    language: string;
    printType: string;
    status: string;
    barcode: string;
    callNumber: string;
    purchasePrice: string;
    circulationType: string;
    dateAcquired: Date;
    notes: string;
    sublocation: string;
    vendor: string;
    fundingSource: string;
    subjects: string;
}

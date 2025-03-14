import { BookCatalog } from "./BookCatalog";

export interface Books {
    id: number;
    accessionNumber: string;
    title: string;
    authors: string[];
    isbn10: string;
    isbn13: string;
    description: string;
    pages: number;
    thumbnail: string;
    edition: string;
    series?: string;
    language: string;
    publishedDate: string;
    publisher: string;
    copyRight: string;
    printType: string;
    format: string;
    status: string;
    condition: string;
    bookCatalog: BookCatalog
}
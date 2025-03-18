export interface BookReference {
    id: number;

    // COURSE ARRTRIBS
    course_id: number;
    course_name: string;

    // BOOK ATTRIBS
    book_id: number;
    book_name: string;
    authors: string[];
    isbn10: string;
    isbn13: string;
    copyright: string;
    language: string;

    status: number;
}
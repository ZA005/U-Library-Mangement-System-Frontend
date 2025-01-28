import { Book } from "./BookRefRec";

export const useFilteredBooks = (books: Book[], searchTerm: string) => {
    return books.filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
};

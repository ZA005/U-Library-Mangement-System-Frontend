import { useState, useEffect } from "react";
import { Book } from "../../../model/Book";
import { getAllBooks } from "../../../services/Cataloging/LocalBooksAPI";

export const useFetchAllBooks = (open: boolean) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const fetchBooks = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchedBooks = await getAllBooks();
                setBooks(fetchedBooks);
            } catch (e) {
                console.error(e)
                throw e;
            } finally {
                setLoading(false);
            }
        }

        fetchBooks()
    }, [open]);

    return { books, loading, error };
}
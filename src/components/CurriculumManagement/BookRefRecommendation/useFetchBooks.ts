import { useState, useEffect } from "react";
import { Book } from "../../../model/Book";
import { getAllUniqueBooks, getAllNotReferencedBook } from "../../../services/Curriculum/BookReferenceService";

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
                const fetchedBooks = await getAllUniqueBooks();
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

export const useFetchAllBooksNotReferenced = (course_id: number, refreshTrigger: number) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchedBooks = await getAllNotReferencedBook(course_id);
                setBooks(fetchedBooks);
            } catch (e) {
                console.error(e);
                setError("Failed to fetch books.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [course_id, refreshTrigger]); // Added refreshTrigger

    return { books, loading, error };
};
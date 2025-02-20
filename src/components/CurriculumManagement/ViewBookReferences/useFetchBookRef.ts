import { useState, useEffect } from "react";
import { BookReference, getAllBookRef, getAllBookRefByCourse } from "../../../services/Curriculum/BookReferenceService";

export const useFetchBookRef = (open: boolean) => {
    const [bookRef, setBookRef] = useState<BookReference[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const fetchBookRef = async () => {
            setLoading(true)
            setError(null)

            try {
                const fetchedBookRef = await getAllBookRef()
                setBookRef(fetchedBookRef)
            } catch (e) {
                console.error(e)
                throw e;
            } finally {
                setLoading(false)
            }
        }

        fetchBookRef()
    }, [open])

    return { bookRef, loading, error }
}

export const useFetchBookRefByCourse = (course_id: number | undefined) => {
    const [bookRef, setBookRef] = useState<BookReference[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchBookRef = async () => {
            if (!course_id) {
                if (isMounted) {
                    setBookRef([]);
                }
                return;
            }
            setLoading(true)
            setError(null)

            try {
                const fetchedBookRef = await getAllBookRefByCourse(course_id)
                setBookRef(fetchedBookRef)
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setError('Failed to fetch courses');
                }
            } finally {
                setLoading(false)
            }
        }

        fetchBookRef()
        return () => {
            isMounted = false;
        };
    }, [course_id])

    return { bookRef, loading, error }
}
import { useState, useEffect } from "react";
import { Course, getAllCourses, getAllCourseByProgram, getAllCourseByRevision } from "../services/Curriculum/CourseService";

export const useFetchAllCurriculum = (open: boolean) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const fetchCourses = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchedCourses = await getAllCourses();
                setCourses(fetchedCourses);
            } catch (e) {
                console.error(e)
                throw e;
            } finally {
                setLoading(false);
            }
        }

        fetchCourses()
    }, [open]);

    return { courses, loading, error };
}

export const useFetchAllCurriculumByProgram = (program_id: number | undefined) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchCourses = async () => {
            if (!program_id) {
                if (isMounted) {
                    setCourses([]);
                }
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const fetchedCourses = await getAllCourseByProgram(program_id);
                if (isMounted) {
                    setCourses(fetchedCourses);
                }
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setError('Failed to fetch courses');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCourses();

        return () => {
            isMounted = false;
        };
    }, [program_id]);

    return { courses, loading, error };
};

export const useFetchAllCurriculumByRevision = (revisionNo: number) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const fetchCourses = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchedCourses = await getAllCourseByRevision(revisionNo);
                setCourses(fetchedCourses);
            } catch (e) {
                console.error(e)
                throw e;
            } finally {
                setLoading(false);
            }
        }

        fetchCourses()
    }, [revisionNo]);

    return { courses, loading, error };
}
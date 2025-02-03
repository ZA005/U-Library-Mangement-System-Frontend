import { useState, useEffect } from "react";
import { Course, getAllCourses, getAllCourseByProgram } from "../services/Curriculum/CourseService";

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

export const useFetchAllCurriculumByProgram = (program_id: number) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const fetchCourses = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchedCourses = await getAllCourseByProgram(program_id);
                setCourses(fetchedCourses);
            } catch (e) {
                console.error(e)
                throw e;
            } finally {
                setLoading(false);
            }
        }

        fetchCourses()
    }, [program_id]);

    return { courses, loading, error };
}
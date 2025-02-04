import { useState, useEffect } from "react";
import { Curriculum, getAllCurriculum, getAllCurriculumsByProgram } from "../services/Curriculum/CurriculumService";

export const useCurriculum = (open: boolean) => {
    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const fetchCurriculums = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchedCurriculums = await getAllCurriculum();
                setCurriculums(fetchedCurriculums);
            } catch (e) {
                console.error(e)
                throw e;
            } finally {
                setLoading(false);
            }
        }

        fetchCurriculums()
    }, [open]);

    return { curriculums, loading, error };
};


export const useCurriculumByProgram = (program_id: number) => {
    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchCurriculums = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchedCurriculums = await getAllCurriculumsByProgram(program_id);
                setCurriculums(fetchedCurriculums);
            } catch (e) {
                console.error(e)
                throw e;
            } finally {
                setLoading(false);
            }
        }

        fetchCurriculums()
    }, [program_id]);

    return { curriculums, loading, error };
}
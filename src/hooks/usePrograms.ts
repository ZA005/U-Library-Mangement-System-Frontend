import { useState, useEffect } from "react";
import { getAllProgramsByDepartment, getAllPrograms, Program } from "../services/Curriculum/ProgramService";

export const usePrograms = (open: boolean) => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const fetchPrograms = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedPrograms = await getAllPrograms();
                console.log(fetchedPrograms)
                setPrograms(fetchedPrograms); // Update departments state
            } catch (err) {
                console.error("Error fetching departments:", err);
                setError("Failed to load departments. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, [open]);

    return { programs, loading, error };
};

export const useProgramsByDepartment = (department_id: string) => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedPrograms = await getAllProgramsByDepartment(department_id);
                console.log(fetchedPrograms)
                setPrograms(fetchedPrograms); // Update departments state
            } catch (err) {
                console.error("Error fetching departments:", err);
                setError("Failed to load departments. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, [department_id]);

    return { programs, loading, error };
}
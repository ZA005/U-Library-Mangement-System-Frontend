import { useState, useEffect } from "react";
import { getAllDepartments, Department } from "../services/Curriculum/DepartmentService";

export const useDepartments = (open: boolean) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const fetchDepartments = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedDepartments = await getAllDepartments();
                setDepartments(fetchedDepartments); // Update departments state
            } catch (err) {
                console.error("Error fetching departments:", err);
                setError("Failed to load departments. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, [open]);

    return { departments, loading, error };
};

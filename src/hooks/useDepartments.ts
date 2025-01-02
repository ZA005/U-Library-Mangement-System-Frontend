// src/hooks/useDepartments.ts
import { useState, useEffect } from "react";
import { getAllDepartments, Department } from "../services/Curriculum/DepartmentService";

export const useDepartments = (open: boolean) => {
    const [departments, setDepartments] = useState<Department[]>([]); // State to hold fetched departments
    const [loading, setLoading] = useState<boolean>(false); // State to track loading status
    const [error, setError] = useState<string | null>(null); // State to track any errors

    useEffect(() => {
        if (!open) return; // Fetch only when the modal is open

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
    }, [open]); // Re-run when `open` changes

    return { departments, loading, error };
};

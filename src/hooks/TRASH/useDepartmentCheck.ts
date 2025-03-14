import { useEffect, useState } from "react";
import { useDepartments } from "./useDepartments";

export const useDepartmentCheck = () => {
    const { departments, loading } = useDepartments(true);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (!loading && departments.length === 0) {
            setShowAlert(true);
        }
    }, [loading, departments]);

    // Function to close alert
    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    return { showAlert, handleCloseAlert, loading, hasDepartments: departments.length > 0 };
};

import { useState, useCallback } from "react";
import { AlertColor } from "@mui/material";

interface SnackbarState {
    message: string;
    severity: AlertColor;
    open: boolean;
}

export const useSnackbar = () => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        message: "",
        severity: "info",
        open: false,
    });

    const showSnackbar = useCallback((message: string, severity: AlertColor = "info") => {
        setSnackbar({ message, severity, open: true });
    }, []);

    const closeSnackbar = useCallback(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    return { snackbar, showSnackbar, closeSnackbar };
};

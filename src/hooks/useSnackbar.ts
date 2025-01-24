import { useState, useCallback } from "react";

export const useSnackbar = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarStatus, setSnackbarStatus] = useState<"success" | "error">("success");

    // Memoize openSnackbar
    const openSnackbar = useCallback((message: string, status: "success" | "error") => {
        setSnackbarMessage(message);
        setSnackbarStatus(status);
        setSnackbarOpen(true);
    }, []); // Empty array since the function doesn't depend on anything within the hook

    const closeSnackbar = useCallback(() => {
        setSnackbarOpen(false);
    }, []); // Similarly, memoize closeSnackbar

    return {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    };
};
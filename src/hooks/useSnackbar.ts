import { useState } from "react";

export const useSnackbar = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarStatus, setSnackbarStatus] = useState<"success" | "error">("success");

    const openSnackbar = (message: string, status: "success" | "error") => {
        setSnackbarMessage(message);
        setSnackbarStatus(status);
        setSnackbarOpen(true);
    };

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    return {
        snackbarOpen,
        snackbarMessage,
        snackbarStatus,
        openSnackbar,
        closeSnackbar,
    };
};

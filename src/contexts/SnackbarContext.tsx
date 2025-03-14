import React, { createContext, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../hooks/useSnackbar";

const SnackbarContext = createContext<any>(null);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

    return (
        <SnackbarContext.Provider value={showSnackbar}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbarContext = () => {
    return useContext(SnackbarContext);
};

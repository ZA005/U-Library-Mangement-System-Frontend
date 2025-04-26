import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { IconButton, Container, Box, TextField, InputAdornment } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { Search, Menu } from "lucide-react";

const BrowseCurriculum: React.FC = () => {

    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Browse Curriculum - Library Management System");
        setHeaderButtons(
            <IconButton color="inherit" onClick={() => setSidebarOpen((prev) => !prev)}>
                <Menu color="#d32f2f" />
            </IconButton>
        );
        return () => {
            setHeaderButtons(null);
            setTitle("");
        };
    }, [setHeaderButtons, setTitle, setSidebarOpen]);

    /////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
        </>
    )
}

export default BrowseCurriculum
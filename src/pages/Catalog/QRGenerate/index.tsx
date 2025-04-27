import { Autocomplete, Box, Button, CircularProgress, Container, IconButton, TextField, Typography } from "@mui/material";
import { Menu } from "lucide-react";
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { PageTitle } from "../../../components";
import { useFetchAllAccessionNumbers } from "./useFetchAccessionNumbers";
import { QrCodeLabels } from "../../../types/Catalog/AccessionNumbers";
import { useSnackbarContext } from "../../../contexts/SnackbarContext";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";

const ManageQrGeneratePage: React.FC = () => {
    /////////////////////////////////////////////////////////////////////////////////////

    const { setHeaderButtons, setTitle, setSidebarOpen } = useOutletContext<{
        setHeaderButtons: Dispatch<SetStateAction<ReactNode>>;
        setTitle: Dispatch<SetStateAction<ReactNode>>;
        setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    /////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setTitle("Manage QR Generate - Library Management System");
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
    const showSnackbar = useSnackbarContext();
    const [startingPosition, setStartingPosition] = useState<number>(0);
    const [openAutocomplete, setOpenAutocomplete] = useState<boolean>(false);
    const [options, setOptions] = useState<QrCodeLabels[]>([]);
    const [selectedAccessions, setSelectedAccessions] = useState<QrCodeLabels[]>([]);
    const { isLoading, data, error, refetch } = useFetchAllAccessionNumbers();
    const contentRef = useRef<HTMLDivElement>(null);

    const handleCloseAutocomplete = () => setOpenAutocomplete(false);

    // Handle fetched accession numbers
    useEffect(() => {
        if (error) {
            console.error("Failed to fetch accession numbers:", error);
            showSnackbar("Failed to fetch accession numbers!", "error");
            return;
        }
        if (data) {
            const validAccessions = data.filter((acc) => acc?.accessionNumber && acc?.section);
            if (data.length !== validAccessions.length) {
                console.warn("Invalid accession numbers detected:", data);
                showSnackbar("Some accession numbers have invalid data.", "warning");
            }
            setOptions(validAccessions);
            console.log("Fetched accession numbers:", validAccessions);
        }
    }, [data, error, showSnackbar]);

    // Fetch accession numbers
    const handleOpenAutocomplete = async () => {
        setOpenAutocomplete(true);
        if (options.length === 0 && !isLoading && !error) {
            refetch();
        }
    };

    const handleSelectionChange = (_event: React.SyntheticEvent, newValues: (string | QrCodeLabels)[]) => {
        if (newValues.some((value) => typeof value === "string" && value === "Select All")) {
            setSelectedAccessions(options);
        } else {
            const validSelections = newValues.filter(
                (value): value is QrCodeLabels => typeof value !== "string"
            );
            setSelectedAccessions(validSelections);
        }
    };

    // Print QR codes
    const handlePrint = useReactToPrint({
        contentRef,
        onAfterPrint: () => showSnackbar("QR codes printed successfully!", "success"),
        onPrintError: () => showSnackbar("Failed to print QR codes.", "error"),
    });


    return (
        <>
            <PageTitle title="QR Codes Label" />
            <Container maxWidth="lg" sx={{ padding: 0 }}>
                {isLoading && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 1000,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <CircularProgress size={60} />
                        <Typography variant="body1" sx={{ color: "white", ml: 2 }}>
                            Loading accession numbers, please wait...
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", p: 2.5 }}>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Box sx={{ width: "45%", pr: 2.5 }}>
                            <TextField
                                label="Starting Position"
                                type="number"
                                value={startingPosition}
                                onChange={(e) =>
                                    setStartingPosition(Math.min(40, Math.max(0, Number(e.target.value))))
                                }
                                sx={{ mt: 2, width: "100%", mb: 2.5 }}
                                inputProps={{ min: 0, max: 40 }}
                                disabled={isLoading}
                            />

                            <Autocomplete
                                sx={{ width: "100%" }}
                                multiple
                                freeSolo
                                open={openAutocomplete}
                                onOpen={handleOpenAutocomplete}
                                onClose={handleCloseAutocomplete}
                                isOptionEqualToValue={(option, value) =>
                                    typeof option !== "string" &&
                                    typeof value !== "string" &&
                                    option.accessionNumber === value.accessionNumber
                                }
                                getOptionLabel={(option) =>
                                    typeof option === "string" ? option : `${option.accessionNumber} - ${option.section}`
                                }
                                options={["Select All", ...options.filter(
                                    (option) => !selectedAccessions.some((selected) => selected.accessionNumber === option.accessionNumber)
                                )]}
                                loading={isLoading}
                                value={selectedAccessions}
                                onChange={handleSelectionChange}
                                disabled={isLoading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Accession Numbers"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handlePrint?.()}
                                    disabled={selectedAccessions.length === 0 || isLoading}
                                >
                                    Print QR Codes
                                </Button>
                            </Box>
                        </Box>

                        {/* QR Code Preview Section */}
                        <Box
                            sx={{
                                flex: 1,
                                p: 2.5,
                                border: "1px solid #ccc",
                                borderRadius: 1,
                            }}
                        >
                            <Typography sx={{ mb: 2, textAlign: "center" }}>Sample page layout</Typography>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 190px)",
                                    gap: 1.25,
                                    justifyContent: "center",
                                }}
                            >
                                {Array.from({ length: 21 }).map((_, i) => {
                                    const index = i - startingPosition;
                                    if (index < 0 || index >= selectedAccessions.length) {
                                        return (
                                            <Box
                                                key={`placeholder-${i}`}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "190px",
                                                    height: "70px",
                                                    border: "1px dashed #ccc",
                                                    p: 0.625,
                                                }}
                                            />
                                        );
                                    }
                                    const qrCode = selectedAccessions[index];
                                    return (
                                        <Box
                                            key={`qrCode-${index}`}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "190px",
                                                height: "70px",
                                                border: "1px solid #ccc",
                                                p: 0.625,
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{ textAlign: "center", fontSize: "10px", mb: 0.625 }}
                                            >
                                                {qrCode.section}
                                                <br />
                                                UNC eLibrary
                                            </Typography>
                                            <QRCodeSVG
                                                value={qrCode.accessionNumber}
                                                size={50}
                                                bgColor="#FFF"
                                                fgColor="#000"
                                                level="M"
                                                style={{ display: "block" }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Print Layout */}
                <Box
                    ref={contentRef}
                    sx={{
                        width: "210mm",
                        height: "297mm",
                        p: "10mm",
                        bgcolor: "white",
                        display: "none",
                        "@media print": { display: "block" },
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 250px)",
                            gap: "5mm",
                        }}
                    >
                        {Array.from({ length: 40 }).map((_, i) => {
                            const index = i - startingPosition;
                            if (index < 0 || index >= selectedAccessions.length) {
                                return (
                                    <Box
                                        key={`print-placeholder-${i}`}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "250px",
                                            height: "100px",
                                        }}
                                    />
                                );
                            }
                            const qrCode = selectedAccessions[index];
                            return (
                                <Box
                                    key={`print-qrCode-${index}`}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "250px",
                                        height: "100px",
                                        border: "1px solid #ccc",
                                        p: 0.625,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{ textAlign: "center", fontSize: "12px", mb: 0.625 }}
                                    >
                                        {qrCode.section}
                                        <br />
                                        UNC eLibrary
                                    </Typography>
                                    <QRCodeSVG
                                        value={qrCode.accessionNumber}
                                        size={80}
                                        bgColor="#FFF"
                                        fgColor="#000"
                                        level="M"
                                        style={{ display: "block" }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

            </Container >
        </>
    );
}

export default ManageQrGeneratePage;
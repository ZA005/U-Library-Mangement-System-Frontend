import { Button, Box, Typography } from "@mui/material";
import { WeedingInfo } from "../../../types/Catalog/WeedingInfo";
import { statusToDisplay } from "../../../utils/weedingStatus";

const renderActionBasedOnStatus = (
    weedInfo: WeedingInfo,
    handleOpenModal: (info: WeedingInfo) => void,
    onOverrideWeeding: (id: number) => void,
    role: string
) => {
    const statusInfo = statusToDisplay(weedInfo.weedStatus);

    if (statusInfo) {
        if (weedInfo.weedStatus === "REVIEWED" && (role === "ADMIN" || role === "LIBRARY DIRECTOR")) {
            return (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Button
                        color="error"
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenModal(weedInfo)}
                        sx={{ textTransform: "none" }}
                    >
                        Weed
                    </Button>
                    <Button
                        color="success"
                        variant="outlined"
                        size="small"
                        onClick={() => onOverrideWeeding(weedInfo.id)}
                        sx={{ textTransform: "none" }}
                    >
                        Override
                    </Button>
                </Box>
            );
        }

        if (weedInfo.weedStatus === "FLAGGED" && role === "LIBRARIAN") {
            return (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Button
                        color="error"
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenModal(weedInfo)}
                        sx={{ textTransform: "none" }}
                    >
                        Weed
                    </Button>
                    <Button
                        color="success"
                        variant="outlined"
                        size="small"
                        onClick={() => onOverrideWeeding(weedInfo.id)}
                        sx={{ textTransform: "none" }}
                    >
                        Override
                    </Button>
                </Box>
            );
        }

        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography color={statusInfo.color} sx={{ fontWeight: "medium" }}>
                    {statusInfo.icon} {statusInfo.text}
                </Typography>
            </Box>
        );
    }

    return null;
};

export default renderActionBasedOnStatus;
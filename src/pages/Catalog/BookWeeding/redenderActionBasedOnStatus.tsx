import { Button, Box, Typography } from "@mui/material"; // Use MUI Box and Typography
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
        if (weedInfo.weedStatus === "REVIEWED" && role === "LIBRARY DIRECTOR") {
            return (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Button
                        color="error"
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenModal(weedInfo)}
                    >
                        Weed
                    </Button>
                    <Button
                        onClick={() => onOverrideWeeding(weedInfo.id)}
                        variant="outlined"
                        size="small"
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
                    >
                        Weed
                    </Button>
                    <Button
                        onClick={() => onOverrideWeeding(weedInfo.id)}
                        variant="outlined"
                        size="small"
                    >
                        Override
                    </Button>
                </Box>
            );
        }
        // Render status text with color and icon for other statuses
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
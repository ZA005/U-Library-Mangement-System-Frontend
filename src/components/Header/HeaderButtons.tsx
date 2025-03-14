import { Button, Stack } from "@mui/material";

interface HeaderButtonsProps {
    onLoginClick: () => void;
    onVerifyClick: () => void;
}

const HeaderButtons: React.FC<HeaderButtonsProps> = ({ onLoginClick, onVerifyClick }) => {
    return (
        <>
            <Stack spacing={1} direction={{ xs: "column", md: "row" }} width="100%">
                <Button
                    variant="outlined"
                    sx={{
                        color: "#d32f2f",
                        borderColor: "#d32f2f",
                        width: { xs: "100%", md: "auto" },
                    }}
                    onClick={onVerifyClick}
                >
                    Activate Account
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#d32f2f",
                        width: { xs: "100%", md: "auto" },
                    }}
                    onClick={onLoginClick}
                >
                    Sign In
                </Button>
            </Stack>
        </>

    );
};

export default HeaderButtons;

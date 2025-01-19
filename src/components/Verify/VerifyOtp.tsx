import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import UserService from "../../services/UserService";
import "./VerifyOtp.css";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string>(""); // Store OTP input
  const [error, setError] = useState<string | null>(null); // Store error messages
  const [loading, setLoading] = useState<boolean>(false); // Show loading state
  const location = useLocation();
  const userData = location.state?.userData;
  const navigate = useNavigate();

  const emailAdd = localStorage.getItem("emailAdd");

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    if (!emailAdd) {
      setError("Email is missing. Please make sure you are logged in.");
      setLoading(false);
      return;
    }

    try {
      const response = await UserService.verifyOTP(emailAdd, otp);

      if (response.success === "true") {
        navigate("/register", { state: { userData } });
      } else {
        setError(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Error verifying OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Header buttons={null} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Box
            sx={{
              bgcolor: "#f5f5f5",
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              width: "20vw",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Verify OTP
            </Typography>

            <form onSubmit={(e) => e.preventDefault()} style={{ width: "100%" }}>
              <TextField
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className="send-otp-button"
                onClick={handleSubmit}
              >
                {loading ? "Verifying..." : "Submit"}
              </Button>
            </form>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default VerifyOtp;

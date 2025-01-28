import React, { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined"; // Import the icon
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
      setError("Error verifying OTP. Please try again later." + error);
    } finally {
      setLoading(false);
    }
  };

  return (

    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header buttons={null} />
      <Container maxWidth="sm" sx={{ flexGrow: 1 }}>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            position: "relative",
            marginTop: "2rem", // Adds space below the header
          }}
        >
          {/* Icon positioned outside the box */}
          <CheckCircleOutlinedIcon
            className="otp-icon"
            sx={{
              fontSize: 90,
              color: "#cc0000",
              position: "absolute",
              top: "20px", // Adjusts the icon to sit properly
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />

          {/* Main box */}
          <Box
            className="verify-otp-box"
            sx={{
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
              Verify Your Code
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              We have sent a code to your email: <strong>{emailAdd}</strong>
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mb: 2,
              }}
            >
              {Array(6) // Change to 6 boxes
                .fill("")
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d$/.test(value) || value === "") {
                        const newOtp = otp.split("");
                        newOtp[index] = value;
                        setOtp(newOtp.join(""));
                      }
                    }}
                    className="otp-input"
                  />
                ))}
            </Box>
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
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
              {loading ? "Verifying..." : "Verify"}
            </Button>

            <Typography
              variant="body2"
              sx={{ mt: 2, cursor: "pointer", color: "#cc0000" }}
              onClick={() => {
                // Add resend logic here
              }}
            >
              Didn’t receive a code? Resend
            </Typography>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default VerifyOtp;

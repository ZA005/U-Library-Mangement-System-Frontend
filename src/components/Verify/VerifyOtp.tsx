import React, { useState, useRef } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import UserService from "../../services/UserManagement/UserService";
import "./VerifyOtp.css";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const location = useLocation();
  const userData = location.state?.userData;
  const navigate = useNavigate();

  const emailAdd = localStorage.getItem("emailAdd");

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "")) {
        handleSubmit(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (otpCode: string): Promise<void> => {
    setError(null);
    setLoading(true);

    if (!emailAdd) {
      setError("Email is missing. Please make sure you are logged in.");
      setLoading(false);
      return;
    }

    try {
      const response = await UserService.verifyOTP(emailAdd, otpCode);
      if (response.success === "true") {
        navigate("/register", { state: { userData } });
      } else {
        setError(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Invalid OTP. Please check the OTP again." + error);
    } finally {
      setLoading(false);
    }
  };

  return (

    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Header buttons={null} />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", position: "relative", marginTop: "2rem" }}>
          <Box className="verify-otp-box" sx={{ bgcolor: "white", p: 4, borderRadius: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", textAlign: "center", width: "100%", maxWidth: 400 }}>
            <CheckCircleOutlinedIcon sx={{ fontSize: { xs: 60, sm: 80, md: 90 }, color: "#cc0000", backgroundColor: "white", borderRadius: "50%", padding: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }} />
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>Verify Your Code</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>We have sent a code to your email: <strong>{emailAdd}</strong></Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                />
              ))}
            </Box>
            {error && <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>}
            <Button type="submit" variant="contained" fullWidth disabled={loading} className="send-otp-button" onClick={() => handleSubmit(otp.join(""))}>{loading ? "Verifying..." : "Verify"}</Button>
            <Typography variant="body2" sx={{ mt: 2, cursor: "pointer", color: "#cc0000" }} onClick={() => { }}>Didn’t receive a code? Resend</Typography>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default VerifyOtp;
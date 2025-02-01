import React, { useState } from "react";
import { Box, Container, Typography, Grid, Button, ButtonGroup, IconButton, TextField, MenuItem, Select, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar";
import Line from "../../components/Line/Line";
import styles from "./styles.module.css";

const PayFee: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [selectedOnlinePayment, setSelectedOnlinePayment] = useState<string>("");

  const handleSideBarClick = () => setSidebarOpen(!isSidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);
  const handlePaymentMethodChange = (method: string) => setPaymentMethod(method);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" className={styles.container}>
      <Header
        buttons={
          <IconButton onClick={handleSideBarClick}>
            <MenuIcon className={styles.menuIcon} />
          </IconButton>
        }
      />
      <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />

      <Box flex="1">
        <Container maxWidth="lg" className={styles.content}>
          <Box className={styles.headerTitleContainer}>
            <Typography variant="h3" fontWeight="bold" className={styles.title}>
              Pay Fees
            </Typography>
            <Line className={styles.separator} />
          </Box>

          <Grid container spacing={6} className={styles.historyContainer}>
            <Grid item xs={12} md={6} className={styles.paymentInfoBox}>
              <Box sx={{ marginTop: 2 }}>
                <ButtonGroup variant="outlined" fullWidth>
                  <Button onClick={() => handlePaymentMethodChange("online")} className={styles.paymentButton}>
                    Online Payment
                  </Button>
                  <Button onClick={() => handlePaymentMethodChange("counter")} className={styles.paymentButton}>
                    Counter Payment
                  </Button>
                </ButtonGroup>
              </Box>

              {paymentMethod === "online" && (
                <Box mt={3}>
                  <Typography variant="h6">Payment Method</Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Select
                      value={selectedOnlinePayment}
                      onChange={(e) => setSelectedOnlinePayment(e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="VISA">VISA</MenuItem>
                      <MenuItem value="Gcash">Gcash</MenuItem>
                      <MenuItem value="Mastercard">Mastercard</MenuItem>
                      <MenuItem value="Paypal">Paypal</MenuItem>
                    </Select>
                    <TextField label="Cardholder Name" fullWidth />
                    <TextField label="Card Number" fullWidth />
                    <Box display="flex" gap={2}>
                      <TextField label="Date" fullWidth />
                      <TextField label="CCV" fullWidth />
                    </Box>
                  </Box>
                </Box>
              )}

              {paymentMethod === "counter" && (
                <Box mt={3}>
                  <Typography variant="h6">Payment</Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <TextField label="Name" fullWidth />
                    <TextField label="ID Number" fullWidth />
                    <TextField label="Date" fullWidth />
                  </Box>
                  <Typography mt={2}>
                    Please, proceed to pay this at the counter.
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} className={styles.paymentSummary} sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 3, minHeight: "300px" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: "2px solid black", paddingBottom: 1 }}>Payment Summary</Typography>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography>Balance amount:</Typography>
                  <Typography>₱ 100.00</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography>VAT (21%):</Typography>
                  <Typography>₱ 21.00</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1} fontWeight="bold">
                  <Typography>TOTAL (Incl. VAT):</Typography>
                  <Typography>₱ 121.00</Typography>
                </Box>
                <Button variant="contained" color="error" fullWidth sx={{ marginTop: 6 }}>
                  Confirm Your Order
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default PayFee;

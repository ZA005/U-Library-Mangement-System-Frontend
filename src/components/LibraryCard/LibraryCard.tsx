import React from "react";
import { Box, Typography } from "@mui/material";
import LibraryLogo from "../../assets/images/lms-logo.png";
import { QRCodeSVG } from "qrcode.react";
import Style from "./LibraryCard.module.css";

const LibraryCard: React.FC = () => {
  return (
    <Box className={Style.cardContainer}>
      {/* Header Section */}
      <Box className={Style.cardheader}>
        <Box className={Style.logoContainer}>
          <img src={LibraryLogo} alt="Library Logo" className={Style.logo} />
          <Box>
            <Typography className={Style.h1}>Library Card</Typography>
            <Typography className={Style.h2}>University of Nueva Caceres</Typography>
          </Box>
        </Box>
        <Box>
          <Typography className={Style.h1}>Student ID</Typography>
          <Typography className={Style.h2}>12-12345</Typography>
        </Box>
      </Box>

      {/* QR Code Section */}
      <Box className={Style.qrSection}>
        <Box className={Style.qrImage}>
          <QRCodeSVG value="85462698423684" size={128} />
        </Box>

        <Typography className={Style.qrText}>85462698423684</Typography>
      </Box>

      {/* Details Section */}
      <Box className={Style.detailsSection} display="flex" >
        <Typography className={Style.detailLabel}>Name:</Typography>
        <Typography className={Style.detailLabel}>Year Level:</Typography>
        <Typography className={Style.detailLabel}>Department:</Typography>
        <Typography className={Style.detailLabel}>Course:</Typography>
        <Typography className={Style.detailLabel}>Phone Number:</Typography>
      </Box>
    </Box>
  );
};

export default LibraryCard;

import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import LibraryLogo from "../../assets/images/lms-logo.png";
import { QRCodeSVG } from "qrcode.react";
import Style from "./LibraryCard.module.css";

const LibraryCard: React.FC = () => {
  const location = useLocation();
  const {
    schoolId,
    firstName,
    middleName,
    lastName,
    department,
    course,
    contactNumber,
    libraryCardNumber,
  } = location.state || {};

  // Combine all data into a string for the QR code
  const qrCodeValue = JSON.stringify({
    schoolId,
    firstName,
    middleName,
    lastName,
    department,
    course,
    contactNumber,
    libraryCardNumber,
  });

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
          <Typography className={Style.h2}>{schoolId}</Typography>
        </Box>
      </Box>

      {/* QR Code Section */}
      <Box className={Style.qrSection}>
        <Box className={Style.qrImage}>
          <QRCodeSVG value={qrCodeValue} size={128} />
        </Box>

        <Typography className={Style.qrText}>{libraryCardNumber}</Typography>
      </Box>

      {/* Details Section */}
      <Box className={Style.detailsSection} display="flex" flexDirection="column" gap={1}>
        <Typography className={Style.detailLabel}>Name: {`${firstName} ${middleName} ${lastName}`}</Typography>
        <Typography className={Style.detailLabel}>Department: {department}</Typography>
        <Typography className={Style.detailLabel}>Course: {course}</Typography>
        <Typography className={Style.detailLabel}>Phone Number: {contactNumber}</Typography>
      </Box>
    </Box>
  );
};

export default LibraryCard;

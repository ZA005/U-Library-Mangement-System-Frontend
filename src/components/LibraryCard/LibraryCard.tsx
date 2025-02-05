import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import LibraryLogo from "../../assets/images/lms-logo.png";
import { QRCodeSVG } from "qrcode.react";
import Style from "./LibraryCard.module.css";
import { UserDetails } from "../../model/Users";
import { getUserDetails } from "../../services/UserManagement/StakeholderService";

const LibraryCard: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const uncIdNumber = localStorage.getItem("uncIdNumber");


  // Combine all data into a string for the QR code
  const qrCodeValue = uncIdNumber || 'Something went wrong';

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (uncIdNumber) {
        try {
          const fetchedDetails = await getUserDetails(uncIdNumber);
          setUserDetails(fetchedDetails);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        console.error("UNC ID Number is null");
      }
    };

    fetchUserDetails();
  }, [uncIdNumber]);

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
          <Typography className={Style.h2}>{userDetails?.id}</Typography>
        </Box>
      </Box>

      {/* QR Code Section */}
      <Box className={Style.qrSection}>
        <Box className={Style.qrImage}>
          <QRCodeSVG value={qrCodeValue} size={128} />
        </Box>
      </Box>

      {/* Details Section */}
      <Box className={Style.detailsSection} display="flex" flexDirection="column" gap={1}>
        <Typography className={Style.detailLabel}><strong>Name:</strong> {userDetails?.fullName}</Typography>
        <Typography className={Style.detailLabel}><strong>Department:</strong> {userDetails?.departmentName}</Typography>
        <Typography className={Style.detailLabel}><strong>Program:</strong> {userDetails?.programName}</Typography>
        <Typography className={Style.detailLabel}><strong>Email:</strong> {userDetails?.emailAdd}</Typography>
        <Typography className={Style.detailLabel}><strong>Phone Number:</strong> {userDetails?.contactNum}</Typography>
      </Box>
    </Box>
  );
};

export default LibraryCard;

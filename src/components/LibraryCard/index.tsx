import React from "react";
import { Box, Typography } from "@mui/material";
import LibraryLogo from "../../assets/images/lms-logo.png";
import { QRCodeSVG } from "qrcode.react";
import { UserData } from "../../types";

interface LibraryCardProps {
	userData: UserData;
}
const LibraryCard: React.FC<LibraryCardProps> = ({ userData }) => {
	const qrCodeValue = userData.id;

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			width="280px"
			height="auto"
			padding="0px 10px"
			minHeight="430px"
			boxShadow="0 4px 8px rgba(0,0,0, 0.2)"
		>
			{/* Header Section */}
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				width="100%"
				height="8vh"
				padding="5px 10px"
				border="1.5px groove #d32f2f"
				color="white"
				sx={{ background: "#d32f2f" }}
			>
				<Box display="flex" alignItems="center">
					<Box marginRight="10px">
						<img src={LibraryLogo} alt="Library Logo" height="40px" />
					</Box>
					<Box>
						<Typography fontWeight="bold" fontSize="16px" sx={{ fontFamily: "Spartan, sans-serif !important" }}>
							Library Card
						</Typography>
						<Typography fontWeight="bold" fontSize="11px" sx={{ fontFamily: "Spartan, sans-serif !important" }}>
							University of Nueva Caceres
						</Typography>
					</Box>
				</Box>

				<Box>
					<Typography fontWeight="bold" fontSize="16px" sx={{ fontFamily: "Spartan, sans-serif !important" }}>
						Student ID
					</Typography>
					<Typography fontWeight="bold" fontSize="11px" sx={{ fontFamily: "Spartan, sans-serif !important" }}>
						{userData.id || "N/A"}
					</Typography>
				</Box>
			</Box>

			{/* QR Code Section */}
			<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" marginTop="30px">
				<Box padding="8px" border="2px solid #c4c4c4" borderRadius="8px">
					<QRCodeSVG value={qrCodeValue} size={160} />
				</Box>
			</Box>

			{/* Details Section */}
			<Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="space-between" width="80%" color="black" padding="20px 0">
				<Typography fontSize="14px" fontFamily="Spartan, sans-serif !important">
					<strong>Name:</strong> {`${userData.firstName} ${userData.middleName} ${userData.lastName} ${userData.suffix}`.trim().toUpperCase() || "N/A"}
				</Typography>
				<Typography fontSize="14px" fontFamily="Spartan, sans-serif !important">
					<strong>Department:</strong> {userData.department.toUpperCase() || "N/A"}
				</Typography>
				<Typography fontSize="14px" fontFamily="Spartan, sans-serif !important">
					<strong>Program:</strong> {userData.program.toUpperCase() || "N/A"}
				</Typography>
				<Typography fontSize="14px" fontFamily="Spartan, sans-serif !important">
					<strong>Email:</strong> {userData.emailAdd || "N/A"}
				</Typography>
				<Typography fontSize="14px" fontFamily="Spartan, sans-serif !important">
					<strong>Phone Number:</strong> {userData.contactNo || "N/A"}
				</Typography>
			</Box>
		</Box>
	);
};

export default LibraryCard;
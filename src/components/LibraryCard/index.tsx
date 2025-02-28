import React from "react";
import { Box, Typography } from "@mui/material";
import LibraryLogo from "../../assets/images/lms-logo.png";
import { QRCodeSVG } from "qrcode.react";


const LibraryCard: React.FC = () => {
	const uncIdNumber = localStorage.getItem("uncIdNumber");
	const qrCodeValue = uncIdNumber || "Something went wrong";

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
				border="1.5px groove #cc0000"
				color="white"
				sx={{
					background: "#cc0000"
				}}
			>
				<Box
					display="flex"
					alignItems="center"
				>
					<Box marginRight="10px">
						<img src={LibraryLogo} alt="Library Logo" height="40px" />
					</Box>
					<Box>
						<Typography
							fontWeight="bold"
							fontSize="16px"
							sx={{ fontFamily: "Spartan, sans-serif !important" }}
						>
							Library Card
						</Typography>

						<Typography
							fontWeight="bold"
							fontSize="11px"
							sx={{ fontFamily: "Spartan, sans-serif !important" }}
						>
							University of Nueva Caceres
						</Typography>
					</Box>
				</Box>

				<Box>
					<Typography
						fontWeight="bold"
						fontSize="16px"
						sx={{ fontFamily: "Spartan, sans-serif !important" }}
					>
						Student ID
					</Typography>

					<Typography
						fontWeight="bold"
						fontSize="11px"
						sx={{ fontFamily: "Spartan, sans-serif !important" }}
					>
						{uncIdNumber || "N/A"}
					</Typography>
				</Box>
			</Box>

			{/* QR Code Section */}
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				width="100%"
				marginTop="30px"
			>
				<Box
					padding="8px"
					border="2px solid #c4c4c4"
					borderRadius="8px"
				>
					<QRCodeSVG value={qrCodeValue} size={160} />
				</Box>
			</Box>

			{/* Details Section */}
			<Box
				display="flex"
				flexDirection="column"
				alignItems="flex-start"
				justifyContent="flex-start"
				width="80%"
				color="black"
				padding="20px 0 20px 0"
			>
				{["Name", "Department", "Program", "Email", "Phone Number"].map((label) => (
					<Typography
						key={label}
						fontSize="14px"
						fontFamily="Spartan, sans-serif !important"
					>
						<strong>{label}:</strong> {localStorage.getItem(label.toLowerCase().replace(" ", "")) || "N/A"}
					</Typography>
				))}
			</Box>
		</Box>
	);
};

export default LibraryCard;
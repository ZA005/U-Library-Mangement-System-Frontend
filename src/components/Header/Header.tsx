import React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import Style from './Header.module.css';
import LibraryLogo from '../../assets/images/lms-logo.png'

// Passing of props so that the buttons can be dynamic
interface HeaderProps {
  buttons: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ buttons }) => {
  return (
    <AppBar position="static" color="transparent" elevation={0} className={Style.bottomLine}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <img src={LibraryLogo} alt="Library Logo" height={50} />
          <Box display="flex" flexDirection="column">
            <Typography
              variant="caption"
              ml={2}
              fontSize="15px"
              fontWeight="bold"
              className={Style.spartan}
              sx={{ fontFamily: 'Spartan, sans-serif !important' }} // this line overrides the default fontfamily of MUI fontfamily
            >
              <span className={Style.title}>A</span>CQUIRE
            </Typography>
            <Typography variant="caption" ml={2}>
              Library Management System
            </Typography>
          </Box>
        </Box>
        {/* Render buttons passed as props */}
        <Box>{buttons}</Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

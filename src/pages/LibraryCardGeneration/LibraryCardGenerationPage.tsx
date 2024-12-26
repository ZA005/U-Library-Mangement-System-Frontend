import React from "react";
import { Box, Container, Typography, Button, List, ListItem, ListItemText, Grid } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { grey } from '@mui/material/colors';
import Header from "../../components/Header/Header";
import Copyright from "../../components/Footer/Copyright";
import Line from "../../components/Line/Line";
import LibraryCard from "../../components/LibraryCard/LibraryCard";
import Style from "./LibraryCardGeneration.module.css"
import html2canvas from "html2canvas";
import { useNavigate } from 'react-router-dom';

const LibraryCardGenerationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    // console.log("Download button clicked");
    const libraryCardElement = document.getElementById('libraryCard');
    if (libraryCardElement) {
        html2canvas(libraryCardElement).then((canvas) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'library_card.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }, 'image/png');
        });
    } else {
      console.log("Download button clicked!");
    }
  };

  const handleLogin = () => {
    navigate('/');
  }
  // const testClick = () => {
  //   console.log('test');
  // }


  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Header
          buttons=<>
            
          </>
        />

        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2rem', md: '2.4rem' } }}>
          Generated Library Card
        </Typography>
        <Line />

        {/* Responsive layout for LibraryCard and How to Use */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
            <div id="libraryCard">
              <LibraryCard />
            </div>
          </Grid>

          {/* How to Use Section */}
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h5" sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, paddingBottom: '2vh' }}>
                How to Use Your Library Card
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, marginBottom: '1rem' }}>
                Your library card serves as your official identification for accessing library resources. <br />
                Please follow these instructions:
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText primary={
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '1rem' }, fontWeight: 'bold' }}>
                      • Present your library card at the library entrance for access.
                    </Typography>
                  } />
                </ListItem>
                <ListItem>
                  <ListItemText primary={
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '1rem' }, fontWeight: 'bold' }}>
                      • Ensure that your library card is visible when borrowing books or materials.
                    </Typography>
                  } />
                </ListItem>
                <ListItem>
                  <ListItemText primary={
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '1rem' }, fontWeight: 'bold' }}>
                      • For any issues with your library card, contact the library administration.
                    </Typography>
                  } />
                </ListItem>
              </List>

              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, marginBottom: '1rem' }}>
                To download your library card for digital use, click the "Download Library Card" button below.
              </Typography>

              {/* Responsive Button Section */}
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="center" alignItems="center" width="100%" marginBottom="20px">
                <Button className={Style.buttonDesign} variant="contained" sx={{ width: { xs: '100%', sm: 'auto' }, height: 56 }} onClick={handleDownload}>
                  <DownloadIcon sx={{ color: grey[50] }} /> Download Library Card
                </Button>
                <Button className={Style.buttonDesign} variant="contained" sx={{ width: { xs: '100%', sm: 'auto' }, height: 56 }} onClick={handleLogin}>
                  Sign In
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Copyright />
    </Box>
  );
};

export default LibraryCardGenerationPage;

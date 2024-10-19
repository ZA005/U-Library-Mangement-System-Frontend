import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Style from './Carousel.module.css';

const Carousel: React.FC = () => {
  // Slick settings for the carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Images for the carousel
  const images = [
    'src/assets/images/library1.jpg', 
    'src/assets/images/library2.jpg',
    'src/assets/images/library3.jpg'
  ];

  return (
    <Box className={Style.carouselContainer} my= "25px">
      <Slider {...settings}>
        {images.map((image, index) => (
          <Box key={index} className={Style.slide}>
            <img src={image} alt={`slide-${index}`} className={Style.image} />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Carousel;

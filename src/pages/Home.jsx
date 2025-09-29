import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  VStack,
  Image,
  
} from "@chakra-ui/react";
import '../index.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { motion } from "framer-motion";
import { PixelatedCanvas } from "../components/PixelatedCanvas";
import { useResponsiveSizes } from "../custom-js/useResponsiveSizes";
import ArticleList from "../components/serverComponents/ArticleList";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, HashNavigation } from 'swiper/modules';
import TopArticles from "../components/serverComponents/TopArticles";
import TopProjects from "../components/serverComponents/TopProjects";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

function Home() {
  const navigate = useNavigate();
    const { width, height } = useResponsiveSizes();
    const slides = [
      {
        title: "Welcome to Our Website",
        text: "Explore amazing articles, insights, and much more to expand your knowledge.",
        img: "/slide1.jpg", // Replace with your image
        nv: "/articles"
      },
      {
        title: "Discover Projects",
        text: "Check out innovative projects created by talented developers.",
        img: "/slide2.jpg",
        nv: "/projects"
      },
      {
        title: "Join the Community",
        text: "Connect with others and share your ideas in our platform. Login, create your profile and then write articles/projects...",
        img: "/slide3.jpg",
        nv: "/login"
      },
    ];
  return (
    <>
    <Box
  minH="100vh"
  display="flex"
  alignItems="center"
  justifyContent="center"
  px={{ base: 4, md: 6 }} // responsive padding
>
  <Stack
    direction={{ base: "column", md: "row" }} // column on mobile, row on desktop
    spacing={{ base: 8, md: 10 }}             // responsive spacing
    align="center"
    maxW="6xl"
    w="full"
    textAlign={{ base: "center", md: "left" }} // responsive text alignment
    mt={{ base: 8, md: 10 }}
  >
    <MotionBox
      flex="1"
      display="flex"
      justifyContent="center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      mt={{ base: 3, md: 0 }} // margin top on mobile for spacing
    >
      <PixelatedCanvas
        src="https://vklkbmottirkmhyuuqce.supabase.co/storage/v1/object/public/project-images/public/photo_5969898782621551432_x.jpg" 
        width={width}
        height={height}
        cellSize={3}
        shape="circle"
        tintColor="#00ffcc"
        distortionMode="swirl"
        interactive={true}
        backgroundColor="transparent"
        style={{ borderRadius: "50%", overflow: "hidden" }} 
      />
    </MotionBox>
    
    <MotionBox
      flex="1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      padding="8"
    >
      <Heading
        as="h1"
        size={{ base: "xl", md: "2xl" }} // smaller on mobile
        fontWeight="bold"
        mb={4}
        lineHeight="short"
        color="gray.600"
      >
        Hey, I'm <Text as="span" color="teal.400">zxd1385</Text>
      </Heading>
      <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" mb={6}>
        A passionate web developer building modern, responsive, and
        user-friendly web experiences.
      </Text>
      <Button
        colorScheme="teal"
        size={{ base: "md", md: "lg" }}
        _hover={{ transform: "scale(1.05)" }}
        onClick={() => navigate("/articles")}
      >
        View My Work
      </Button>
    </MotionBox>

    
  </Stack>
    </Box>

    



    <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    px={{ base: 4, md: 6 }} // responsive padding
    >
      {/* Swiper Slider */}
     
      
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Pagination, Navigation]}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Box
              position="relative"
              w="full"
              h={{ base: "300px", md: "400px" }}
              borderRadius="lg"
              overflow="hidden"
            >
              
              <VStack
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                spacing={4}
                textAlign="center"
                color="white"
                px={4}
              >
                <Heading size={{ base: "md", md: "2xl" }} fontWeight="bold">
                  {slide.title}
                </Heading>
                <Text fontSize={{ base: "sm", md: "lg" }} maxW="600px">
                  {slide.text}
                </Text>
                <Button
                  colorScheme="teal"
                  size={{ base: "sm", md: "lg" }}
                  variant="solid"
                  onClick={() => navigate(`${slide.nv}`)}
                >
                  Get Started
                </Button>
              </VStack>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
    

      
  
    <Box display="flex" justifyContent="center" px={{ base: 4, md: 6 }}>
  <MotionBox
    flex="1"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    w="full"
    pt={{ base: 12, md: 16 }}
  >
    <TopArticles limit={5} />  {/* Show top 3 articles */}
    <TopProjects limit={5} />  {/* Show top 3 projects */}
  </MotionBox>
    </Box>


    </>
    



    
  );
}

export default Home;


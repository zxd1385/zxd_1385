import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Image,
  
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PixelatedCanvas } from "../components/PixelatedCanvas";
import { useResponsiveSizes } from "../custom-js/useResponsiveSizes";
import ArticleList from "../components/serverComponents/ArticleList";



const MotionBox = motion(Box);

function Home() {
    const { width, height } = useResponsiveSizes();
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
      mt={{ base: 6, md: 0 }} // margin top on mobile for spacing
    >
      <PixelatedCanvas
        src="/myimg.jpg" 
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
    <MotionBox
      flex="1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      w="full"
      pt={{ base: 12, md: 16 }} // Add padding-top for spacing from the previous section
    >
      <ArticleList />
    </MotionBox>  
    </Box>
    </>
    



    
  );
}

export default Home;


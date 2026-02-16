import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  VStack,
  HStack
  
  
} from "@chakra-ui/react";
import '../index.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { motion } from "framer-motion";
import { useResponsiveSizes } from "../custom-js/useResponsiveSizes";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import TopArticles from "../components/serverComponents/TopArticles";
import TopProjects from "../components/serverComponents/TopProjects";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaRegHandPaper, FaSmile, FaInfoCircle  } from "react-icons/fa";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import { useInView } from "react-intersection-observer";
import TextType from "../components/ui/TextAnimations/TextType";
import HandleTargetCursor from "../components/ui/HandleTargetCursor";


const MotionBox = motion(Box);

function Home() {
  const [articlesCount, setArticlesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [icon, setIcon] = useState(null);
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
    const handleAnimationComplete = () => {
      console.log('Animation completed!');
    };
    useEffect(() => {
      const checkProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setMessage("Haven’t logged in yet? Please login.");
          setIcon(<FaInfoCircle />)
          setShow(true);
          setTimeout(() => setShow(false), 4000);
          return;
        }
  
        const { data, error } = await supabase
          .from('profiles') // Assuming your profile table is called 'profiles'
          .select('name')
          .eq('id', session.user.id) // Replace with the correct user ID column
          .single();
  
        if (error) {
            setMessage('Welcome Dear! Please complete your profile in dashboard first.');
            setIcon(<FaSmile />)
        } else {
          if (data) {
            // If profile exists, greet user by name
            setMessage(`Hey ${data.name}!\nWelcome back...`);
            setIcon(<FaRegHandPaper />)
          }
        }
  
        setShow(true);
        setTimeout(() => setShow(false), 4000); // Fade out after 4 seconds
      };
  
      checkProfile();
    }, []);


  const [startCount, setStartCount] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.8,  // trigger when 30% of the container is visible
    triggerOnce: true // only trigger once
  });
  

  // Start counting when in viewport
  if (inView && !startCount) setStartCount(true);
    

  return (
    <>
    

    

    <Box
  position="fixed"
  top={{ base: 16, md: 16 }}        // 4 units on small screens, 16 units on medium+
  left={{ base: 4, md: 40 }}       // 4 units on small screens, 40 units (~160px) on medium+
  zIndex="banner"
>
<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: show ? 1 : 0 }}
    transition={{ duration: 1 }}
  >
    <Box
      bg="purple.600"
      color="white"
      px={1.5}
      py={1.5}
      borderRadius="md"
      boxShadow="lg"
    >
      <HStack spacing={1} justify="start">
        {icon}<Text fontWeight="bold">
        {message}
              </Text>
      </HStack>
    </Box>
</motion.div>




    </Box>


    <Box
  minH="100vh"
  display="flex"
  alignItems="center"
  justifyContent="center"
  px={{ base: 2, md: 6 }} // responsive padding
>
  <VStack
    direction={{ base: "column", md: "row" }} // column on mobile, row on desktop
    spacing={{ base: 8, md: 10 }}             // responsive spacing
    align="center"
    maxW="6xl"
    w="full"
    textAlign={{ base: "center", md: "left" }} // responsive text alignment
    // mt={{ base: 3, md: 10 }}
  >
    {/* <MotionBox
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
    </MotionBox> */}
    <TextType 
  text={["Welcome to zxdclub", "A community for innovators", "Building creative projects", "One spark at a time"]}
  textColors = {["white", "white", "white"]}
  typingSpeed={75}
  pauseDuration={2000}
  showCursor={true}
  cursorCharacter="_"
/>
    
    
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
        color="gray.300"
      >
        Hey, I'm <Text as="span" color="purple.400">zxd1385</Text>
      </Heading>
      <Text fontSize={{ base: "md", md: "lg" }} color="gray.300" mb={6}>
        A passionate Electrical Engineering Student at Sharif University of Technology(EE-SUT) ...
        <br />see my github: https://github.com/zxd1385
      </Text>
      <Button
      className="cursor-target"
        colorScheme="teal"
        size={{ base: "md", md: "lg" }}
        _hover={{ transform: "scale(1.05)" }}
        onClick={() => navigate("/projects")}
      >
        View My Work
      </Button>
    </MotionBox>

    
  </VStack>
    </Box>

    <Box
      // maxW="6xl"  
      mx="auto"                // center horizontally
      // bg="gray.900"            // background color
      p={{ base: 6, md: 10 }}  // responsive padding
      borderRadius="md"        // rounded corners
      boxShadow="lg"           // subtle shadow
      textAlign="center"       // center content
      ref={ref} 
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 6, md: 12 }}
        justify="space-around"
        align="center"
      >

        <Box>
          <Text color="gray.300" mt={2} fontSize={"1.1rem"}>My work in numbers:</Text>
        </Box>

        <Box>
          <Text fontSize="2xl" color="purple.600" fontWeight="bold">
          {startCount ? <AnimatedCounter target={articlesCount} /> : 0}+
          </Text>
          <Text color="gray.300" mt={2}>Articles</Text>
        </Box>

        <Box>
          <Text fontSize="2xl" color="purple.600" fontWeight="bold">
          {startCount ? <AnimatedCounter target={projectsCount} /> : 0}+
          </Text>
          <Text color="gray.300" mt={2}>Projects</Text>
        </Box>

        
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
                className="cursor-target"
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
    <TopArticles limit={5} setArticlesCount={setArticlesCount}/>  {/* Show top 3 articles */}
    <TopProjects limit={5} setProjectsCount={setProjectsCount}/>  {/* Show top 3 projects */}
  </MotionBox>
    </Box>


    </>
    



    
  );
}

export default Home;


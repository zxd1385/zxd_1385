import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const MotionBox = motion(Box);

export default function LoadingScreen({type="", padd=2 }) {
  const [show, setShow] = useState(false);

  // Small delay before showing loading screen for smoother UX
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    show && (
      <MotionBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={padd}
        _dark={{ bg: "gray.800" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          backdropFilter: "blur(10px)", // This applies the blur effect to the background
        }}
      >
        <VStack spacing={4}>
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.7s"
            emptyColor="gray.200"
            color="purple.400"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Text fontSize="lg" fontWeight="medium" color="gray.600" _dark={{ color: "gray.300" }}>
              Loading {type}...
            </Text>
          </motion.div>
        </VStack>
      </MotionBox>
    )
  );
}

import { Box, Heading, Text, Stack, Flex } from "@chakra-ui/react";

function About() {
  return (
    <Flex
    minH="100vh"
      align="center"
      justify="center"
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 12 }}
      >
      <Box maxW="800px"
    w="full"
    borderRadius="lg"
    shadow="xl"
    color="white"
    p={{ base: 6, md: 12 }}>
      <Heading mb={4} color="gray.600">
        About zxdClub
      </Heading>
      <Text mb={6}>
        Welcome to **ZXDClub** — a community-driven platform where creativity
        meets collaboration! 🚀
      </Text>
      <Text mb={6}>
        At **ZXDClub**, we believe everyone has a story to tell, a project to
        showcase, or a unique idea to share with the world. Whether you're an
        aspiring writer, an entrepreneur, a designer, or just someone passionate
        about bringing their ideas to life, **ZXDClub** provides the perfect
        space to share your work, grow your network, and find inspiration.
      </Text>
      <Stack spacing={4}>
        <Text>- Publish Articles, Projects, and Portfolios</Text>
        <Text>- Engage with a like-minded community</Text>
        <Text>- Collaborate and build meaningful relationships</Text>
        <Text>- Discover inspiration and expand your skills</Text>
      </Stack>

      <Text mt={6}>
        Ready to join the community? Share your story, connect with others, and
        get inspired. Welcome to **ZXDClub**! 🌟
      </Text>
    </Box>
    </Flex>
  );
}

export default About;

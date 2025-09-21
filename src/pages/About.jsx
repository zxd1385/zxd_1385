import { Box, Heading, Text, Stack } from "@chakra-ui/react";

function About() {
  return (
    <Box p={8}>
      <Heading mb={4}>About Me</Heading>
      <Text mb={4}>
        Hi, I'm John Doe, a full-stack web developer with a focus on building beautiful, functional, and user-friendly web applications.
      </Text>
      <Stack spacing={2}>
        <Text>- Skilled in React, Node.js, and Express</Text>
        <Text>- Familiar with cloud platforms like AWS and Firebase</Text>
        <Text>- Passionate about UI/UX and modern web design</Text>
      </Stack>
    </Box>
  );
}

export default About;

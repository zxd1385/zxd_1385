import { Box, Heading, Text, Input, Button, Stack } from "@chakra-ui/react";

function Contact() {
  return (
    <Box p={8} maxW="500px" mx="auto">
      <Heading mb={4}>Contact Me</Heading>
      <Text mb={6}>
        Have a project in mind or want to collaborate? Send me a message!
      </Text>
      <Stack spacing={4}>
        <Input placeholder="Your Name" />
        <Input placeholder="Your Email" />
        <Input placeholder="Subject" />
        <Input placeholder="Message" as="textarea" rows={4} />
        <Button colorScheme="teal">Send Message</Button>
      </Stack>
    </Box>
  );
}

export default Contact;

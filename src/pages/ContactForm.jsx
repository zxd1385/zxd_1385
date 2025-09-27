import { useState } from 'react';
import { Box, Button, Input, Textarea, VStack, Heading, Text, Field, InputGroup  } from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram_id: '',
    idea: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { data, error } = await supabase
      .from('contacts')
      .insert([formData]);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Your message has been sent!');
      setFormData({ name: '', email: '', telegram_id: '', idea: '' });
    }

    setLoading(false);
  };

  return (
    <Box
      p={8}
      maxW="500px"
      mx="auto"
      mt={10}
      borderRadius="2xl"
      boxShadow="lg"
      backdropFilter={"blur(1px)"}
      _dark={{ bg: "gray.800" }}
    >
      <Heading
        mb={6}
        size="lg"
        textAlign="center"
        color="teal.500"
        letterSpacing="wide"
      >
        Contact Us
      </Heading>

      {error && <Text color="red.400" textAlign="center">{error}</Text>}
      {success && <Text color="green.400" textAlign="center">{success}</Text>}

      <form onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          <Input
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            isRequired
            variant="filled"
            color="gray.300"
            borderBottom="1px solid white"
            focusBorderColor="white.900"
            borderRadius={0}
          />

          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            isRequired
            variant="filled"
            color="gray.300"
            borderBottom="1px solid white"
            focusBorderColor="white.900"
            borderRadius={0}
          />

          <Input
            placeholder="Telegram ID"
            value={formData.telegram_id}
            onChange={(e) => setFormData({ ...formData, telegram_id: e.target.value })}
            isRequired
            variant="filled"
            color="gray.300"
            borderBottom="1px solid white"
            focusBorderColor="white.900"
            borderRadius={0}
          />

          <Textarea
            placeholder="Your Idea / Message"
            value={formData.idea}
            onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
            isRequired
            color="gray.300"
            border="1px solid white"
            focusBorderColor="white.900"
            borderRadius={4}
            mt={4}
          />

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={loading}
            size="lg"
            borderRadius="lg"
            _hover={{ transform: "scale(1.03)" }}
            transition="all 0.2s ease"
          >
            Send Message
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ContactForm;

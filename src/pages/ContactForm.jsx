import { useState } from 'react';
import { Box, Button, Input, Textarea, VStack, Heading, Text, Spinner, Image } from '@chakra-ui/react';
import { LuCheck } from 'react-icons/lu';
import { supabase } from '../lib/supabaseClient';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram_id: '',
    idea: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.telegram_id.trim()) newErrors.telegram_id = 'Telegram ID is required';
    else if (!/^@?\w+$/.test(formData.telegram_id))
      newErrors.telegram_id = 'Invalid Telegram ID';
    if (!formData.idea.trim()) newErrors.idea = 'Message cannot be empty';
    else if (formData.idea.trim().length < 10)
      newErrors.idea = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;

    setLoading(true);
    const { error } = await supabase.from('contacts').insert([formData]);

    if (error) {
      setErrors({ submit: error.message });
    } else {
      setSuccess('Your message has been sent!');
      setFormData({ name: '', email: '', telegram_id: '', idea: '' });
      setErrors({});
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
      backdropFilter="blur(1px)"
      _dark={{ bg: 'gray.800' }}
    >

      <VStack spacing={3} align="center" mb={6}>
  {/* Top Image */}
  <Image
    boxSize="100px"        // size of the image
    borderRadius="full"    // makes it circular
    src="https://vklkbmottirkmhyuuqce.supabase.co/storage/v1/object/public/project-images/public/photo_5969898782621551432_x.jpg"
    alt="Contact Icon"
  />

  {/* Heading */}
  <Heading
    size="lg"
    textAlign="center"
    color="teal.500"
    letterSpacing="wide"
  >
    Contact Us
  </Heading>

  {/* Encouraging Text */}
  <Text
    textAlign="center"
    color="gray.300"
    maxW="400px"           // limits width for readability
  >
    We’d love to hear your ideas! Reach out to us and let’s make something amazing together.
  </Text>
      </VStack>



      <form onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          <Input
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            isInvalid={!!errors.name}
            variant="filled"
            color="gray.300"
            borderBottom="1px solid white"
            focusBorderColor="teal.400"
            borderRadius={0}
          />
          {errors.name && <Text color="red.400">{errors.name}</Text>}

          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            isInvalid={!!errors.email}
            variant="filled"
            color="gray.300"
            borderBottom="1px solid white"
            focusBorderColor="teal.400"
            borderRadius={0}
          />
          {errors.email && <Text color="red.400">{errors.email}</Text>}

          <Input
            placeholder="Telegram ID"
            value={formData.telegram_id}
            onChange={(e) => setFormData({ ...formData, telegram_id: e.target.value })}
            isInvalid={!!errors.telegram_id}
            variant="filled"
            color="gray.300"
            borderBottom="1px solid white"
            focusBorderColor="teal.400"
            borderRadius={0}
          />
          {errors.telegram_id && <Text color="red.400">{errors.telegram_id}</Text>}

          <Textarea
            placeholder="Your Idea / Message"
            value={formData.idea}
            onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
            isInvalid={!!errors.idea}
            color="gray.300"
            border="1px solid white"
            focusBorderColor="teal.400"
            borderRadius={4}
            mt={4}
          />
          {errors.idea && <Text color="red.400">{errors.idea}</Text>}

          {errors.submit && <Text color="red.400" textAlign="center">{errors.submit}</Text>}
          {success && <Text color="green.400" textAlign="center">{success}</Text>}

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={loading}
            size="lg"
            borderRadius="lg"
            _hover={{ transform: 'scale(1.03)' }}
            transition="all 0.2s ease"
          >
            Send Message {loading ? <Spinner size="sm" ml={2} /> : success && <LuCheck />}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ContactForm;

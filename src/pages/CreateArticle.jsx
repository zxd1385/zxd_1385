import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Input, Textarea, VStack, Heading, Checkbox, Text } from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';

const CreateArticle = () => {
  const { id } = useParams(); // optional article id for editing
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [authorName, setAuthorName] = useState("Uknown Author");
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [body, setBody] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserName = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", session.user.id)
          .single();
  
        if (!error && data) {
          setAuthorName(data.name);
        }
      };
      fetchUserName();
    }
  }, [session]);
  
  // Fetch article data if id exists
  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setError('You must be logged in to edit an article.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setTitle(data.title);
        setShortDesc(data.short_description);
        setBody(data.body);
        setIsVisible(data.is_visible);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setError('You must be logged in to submit an article.');
      setLoading(false);
      return;
    }

    const articleData = {
      title,
      short_description: shortDesc,
      body,
      publisher_id: session.user.id,
      is_visible: false,
      author_name: authorName,
    };

    let errorInsert;
    if (id) {
      // Update existing article
      const { error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', id);
      errorInsert = error;
    } else {
      // Insert new article
      const { error } = await supabase
        .from('articles')
        .insert([articleData])
        .single();
      errorInsert = error;
    }

    if (errorInsert) {
      setError(errorInsert.message);
    } else {
      alert(id ? 'Article updated successfully!' : 'Article submitted successfully!');
      navigate('/dashboard'); // redirect back to dashboard or articles list
    }

    setLoading(false);
  };

  return (
    <Box p={8} maxW="600px" mx="auto">
      <Heading color="purple.500" mb={6}>{id ? 'Edit Article' : 'Write a New Article'}</Heading>
      {error && <Box color="red.500">{error}</Box>}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
        <Text color="gray.300">Article Title</Text>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isRequired
            variant="filled"
            color="gray.300"
            borderBottom="1px solid white"
            focusBorderColor="white.900"
            borderRadius={0}
            mb={5}
          />
          <Text color="gray.300">Article Short Description</Text>
          <Input
            placeholder="Short Description"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            isRequired
            variant="filled"
            color="gray.300"
            borderBottom="1px solid white"
            focusBorderColor="white.900"
            borderRadius={0}
            mb={5}
          />
          <Text color="gray.300">Article Body</Text>
          <Textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            isRequired
            variant="filled"
            color="gray.300"
            border="1px solid white"
            focusBorderColor="white.900"
            borderRadius={5}
            rows={5}
            mb={3}
          />
          
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText={id ? 'Updating...' : 'Submitting...'}
            isFullWidth
          >
            {id ? 'Update Article' : 'Submit Article'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateArticle;

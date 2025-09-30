import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Input, VStack, Heading, Text, Spinner } from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LuCheck } from 'react-icons/lu';

const CreateArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [authorName, setAuthorName] = useState("Unknown Author");
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [body, setBody] = useState('');
  const [publishTime, setPublishTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setsubmitLoading] = useState(false);
  const [isSubmited, setisSubmited] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
  }, []);

  // Fetch author name
  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchUserName = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", session.user.id)
        .single();
      if (!error && data) setAuthorName(data.name);
    };
    fetchUserName();
  }, [session]);

  // Fetch article if editing
  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        setTitle(data.title);
        setShortDesc(data.short_description);
        setBody(data.body);
        setPublishTime(data.publish_time);
      }
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    else if (title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters';

    if (!shortDesc.trim()) newErrors.shortDesc = 'Short description is required';
    else if (shortDesc.trim().length < 10) newErrors.shortDesc = 'Description must be at least 10 characters';

    if (!body || body.replace(/<(.|\n)*?>/g, '').trim().length < 20)
      newErrors.body = 'Article body must be at least 20 characters';

    if (publishTime && isNaN(new Date(publishTime).getTime()))
      newErrors.publishTime = 'Invalid date/time';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setsubmitLoading(true);
    setisSubmited(false);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setErrors({ submit: 'You must be logged in to submit an article.' });
      setLoading(false);
      setsubmitLoading(false);
      return;
    }

    const articleData = {
      title,
      short_description: shortDesc,
      body,
      publisher_id: session.user.id,
      is_visible: false,
      author_name: authorName,
      publish_time: publishTime,
    };

    let errorInsert;
    if (id) {
      const { error } = await supabase.from('articles').update(articleData).eq('id', id);
      errorInsert = error;
    } else {
      const { error } = await supabase.from('articles').insert([articleData]).single();
      errorInsert = error;
    }

    if (errorInsert) setErrors({ submit: errorInsert.message });
    else setisSubmited(true);

    setLoading(false);
    setsubmitLoading(false);
  };

  return (
    <Box p={8} maxW="600px" mx="auto">
      <Heading color="purple.500" mb={6}>{id ? 'Edit Article' : 'Write a New Article'}</Heading>

      {errors.submit && <Text color="red.400">{errors.submit}</Text>}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Text color="gray.300">Article Title</Text>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isInvalid={!!errors.title}
            color="gray.300"
          />
          {errors.title && <Text color="red.400">{errors.title}</Text>}

          <Text color="gray.300">Short Description</Text>
          <Input
            placeholder="Short Description"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            isInvalid={!!errors.shortDesc}
            color="gray.300"
          />
          {errors.shortDesc && <Text color="red.400">{errors.shortDesc}</Text>}

          <Text color="gray.300">Article Body</Text>
          <ReactQuill
            value={body}
            onChange={setBody}
            theme="snow"
            placeholder="Write your article..."
            style={{ color: 'gray' }} // This applies to the container, may not affect text fully
          />

          {errors.body && <Text color="red.400">{errors.body}</Text>}

          <Text color="gray.300">Publish Time (Optional)</Text>
          <Input
            type="datetime-local"
            value={publishTime}
            onChange={(e) => setPublishTime(e.target.value)}
            isInvalid={!!errors.publishTime}
            color="gray.300"
          />
          {errors.publishTime && <Text color="red.400">{errors.publishTime}</Text>}

          <Button type="submit" colorScheme="blue" isFullWidth isLoading={loading}>
            {id ? 'Update Article' : 'Submit Article'} {submitLoading ? <Spinner /> : isSubmited ? <LuCheck /> : ""}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateArticle;

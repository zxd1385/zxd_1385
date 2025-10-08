import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Input, VStack, Heading, Text, Spinner, Alert } from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';
import ReactQuill from 'react-quill';
import ValidationProgress from '../components/ui/ValidationProgress';
import 'react-quill/dist/quill.snow.css';
import { LuCheck} from 'react-icons/lu';
import { validateWithServer } from '../custom-js/validationServerText';
import { sendTextToAdmin } from '../custom-js/senTextToAdmin';
import { sendTelegramMessage } from '../custom-js/sendTelegramMessage';
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import * as toxicity from '@tensorflow-models/toxicity';


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
  const [titleValidation, settitleValidation] = useState(false);
  const [titleErrors, settitleErrors] = useState('');
  const [shortdescValidation, setshortdescValidation] = useState(false);
  const [shortdescErrors, setshortdescErrors] = useState('');
  const [bodyValidation, setbodyValidation] = useState(false);
  const [bodyErrors, setbodyErrors] = useState('');
  const [submitLoading, setsubmitLoading] = useState(false);
  const [isSubmited, setisSubmited] = useState(false);
  const [isSubmitedSucces, setisSubmitedSucces] = useState(false);
  const [isfSubmited, setisfSubmited] = useState(false);
  const [errors, setErrors] = useState({});
  const [toxicityErrors, setToxicityErrors] = useState({
    title: [],
    shortDesc: [],
    body: []
  });
  

  const editorRef = useRef(null);
  const logContent = () => {
    if (editorRef.current) {
      setBody(editorRef.current.getContent());
    }
  };

  const threshold = 0.6; // probability threshold

  const checkToxicity = async (text) => {
    const threshold = 0.9; // high confidence
    const model = await toxicity.load(threshold);
    const predictions = await model.classify([text]);
  
    // Filter only matched categories
    const flaggedCategories = predictions
      .filter(p => p.results[0].match)
      .map(p => p.label);
  
    return flaggedCategories; // array of strings like ['toxicity', 'insult']
  };
  
  

  
  
  
  

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
    setisSubmitedSucces(false)

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setErrors({ submit: 'You must be logged in to submit an article.' });
      setLoading(false);
      setsubmitLoading(false);
      return;
    }



    // --- Check toxicity for title ---
  // const titleFlags = await checkToxicity(title);
  // const shortDescFlags = await checkToxicity(shortDesc);
  // const cleanBody = body.replace(/<(.|\n)*?>/g, '');
  // const bodyFlags = await checkToxicity(cleanBody);

  // setToxicityErrors({
  //   title: titleFlags,
  //   shortDesc: shortDescFlags,
  //   body: bodyFlags
  // });

  setisfSubmited(true);
  settitleErrors('')
  setbodyErrors('')
  setshortdescErrors('')

  // // If any field has toxic categories, stop submission
  // if (titleFlags.length || shortDescFlags.length || bodyFlags.length) {
  //   setLoading(false);
  //   setsubmitLoading(false);
  //   return; // stop
  // }

  settitleValidation(true)
  const validation = await validateWithServer(`${title}`);
  
  if (validation.broadcast_ok === "NO") {
    settitleErrors(validation.problems)
    settitleValidation(false)
    setsubmitLoading(false)
    return; // ❌ stop submission
  } else {
    settitleErrors('z')
  }

  settitleValidation(false)


  setshortdescValidation(true)
  const svalidation = await validateWithServer(`${shortDesc}`);
  
  if (svalidation.broadcast_ok === "NO") {
    setshortdescErrors(svalidation.problems)
    setshortdescValidation(false)
    setsubmitLoading(false)
    return; // ❌ stop submission
  }else{
    setshortdescErrors('z')
  }

  setshortdescValidation(false)



  setbodyValidation(true)
  const bvalidation = await validateWithServer(`${body}`);
  
  if (bvalidation.broadcast_ok === "NO") {
    setbodyErrors(bvalidation.problems)
    setbodyValidation(false)
    setsubmitLoading(false)
    return; // ❌ stop submission
  } else {
    setbodyErrors('z')
  }

  setbodyValidation(false)
  
    
  

    const articleData = {
      title,
      short_description: shortDesc,
      body,
      publisher_id: session.user.id,
      is_visible: true,
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
    else {
      setisSubmited(true)
      const state = id ? 'updated' : 'published'
      const href = id ? `${import.meta.env.VITE_SITE_URL}/#/article/${id}` : `${import.meta.env.VITE_SITE_URL}/#/articles`
      const strToAdmin = `🖊️A new <b>Article</b> has been ${state} succesfuly!\nTitle: <u>${title}</u>\nShort Description: <i>${shortDesc}</i>\n<a href="${href}">Read it here</a>`
      console.log(strToAdmin);
      const sentText = await sendTelegramMessage(strToAdmin);
    };

    setLoading(false);
    setsubmitLoading(false);
    setisSubmitedSucces(true)
    
  };

  return (
    <Box p={8} maxW="600px" mx="auto">
      <Heading color="gray.500" mb={6}>{id ? 'Edit Article' : 'Write a New Article'}</Heading>

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

          <Box >
       <Text mb={2} color="gray.300">Article Body (Latex supported)</Text>
       <Box textAlign="center">
       <Editor
        apiKey={import.meta.env.VITE_MCE_EDITOR_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        onChange={logContent}
        initialValue={body || "<p>Start creating something amazing...</p>"}
        init={{
          height: 300,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help",
        }}
        
      />
       </Box>
       </Box>

          {errors.body && <Text color="red.400">{errors.body}</Text>}

          <Text color="gray.300">Publish Time </Text>
          <Input
            type="datetime-local"
            value={publishTime}
            onChange={(e) => setPublishTime(e.target.value)}
            isInvalid={!!errors.publishTime}
            color="gray.300"
          />
          {errors.publishTime && <Text color="red.400">{errors.publishTime}</Text>}

          
          <Button type="submit" colorScheme="blue" isFullWidth isLoading={loading}>
            {titleValidation ? 'Validating Title...' : shortdescValidation ? 'Validating Short Description' : bodyValidation ? 'Validating Body' : id ? 'Update Article' : 'Submit Article'} {submitLoading ? <Spinner /> : isSubmited ? <LuCheck /> : ""}
          </Button>
          <ValidationProgress
              titleValidation={titleValidation}
              titleErrors={titleErrors}
              shortdescValidation={shortdescValidation}
              shortdescErrors={shortdescErrors}
              bodyValidation={bodyValidation}
              bodyErrors={bodyErrors}
              isfSubmited={isfSubmited}
           />
          

        </VStack>
      </form>
    </Box>
  );
};

export default CreateArticle;

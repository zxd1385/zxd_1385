import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Heading, Input, Textarea, Button, VStack, Text, Spinner } from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';
import { LuCheck } from 'react-icons/lu';
import ReactQuill from 'react-quill';
import { sendTextToAdmin } from '../custom-js/senTextToAdmin';
import { sendTelegramMessage } from '../custom-js/sendTelegramMessage';
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // optional project id for editing

  const [session, setSession] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    imageFile: '',
    pdfFile: ''
  });

  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState(null);

  // tinyMCE cinfiguration...
  const editorRef = useRef(null);
  const logContent = () => {
      if (editorRef.current) {
        setDescription(editorRef.current.getContent());
      }
    };

  useEffect(() => {
    const fetchSessionAndProject = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        navigate('/login');
        return;
      }
      setSession(session);

      // ✅ Fetch user profile for role
    const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

      if (profileError) {
        console.error("Error fetching profile role:", profileError);
        navigate("/"); // fallback
        return;
      }
    
      if (profile.role !== "team member" && profile.role !== "admin") {
        // 🚫 not admin, redirect or show error
        alert("Only Team Members can create or edit projects! Contact us to be our member...");
        navigate("/");
        return;
      }

      if (id) {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        if (error) {
          console.error('Error fetching project:', error);
        } else {
          setTitle(data.title);
          setDescription(data.description);
          setExistingImageUrl(data.image_url || null);
          setExistingPdfUrl(data.pdf_url || null);
        }
      }
    };
    fetchSessionAndProject();
  }, [id, navigate]);

  const validateFields = () => {
    const newErrors = { title: '', description: '', imageFile: '', pdfFile: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    if (imageFile && !['image/png', 'image/jpeg', 'image/jpg'].includes(imageFile.type)) {
      newErrors.imageFile = 'Only PNG/JPG images are allowed';
      isValid = false;
    }
    if (pdfFile && pdfFile.type !== 'application/pdf') {
      newErrors.pdfFile = 'Only PDF files are allowed';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProject = async () => {
    if (!validateFields()) return;

    if (!session) return;
    setLoading(true);
    setSubmitLoading(true);
    setIsSubmitted(false);

    let imageUrl = existingImageUrl;
    let pdfUrl = existingPdfUrl;

    // Upload image
    if (imageFile) {
      if (existingImageUrl) {
        const oldPath = existingImageUrl.split('/').pop();
        await supabase.storage.from('project-images').remove([`public/${oldPath}`]);
      }
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(`public/${imageFile.name}`, imageFile);

      if (uploadError) {
        setErrors(prev => ({ ...prev, imageFile: uploadError.message }));
        setLoading(false);
        return;
      }
      imageUrl = supabase.storage.from('project-images').getPublicUrl(`public/${imageFile.name}`).data.publicUrl;
    }

    // Upload PDF
    if (pdfFile) {
      if (existingPdfUrl) {
        const oldPath = existingPdfUrl.split('/').pop();
        await supabase.storage.from('project-pdfs').remove([`public/${oldPath}`]);
      }
      const { error: uploadError } = await supabase.storage
        .from('project-pdfs')
        .upload(`public/${pdfFile.name}`, pdfFile);

      if (uploadError) {
        setErrors(prev => ({ ...prev, pdfFile: uploadError.message }));
        setLoading(false);
        return;
      }
      pdfUrl = supabase.storage.from('project-pdfs').getPublicUrl(`public/${pdfFile.name}`).data.publicUrl;
    }

    const projectData = {
      title,
      description,
      publisher_id: session.user.id,
      image_url: imageUrl,
      pdf_url: pdfUrl,
      is_visible: true
    };

    let errorInsert;
    if (id) {
      const { error } = await supabase.from('projects').update(projectData).eq('id', id);
      errorInsert = error;
    } else {
      const { error } = await supabase.from('projects').insert([projectData]).single();
      errorInsert = error;
    }

    if (errorInsert) {
      console.error('Error saving project:', errorInsert);
    } else {
      setIsSubmitted(true);
      const state = id ? 'updated' : 'published'
      const href = id ? `${import.meta.env.VITE_SITE_URL}/#/project/${id}` : `${import.meta.env.VITE_SITE_URL}/#/projects`
      const strToAdmin = `🖊️A new <b>Project</b> has been ${state} succesfuly!\nTitle: <u>${title}</u>\n<a href="${href}">Read it here</a>`
      console.log(strToAdmin);
      const sentText = await sendTelegramMessage(strToAdmin);
    }

    setLoading(false);
    setSubmitLoading(false);
  };

  return (
    <Box p={8} maxW="600px" mx="auto">
      <Heading color="gray.500" mb={6}>{id ? 'Edit Project' : 'Create Project'}</Heading>
      <VStack spacing={4} align="stretch">
        <Text color="gray.300">Project Title</Text>
        <Input
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          isRequired
          variant="filled"
          color="gray.300"
          borderBottom="1px solid white"
          focusBorderColor="white.900"
          borderRadius={0}
          mb={4}
        />
        {errors.title && <Text color="red.400">{errors.title}</Text>}

        
        
       <Box >
       <Text mb={2} color="gray.300">Project Description (Latex supported)</Text>
       <Box textAlign="center">
       <Editor
        apiKey={import.meta.env.VITE_MCE_EDITOR_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        onChange={logContent}
        initialValue={ description || "<p>Start creating something amazing...</p>"}
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
  
        
        {errors.description && <Text color="red.400">{errors.description}</Text>}

        <Box mb={5} mt={34}>
          <Text color="gray.300" mb={1}>Upload Image (optional)</Text>
          {existingImageUrl && !imageFile && (
            <Box mb={2}><img src={existingImageUrl} alt="Current Project" style={{ maxWidth: '100%' }} /></Box>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            color="gray.300"
          />
          {errors.imageFile && <Text color="red.400">{errors.imageFile}</Text>}
        </Box>

        <Box>
          <Text color="gray.300" mb={1}>Upload PDF (optional)</Text>
          {existingPdfUrl && !pdfFile && (
            <Box mb={2}><a href={existingPdfUrl} target="_blank" rel="noopener noreferrer">View current PDF</a></Box>
          )}
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            color="gray.300"
          />
          {errors.pdfFile && <Text color="red.400">{errors.pdfFile}</Text>}
        </Box>

        <Button colorScheme="blue" onClick={handleSaveProject} isLoading={loading}>
          {id ? 'Update Project' : 'Save Project'} {submitLoading ? <Spinner /> : isSubmitted ? <LuCheck /> : ""}
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateProjectPage;

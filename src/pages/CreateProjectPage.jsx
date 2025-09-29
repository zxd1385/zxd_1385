import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Heading, Input, Textarea, Button, VStack, Text } from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // optional project id for editing

  const [session, setSession] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState(null);

  // Fetch session and existing project (if editing)
  useEffect(() => {
    const fetchSessionAndProject = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        navigate('/login');
        return;
      }
      setSession(session);

      if (id) {
        // Fetch project data
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
          // Existing files won't be set as File objects; user can re-upload
        }
      }
    };

    fetchSessionAndProject();
  }, [id, navigate]);

  const handleSaveProject = async () => {
    if (!session) return;
    setLoading(true);

    let imageUrl = null;
    let pdfUrl = null;

    // Upload image
    if (imageFile) {
        // Remove old image first
        if (existingImageUrl) {
          const oldPath = existingImageUrl.split('/').pop(); // get filename from URL
          await supabase.storage.from('project-images').remove([`public/${oldPath}`]);
        }
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(`public/${imageFile.name}`, imageFile);

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        setLoading(false);
        return;
      }

      imageUrl = supabase.storage
        .from('project-images')
        .getPublicUrl(`public/${imageFile.name}`).data.publicUrl;
    }

    // Upload PDF
    if (pdfFile) {

        if (existingPdfUrl) {
            const oldPath = existingPdfUrl.split('/').pop();
            await supabase.storage.from('project-pdfs').remove([`public/${oldPath}`]);
          }
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-pdfs')
        .upload(`public/${pdfFile.name}`, pdfFile);

      if (uploadError) {
        console.error('PDF upload error:', uploadError);
        setLoading(false);
        return;
      }

      pdfUrl = supabase.storage
        .from('project-pdfs')
        .getPublicUrl(`public/${pdfFile.name}`).data.publicUrl;
    }

    // Prepare project data
    const projectData = {
      title,
      description,
      publisher_id: session.user.id,
      image_url: imageFile
        ? supabase.storage.from('project-images').getPublicUrl(`public/${imageFile.name}`).data.publicUrl
        : existingImageUrl,

      pdf_url: pdfFile
        ? supabase.storage.from('project-pdfs').getPublicUrl(`public/${pdfFile.name}`).data.publicUrl
        : existingPdfUrl,
        is_visible: false

    };

    let errorInsert;
    if (id) {
      // Update existing project
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id);
      errorInsert = error;
    } else {
      // Insert new project
      const { error } = await supabase
        .from('projects')
        .insert([projectData])
        .single();
      errorInsert = error;
    }

    if (errorInsert) {
      console.error('Error saving project:', errorInsert);
    } else {
      alert(id ? 'Project updated successfully!' : 'Project created successfully!');
      navigate('/dashboard'); // redirect after save
    }

    setLoading(false);
  };

  return (
    <Box p={8} maxW="600px" mx="auto">
      <Heading color="purple.500" mb={6}>{id ? 'Edit Project' : 'Create Project'}</Heading>
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
          mb={6}
        />
        <Text color="gray.300">Project Description</Text>
        <Textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          isRequired
          variant="filled"
          color="gray.300"
          border="1px solid white"
          focusBorderColor="white.900"
          borderRadius={5}
          mb={5}
        />
        <Box mb={5}>
          <Text color="gray.300" mb={1}>Upload Image (optional)</Text>
          {existingImageUrl && !imageFile && (
            <Box mb={2}>
              <img src={existingImageUrl} alt="Current Project" style={{ maxWidth: '100%' }} />
            </Box>
          )}
          <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} color="gray.300" />
        </Box>
      
        <Box>
          <Text color="gray.300" mb={1}>Upload PDF (optional)</Text>
          {existingPdfUrl && !pdfFile && (
            <Box mb={2}>
              <a href={existingPdfUrl} target="_blank" rel="noopener noreferrer">
                View current PDF
              </a>
            </Box>
          )}
          <Input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} color="gray.300" />
        </Box>

        <Button colorScheme="blue" onClick={handleSaveProject} isLoading={loading}>
          {id ? 'Update Project' : 'Save Project'}
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateProjectPage;

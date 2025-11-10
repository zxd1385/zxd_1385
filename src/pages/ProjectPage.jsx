import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Image, Button, Link, VStack, HStack, Flex, Avatar } from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';
import MarkdownRenderer from '../components/serverComponents/MarkDownRenderer';
import LoadingScreen from '../components/ui/Loading';
import StudyngProgressBar from '../components/ui/StudyngProgressBar';

const ProjectPage = () => {
  const { id } = useParams(); // Get project ID from the URL
  const [project, setProject] = useState(null);

  const containerRef = useRef();

  useEffect(() => {
    if (window.MathJax) {
      // tell MathJax to render math inside this container
      window.MathJax.typesetPromise([containerRef.current]);
    }
  }, [project]);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (
            avatar_url,
            name,
            website
          )
        `)
        .eq('id', id)
        .single(); // Fetch the project by ID

      if (error) {
        console.error(error);
      } else {
        setProject(data);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) return <LoadingScreen type='Project' padd={40} />;

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      px={{ base: 3, md: 8 }}
      py={{ base: 6, md: 12 }}
    >
      <StudyngProgressBar />
      <Box 
        maxW="800px" 
        w="full"
        bg="gray.800" 
        borderRadius="lg" 
        shadow="xl" 
        color="white"
        p={{ base: 6, md: 12 }}
      >
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" size="2xl">
            {project.title}
          </Heading>

          {project.image_url && (
            <Image 
              src={project.image_url} 
              alt={project.title} 
              borderRadius="md" 
              objectFit="cover" 
              maxH="400px"
              w="full"
            />
          )}

          <HStack justify="space-between" fontSize="sm" color="gray.400">
          <HStack alignItems="start">
                <Avatar.Root size="lg"  borderRadius="50%">
                  <Avatar.Image
                    src={project.profiles.avatar_url || `https://avatar.iran.liara.run/public/boy?username=${project.profiles.name}`}
                    
                  />
                  <Avatar.Fallback name={project.profiles.avatar_url || "Unknown"} />
                </Avatar.Root>
                <VStack>
                <Text fontSize="sm" color="gray.500">
                  {project.profiles.name || "Unknown Author"}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Custom website: {project.profiles.website || "Unknown"}
                </Text>
                </VStack>
          </HStack>
            <Text>Created at: {new Date(project.created_at).toLocaleDateString()}</Text>
          </HStack>

          <Box
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: project.description }}
          padding={3}
          mt={4}
          >
          </Box>

          {project.pdf_url && (
            <Link href={project.pdf_url} isExternal _hover={{ textDecoration: 'none' }}>
              <Button colorScheme="teal" w="full">
                Download Project PDF
              </Button>
            </Link>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default ProjectPage;

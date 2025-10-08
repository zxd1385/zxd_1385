import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Text, Button, Stack, Card, Avatar, Image, HStack} from "@chakra-ui/react";
import { supabase } from '../lib/supabaseClient';
import LoadingScreen from '../components/ui/Loading';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
        setLoading(true);
      // Only select projects that are visible
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (
            avatar_url,
            name
          )
        `)
        .eq('is_visible', true)
        .order('created_at', { ascending: false }); // optional: newest first

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <LoadingScreen type='Projects' padd={40}  />;
  return (
    <Box p={8}>
      <Heading mb={6} color="teal.300" textAlign="center">
        Projects
      </Heading>

      <Stack gap="4" direction="row" wrap="wrap" justify="center">
        {projects.length === 0 ? (
          <Text textAlign="center" color="gray.400" fontSize="lg">
            No projects to show
          </Text>
        ) : (
          projects.map((project) => (
            <Card.Root
              key={project.id}
              width="320px"
              variant="subtle"
              bg="gray.800"
              color="gray.100"
              _hover={{ transform: "scale(1.02)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              {project.image_url && (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  objectFit="cover"
                  height="160px"
                  width="100%"
                  borderTopRadius="md"
                />
              )}
              <Card.Body gap="2">
                <Card.Title mb="2" color="teal.200">
                  {project.title}
                </Card.Title>
                <Card.Description color="gray.400" noOfLines={1}>
                {project.description.length > 100
                ? project.description.slice(0, 100) + "..."
                : project.description}
                </Card.Description>
              </Card.Body>
              <Card.Footer justifyContent="space-between">
              <HStack ml={3}>
                <Avatar.Root size="lg"  borderRadius="50%">
                  <Avatar.Image
                    src={project.profiles.avatar_url || `https://avatar.iran.liara.run/public/boy?username=${project.profiles.name}`}
                    
                  />
                  <Avatar.Fallback name={project.profiles.avatar_url || "Unknown"} />
                </Avatar.Root>
                <Text fontSize="xs" color="gray.500">
                  {project.profiles.name || "Unknown Author"}
                </Text>
              </HStack>
              <Link to={`/project/${project.id}`}>
              <Button colorScheme="blue" size="xs">View Project</Button>
               </Link>
               
              </Card.Footer>
            </Card.Root>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default ProjectsPage;

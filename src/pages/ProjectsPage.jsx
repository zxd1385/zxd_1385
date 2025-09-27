import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Text, Button, Stack, Card, Avatar, Image } from "@chakra-ui/react";
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
        .select('*')
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

  if (loading) return <LoadingScreen />;
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
              <Link to={`/project/${project.id}`}>
              <Button colorScheme="blue">View Project</Button>
               </Link>
                <Text fontSize="sm" color="gray.500">
                  {project.publisher_name || "Unknown Publisher"}
                </Text>
              </Card.Footer>
            </Card.Root>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default ProjectsPage;

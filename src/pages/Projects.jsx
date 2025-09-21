import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";

function Projects() {
  const projects = ["Portfolio Website", "E-commerce Store", "Blog Platform"];

  return (
    <Box p={8}>
      <Heading mb={6}>My Projects</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {projects.map((project, index) => (
          <Box
            key={index}
            p={4}
            boxShadow="md"
            borderRadius="md"
            bg="white"
            _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
            transition="0.2s"
          >
            <Heading as="h3" size="md" mb={2}>
              {project}
            </Heading>
            <Text>
              A sample project showcasing {project.toLowerCase()} features and functionalities.
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Projects;

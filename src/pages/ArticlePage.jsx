import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, VStack, Flex } from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';
import MarkdownRenderer from '../components/serverComponents/MarkDownRenderer';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setArticle(data);
    };

    fetchArticle();
  }, [id]);

  if (!article) return <Text>Loading...</Text>;

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 12 }}
    >
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
            {article.title}
          </Heading>

          <Text 
            mb={6} 
            fontStyle="italic" 
            textAlign="center" 
            color="gray.300"
          >
            {article.short_description}
          </Text>

          <Text fontSize="sm" color="gray.400">
            Created at: {new Date(article.created_at).toLocaleDateString()} by {article.author_name}
          </Text>

          <Text fontSize="sm" color="gray.400">
            Last update: {new Date(article.updated_at).toLocaleDateString()}
          </Text>

          <Box mt={4}>
            <MarkdownRenderer content={article.body} />
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ArticlePage;

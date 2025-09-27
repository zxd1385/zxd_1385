import { useEffect, useState } from 'react';
import { Box, VStack, Heading, Text, Button, Stack, Avatar, Card } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const TopArticles = ({ limit = 3 }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, short_description, author')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) console.error('Error fetching articles:', error);
      else setArticles(data);
    };
    fetchArticles();
  }, [limit]);

  return (
    <Box p={8}>
      <Heading mb={6} color="teal.300" textAlign="center">
        Top Articles
      </Heading>

      <Stack gap="4" direction="row" wrap="wrap" justify="center">
        {articles.length === 0 ? (
          <Text textAlign="center" color="gray.400" fontSize="lg">
            No articles to show
          </Text>
        ) : (
          articles.map((article) => (
            <Card.Root
              key={article.id}
              width="320px"
              variant="subtle"
              bg="gray.800"
              color="gray.100"
              _hover={{ transform: "scale(1.02)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              <Card.Body gap="2">
                <Avatar.Root size="lg" shape="rounded">
                  <Avatar.Image
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${article.author_name || "A"}`}
                  />
                  <Avatar.Fallback name={article.author_name || "Unknown"} />
                </Avatar.Root>
                <Card.Title mb="2" color="teal.200">
                  {article.title}
                </Card.Title>
                <Card.Description color="gray.400" noOfLines={3}>
                  {article.short_description}
                </Card.Description>
              </Card.Body>
              <Card.Footer justifyContent="space-between">
                <Text fontSize="sm" color="gray.500">
                  {article.author_name || "Unknown Author"}
                </Text>
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  Read More
                </Button>
              </Card.Footer>
            </Card.Root>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default TopArticles;

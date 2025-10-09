import { useEffect, useState } from 'react';
import { Box, Heading, Text, Button, Stack, Card, Avatar, HStack, Input } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import LoadingScreen from '../components/ui/Loading';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredArticles, setfilteredArticles] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(
    () => {
      const filteredArticles = articles.filter(
        (article) =>
          article.profiles.name?.toLowerCase().includes(search.toLowerCase()) ||
        article.title?.toLowerCase().includes(search.toLowerCase()) ||
        article.short_description?.toLowerCase().includes(search.toLowerCase())
      );
      setfilteredArticles(filteredArticles)
      
    }
  , [search])

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
    
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          short_description,
          created_at,
          publisher_id,
          profiles (
            avatar_url,
            name
          )
        `)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });
    
      if (error) {
        console.error(error);
      } else {
        console.log(data); // Each article will now have a "profiles" object
        setArticles(data);
        setfilteredArticles(data)
      }
    
      setLoading(false);
    };
    

    fetchArticles();
  }, []);

  if (loading) return <LoadingScreen type='Articles' padd={40} />;

  return (
    <Box p={8} textAlign="center">
      <Heading mb={6} color="teal.300" textAlign="center">
        Articles ({filteredArticles.length})
      </Heading>
      <Box mb={4} maxW="400px" mx="auto">
        <Input
          placeholder="Search Articles by Content, Author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="gray.700"
          color="white"
        />
      </Box>

      <Stack gap="4" direction="row" wrap="wrap" justify="center">
        {filteredArticles.length === 0 ? (
          <Text textAlign="center" color="gray.400" fontSize="lg">
            No articles to show
          </Text>
        ) : (
          filteredArticles.map((article) => (
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
                
                <Card.Title mb="2" color="teal.200">
                  {article.title}
                </Card.Title>
                <Card.Description color="gray.400" noOfLines={3}>
                  {article.short_description}
                </Card.Description>
              </Card.Body>
              <Card.Footer justifyContent="space-between">
                <HStack >
                <Avatar.Root size="lg"  borderRadius="50%">
                  <Avatar.Image
                    src={article.profiles.avatar_url || `https://avatar.iran.liara.run/public/boy?username=${article.profiles.name}`}
                    
                  />
                  <Avatar.Fallback name={article.profiles.avatar_url || "Unknown"} />
                </Avatar.Root>
                <Text fontSize="xs" color="gray.500">
                  {article.profiles.name || "Unknown Author"}
                </Text>
                </HStack>
                <Button
                  size="xs"
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

export default ArticlesPage;

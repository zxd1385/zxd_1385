import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, VStack, HStack, Flex, Avatar } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import MarkdownRenderer from '../components/serverComponents/MarkDownRenderer';
import DigitalCountdown from '../components/ui/DigitalCowntdown';
import LoadingScreen from '../components/ui/Loading';
import LikeDislike from '../components/serverComponents/LikeDislike';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isPublished, setIsPublished] = useState(true);
  const [session, setSession] = useState(null);

useEffect(() => {
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
  };
  getSession();
}, []);


  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles (
            avatar_url,
            name,
            website,
            location
          )
        `)
        .eq('id', id)
        .single();

      if (!error) {
        setArticle(data)
      // If there's a publish_time, check if it's in the future
      if (data.publish_time) {
        const currentTime = new Date();
        const publishTime = new Date(data.publish_time);

        if (currentTime < publishTime) {
          setIsPublished(false);  // Set state to false if it's not yet time to publish
        }
      }
      
      };
    };

    fetchArticle();
  }, [id]);

  if (!article) return <LoadingScreen type='Article' padd={40} />;

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

          <HStack alignItems="start">
                <Avatar.Root size="lg"  borderRadius="50%">
                  <Avatar.Image
                    src={article.profiles.avatar_url}
                    
                  />
                  <Avatar.Fallback name={article.profiles.avatar_url || "Unknown"} />
                </Avatar.Root>
                <VStack>
                <Text fontSize="sm" color="gray.500">
                  {article.profiles.name || "Unknown Author"}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Custom website: {article.profiles.website || "Unknown"}
                </Text>
                </VStack>
          </HStack>
          <Text fontSize="sm" color="gray.400">
            Created at: {new Date(article.created_at).toLocaleDateString()}
          </Text>
          

          <Text fontSize="sm" color="gray.400">
            Last update: {new Date(article.updated_at).toLocaleDateString()}
          </Text>

          {!isPublished ? (
            <Box>
              <Box 
              p={4} 
              mt={4}
              bg="yellow.400" 
              color="gray.600" 
              borderRadius="md" 
              textAlign="center"
            >
              <Text>This article will be available on {new Date(article.publish_time ).toLocaleString()}</Text>
              
            </Box>
            <Box>
              <CustomCountdown targetDate={new Date(article.publish_time)} isLoading={false} />
            </Box>
            </Box>
          ) : (
            <Box
             mt={4}
             dangerouslySetInnerHTML={{ __html: article.body }}>
              
            </Box>
            
          )}

<LikeDislike articleId={article.id} session={session} />
          
        </VStack>
      </Box>
    </Flex>
  );
};


function CustomCountdown({ targetDate, isLoading }) {
  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return undefined

    
    const difference = +new Date(targetDate) - +new Date()
    let _timeLeft = {}

    if (difference > 0) {
      _timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return _timeLeft
  }, [])

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  // const boxBg = useColorModeValue("white", "gray.800");
  const targetDay = new Date(targetDate)
  const labelColor = "gray300"
  const numberColor = "black"
  const bg = "gray.300"
  const boxShadow = "1px"
  if (!timeLeft && !isLoading) return <></>

  return (
    <VStack
      mt={3}
      spacing={4}
      p={4}
      boxShadow={boxShadow}
      rounded="md"
    >
      <Text fontSize="2xl" fontWeight="bold" color="gray.300">
        {isLoading ? (
          <SkeletonText>Until Broadcast...</SkeletonText>
        ) : (
          "Until Broadcast..."
        )}
      </Text>
      {!isLoading ? (
        <HStack spacing={6} position="relative">
          {/* dot seperators */}
          <Box position="absolute" top="14px" left="60px" bg="white" width="6px" height="6px" borderRadius="50%"></Box>
          <Box position="absolute" top="35px" left="60px" bg="white" width="6px" height="6px" borderRadius="50%"></Box>
          <Box position="absolute" top="14px" left="132px" bg="white" width="6px" height="6px" borderRadius="50%"></Box>
          <Box position="absolute" top="35px" left="132px" bg="white" width="6px" height="6px" borderRadius="50%"></Box>
          <Box position="absolute" top="35px" left="205px" bg="white" width="6px" height="6px" borderRadius="50%"></Box>
          <Box position="absolute" top="14px" left="205px" bg="white" width="6px" height="6px" borderRadius="50%"></Box>
          
          <VStack mr={2}>
            {}
            <DigitalCountdown value={timeLeft.days} width={50} height={20} />
            {/* <Text fontSize="2xl" as="b" color={numberColor}>
              {timeLeft.days || "0"}
            </Text> */}
            <Text fontSize="md" color={labelColor}>
              Days
            </Text>
          </VStack>
          <VStack mr={2}>
          <DigitalCountdown value={timeLeft.hours} width={350} height={120} />
            {/* <Text fontSize="2xl" as="b" color={numberColor}>
              {timeLeft.hours || "0"}
            </Text> */}
            <Text fontSize="md" color={labelColor}>
              Hours
            </Text>
          </VStack>
          <VStack mr={2}>
          <DigitalCountdown value={timeLeft.minutes} width={350} height={120} />
            {/* <Text fontSize="2xl" as="b" color={numberColor}>
              {timeLeft.minutes || "0"}
            </Text> */}
            <Text fontSize="md" color={labelColor}>
              Minutes
            </Text>
          </VStack>
          <VStack >
          {/* <PaperCountdown value={timeLeft.seconds} width={90} height={100} /> */}
          <DigitalCountdown value={timeLeft.seconds} width={350} height={120} />
            <Text fontSize="md" color={labelColor}>
              Seconds
            </Text>
          </VStack>
        </HStack>
      ) : (
        <HStack spacing={8}>
          <VStack gap={3}>
            <Skeleton rounded="xl" height="40px" width="40px" />
            <Skeleton rounded="xl" height="30px" width="40px" />
          </VStack>
          <VStack gap={3}>
            <Skeleton rounded="xl" height="40px" width="40px" />
            <Skeleton rounded="xl" height="30px" width="40px" />
          </VStack>
          <VStack gap={3}>
            <Skeleton rounded="xl" height="40px" width="40px" />
            <Skeleton rounded="xl" height="30px" width="40px" />
          </VStack>
          <VStack gap={3}>
            <Skeleton rounded="xl" height="40px" width="40px" />
            <Skeleton rounded="xl" height="30px" width="40px" />
          </VStack>
        </HStack>
      )}
    </VStack>
  )
}



export default ArticlePage;

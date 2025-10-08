import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputGroup,
  IconButton,
  Button,
  Image,
} from "@chakra-ui/react";
import { LuSend, LuLoader } from "react-icons/lu";
import { getComments } from "../../custom-js/getComments";
import addComment from "../../custom-js/addComment";
import { supabase } from "../../lib/supabaseClient";
import { validateWithServer } from "../../custom-js/validationServerText";
import { sendTextToAdmin } from "../../custom-js/senTextToAdmin";
import LoadingScreen from "../ui/Loading";
import { comment } from "postcss";
import { sendTelegramMessage } from "../../custom-js/sendTelegramMessage";

export default function Comments({ articleId }) {
  const [loadingcomments, setloadingcomments] = useState(true)
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);
  const [commentValidation, setcommentValidation] = useState(false);
  const [commentErrors, setcommentErrors] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
  
      try {
        setloadingcomments(true)
        const commentsData = await getComments(articleId);

    // Fetch user info for each comment
    const commentsWithUsers = await Promise.all(
      commentsData.map(async (c) => {
        const { data: user } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", c.user_id)
          .single();
        return { ...c, user };
      })
    );

    setComments(commentsWithUsers);
    setloadingcomments(false)
      } catch (err) {
        console.error(err);
      }
    })();
  }, [articleId]);
  
  useEffect(() => {
    // console.log("Comments updated:", comments);
  }, [comments]);

  const handleAddComment = async () => {
    if (!content.trim()) return;
    setcommentValidation(true)
    const validation = await validateWithServer(`${content}`);
    if (validation.broadcast_ok === "NO") {
        setcommentErrors(validation.problems)
        setcommentValidation(false)
        alert(validation.problems)
        return; // ❌ stop submission
      }

    const addcomment = await addComment(articleId, user.id, content);
    const strToAdmin = `📝A new <b>Comment</b> has been sent succesfuly!\nContent: <i>${content}</i>\nArticle ID: ${articleId}\nUser ID: ${user.id}\ngo to <a href="${import.meta.env.VITE_SITE_URL}/#/article/${articleId}">this article</a> and check it manualy!`
    const sentText = await sendTelegramMessage(strToAdmin);
    setContent("");
    setloadingcomments(true)
    const data = await getComments(articleId);
    const commentsWithUsers = await Promise.all(
        data.map(async (c) => {
          const { data: user } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", c.user_id)
            .single();
          return { ...c, user };
        })
      );
  
    setComments(commentsWithUsers);
    setloadingcomments(false)
    setcommentValidation(false)
  };

  return (
    <Box mt={8} p={4}  borderRadius="xl" boxShadow="xl">
      <Text fontSize="lg" mb={4} fontWeight="bold" color="gray.300">
        Comments
      </Text>
      <Box height="1px" bg="gray.600" my={4} />


      {user ? (
        <VStack>
            {commentValidation && 
            <Text maxW="280px" color="gray.500">Validating your comment by zxdClub AI validation system</Text>
            }
          <Box position="relative" width="100%">
      <Input
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        bg="gray.700"
        color="white"
        borderRadius="full"
        pr="3rem" // leave space for the send button
      />
      <Button
        colorScheme="purple"
        bg="transparent"
        size="sm"
        borderRadius="full"
        position="absolute"
        right="0.25rem"
        top="50%"
        transform="translateY(-50%)"
        aria-label="Send comment"
        onClick={handleAddComment}
      >
        { commentValidation ? <LuLoader className="animate-spin" /> : <LuSend /> }
        </Button>
            </Box>
        </VStack>
      ) : (
        <Text color="gray.500">Please log in to comment.</Text>
      )}

      <VStack align="stretch" spacing={3} mt={4}>
        {loadingcomments ? <LoadingScreen type="Comments" />
        :
        comments.map((c) => 
        (
          <Box key={c.id} p={4} bg="gray.700" borderRadius="md" maxWidth="280px">
            <Text mb={5}>{c.content}</Text>
            <HStack justify="start">
              <HStack>
                <Image
                  src={c.user?.avatar_url || "https://avatar.iran.liara.run/public/13"}
                  size="xs"
                  name={c.user?.name}
                  borderWidth="2px"
                  borderColor="teal.400"
                  maxWidth="44px"
                  minHeight="44px"
                  borderRadius="50%"
                />
                
              </HStack>
              <VStack alignItems="start">
              <Text fontSize="sm">{c.user?.name}</Text>
              <Text fontSize="xs" color="gray.400">
                {new Date(c.created_at).toLocaleString()}
              </Text>
              </VStack>
            </HStack>
            
          </Box>
        ))}
        {comments.length == 0 && !loadingcomments &&
        (<Text color="gray.500">Be the first to share your thoughts! Start the conversation by leaving a comment below.</Text>)
        }
      </VStack>

      
    </Box>
  );
}

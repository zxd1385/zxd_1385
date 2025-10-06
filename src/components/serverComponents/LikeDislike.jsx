import { useState, useEffect } from "react";
import { HStack, Button, Text, VStack } from "@chakra-ui/react";
import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";

export default function LikeDislike({ articleId, session }) {
  const userId = session?.user?.id;
  const [vote, setVote] = useState(0); // 1 = like, -1 = dislike, 0 = none
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false);

  // Initial fetch
  useEffect(() => {
    const fetchVotes = async () => {
      if (!articleId) return;

      // User's vote
      if (userId) {
        setMessage("Did you like this article?")
        const { data: userVote } = await supabase
          .from("article_votes")
          .select("vote")
          .eq("article_id", articleId)
          .eq("user_id", userId)
          .maybeSingle();

        setVote(userVote?.vote || 0);
      } else {
        setMessage("Please log in to vote this article")
      }

      // Counts
      const { data: allVotes } = await supabase
        .from("article_votes")
        .select("vote")
        .eq("article_id", articleId);

      const likeCount = allVotes?.filter((v) => v.vote === 1).length || 0;
      const dislikeCount = allVotes?.filter((v) => v.vote === -1).length || 0;

      setLikes(likeCount);
      setDislikes(dislikeCount);
    };

    fetchVotes();
  }, [articleId, userId]);

  const handleVote = async (newVote) => {
    if (!userId) return alert("Please log in to vote!");
    setLoading(true);

    if (vote === newVote) {
      // 1) Undo the same vote
      await supabase
        .from("article_votes")
        .delete()
        .eq("article_id", articleId)
        .eq("user_id", userId);

      if (newVote === 1) setLikes((l) => l - 1);
      if (newVote === -1) setDislikes((d) => d - 1);

      setVote(0);
    } else {
      // 2) If switching vote, adjust both counts
      if (vote === 1 && newVote === -1) {
        setLikes((l) => l - 1);
        setDislikes((d) => d + 1);
      } else if (vote === -1 && newVote === 1) {
        setDislikes((d) => d - 1);
        setLikes((l) => l + 1);
      } else if (vote === 0 && newVote === 1) {
        setLikes((l) => l + 1);
      } else if (vote === 0 && newVote === -1) {
        setDislikes((d) => d + 1);
      }

      // 3) Upsert new vote
      await supabase.from("article_votes").upsert(
        {
          article_id: articleId,
          user_id: userId,
          vote: newVote,
        },
        { onConflict: ["article_id", "user_id"] }
      );

      setVote(newVote);
    }

    setLoading(false);
  };

  return (
    <HStack spacing={8} justify="center" mt={6}>
        <Text>{message}</Text>
      {/* Like */}
      <VStack>
        <HStack>
        <Button
        bg="transparent"
        onClick={() => handleVote(1)}
        isLoading={loading}
        _hover={{ transform: "scale(1.1)", color: "green.300" }}
      >
        <Text color={vote === 1 ? "green.300" : "gray.400"}>
          {vote === 1 ? <FaThumbsUp /> : <FaRegThumbsUp />} {likes}
        </Text>
      </Button>

      {/* Dislike */}
      <Button
      bg="transparent"
        variant="ghost"
        onClick={() => handleVote(-1)}
        isLoading={loading}
        _hover={{ transform: "scale(1.1)", color: "red.300" }}
      >
        <Text color={vote === -1 ? "red.300" : "gray.400"}>
          {vote === -1 ? <FaThumbsDown /> : <FaRegThumbsDown />} {dislikes}
        </Text>
      </Button>
        </HStack>
      </VStack>
    </HStack>
  );
}

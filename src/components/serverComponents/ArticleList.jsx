import React, { useState, useEffect } from "react";
import { Box, Button, Text, VStack, Image, Spinner, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import LoadingScreen from "../ui/Loading";

// Optional: Motion component for animation
const MotionBox = motion(Box);

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching the articles from the GitHub repo
  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/zxd1385/MyDocuments/contents/articles?ref=main"
        );
        if (!res.ok) throw new Error("GitHub API request failed");

        const directories = await res.json();

        // Get all folders (articles) inside the articles directory
        const folderDirs = directories.filter((item) => item.type === "dir");

        const articlesData = [];

        for (let folder of folderDirs) {
          const folderRes = await fetch(
            `https://api.github.com/repos/zxd1385/MyDocuments/contents/articles/${folder.name}?ref=main`
          );
          const folderFiles = await folderRes.json();

          // Find the markdown file inside the folder (assuming it's named index.md)
          const mdFile = folderFiles.find(f => f.name === "index.md");

          if (mdFile) {
            articlesData.push({
              folderName: folder.name,
              markdownFile: mdFile,
              files: folderFiles.filter(file => file.name !== "index.md"), // Other files (images, PDFs)
            });
          }
        }

        setArticles(articlesData);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // Show loading screen until data is fetched
  if (loading) return <LoadingScreen />;

  return (
    <VStack spacing={6} align="stretch" p={5}>
      {articles.length > 0 ? (
        articles.map((article) => (
          <MotionBox
            key={article.markdownFile.sha}
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={5}
            bg="white"
            borderRadius="md"
            boxShadow="md"
            whileHover={{ scale: 1.05 }}
            transition="all 0.3s ease"
            cursor="pointer"
            onClick={() => window.location.href = `/article/${article.folderName}`}
          >
            <Box mb={4}>
              {/* If there is an image in the article files, display it */}
              {article.files.length > 0 && article.files.some(file => file.name.endsWith(".jpg") || file.name.endsWith(".png")) ? (
                <Image
                  src={article.files.find(file => file.name.endsWith(".jpg") || file.name.endsWith(".png")).download_url}
                  alt={article.folderName}
                  borderRadius="md"
                  boxSize="150px"
                  objectFit="cover"
                  mb={3}
                />
              ) : (
                <Box h="150px" w="150px" bg="gray.200" borderRadius="md" mb={3} />
              )}
            </Box>
            <Text fontSize="xl" fontWeight="semibold" color="teal.500">
              {article.folderName}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
              Click to read more
            </Text>
          </MotionBox>
        ))
      ) : (
        <Text>No articles found.</Text>
      )}
    </VStack>
  );
}

export default ArticleList;

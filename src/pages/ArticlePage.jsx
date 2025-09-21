import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Link,
  Image,
  Stack,
  Spinner,
  Card,
  CardBody,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "react-router-dom";
import MarkdownRenderer from "../components/serverComponents/MarkDownRenderer";
import LoadingScreen from "../components/ui/Loading";


export default function ArticlePage() {
  const { folderName } = useParams();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(
          `https://api.github.com/repos/zxd1385/MyDocuments/contents/articles/${folderName}/index.md?ref=main`
        );
        const data = await res.json();
        const text = await fetch(data.download_url).then((res) => res.text());
        setContent(text);

        const filesRes = await fetch(
          `https://api.github.com/repos/zxd1385/MyDocuments/contents/articles/${folderName}?ref=main`
        );
        const folderFiles = await filesRes.json();
        setFiles(folderFiles.filter((f) => f.name !== "index.md"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [folderName]);

  if (loading)
    return (
      <LoadingScreen />
    );

  return (
    <Box maxW="800px" mx="auto" p={5}>
     
          <MarkdownRenderer content={content} /> 
        
    

      {files.length > 0 && (
        <Box mt={5}>
          <Heading size="md" mb={3}>
            Assets
          </Heading>
          <Stack spacing={4}>
            {files.map((file) => (
              <Box key={file.sha} borderWidth="1px" borderRadius="md" p={3}>
                {file.name.endsWith(".pdf") ? (
                  <Link href={file.download_url} color="teal.400" isExternal>
                    Download PDF: {file.name}
                  </Link>
                ) : (
                  <Image src={file.download_url} alt={file.name} borderRadius="md" />
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  Heading,
  Text,
  Code,
  Link
} from "@chakra-ui/react";

export default function MarkdownRenderer({ content }) {
  return (
    <Box p={4}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <Heading as="h1" size="xl" mt={4} mb={2}>{children}</Heading>,
          h2: ({ children }) => <Heading as="h2" size="lg" mt={4} mb={2}>{children}</Heading>,
          h3: ({ children }) => <Heading as="h3" size="md" mt={4} mb={2}>{children}</Heading>,
          p: ({ children }) => <Text mb={2}>{children}</Text>,
          a: ({ children, href }) => <Link color="teal.500" href={href} isExternal>{children}</Link>,
          code: ({ children }) => <Code p={1} borderRadius="md">{children}</Code>,
          table: ({ children }) => <table style={{ border: "1px solid gray", width: "100%" }}>{children}</table>,
          thead: ({ children }) => <thead style={{ background: "#eee" }}>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th style={{ padding: "8px" }}>{children}</th>,
          td: ({ children }) => <td style={{ padding: "8px", border: "1px solid #ccc" }}>{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}

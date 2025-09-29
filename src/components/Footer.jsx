import { Box, Flex, Stack, Text, Link, Heading, Input, Button, HStack } from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTelegram, FaTwitter } from "react-icons/fa";
import VanishInput from "./ui/VanishInput";


export default function Footer() {
  const links = [
    { name: "Home", href: "#/" },
    { name: "About", href: "#/about" },
    { name: "Projects", href: "#/projects" },
    { name: "Contact", href: "#/contact" },
  ];

  const socials = [
    { icon: <FaGithub />, href: "https://github.com/zxd1385" },
    { icon: <FaLinkedin />, href: "https://linkedin.com/in/yourusername" },
    { icon: <FaTwitter />, href: "https://twitter.com/yourusername" },
    { icon: <FaTelegram />, href: "t.me/zxd_Solenoid" },
  ];

  return (
    <Box bg="gray.900" color="white" py={10} px={{ base: 4, md: 10 }}>
      <Flex
        direction={{ base: "column", md: "row" }}
        maxW="6xl"
        mx="auto"
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={6}
      >
        {/* Brand */}
        <Box mb={{ base: 4, md: 0 }}>
          <Heading size="md" mb={2}>
            zxd 1385
          </Heading>
          <Text fontSize="sm" color="gray.400">
            Building modern research experiences
          </Text>
        </Box>

        {/* Quick Links */}
        <Stack direction={{ base: "column", md: "row" }} spacing={6}>
          {links.map((link) => (
            <Link key={link.name} href={link.href} _hover={{ textDecoration: "underline", color: "teal.300" }}>
              {link.name}
            </Link>
          ))}
        </Stack>

        {/* Socials */}
        <HStack mt={{ base: 4, md: 0 }} spacing={4}>
          {socials.map((social, idx) => (
            <Link key={idx} href={social.href} isExternal _hover={{ color: "teal.300" }}>
              {social.icon}
            </Link>
          ))}
        </HStack>
      </Flex>

      {/* Newsletter / optional */}
      <Flex direction={{ base: "column", md: "row" }} maxW="6xl" mx="auto" justify="space-between" align="center" mb={4}>
        <Text mb={{ base: 2, md: 0 }} color="gray.400">
          Subscribe to our newsletter
        </Text>
        <HStack spacing={2}>
        
          <Input placeholder="Your email" size="sm" bg="gray.800" border="none" _focus={{ borderColor: "teal.300" }} />
          <Button colorScheme="teal" size="sm">
            Subscribe
          </Button>
        </HStack>
      </Flex>

      <Text fontSize="sm" textAlign="center" color="gray.500">
        © {new Date().getFullYear()} zxd1385. All rights reserved.
      </Text>
    </Box>
  );
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Box, Button, Input, Heading, Text, VStack, Spinner } from '@chakra-ui/react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("Please log in to access all contents...")

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setMessage('You are already logged in!')
      }
    }
    checkSession()
  }, [])

  const handleLogin = async () => {
    if (!email) {
      setMessage("Email is required")
      return
    }

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for the login link!')
    }

    setLoading(false)
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box maxW="md" w="full" p={6} borderRadius="md" boxShadow="lg" bg="gray.800" color="white">
        <Heading mb={6} textAlign="center">Sign In</Heading>

        {/* Message Above Input */}
        {message && (
          <Text
            color={
              message.startsWith('Error') ? 'red.400' :
              message.startsWith('Please') ? 'gray.300' :
              'green.400'
            }
            textAlign="center"
            mb={4}
          >
            {message}
          </Text>
        )}

        {/* Email Input */}
        <VStack spacing={4}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            isRequired
            color="gray.300"
          />

          <Button
            colorScheme="teal"
            width="100%"
            onClick={handleLogin}
            isLoading={loading}
            loadingText="Sending..."
          >
            Send Link {loading && <Spinner />}
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}

export default LoginPage

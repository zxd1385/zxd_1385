import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Box, Button, Input, Heading, Text, Center, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import LoadingScreen from '../components/ui/Loading'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("Please Log-in to accese all contents...")
  const navigate = useNavigate()

  // Check if user is already logged in
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


if (loading) return <LoadingScreen />


  return (
    <Box
  minH="100vh"          // full viewport height
  display="flex"
  alignItems="center"    // vertical center
  justifyContent="center"         // optional background
  px={4}                 // horizontal padding
>
  <Box
    maxW="md"
    w="full"
    p={6}
    borderRadius="md"
    boxShadow="lg"
    bg="gray.800"
    color="white"
  >
    <Heading mb="6" textAlign="center">Sign In</Heading>

    {message && (
        <HStack spacing={4} align="center" justify="center" w="full">
        <Text
          flex="1"
          color={
            message.startsWith('Error') ? 'red.400' :
            message.startsWith('Please') ? 'gray.300' :
            'green.400'
          }
          textAlign="center"
          mb={6}
        >
          {message}
        </Text>
      </HStack>
      
      
      
    )}

    {message && message.startsWith('Please') && (
      <Box>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          isRequired
          mb="4"
        />

        <Button
          colorScheme="teal"
          width="100%"
          onClick={handleLogin}
          isLoading={loading}
          loadingText="Sending"
        >
          Send Magic Link
        </Button>
      </Box>
    )}
  </Box>
</Box>

  )
}

export default LoginPage

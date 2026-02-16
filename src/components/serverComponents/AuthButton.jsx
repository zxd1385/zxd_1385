import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Box, Button, HStack, Icon } from "@chakra-ui/react";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";

const AuthButton = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogin = () => navigate("/login");

  return session ? (
    <HStack spacing={4}>
      <Button colorScheme="teal" size="xs" onClick={goToDashboard} className='cursor-target'>
        <Icon as={FaUser}  mr={2} />
        Dashboard
      </Button>

      <Button colorScheme="red" size="xs" onClick={handleLogout} className='cursor-target'>
        <Icon as={FaSignOutAlt} mr={2} />
        Logout
      </Button>
    </HStack>
    
  ) : (
    <Button
      bg="gray.900"
      onClick={handleLogin}
      size="xs"
    >
      <Icon as={FaSignInAlt} />
      Login
    </Button>
  );
};

export default AuthButton;

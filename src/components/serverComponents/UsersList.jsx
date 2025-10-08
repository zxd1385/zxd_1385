import { useEffect, useState } from "react";
import { Box, VStack, HStack, Text, Image, Spinner, Heading, Collapsible, Link, Input } from "@chakra-ui/react";
import { supabase } from "../../lib/supabaseClient"; // adjust your import path
import LoadingScreen from "../ui/Loading";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setfilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");


  useEffect(
    () => {
      const filteredUsers = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.phone_number?.toLowerCase().includes(search.toLowerCase()) ||
          user.role?.toLowerCase().includes(search.toLowerCase())
      );
      setfilteredUsers(filteredUsers)
      
    }
  , [search])
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*"); // fetch all columns, adjust as needed

        if (error) {
          console.error("Error fetching users:", error);
        } else {
          setUsers(data);
          setfilteredUsers(data)
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <LoadingScreen type="Users" />
    );
  }

  return (
    <VStack align="stretch" spacing={4} mb={5}>
      <Heading size="md" mb={4} color="teal.200">
        {filteredUsers.length} Users
      </Heading>
      <Box mb={4}>
        <Input
          placeholder="Search users by name or phone number or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="gray.700"
          color="white"
        />
      </Box>

      {filteredUsers.map((user) => (
        
          
        <Box key={user.id} width="100%">
            <Collapsible.Root unmountOnExit >
            <Collapsible.Trigger>
            <HStack 
            key={user.id}
            borderRadius="md"
            spacing={4}
            align="center"
            width="100%"
            >
            <Image
                  src={user?.avatar_url || `https://avatar.iran.liara.run/public/boy?username=${user?.name}`}
                  size="xs"
                  name={user?.name}
                  borderWidth="2px"
                  borderColor="teal.400"
                  maxWidth="44px"
                  minHeight="44px"
                  borderRadius="50%"
                />
            <Box>
            <Text  color="gray.400">{user.name || "No username"}</Text>
            <Text fontSize="sm" color="gray.400" textAlign="left">
             details
            </Text>
            
          </Box>
            </HStack>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Box mt={2} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.600" bg="gray.900">
                <Text fontSize="sm" color="gray.100" mb={2}>Wesite: {user.website || "No website"}</Text>
                <Text fontSize="sm" color="gray.100" mb={2}>Bio: {user.bio || "No bio"}</Text>
                <Text fontSize="sm" color="gray.100" mb={2}>»Location: {user.location || "No Location"}</Text>
                <Text fontSize="sm" color="gray.100" mb={2}>Phone Number: {user.phone_number || "No Phone Number"}</Text>
                <Text fontSize="sm" color="gray.100" mb={2}>Date Of Birth: {user.date_of_birth || "No Phone Number"}</Text>
                <Text fontSize="sm" color="gray.100" mb={2}>Gender: {user.gender || "Null"}</Text>
                <Text fontSize="sm" color="gray.100" mb={2}>Role: {user.role || "Null"}</Text>
                <Text fontSize="sm" color="gray.100" mb={2}>Joined At: {user.created_at || "Null"}</Text>
                
              </Box>
            </Collapsible.Content>
            </Collapsible.Root>
        </Box>
        
      ))}
    </VStack>
  );
};

export default UsersList;

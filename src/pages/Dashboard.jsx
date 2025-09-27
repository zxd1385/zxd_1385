import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Alert, Collapsible, Box, Heading, Text, Image, Button, Input, VStack, HStack, Link } from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';
import LoadingScreen from '../components/ui/Loading';
import { LuCheck, LuPen, LuX } from "react-icons/lu"

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [pendingArticles, setPendingArticles] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar_url: '',
    bio: '',
    website: '',
    location: '',
    phone_number: '',
    date_of_birth: '',
    role: ''
  });
  

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/login'); // redirect if not logged in
        return;
      }
      setSession(session);
      fetchProfile(session.user.id);
    };

    const fetchProfile = async (userId) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error && error.code !== 'PGRST116') console.error('Error fetching profile:', error);
      
        if (data) {
          setProfile(data);
          setFormData({
            name: data.name || '',
            avatar_url: data.avatar_url || '',
            bio: data.bio || '',
            website: data.website || '',
            location: data.location || '',
            phone_number: data.phone_number || '',
            date_of_birth: data.date_of_birth || '',
            role: data.role || ''
          });
        }
      
        setLoading(false);
        setIsAdmin(data.role === 'admin');
      };
      

    fetchSession();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
  
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('publisher_id', session.user.id);
  
      if (projectsError) console.error('Error fetching projects:', projectsError);
  
      // Fetch articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('publisher_id', session.user.id);
  
      if (articlesError) console.error('Error fetching articles:', articlesError);
  
      setProjects(projectsData || []);
      setArticles(articlesData || []);
    };
  
    fetchData();
  }, [session]);
  
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!isAdmin) return;
  
      // Fetch all contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .limit(15);
  
      if (contactsError) console.error('Error fetching contacts:', contactsError);
      setContacts(contactsData || []);
  
      // Fetch all non-visible articles
      const { data: pendingArticles, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('is_visible', false);
  
      if (articlesError) console.error('Error fetching pending articles:', articlesError);
      setPendingArticles(pendingArticles || []);
  
      // Fetch all non-visible projects
      const { data: pendingProjects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('is_visible', false);
  
      if (projectsError) console.error('Error fetching pending projects:', projectsError);
      setPendingProjects(pendingProjects || []);
    };
  
    fetchAdminData();
  }, [isAdmin]);
  


  const handleSaveProfile = async () => {
    if (!session) return;
  
    const userId = session.user.id;
  
    const { data, error } = await supabase
      .from('profiles')
      .upsert([{
        id: userId,
        name: formData.name,
        avatar_url: formData.avatar_url,
        bio: formData.bio,
        website: formData.website,
        location: formData.location,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth
      }]);
  
    if (error) {
      console.error('Error saving profile:', error);
      return;
    }
  
    // Refresh profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return;
    }
  
    setProfile(profileData);
    setEditMode(false);
  };
  
  
  

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };


  const handleDeleteArticle = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
  
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) console.error('Error deleting article:', error);
    else setArticles(articles.filter(a => a.id !== id));
  };
  
  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
  
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) console.error('Error deleting project:', error);
    else setProjects(projects.filter(p => p.id !== id));
  };


  const approveArticle = async (id) => {
    if (!confirm("Are you sure you want to approve this article?")) return;
  
    const { error } = await supabase
      .from('articles')
      .update({ is_visible: true })
      .eq('id', id);
  
    if (!error) setPendingArticles(pendingArticles.filter(a => a.id !== id));
  };
  
  const approveProject = async (id) => {
    if (!confirm("Are you sure you want to approve this project?")) return;
  
    const { error } = await supabase
      .from('projects')
      .update({ is_visible: true })
      .eq('id', id);
  
    if (!error) setPendingProjects(pendingProjects.filter(p => p.id !== id));
  };
  
  

  if (loading) return <LoadingScreen />;

  return (
    <Box p={8} maxW="600px" mx="auto">
      <HStack justify="space-between" mb={4}>
        <Heading size="lg">Dashboard</Heading>
        <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
      </HStack>

      {!profile || editMode ? (
        <VStack spacing={4} align="stretch">
        <Heading size="md">{profile ? 'Edit Profile' : 'Create Profile'}</Heading>
      
        <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <Input placeholder="Avatar URL" value={formData.avatar_url} onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })} />
        <Input placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
        <Input placeholder="Website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
        <Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
        <Input placeholder="Phone Number" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
        <Input
          placeholder="Date of Birth"
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
        />
      
        <Button colorScheme="blue" onClick={handleSaveProfile}>
          {profile ? 'Update Profile' : 'Create Profile'}
        </Button>
      </VStack>
      
      ) : (
        <Box mt={6} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="gray.900"
        borderColor="gray.700"
        color="gray.100" _dark={{ bg: "gray.800" }}>
  <HStack spacing={6} align="center">
    {/* Avatar */}
    <Image
      src={profile.avatar_url || "https://via.placeholder.com/150"}
      size="xl"
      name={profile.name}
      borderWidth="2px"
      borderColor="teal.400"
      maxWidth="80px"
      minHeight="80px"
      borderRadius="50%"
    />

    {/* User Info */}
    <Box flex="1" padding={4}>
      <Heading size="md" color="teal.500">{profile.name || "Unnamed User"}</Heading>
      <Text fontSize="sm" color="gray.500" mt={1}>{profile.bio || "No bio available."}</Text>
      <HStack spacing={4} mt={2} wrap="wrap">
        {profile.website && (
          <Text fontSize="sm" color="blue.400" as="a" href={profile.website} target="_blank" rel="noopener noreferrer">
            🌐 {profile.website}
          </Text>
        )}
        {profile.location && <Text fontSize="sm">📍 {profile.location}</Text>}
        {profile.phone_number && <Text fontSize="sm">📞 {profile.phone_number}</Text>}
        {profile.date_of_birth && <Text fontSize="sm">🎂 {profile.date_of_birth}</Text>}
      </HStack>
      <Text fontSize="sm" mt={2} fontWeight="bold" color="gray.600">
        Role: <Text as="span" color="teal.500">{profile.role || "User"}</Text>
      </Text>
    </Box>
  </HStack>

  {/* Edit Button */}
  <Button
    mt={4}
    colorScheme="teal"
    size="sm"
    onClick={() => setEditMode(true)}
    _hover={{ transform: "scale(1.05)" }}
    transition="0.2s"
  >
    Edit Profile
  </Button>

  {/* Articles & Projects Section */}
  <Box mt={8}>
    <Heading size="md" mb={3} color="teal.500">Your Articles</Heading>
    {articles.length > 0 ? (
      articles.map((article) => (
        <HStack key={article.id} justify="space-between"  p={1} mb={1}>
          <Alert.Root status={article.is_visible ? "success" : "warning"}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{article.title}</Alert.Title>
                  <Alert.Description>
                  {article.is_visible 
                  ? "This article has been confirmed by admin" 
                  : "Pending article..."}
                    <HStack padding={1}>
                      <Button size="sm" onClick={() => navigate(`/edit-article/${article.id}`)}><LuPen />Edit</Button>
                      <Button size="sm" colorScheme="red" onClick={() => handleDeleteArticle(article.id)}><LuX />Decline</Button>
                    </HStack>
                  </Alert.Description>
                </Alert.Content>
          </Alert.Root>
        </HStack>
      ))
    ) : (
      <Text fontSize="sm" color="gray.500">No articles found.</Text>
    )}

    <Heading size="md" mt={6} mb={3} color="teal.500">Your Projects</Heading>
    {projects.length > 0 ? (
      projects.map((project) => (
        <HStack key={project.id} justify="space-between"  p={1} mb={1}>

          <Alert.Root status={project.is_visible ? "success" : "warning"}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{project.title}</Alert.Title>
                  <Alert.Description>
                  {project.is_visible 
                  ? "This article has been confirmed by admin" 
                  : "Pending article..."}
                    <HStack padding={1}>
                        <Button size="sm" onClick={() => navigate(`/edit-project/${project.id}`)}><LuPen />Edit</Button>
                        <Button size="sm" colorScheme="red" onClick={() => handleDeleteProject(project.id)}><LuX />Decline</Button>
                    </HStack>
                  </Alert.Description>
                </Alert.Content>
          </Alert.Root>
        </HStack>
      ))
    ) : (
      <Text fontSize="sm" color="gray.500">No projects found.</Text>
    )}
  </Box>
        </Box>

      )}

{isAdmin && (
  <Box mt={10} p={6} borderWidth="1px" borderRadius="lg" borderColor="gray.800" bg="gray.900" boxShadow="lg">
    <Heading size="lg" mb={6} color="teal.300" textAlign="center">
      Admin Panel
    </Heading>

    {/* Contacts Section */}
    <Box mb={8}>
      <Heading size="md" color="teal.200" mb={3}>Contacts</Heading>
      {contacts.length > 0 ? (
        contacts.map((c) => (
          <Box
            key={c.id}
            p={3}
            mb={2}
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.700"
            _hover={{ bg: "gray.700" }}
            transition="0.2s"
          >
            <Text fontSize="sm" color="gray.100">
              <b>{c.name}</b> • {c.email} • {c.telegram_id}  
            </Text>
            <Text fontSize="sm" color="gray.400">{c.idea}</Text>
          </Box>
        ))
      ) : (
        <Text fontSize="sm" color="gray.500">No contacts yet.</Text>
      )}
    </Box>

    {/* Pending Articles Section */}
    <Box mb={8}>
      <Heading size="md" color="teal.200" mb={3}>Pending Articles</Heading>
      {pendingArticles.length > 0 ? (
        pendingArticles.map((a) => (
          <Box
            key={a.id}
            mb={3}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.700"
            _hover={{ bg: "gray.700" }}
            transition="0.2s"
          >
            <Collapsible.Root unmountOnExit>
              <Collapsible.Trigger>
                <Text fontWeight="bold" color="teal.300" cursor="pointer">
                  {a.title} — By {a.author_name ? a.author_name : "Uknown?"}
                </Text>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Box mt={2} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.600" bg="gray.900">
                  <Text fontSize="sm" color="gray.100">{a.body}</Text>
                </Box>
              </Collapsible.Content>
            </Collapsible.Root>

            <Button
              mt={2}
              size="sm"
              colorPalette="green"
              onClick={() => approveArticle(a.id)}
              _hover={{ transform: "scale(1.05)" }}
              transition="0.2s"

            >
              <LuCheck />
              Approve
            </Button>
          </Box>
        ))
      ) : (
        <Text fontSize="sm" color="gray.500">No pending articles.</Text>
      )}
    </Box>

    {/* Pending Projects Section */}
    <Box>
      <Heading size="md" color="teal.200" mb={3}>Pending Projects</Heading>
      {pendingProjects.length > 0 ? (
        pendingProjects.map((p) => (
          <Box
            key={p.id}
            mb={3}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.700"
            _hover={{ bg: "gray.700" }}
            transition="0.2s"
          >
            <Collapsible.Root unmountOnExit>
              <Collapsible.Trigger>
                <Text fontWeight="bold" color="teal.300" cursor="pointer">
                  {p.title} — {new Date(p.created_at).toLocaleDateString()}
                </Text>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Box mt={2} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.600" bg="gray.900">
                  <Text fontSize="sm" color="gray.100" mb={2}>{p.description}</Text>
                  <HStack spacing={4}>
                    <Link href={p.image_url} color="teal.400" isExternal>Project Image</Link>
                    <Link href={p.pdf_url} color="teal.400" isExternal>Project PDF</Link>
                  </HStack>
                </Box>
              </Collapsible.Content>
            </Collapsible.Root>

            <Button
              mt={2}
              size="sm"
              colorPalette="green"
              onClick={() => approveProject(p.id)}
              _hover={{ transform: "scale(1.05)" }}
              transition="0.2s"
            >
              <LuCheck />
              Approve
            </Button>
          </Box>
        ))
      ) : (
        <Text fontSize="sm" color="gray.500">No pending projects.</Text>
      )}
    </Box>
  </Box>
)}


    </Box>
  );
};

export default Dashboard;

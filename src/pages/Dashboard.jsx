import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Alert, Collapsible, Box, Heading, Text, Image, Button, Input, VStack, HStack, Link, Select, Spinner} from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';
import LoadingScreen from '../components/ui/Loading';
import { LuCheck, LuPen, LuX } from "react-icons/lu"
import { FaGlobe, FaMapMarkerAlt, FaPhoneAlt, FaBirthdayCake } from 'react-icons/fa'; // Add the icons here
import { IoPerson } from 'react-icons/io5'; // For role icon
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [pendingArticles, setPendingArticles] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingAdminProjects, setLoadingAdminProjects] = useState(true);
  const [loadingAdminArticles, setLoadingAdminArticles] = useState(true);
  const [loadingAdminContacts, setLoadingAdminContacts] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false)
  const [approvingId, setApprovingId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [formErrors, setFormErrors] = useState({});
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


  const handleStartDateChange = (date) => setStartDate(date);
  const handleEndDateChange = (date) => setEndDate(date);

  // Filter function to check if the date is within range
  const filterByDateRange = (items, startDate, endDate) => {
    return items.filter((item) => {
      const itemDate = new Date(item.created_at); // Assuming `created_at` is the date field
      if (!startDate && !endDate) return true; // If no date range is set, show all
      if (startDate && endDate) return itemDate >= startDate && itemDate <= endDate;
      if (startDate) return itemDate >= startDate;
      if (endDate) return itemDate <= endDate;
    });
  };


  // Filtered items based on selected date range
  const filteredArticles = filterByDateRange(pendingArticles, startDate, endDate);
  const filteredProjects = filterByDateRange(pendingProjects, startDate, endDate);
  

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
          setLoadingProfile(false)
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
        setLoadingProjects(false)
      // Fetch articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('publisher_id', session.user.id);
  
      if (articlesError) console.error('Error fetching articles:', articlesError);
        setLoadingArticles(false)
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
      setLoadingAdminContacts(false)
  
      // Fetch all non-visible articles
      const { data: pendingArticles, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('is_visible', false);
  
      if (articlesError) console.error('Error fetching pending articles:', articlesError);
      setPendingArticles(pendingArticles || []);
      setLoadingAdminArticles(false)
  
      // Fetch all non-visible projects
      const { data: pendingProjects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('is_visible', false);
  
      if (projectsError) console.error('Error fetching pending projects:', projectsError);
      setPendingProjects(pendingProjects || []);
      setLoadingAdminProjects(false)
    };
  
    fetchAdminData();
  }, [isAdmin]);
  

  // Simple validation helper functions
const isValidUrl = (url) => {
  const regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\/\w\.-]*)*\/?$/;
  return regex.test(url);
};

const isValidPhoneNumber = (phoneNumber) => {
  const regex = /^[0-9+\-() ]{7,20}$/;  // Basic phone number validation (length + allowed characters)
  return regex.test(phoneNumber);
};

const isValidDateOfBirth = (dateOfBirth) => {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  return dob < today;
};

  const handleSaveProfile = async () => {
    if (!session) return;
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);  // Display errors
      return;  // Prevent form submission if errors exist
    }
    setSubmitLoading(true)
  
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
  
    setSubmitLoading(false)
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
    setApprovingId(id);
  
    const { error } = await supabase
      .from('articles')
      .update({ is_visible: true })
      .eq('id', id);
  
    if (!error) {setPendingArticles(pendingArticles.filter(a => a.id !== id)); setApprovingId(null);};
  };
  
  const approveProject = async (id) => {
    if (!confirm("Are you sure you want to approve this project?")) return;
    setApprovingId(id);
    const { error } = await supabase
      .from('projects')
      .update({ is_visible: true })
      .eq('id', id);
  
    if (!error) {setPendingProjects(pendingProjects.filter(p => p.id !== id)); setApprovingId(null);};
  };


  const validateForm = (data) => {
    const errors = {};
    // Name should not be empty
    if (!data.name.trim()) {
      errors.name = 'Name is required.';
    }
    
    // Avatar URL validation
    if (data.avatar_url && !isValidUrl(data.avatar_url)) {
      errors.avatar_url = 'Invalid URL format.';
    }

    // Bio should not exceed 500 characters (optional)
    if (data.bio && data.bio.length > 500) {
      errors.bio = 'Bio should not exceed 500 characters.';
    }

    // Website URL validation (optional)
    if (data.website && !isValidUrl(data.website)) {
      errors.website = 'Invalid website URL.';
    }

    // Phone number validation (optional)
    if (data.phone_number && !isValidPhoneNumber(data.phone_number)) {
      errors.phone_number = 'Invalid phone number format.';
    }

    // Date of birth validation (should be in the past)
    if (data.date_of_birth && !isValidDateOfBirth(data.date_of_birth)) {
      errors.date_of_birth = 'Date of birth should be in the past.';
    }

    return errors;
  };

  
  


  return (
    <Box p={8} maxW="600px" mx="auto">
      <HStack justify="space-between" mb={4}>
        <Heading size="lg" color="gray.200">Dashboard</Heading>

      </HStack>

      { loadingProfile ? (<LoadingScreen type='Profile' padd={40} />) : !profile || editMode ? (
        <VStack spacing={5} align="stretch">
        {/* Name */}
        <Text color="gray.300">Name:</Text>
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          isRequired
          variant="filled"
          color="gray.300"
          borderBottom="1px solid white"
          focusBorderColor="white.900"
          borderRadius={0}
          mb={3}
        />
        {formErrors.name && <Text color="red.500">{formErrors.name}</Text>}
  
        {/* Avatar URL */}
        <Text color="gray.300">Avatar URL:</Text>
        <Input
          placeholder="Avatar URL"
          value={formData.avatar_url}
          onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
          variant="filled"
          color="gray.300"
          borderBottom="1px solid white"
          focusBorderColor="white.900"
          borderRadius={0}
          mb={3}
        />
        {formErrors.avatar_url && <Text color="red.500">{formErrors.avatar_url}</Text>}
  
        {/* Bio */}
        <Text color="gray.300">Bio:</Text>
        <Input
          placeholder="Bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          variant="filled"
          color="gray.300"
          borderBottom="1px solid white"
          focusBorderColor="white.900"
          borderRadius={0}
          mb={3}
        />
        {formErrors.bio && <Text color="red.500">{formErrors.bio}</Text>}
  
        {/* Website */}
        <Text color="gray.300">Website:</Text>
        <Input
          placeholder="Website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          variant="filled"
          color="gray.300"
          borderBottom="1px solid white"
          focusBorderColor="white.900"
          borderRadius={0}
          mb={3}
        />
        {formErrors.website && <Text color="red.500">{formErrors.website}</Text>}
  
        {/* Location */}
        <Text color="gray.300">Location:</Text>
        <Input
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          variant="filled"
          color="gray.300"
          borderBottom="1px solid white"
          focusBorderColor="white.900"
          borderRadius={0}
          mb={3}
        />
  
        {/* Phone Number */}
        <Text color="gray.300">Phone Number:</Text>
        <Input
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          variant="filled"
          color="gray.300"
          borderBottom="1px solid white"
          focusBorderColor="white.900"
          borderRadius={0}
          mb={3}
        />
        {formErrors.phone_number && <Text color="red.500">{formErrors.phone_number}</Text>}
  
        {/* Date of Birth */}
        <Text color="gray.300">Date of Birth:</Text>
        <Input
          placeholder="Date of Birth"
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
          variant="filled"
          color="gray.300"
          borderBottom="1px solid white"
          focusBorderColor="white.900"
          borderRadius={0}
          mb={3}
        />
        {formErrors.date_of_birth && <Text color="red.500">{formErrors.date_of_birth}</Text>}
  
        {/* Save Profile Button */}
        <Button
          type="submit"
          colorScheme="teal"
          isLoading={loading}
          size="lg"
          borderRadius="lg"
          _hover={{ transform: "scale(1.03)" }}
          transition="all 0.2s ease"
          onClick={handleSaveProfile}
        >
          {profile ? 'Update Profile' : 'Create Profile'} {submitLoading && <Spinner />}
        </Button>
      </VStack>
      
      ) : (
        <Box mt={6} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="gray.900"
        borderColor="gray.700"
        color="gray.100" _dark={{ bg: "gray.800" }}>
  <VStack spacing={6} align="flex-start" justify="flex-start" w="full" padding={4}>
  {/* Avatar and Name */}
  <HStack align="center" spacing={4} w="full">
    <Image
      src={profile.avatar_url || "https://avatar.iran.liara.run/public/13"}
      size="xs"
      name={profile.name}
      borderWidth="2px"
      borderColor="teal.400"
      maxWidth="80px"
      minHeight="80px"
      borderRadius="50%"
    />
    <VStack align="flex-start" spacing={1} ml={3}>
      <Heading size="md" color="teal.500">{profile.name || "Unnamed User"}</Heading>
      <Text fontSize="sm" color="gray.500" maxWidth="300px" textAlign="left">
        {profile.bio || "No bio available."}
      </Text>
    </VStack>
  </HStack>

  {/* User Info */}
  <Box flex="1" w="full" mt={4}>
      <HStack spacing={6} wrap="wrap" mb={2} gap={4}>
        {profile.website && (
          <Text fontSize="sm" color="blue.400" as="a" href={profile.website} target="_blank" rel="noopener noreferrer">
            <HStack><FaGlobe /> {profile.website}</HStack>
          </Text>
        )}
        {profile.location && (
          <Text fontSize="sm">
            <HStack><FaMapMarkerAlt /> {profile.location}</HStack>
          </Text>
        )}
        {profile.phone_number && (
          <Text fontSize="sm">
            <HStack><FaPhoneAlt /> {profile.phone_number}</HStack>
          </Text>
        )}
        {profile.date_of_birth && (
          <Text fontSize="sm">
            <HStack><FaBirthdayCake /> {profile.date_of_birth}</HStack>
          </Text>
        )}
      </HStack>
      <Text fontSize="sm" fontWeight="bold" color="gray.600">
        <HStack>Role: <Text as="span" color="teal.500"><HStack><IoPerson /> {profile.role || "User"}</HStack></Text></HStack>
      </Text>
    </Box>
</VStack>



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

  {/* logout button */}
  <Button mt={4}
    colorScheme="teal"
    size="sm"
    onClick={() => setEditMode(true)}
    _hover={{ transform: "scale(1.05)" }}
    transition="0.2s" onClick={handleLogout}
    >Logout
    </Button>

  {/* Articles & Projects Section */}
  <Box mt={8}>
    <Heading size="md" mb={3} color="teal.500">Your Articles</Heading>
    {loadingArticles ? (<LoadingScreen type='Articles' />) : articles.length > 0 ? (
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
                      <Button size="xs" onClick={() => navigate(`/edit-article/${article.id}`)}><LuPen />Edit</Button>
                      <Button size="xs" colorScheme="red" onClick={() => handleDeleteArticle(article.id)}><LuX />Decline</Button>
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
    {loadingProjects ? (<LoadingScreen type='Projects' />) : projects.length > 0 ? (
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
                        <Button size="xs" onClick={() => navigate(`/edit-project/${project.id}`)}><LuPen />Edit</Button>
                        <Button size="xs" colorScheme="red" onClick={() => handleDeleteProject(project.id)}><LuX />Delet</Button>
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

  {/* Date Range Filter */}
  <HStack mb={6} spacing={4} justify="center">
    <DatePicker
      selected={startDate}
      onChange={handleStartDateChange}
      dateFormat="yyyy-MM-dd"
      placeholderText="Start Date"
      customInput={<Input variant="filled" color="gray.300" borderBottom="1px solid white" focusBorderColor="teal.400" />}
    />
    <DatePicker
    selected={endDate}
    onChange={handleEndDateChange}
    placeholderText='End Date'
    dateFormat="yyyy-MM-dd"
    customInput={<Input variant="filled" color="gray.300" borderBottom="1px solid white" focusBorderColor="teal.400" />}
  />
  </HStack>

  {/* Pending Articles Section */}
  {loadingAdminArticles ? (<LoadingScreen type='Articles' />) :
  (<Box mb={8}>
    <Heading size="md" color="teal.200" mb={3}>Pending Articles</Heading>
    {filteredArticles.length > 0 ? (
      filteredArticles.map((a) => (
        <Box mb={8}>
  {filteredArticles.length > 0 ? (
    filteredArticles.map((a) => (
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
              {a.title} — By {a.author_name || "Unknown?"}
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
          size="xs"
          colorScheme="green"
          onClick={() => approveArticle(a.id)}
          _hover={{ transform: "scale(1.05)" }}
          transition="0.2s"
        >
          {approvingId === a.id ? <Spinner size="xs" /> : <LuCheck />}
          Approve
        </Button>
      </Box>
    ))
  ) : (
    <Text fontSize="sm" color="gray.500">No pending articles in this date range.</Text>
  )}
</Box>
      ))
    ) : (
      <Text fontSize="sm" color="gray.500">No pending articles in this date range.</Text>
    )}
  </Box>)
  }
  

{/* Pending Projects Section */}
{loadingAdminProjects ? (<LoadingScreen type='Projects' />) :
  (<Box>
    <Heading size="md" color="teal.200" mb={3}>Pending Projects</Heading>
    {filteredProjects.length > 0 ? (
      filteredProjects.map((p) => (
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
            size="xs"
            colorScheme="green"
            onClick={() => approveProject(p.id)}
            _hover={{ transform: "scale(1.05)" }}
            transition="0.2s"
          >
            {approvingId === p.id ? <Spinner size="xs" /> : <LuCheck />}
            Approve
          </Button>
        </Box>
      ))
    ) : (
      <Text fontSize="sm" color="gray.500">No pending projects in this date range.</Text>
    )}
    </Box>)
  }
  


  <Box mt={10} p={6} borderWidth="1px" borderRadius="lg" borderColor="gray.800" bg="gray.900" boxShadow="lg">
  <Heading size="lg" mb={6} color="teal.500" textAlign="center">Contact Messages</Heading>

  {/* Contact Messages */}
  {loadingAdminContacts ? (<LoadingScreen type='Contacts' />) : contacts.length > 0 ? (
    contacts.map(c => (
      <Box key={c.id} mb={3} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.700" _hover={{ bg: "gray.700" }} transition="0.2s">
        <Collapsible.Root unmountOnExit>
          <Collapsible.Trigger>
            <Text fontWeight="bold" color="teal.300" cursor="pointer">
              {c.name} — {c.email} ({c.telegram_id})
            </Text>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <Box mt={2} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.600" bg="gray.900">
              <Text fontSize="sm" color="gray.100">{c.idea}</Text>
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>

        <Button mt={2} size="xs" colorScheme="green" onClick={() => approveContact(c.id)} _hover={{ transform: "scale(1.05)" }} transition="0.2s">
          <LuCheck /> Approve
        </Button>
      </Box>
    ))
  ) : (
    <Text fontSize="sm" color="gray.500">No contact messages in this date range.</Text>
  )}
</Box>

  
</Box>
)}


    </Box>
  );
};

export default Dashboard;

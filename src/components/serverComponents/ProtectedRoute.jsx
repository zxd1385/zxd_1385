import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'; // Your Supabase client setup
import LoadingScreen from '../ui/Loading';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/login'); // Redirect if no session or error
      } else {
        console.log(session);
        setSession(session); // Set session if it exists
      }
    };

    fetchSession();
  }, [navigate]);

  // Return loading state while checking session
  if (session === null) {
    return <LoadingScreen />; // Show loading until session check is done
  }

  return <>{children}</>;
};

export default ProtectedRoute;

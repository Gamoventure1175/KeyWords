'use client';

import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import hook to check auth state
import { useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [user] = useAuthState(auth); // Get the current user

  const handleLogout = () => {
    signOut(auth);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
    }
    router.push('/sign-in');
  };

  useEffect(() => {
    // This could be used to check or handle any state if needed
  }, []);

  return (
    <AppBar position="static" sx={{ bgcolor: '#DECDFB', height: '100px' }}>
      <Toolbar sx={{ color: 'black', bgcolor: 'transparent', height: '100%', color: '#383838' }}>
        {/* Empty Box to push the app name to the center */}
        <Box sx={{ flexGrow: 1 }} />
        
        <Typography variant="h4" component="div" sx={{ flexGrow: 0 }}>
          KeyWords
        </Typography>

        {/* Empty Box to allow app name centering */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Conditionally render the Logout Icon if user is logged in */}
        {user && (
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

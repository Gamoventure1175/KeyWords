'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { Button, Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import KeyWords from '@/components/KeyWords';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  // Redirect if the user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    } else {
      // Update sessionStorage when the user is authenticated
      sessionStorage.setItem('user', 'true');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('user'); // Clear session storage on logout
    router.push('/sign-in');
  };

  return (
    <Box
      sx={{ 
        bgcolor: '#E1EAFB',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 1,
        color: '#383838'
      }}
    >
      <Typography variant='h7'>
        Hello, {user?.email}
      </Typography>

      <Paper 
        elevation={22}
        sx={{
          my: 2,
          padding: 3,
          borderRadius: 8,
          bgcolor: '#DECDFB'
        }}
      >
        <KeyWords />
      </Paper>
    </Box>
  );
}

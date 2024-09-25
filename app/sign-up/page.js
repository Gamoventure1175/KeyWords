'use client';
import { useState, useEffect } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { TextField, IconButton, InputAdornment, Button, Box, Typography, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [user] = useAuthState(auth); // Get the current user
  const router = useRouter();

  // Redirect to the home page if already signed in
  useEffect(() => {
    if (user) {
      router.push('/'); // Redirect to home page or any other desired page
    }
  }, [user, router]);

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
      router.push('/'); // Redirect to home after successful sign up
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSignInRedirect = () => {
    router.push('/sign-in'); // Redirect to the sign-in page
  };

  return (
    <Box 
      sx={{ bgcolor: '#E1EAFB', 
      p: 2,
      height: '100vh',
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center' 
    }}
    >
      <Paper 
        elevation={12} 
        sx={{ 
          p: 4, 
          maxWidth: 400, 
          width: '100%', 
          borderRadius: 2, 
          bgcolor: '#DECDFB' 
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2,bgcolor: '#E1EAFB' }}
        />

        <TextField
          label="Password"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3,bgcolor: '#E1EAFB' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ py: 1.5, bgcolor: 'primary.main', color: 'white', mb: 2 }}
          onClick={handleSignUp}
          component={motion.button}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Sign Up
        </Button>

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ mt: 2 }}
        >
          Already have an account? 
          <Button 
            onClick={() => router.push('/sign-in')}
            sx={{ textTransform: 'none', color: 'primary.main' }}
          >
            Sign In
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;

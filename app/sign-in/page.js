'use client';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { TextField, IconButton, InputAdornment, Button, Box, Typography, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
      router.push('/');
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

  return (
    <Box 
      component='div'
      sx={{ 
        bgcolor: '#E1EAFB', 
        p: 2,
        height: '100vh',
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper 
        elevation={12} 
        sx={{ 
          p: 4, 
          maxWidth: 400, 
          width: '100%', 
          borderRadius: 2, 
          bgcolor: '#DECDFB' }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2, bgcolor: '#E1EAFB' }}
        />

        <TextField
          label="Password"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3, bgcolor: '#E1EAFB' }}
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
          sx={{ py: 1.5, bgcolor: 'primary.main', color: 'white' }}
          onClick={handleSignIn}
          component={motion.button}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Sign In
        </Button>

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ mt: 2 }}
        >
          Don't have an account? 
          <Button 
            onClick={() => router.push('/sign-up')}
            sx={{ textTransform: 'none', color: 'primary.main' }}
          >
            Sign Up
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignIn;

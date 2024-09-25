'use client';

import db from "@/utils/firestore";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from '@firebase/firestore';
import { Button, Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';

const KeyWords = () => {
  const [value, setValue] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [user] = useAuthState(auth); // Get current user

  // Real-time listener for user's keywords
  useEffect(() => {
    if (!user) return; // Don't subscribe if there's no user

    const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/keywords`), (snapshot) => {
      setKeywords(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, [user]);

  // Add keyword to Firestore
  const handleSubmit = async () => {
    if (value.trim() === "") return; // Prevent empty submissions
    try {
      await addDoc(collection(db, `users/${user.uid}/keywords`), { word: value });
      setValue(""); // Reset input field after adding
    } catch (error) {
      console.error("Error adding keyword: ", error);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(); // Call the submit function on Enter key press
    }
  };

  // Delete keyword from Firestore
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/keywords`, id));
    } catch (error) {
      console.error("Error deleting keyword: ", error);
    }
  };

  return (
    <Box sx={{ my: 3, maxWidth: '400px', color: '#383838' }}>
      {/* Input Field */}
      <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TextField
          label="Add keyword"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress} // Add the key press event handler
          sx={{ mb: 1, bgcolor: '#E1EAFB' }}
        />
        <Button variant="contained" onClick={handleSubmit} sx={{ flexBasis: 3,  }}>
          Add Keyword
        </Button>
      </Box>

      {/* Keywords Display */}
      <Box
        sx={{
          my: 2,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <AnimatePresence>
          {keywords.map((keyword) => (
            <Box
              component={motion.div}
              key={keyword.id}
              initial={{ opacity: 0, scale: 0.5 }}  // Initial state for pop-in
              animate={{ opacity: 1, scale: 1 }}     // Pop-in animation
              exit={{ opacity: 0, scale: 0.5 }}      // Exit animation
              onClick={() => handleDelete(keyword.id)} // Delete keyword on click
            >
              <Box
                sx={{
                  padding: 2,
                  m: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: '#E7A2A2',
                  color: '#383838',
                  '&:hover': {
                    backgroundColor: '#9A3A3A',
                    color: 'white',
                  },
                  transition: 'background-color 0.3s, color 0.3s', // Smooth transition on hover
                }}
              >
                <Typography>{keyword.word}</Typography>
              </Box>
            </Box>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default KeyWords;

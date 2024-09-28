'use client';

import db from "@/utils/firestore";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from '@firebase/firestore';
import { Button, Box, TextField, Typography, Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';

const KeyWords = () => {
  const [value, setValue] = useState("");
  const [description, setDescription] = useState(""); // New field for description
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null); // For showing description
  const [user] = useAuthState(auth); // Get current user

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success or error

  // Real-time listener for user's keywords
  useEffect(() => {
    if (!user) return; // Don't subscribe if there's no user

    const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/keywords`), (snapshot) => {
      setKeywords(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, [user]);

  // Show snackbar with a message and severity (success or error)
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Add keyword to Firestore
  const handleSubmit = async () => {
    if (value.trim() === "" || description.trim() === "") return; // Prevent empty submissions
    try {
      await addDoc(collection(db, `users/${user.uid}/keywords`), { 
        word: value, 
        description // Only add the keyword and description
      });
      setValue(""); // Reset input field after adding
      setDescription(""); // Reset description field after adding
      showSnackbar('Keyword added successfully!', 'success');
    } catch (error) {
      console.error("Error adding keyword: ", error);
      showSnackbar('Error adding keyword.', 'error');
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
      showSnackbar('Keyword deleted successfully!', 'success');
    } catch (error) {
      console.error("Error deleting keyword: ", error);
      showSnackbar('Error deleting keyword.', 'error');
    }
  };

  // Handle keyword click to toggle showing description
  const handleKeywordClick = (keyword) => {
    if (selectedKeyword?.id === keyword.id) {
      setSelectedKeyword(null); // Deselect if the same keyword is clicked again
    } else {
      setSelectedKeyword(keyword); // Set the clicked keyword to show description
    }
  };

  return (
    <Box sx={{ my: 3, maxWidth: '400px', color: '#383838' }}>
      {/* Input Fields */}
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
        <TextField
          label="Add description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyPress={handleKeyPress} // Add the key press event handler
          sx={{ mb: 1, bgcolor: '#E1EAFB' }}
        />
        <Button variant="contained" onClick={handleSubmit} sx={{ flexBasis: 3 }}>
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
              onClick={() => handleKeywordClick(keyword)} // Show description on click
              sx={{ cursor: 'pointer' }}
            >
              <Box
                sx={{
                  padding: 2,
                  m: 1,
                  borderRadius: 2,
                  backgroundColor: '#E7A2A2',
                  color: '#383838',
                  position: 'relative', // For positioning the delete button inside the box
                  '&:hover': {
                    backgroundColor: '#9A3A3A',
                    color: 'white',
                  },
                  transition: 'background-color 0.3s, color 0.3s', // Smooth transition on hover
                }}
              >
                <Typography>{keyword.word}</Typography>
                {selectedKeyword?.id === keyword.id && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {keyword.description}
                    </Typography>
                  </Box>
                )}
                {/* Small Delete Button */}
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(keyword.id)}
                  sx={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    minWidth: '25px',
                    minHeight: '25px',
                    padding: 0,
                    borderRadius: '50%',
                  }}
                >
                  &times;
                </Button>
              </Box>
            </Box>
          ))}
        </AnimatePresence>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default KeyWords;

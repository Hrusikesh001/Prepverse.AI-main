

import React, { useState } from 'react'; 
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField
} from '@mui/material';

const ResumeModal = ({ open, handleClose, title, setTitle, handleSubmit }) => {
  const [titleError, setTitleError] = useState(false);

  const onSubmit = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    setTitleError(false);
    handleSubmit(); 
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="resume-modal-title"
      aria-describedby="resume-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 450,
        bgcolor: '#000000', // black background
        borderRadius: '12px',
        boxShadow: 24,
        p: 4,
        color: 'white', // white text
        border: '1px solid #333' // subtle border
      }}>
        <Typography
          id="resume-modal-title"
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            color: 'white', // white heading
            textAlign: 'center',
          }}
        >
          Start Creating Your Resume
        </Typography>

        <TextField
          fullWidth
          label="Resume Title"
          variant="outlined"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError(false); 
          }}
          error={titleError}
          helperText={titleError ? "Resume title is required" : ""}
          sx={{
            input: { 
              color: 'white', // white text
            },
            label: { 
              color: '#ccc' // light gray label
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { 
                borderColor: '#555', // gray border
              },
              '&:hover fieldset': { 
                borderColor: '#888', // lighter gray on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#aaa', // light gray when focused
              },
            },
            mb: 3,
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              color: 'white', // white text
              borderColor: '#555', // gray border
              fontWeight: 'medium',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1a1a1a',
                borderColor: '#888', // lighter gray border on hover
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            sx={{
              backgroundColor: '#1a1a1a', // dark background
              color: 'white', // white text
              border: '1px solid #555', // subtle border
              fontWeight: 'medium',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#2a2a2a', // slightly lighter black on hover
                borderColor: '#888', // lighter gray border on hover
              },
            }}
          >
            Create Resume
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResumeModal;
import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import { Box } from '@mui/material';

const TeacherLoginIcon = ({ size = 24, color ='rgb(255, 255, 255)' }) => (
  <Box position="relative" display="inline-flex">
    <AccountCircleIcon 
      color="inherit" 
      sx={{ color: 'common.white', fontSize: size }}
    />
    <SchoolIcon 
      style={{ 
        position: 'absolute', 
        bottom: -4, 
        right: -4, 
        fontSize: size * 0.6,
        backgroundColor: ' #ffc107',
        borderRadius: '50%',
        padding: 2
      }} 
      color='#ffc107'
    />
  </Box>
);

export default TeacherLoginIcon;
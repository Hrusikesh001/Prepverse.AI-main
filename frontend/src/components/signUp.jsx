

import React, { useState, useRef, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  Link,
  Fade,
  CircularProgress,
  Paper,
  useMediaQuery,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import server from '../environment.js';
import { useAuth } from '../context/AuthProvider.jsx';
import { toast } from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import newImage2 from '../assets/newImage2.png';
import newImage3 from '../assets/newImage3.png';
import { ThemeContext } from '../context/ThemeContext';

// OTP Input Component
const OTPInput = ({ value, onChange, error, disabled, darkMode }) => {
  const inputsRef = useRef([]);
  
  const handleChange = (e, index) => {
    const value = e.target.value;
    
    if (/^[0-9]$/.test(value)) {
      // Update the OTP value
      const newValue = value.split('');
      onChange(newValue.join(''));
      
      // Focus next input
      if (index < 5) {
        inputsRef.current[index + 1].focus();
      }
    } else if (value === '') {
      // Handle backspace
      const newValue = value.split('');
      onChange(newValue.join(''));
      
      // Focus previous input
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      // Move to previous input on backspace
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    
    if (/^[0-9]+$/.test(pastedData)) {
      onChange(pastedData);
      
      // Focus the last input
      if (pastedData.length === 6) {
        inputsRef.current[5].focus();
      } else if (pastedData.length > 0) {
        inputsRef.current[pastedData.length - 1].focus();
      }
    }
  };

  // Split the value into individual digits
  const digits = value.split('');
  while (digits.length < 6) digits.push('');

  return (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mb: 2 }}>
      {digits.map((digit, index) => (
        <TextField
          key={index}
          inputRef={(el) => (inputsRef.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          error={error}
          disabled={disabled}
          inputProps={{
            maxLength: 1,
            style: { 
              textAlign: 'center', 
              fontSize: '1rem', 
              padding: '6px',
              color: darkMode ? 'white' : 'rgba(0, 0, 0, 0.87)',
            }
          }}
          sx={{
            width: 36,
            height: 36,
            '& .MuiOutlinedInput-root': {
              height: 36,
              borderRadius: 1,
              backgroundColor: darkMode ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.95)',
              '& fieldset': {
                borderColor: error ? 'error.main' : darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: '#ff6900',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ff6900',
              },
              '& input': {
                padding: '6px',
                color: darkMode ? 'white' : 'rgba(0, 0, 0, 0.87)',
                '&:focus': {
                  outline: 'none',
                }
              }
            }
          }}
        />
      ))}
    </Box>
  );
};

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const { authUser, setAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState(-1);
  
  // Get theme from context
  const { theme, toggleTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark';
  
  // Media queries for responsiveness
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: false,
    username: false,
    email: false,
    otp: false,
    password: false,
    confirmPassword: false
  });

  // Theme-based styles
  const containerBackground = darkMode 
    ? 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)' 
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';

  const paperBackground = darkMode 
    ? 'rgba(18, 18, 18, 0.9)' 
    : 'rgba(255, 255, 255, 0.95)';

  const textColor = darkMode ? 'white' : 'rgba(0, 0, 0, 0.87)';
  const mutedTextColor = darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.6)';
  const borderColor = darkMode ? 'rgba(255, 105, 0, 0.2)' : 'rgba(255, 105, 0, 0.3)';
  
  // Changed to match the Google button background
  const inputBackground = darkMode ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.95)';
  const inputBorderColor = darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  
  // Specific text colors for left container
  const leftContainerTextColor = darkMode ? 'black' : 'white';
  const leftContainerMutedTextColor = darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleOtpChange = (otpValue) => {
    setFormData(prev => ({
      ...prev,
      otp: otpValue
    }));
    
    if (errors.otp) {
      setErrors(prev => ({
        ...prev,
        otp: false
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
      setProfileFile(e.target.files[0]);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: true }));
      toast.error('Please enter your email first');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: true }));
      toast.error('Please enter a valid email address');
      return;
    }
    
    setSendingOtp(true);
    try {
      const { data } = await axios.post(
        `${server}/user/sendOTP`,
        { email: formData.email },
        { withCredentials: true }
      );

      if (data) {
        setOtpSent(true);
        toast.success('OTP sent successfully! Check your email.');
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      username: !formData.username,
      email: !formData.email,
      otp: !formData.otp || formData.otp.length !== 6,
      password: !formData.password,
      confirmPassword: !formData.confirmPassword || formData.password !== formData.confirmPassword
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleGoogleSignUp = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      try {
        const withGoogle = true;
        setLoading(true);

        await axios.post(
          `${server}/user/signup`,
          {code: response.code, withGoogle},
          { withCredentials: true }
        )
          .then((response) => {
            if (response.data) {
              toast.success("SignUp successful you can login now.");
            }
            console.log(response.data);
            localStorage.setItem("authUserData", JSON.stringify(response.data));
            setAuthUser(response.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error in signup page : ", err);
            setLoading(false);
            if(err.response && err.response.data){
              toast.error(err.response.data.message);
            }
          });

      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    },

    onError: (err) => {
      console.log(err);
      setLoading(false);
    },
  });

  const handleVerifyOtp = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: true }));
      return false;
    }

    if (!formData.otp || formData.otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: true }));
      toast.error('Please enter a valid 6-digit OTP');
      return false;
    }

    try {
      const { data } = await axios.post(
        `${server}/user/verifyOTP`,
        {
          email: formData.email,
          otp: formData.otp
        },
        { withCredentials: true }
      );

      if (!data.valid) {
        toast.error('Invalid OTP! Please try again.');
      }
      return data.valid;
    } catch (err) {
      console.log(err);
      toast.error('OTP verification failed!');
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      if (!formData.otp || formData.otp.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP');
      } else {
        toast.error('Please fill all required fields correctly');
      }
      return;
    }

    setLoading(true);
    const valid = await handleVerifyOtp();

    if (!valid) {
      setLoading(false);
      return;
    }

    let imageURL = "";

    if (profileFile) {
      try {
        const { data } = await axios.get(
          `${server}/getImage`,
          {},
          { withCredentials: true }
        );

        const imageFormData = new FormData();
        imageFormData.append("file", profileFile);
        imageFormData.append('api_key', data.apiKey);
        imageFormData.append('timestamp', data.timestamp);
        imageFormData.append('signature', data.signature);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`;

        const uploadRes = await axios.post(cloudinaryUrl, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageURL = uploadRes.data.secure_url;
      } catch (err) {
        console.log(err);
      }
    }

    const userInfo = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmpassword: formData.confirmPassword,
      profilePicURL: imageURL,
      otp: formData.otp,
      withGoogle : false,
    }

    if (!imageURL || imageURL.trim() === "") {
      const name = userInfo.name.trim();
      const encodedName = encodeURIComponent(name);
      imageURL = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128`;
      userInfo.profilePicURL = imageURL;
    }

    await axios.post(
      `${server}/user/signup`,
      userInfo,
      { withCredentials: true }
    )
      .then((response) => {
        if (response.data) {
          toast.success("SignUp successful! You can now login.");
        }
        console.log(response.data);
        localStorage.setItem("authUserData", JSON.stringify(response.data));
        setAuthUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error in signup page : ", err);
        setLoading(false);
        if (err.response && err.response.data) {
          toast.error(err.response.data.message || "Signup failed. Please try again.");
        } else {
          toast.error("Signup failed. Please try again.");
        }
      });
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: 'calc(100vh - 60px)',
        display: 'flex',
        padding: 0,
        background: containerBackground,
        justifyContent: 'center',
        alignItems: 'center',
        overflowX: 'hidden',
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={24}
          sx={{
            backgroundColor: paperBackground,
            borderRadius: { xs: 2, md: 4 },
            width: { xs: '100%', sm: '90%', md: '1000px' },
            height: { xs: 'auto', md: '80vh' },
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            border: `1px solid ${borderColor}`,
            overflow: 'hidden',
            position: 'relative',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Left Side - Benefits with Background Image */}
          <Box
            sx={{
              width: { xs: '100%', md: '45%' },
              padding: { xs: 3, md: 4 },
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(255,105,0,0.1) 0%, rgba(0,0,0,0.8) 100%)'
                : 'linear-gradient(135deg, rgba(255,105,0,0.1) 0%, rgba(255,255,255,0.8) 100%)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: darkMode ? `url(${newImage2})` : `url(${newImage3})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: darkMode ? 1 : 1,
                zIndex: -1,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  mb: 4,
                  textAlign: 'center',
                  color: '#ff6900',
                  textShadow: '0 2px 10px rgba(255,105,0,0.5)'
                }}
              >
              </Typography>

              <Typography 
                variant="h5" 
                component="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  mb: 3,
                  color: '#ff6900',
                  fontFamily: 'Poppins',
                  mt: -32
                }}
              >
                Why Prepverse.AI?
              </Typography>

              <Box component="ul" sx={{ pl: 2, mb: 4 }}>
                {[
                  "Access personalized quizzes across multiple domains",
                  "Explore real-world opportunities through PrepVerse.ai internships",
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8,  
                      backgroundColor: '#ff6900',
                      transform: 'rotate(45deg)', 
                      mt: 1, 
                      mr: 2,
                      flexShrink: 0
                    }} />
                    <Typography variant="body1" sx={{ 
                      color: leftContainerMutedTextColor,
                      fontFamily:'Inter'
                    }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Divider sx={{ borderColor: 'rgba(255,105,0,0.3)', mb: 2 }} />
                <Typography variant="body2" sx={{ 
                  fontStyle: 'italic', 
                  color: leftContainerMutedTextColor,
                  fontFamily:'Inter'
                }}>
                  Join Prepverse.AI — your smart preparation companion!
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: { xs: '100%', md: '55%' },
              padding: { xs: 2, sm: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              zIndex: 1,
              background: darkMode ? 'rgba(15, 15, 15, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,105,0,0.5)',
                borderRadius: '3px'
              },
              // Global focus style override
              '& input:focus': {
                outline: 'none',
              },
              '& .Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff6900 !important',
                }
              }
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                textAlign: 'center', 
                mb: 1,
                fontWeight: 700,
                fontFamily: 'Poppins',
                background: 'linear-gradient(45deg, #ff6900 30%, #ff9040 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.5rem' }
              }}
            >
              Create Account
            </Typography>

            <Typography 
              variant="body2" 
              sx={{ 
                textAlign: 'center', 
                mb: 3,
                color: mutedTextColor,
                fontFamily:'Inter',
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}
            >
              Already have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/login" 
                sx={{ 
                  color: '#ff6900', 
                  textDecoration: 'none', 
                  fontWeight: 500,
                  '&:hover': { 
                    textDecoration: 'underline',
                  }
                }}
              >
                Sign in instead
              </Link>
            </Typography>

            {/* Profile Picture Upload */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={profilePic}
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    bgcolor: 'rgba(255, 105, 0, 0.1)',
                    '& .MuiSvgIcon-root': { fontSize: { xs: 30, sm: 40 }, color: '#ff6900' },
                    border: '2px solid #ff6900',
                    boxShadow: '0 8px 25px rgba(255, 105, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(255, 105, 0, 0.5)',
                      border: '2px solid rgba(255, 105, 0, 0.8)',
                    }
                  }}
                >
                  {!profilePic && <PhotoCamera fontSize="large" />}
                </Avatar>
                <label htmlFor="profile-pic">
                  <input
                    accept="image/*"
                    id="profile-pic"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: '#ff6900',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#e55d00',
                      },
                      boxShadow: '0 3px 10px rgba(255, 105, 0, 0.4)',
                      width: { xs: 25, sm: 30 },
                      height: { xs: 25, sm: 30 }
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: { xs: 14, sm: 16 } }} />
                  </IconButton>
                </label>
              </Box>
            </Box>

            <Box sx={{ width: '100%' }}>
              {/* Full Name and Username in the same row */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 1, 
                mb: 0.5 
              }}>
                {/* Full Name Field */}
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  size="small"
                  value={formData.name}
                  onChange={handleChange}
                  margin="dense"
                  variant="outlined"
                  error={errors.name}
                  helperText={errors.name ? 'This field is required' : ''}
                  slotProps={{
                    inputLabel: {
                      sx: {
                        color: mutedTextColor,
                        '&.Mui-focused': {
                          color: '#ff6900',
                        }
                      }
                    }
                  }}
                  InputProps={{
                    style: { color: textColor, fontSize: '0.9rem' },
                    sx: {
                      '& fieldset': {
                        borderColor: inputBorderColor,
                      },
                      '&:hover fieldset': {
                        borderColor: '#ff6900',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff6900',
                        borderWidth: '2px',
                      },
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      height: 45,
                      backgroundColor: inputBackground,
                    },
                    flex: 1
                  }}
                />

                {/* Username Field */}
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  size="small"
                  value={formData.username}
                  onChange={handleChange}
                  margin="dense"
                  variant="outlined"
                  error={errors.username}
                  helperText={errors.username ? 'This field is required' : ''}
                  slotProps={{
                    inputLabel: {
                      sx: {
                        color: mutedTextColor,
                        '&.Mui-focused': {
                          color: '#ff6900',
                        }
                      }
                    }
                  }}
                  InputProps={{
                    style: { color: textColor, fontSize: '0.9rem' },
                    sx: {
                      '& fieldset': {
                        borderColor: inputBorderColor,
                      },
                      '&:hover fieldset': {
                        borderColor: '#ff6900',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff6900',
                        borderWidth: '2px',
                      },
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      height: 45,
                      backgroundColor: inputBackground,
                    },
                    flex: 1
                  }}
                />
              </Box>

              {/* Email Field */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                size="small"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="dense"
                variant="outlined"
                error={errors.email}
                helperText={errors.email ? 'This field is required' : ''}
                slotProps={{
                  inputLabel: {
                    sx: {
                      color: mutedTextColor,
                      '&.Mui-focused': {
                        color: '#ff6900',
                      }
                    }
                  }
                }}
                InputProps={{
                  style: { color: textColor, fontSize: '0.9rem' },
                  sx: {
                    '& fieldset': {
                      borderColor: inputBorderColor,
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff6900',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff6900',
                      borderWidth: '2px',
                    },
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    height: 45,
                    backgroundColor: inputBackground,
                  },
                  mb: 0.5
                }}
              />

              {/* OTP Input */}
              <Box sx={{ mt: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ 
                  textAlign: 'left', 
                  mb: 1, 
                  color: mutedTextColor,
                  fontSize: { xs: '0.75rem', sm: '0.8rem' }
                }}>
                  Enter the 6-digit OTP sent to your email
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  alignItems: { xs: 'stretch', sm: 'center' }, 
                  gap: 1, 
                  width: '100%',
                  justifyContent: 'flex-start', 
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 0.5, 
                    flex: 1,
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    {[...Array(6)].map((_, index) => (
                      <TextField
                        key={index}
                        value={formData.otp[index] || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[0-9]$/.test(value)) {
                            const newOtp = formData.otp.split('');
                            newOtp[index] = value;
                            handleOtpChange(newOtp.join(''));
                            
                            // Focus next input
                            if (index < 5) {
                              document.getElementById(`otp-${index+1}`)?.focus();
                            }
                          } else if (value === '') {
                            // Handle backspace
                            const newOtp = formData.otp.split('');
                            newOtp[index] = '';
                            handleOtpChange(newOtp.join(''));
                            
                            // Focus previous input
                            if (index > 0) {
                              document.getElementById(`otp-${index-1}`)?.focus();
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !e.target.value && index > 0) {
                            document.getElementById(`otp-${index-1}`)?.focus();
                          }
                        }}
                        onFocus={() => setFocusedOtpIndex(index)}
                        onBlur={() => setFocusedOtpIndex(-1)}
                        error={errors.otp}
                        disabled={!otpSent}
                        inputProps={{
                          maxLength: 1,
                          style: { 
                            textAlign: 'center', 
                            fontSize: '0.9rem', 
                            padding: '6px',
                            color: textColor,
                            fontWeight: 'bold'
                          },
                          id: `otp-${index}`
                        }}
                        sx={{
                          width: { xs: 40, sm: 50 },
                          height: 36,
                          '& .MuiOutlinedInput-root': {
                            height: 36,
                            borderRadius: 1,
                            backgroundColor: inputBackground,
                            '& fieldset': {
                              borderColor: focusedOtpIndex === index 
                                ? '#ff6900 !important' 
                                : (errors.otp ? 'error.main' : inputBorderColor),
                              borderWidth: focusedOtpIndex === index ? '2px' : '1px'
                            },
                            '&:hover fieldset': {
                              borderColor: '#ff6900',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#ff6900 !important',
                              borderWidth: '2px',
                            },
                            '&.Mui-disabled': {
                              backgroundColor: darkMode ? 'rgba(18, 18, 18, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                              '& fieldset': {
                                borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                              },
                              '& input': {
                                color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                              }
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                  
                  <Button
                    variant="contained"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    sx={{
                      height: '36px',
                      backgroundColor: '#ff6900',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#e55d00',
                      },
                      minWidth: { xs: '100%', sm: '100px' },
                      fontWeight: 500,
                      borderRadius: 1,
                      fontSize: '0.8rem',
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(255, 105, 0, 0.5)',
                      }
                    }}
                  >
                    {sendingOtp ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Send OTP'}
                  </Button>
                </Box>
                
                {errors.otp && (
                  <Typography variant="caption" color="error" sx={{ textAlign: 'left', display: 'block', mb: 1 }}>
                    Please enter a valid 6-digit OTP
                  </Typography>
                )}
              </Box>

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                name="password"
                size="small"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="dense"
                variant="outlined"
                error={errors.password}
                helperText={errors.password ? 'This field is required' : ''}
                slotProps={{
                    inputLabel: {
                      sx: {
                        color: mutedTextColor,
                        '&.Mui-focused': {
                          color: '#ff6900',
                        }
                      }
                    }
                  }}
                InputProps={{
                  style: { color: textColor, fontSize: '0.9rem' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: mutedTextColor, padding: '4px' }}
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    '& fieldset': {
                      borderColor: inputBorderColor,
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff6900',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff6900',
                      borderWidth: '2px',
                    },
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    height: 45,
                    backgroundColor: inputBackground,
                  },
                  mb: 0.5
                }}
              />

              {/* Confirm Password Field */}
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                size="small"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="dense"
                variant="outlined"
                error={errors.confirmPassword}
                helperText={errors.confirmPassword ?
                  (formData.password !== formData.confirmPassword ? 'Passwords do not match' : 'This field is required')
                  : ''}
                slotProps={{
                    inputLabel: {
                      sx: {
                        color: mutedTextColor,
                        '&.Mui-focused': {
                          color: '#ff6900',
                        }
                      }
                    }
                  }}
                InputProps={{
                  style: { color: textColor, fontSize: '0.9rem' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: mutedTextColor, padding: '4px' }}
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    '& fieldset': {
                      borderColor: errors.confirmPassword ? 'error.main' : inputBorderColor,
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff6900',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff6900',
                      borderWidth: '2px',
                    },
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    height: 45,
                    backgroundColor: inputBackground,
                  },
                  mb: 1
                }}
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                mb: 1,
                py: 1,
                backgroundColor: '#ff6900',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#e55d00',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(255, 105, 0, 0.4)',
                },
                '&.Mui-disabled': {
                    backgroundColor: 'rgba(255, 105, 0, 0.5)',
                },
                fontWeight: 600,
                fontSize: '0.9rem',
                borderRadius: 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255, 105, 0, 0.3)',
                height: 45
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'SIGN UP'}
            </Button>

            <Divider sx={{ my: 1, borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
              <Typography variant="body2" sx={{ 
                color: mutedTextColor, 
                px: 1, 
                fontSize: '0.8rem' 
              }}>
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                color: mutedTextColor,
                borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                boxShadow: 'none',
                transform: 'none',
                '&:hover': {
                  borderColor: '#ff6900',
                  backgroundColor: 'rgba(255, 105, 0, 0.1)',
                  color: '#ff6900',
                  boxShadow: 'none',
                  transform: 'none'
                },
                mb: 1,
                py: 0.8,
                fontWeight: 500,
                borderRadius: 1,
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                height: 45
              }}
              onClick={handleGoogleSignUp}
            >
              Sign up with Google
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}

export default SignUp;


import React, { useState, useRef, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  useMediaQuery,
  useTheme
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import server from '../environment.js';
import { useAuth } from '../context/AuthProvider.jsx';
import { LoaderIcon, toast } from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import newImage2 from '../assets/newImage2.png';
import newImage3 from '../assets/newImage3.png';
import { ThemeContext } from '../context/ThemeContext';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    otp: ['', '', '', '', '', ''],
    password: ''
  });
  const [errors, setErrors] = useState({
    email: false,
    otp: false,
    password: false
  });
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Get theme from context
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === 'dark';
  
  // Use MUI's theme breakpoints
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const otpRefs = useRef([...Array(6)].map(() => React.createRef()));

  // Theme-based styles
  const containerBackground = darkMode 
    ? '#121212' 
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';

  const paperBackground = darkMode 
    ? '#1e1e1e' 
    : 'rgba(255, 255, 255, 0.95)';

  const leftContainerBackground = darkMode 
    ? '#1a1a1a' 
    : 'rgba(255, 255, 255, 0.9)';

  const textColor = darkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)';
  const mutedTextColor = darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)';
  const hoverBorderColor = darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';

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

  const handleOtpChange = (index, value) => {
    // Only allow numbers and limit to one character
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) value = value.slice(0, 1);

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData(prev => ({
      ...prev,
      otp: newOtp
    }));

    // Auto-focus to next input
    if (value && index < 5) {
      otpRefs.current[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1].current.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...formData.otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setFormData(prev => ({
      ...prev,
      otp: newOtp
    }));

    // Focus on the last filled input
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    if (lastFilledIndex < 5) {
      otpRefs.current[lastFilledIndex + 1].current.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: true }));
      return;
    }
    
    setIsSendingOtp(true);
    
    try {
      const { data } = await axios.post(
        `${server}/user/sendOTP`,
        { email: formData.email },
        { withCredentials: true }
      );

      if (data) {
        toast.success('OTP sent successfully');
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to send OTP!');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: true }));
      return;
    }

    const otpValue = formData.otp.join('');
    if (!otpValue) {
      setErrors(prev => ({ ...prev, otp: true }));
      return;
    }

    try {
      const { data } = await axios.post(
        `${server}/user/verifyOTP`,
        {
          email: formData.email,
          otp: otpValue
        },
        { withCredentials: true }
      );

      if (!data.valid) {
      toast.error('Wrong OTP!');
      }
      return data.valid;
    } catch (err) {
      console.log(err);
      toast.error('OTP verification failed!');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      try {
        const withGoogle = true;

        await axios.post(
          `${server}/user/login`, 
          {code: response.code, withGoogle}, 
          {
            withCredentials: true,
          }
        )
          .then((response) => {
            if (response.data) {
              toast.success("User logged in successfully!");
            } else {
              toast.error("Failed to log in!");
              return;
            }

            localStorage.setItem("authUserData", JSON.stringify(response.data));
            setAuthUser(response.data);
          })
          .catch((err) => {
            console.log("Error in login: ", err);
          });
      } catch (err) {
        console.log(err);
      }
    },
    onError: (err) => console.log(err)
  });

  const validateForm = () => {
    const otpValue = formData.otp.join('');
    const newErrors = {
      email: !formData.email,
      otp: !otpValue,
      password: !formData.password
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoggingIn(true);

    try {
      const valid = await handleVerifyOtp();

      if (!valid) {
        setIsLoggingIn(false);
        return;
      }

      const userInfo = {
        email: formData.email,
        password: formData.password,
        otp: formData.otp.join(''),
        withGoogle: false,
      };

      await axios.post(`${server}/user/login`, userInfo, {
        withCredentials: true,
      })
        .then((response) => {
          if (response.data) {
            toast.success("User logged in successfully!");
          } else {
            toast.error("Failed to log in!");
            return;
          }

          localStorage.setItem("authUserData", JSON.stringify(response.data));
          setAuthUser(response.data);
        })
        .catch((err) => {
          console.log("Error in login: ", err);
          toast.error("Login failed. Please try again.");
        });
    } catch (err) {
      console.log(err);
      toast.error("An error occurred during login.");
    } finally {
      setIsLoggingIn(false);
    }
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
      {/* Main Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: { xs: '95%', sm: '90%', md: '80%' },
          maxWidth: '1000px',
          height: { xs: 'auto', md: '550px' },
          mb: { xs: 4, md: 0 },
          boxShadow: { xs: '0 4px 10px rgba(0, 0, 0, 0.2)', md: '0 10px 30px rgba(0, 0, 0, 0.3)' },
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: paperBackground,
        }}
      >
        {/* Left Container - Marketing Content - Hidden on mobile */}
        <Box
          sx={{
            flex: { xs: '0 0 0', md: '0 0 45%' },
            width: { xs: '100%', md: 'auto' },
            height: { xs: '200px', md: 'auto' },
            backgroundColor: leftContainerBackground,
            display: { xs: isSmallMobile ? 'none' : 'flex', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: { xs: 2, md: 4 },
            backgroundImage: darkMode ? `url(${newImage2})` : `url(${newImage3})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
          }}
        >
          <Box sx={{ 
            maxWidth: { xs: '300px', md: '450px' }, 
            position: 'relative', 
            zIndex: 2,
            textAlign: 'center'
          }}>
            <Typography 
              variant={isSmallMobile ? "h5" : "h4"} 
              component="h1" 
              gutterBottom 
              sx={{ 
                color: '#ff6900',
                fontWeight: 'bold',
                mb: { xs: 2, md: 4 },
                mt: { xs: 0, md: -18 }
              }}
            >
              Welcome back to Prepverse.AI
            </Typography>
            {!isSmallMobile && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)', 
                  textAlign: 'center',
                  lineHeight: 1.6,
                  fontWeight: darkMode ? 500 : 400
                }}
              >
              
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right Container - Login Form */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '0 0 55%' },
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: { xs: 2, sm: 3 },
            background: darkMode ? 'rgba(15, 15, 15, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '450px',
              padding: { xs: 2, sm: 3 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography 
              variant={isSmallMobile ? "h6" : "h5"} 
              component="h1" 
              gutterBottom 
              sx={{ 
                color: '#ff6900', 
                textAlign: 'center', 
                mb: 3,
                fontWeight: 'bold'
              }}
            >
              Login to Your Account
            </Typography>
            

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                size="small"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                error={errors.email}
                helperText={errors.email ? 'This field is required' : ''}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    color: textColor,
                    '& fieldset': {
                      borderColor: borderColor,
                    },
                    '&:hover fieldset': {
                      borderColor: hoverBorderColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff6900',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: mutedTextColor,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#ff6900',   
                  },
                  '& .MuiFormHelperText-root': {
                    color:'#ff6900'
                  }
                }}
              />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, color: mutedTextColor }}>
                  Enter OTP
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 1, sm: 2 },
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    flex: 1,
                    justifyContent: 'center'
                  }}>
                    {formData.otp.map((digit, index) => (
                      <TextField
                        key={index}
                        inputRef={otpRefs.current[index]}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        inputProps={{
                          maxLength: 1,
                          style: { 
                            textAlign: 'center', 
                            fontSize: '16px',
                            color: textColor,
                            padding: isSmallMobile ? '8px' : '12px'
                          }
                        }}
                        sx={{
                          width: isSmallMobile ? '35px' : '40px',
                          '& .MuiOutlinedInput-root': {
                            height: isSmallMobile ? '35px' : '40px',
                            width: isSmallMobile ? '35px' : '40px',
                            color: textColor,
                            '& fieldset': {
                              borderColor: borderColor,
                            },
                            '&:hover fieldset': {
                              borderColor: hoverBorderColor,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#ff6900',
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    sx={{
                      height: isSmallMobile ? '35px' : '40px',
                      minWidth: '110px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.8rem',
                      backgroundColor: '#ff6900',
                      color: '#fff',
                      mt: { xs: 1, sm: 0 },
                      '&:hover': {
                        backgroundColor: '#ff8533'
                      },
                      '&:disabled': {
                        backgroundColor: 'rgba(255, 105, 0, 0.5)'
                      }
                    }}
                  >
                    {isSendingOtp ? (
                      <LoaderIcon style={{ height: '20px', width: '20px' }} />
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </Box>
                {errors.otp && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    OTP is required
                  </Typography>
                )}
              </Box>

              <TextField
                fullWidth
                label="Password"
                name="password"
                size="small"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                error={errors.password}
                helperText={errors.password ? 'This field is required' : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"  
                        sx={{ 
                          padding: '8px',
                          color: mutedTextColor
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    color: textColor,
                    backgroundColor: 'transparent',
                    '& input': {
                      backgroundColor: 'transparent !important',
                    },
                    '& fieldset': {
                      borderColor: borderColor,
                    },
                    '&:hover fieldset': {
                      borderColor: hoverBorderColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff6900',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: mutedTextColor,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#ff6900',   
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#ff6900'
                  }
                }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoggingIn}
                sx={{
                  py: 1.2,
                  mb: 2,
                  backgroundColor: '#ff6900',
                  fontWeight: 'bold',
                  transform: 'translateY(0)',
                  transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
                  '&:hover:not(:disabled)': {
                    backgroundColor: '#ff8533',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 105, 0, 0.5)'
                  }
                }}
              >
                {isLoggingIn ? (
                  <LoaderIcon style={{ height: '20px', width: '20px' }} />
                ) : (
                  'Login'
                )}
              </Button>

              <Divider sx={{ 
                my: 2, 
                color: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                '&::before, &::after': {
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                }
              }}>
                <Typography variant="body2" sx={{ color: mutedTextColor }}>
                  or
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{ 
                  mb: 2,
                  py: 1,
                  color: textColor,
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                 '&:hover': {
                  borderColor: '#ff6900',
                  backgroundColor: 'rgba(255, 105, 0, 0.1)',
                  color: '#ff6900'
                },
                }}
              >
                Sign in with Google
              </Button>

              <Typography variant="body2" sx={{ color: mutedTextColor, textAlign: 'center' }}>
                Don't have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/signup" 
                  sx={{ 
                    color: '#ff6900',
                    '&:hover': {
                      color: '#ff8533'
                    }
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;





 
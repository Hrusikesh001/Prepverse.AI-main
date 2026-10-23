import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  User,
  Settings,
  LogOut,
  X,
  Briefcase,
  FileText,
  MessageSquare,
  LayoutDashboard
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthProvider.jsx";

// Styled components with theme support
const DrawerContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ theme, $isDark }) => ({
  width: 280,
  background: $isDark ? 'rgba(20, 20, 20, 0.98)' : 'rgba(255, 255, 255, 0.98)',
  backdropFilter: "blur(12px)",
  color: $isDark ? 'white' : '#1a1a1a',
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: $isDark 
    ? "0 0 30px rgba(0, 0, 0, 0.5)" 
    : "0 0 30px rgba(0, 0, 0, 0.1)",
}));

const MenuItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ theme, $isDark }) => ({
  borderRadius: "10px",
  margin: theme.spacing(0.5, 1.5),
  padding: theme.spacing(1, 1.5),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: $isDark 
      ? "rgba(255, 105, 0, 0.15)" 
      : "rgba(255, 105, 0, 0.08)",
    transform: "translateX(4px)",
  },
}));

const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ $isDark }) => ({
  minWidth: "36px",
  color: "#FF6900", // Always orange regardless of theme
}));

const CloseButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ theme, $isDark }) => ({
  borderRadius: "50%",   
  width: 36,             
  height: 36,            
  minWidth: "auto",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: $isDark 
    ? "rgba(255, 255, 255, 0.05)" 
    : "rgba(0, 0, 0, 0.03)",
  "&:hover": {
    backgroundColor: $isDark 
      ? "rgba(255, 255, 255, 0.1)" 
      : "rgba(0, 0, 0, 0.06)",
  },
}));


const LogoutButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ theme, $isDark }) => ({
  borderRadius: "10px",
  margin: theme.spacing(1, 1.5, 2),
  padding: theme.spacing(1, 1.5),
  transition: "all 0.2s ease",
  backgroundColor: $isDark 
    ? "rgba(244, 63, 94, 0.15)" 
    : "rgba(244, 63, 94, 0.08)",
  "&:hover": {
    backgroundColor: $isDark 
      ? "rgba(244, 63, 94, 0.25)" 
      : "rgba(244, 63, 94, 0.12)",
    transform: "translateX(4px)",
  },
}));

const Header = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ theme, $isDark }) => ({
  padding: "20px 16px 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: `1px solid ${$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
}));

const Title = styled("div", {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ $isDark }) => ({
  fontSize: "26px",
  fontWeight: "600",
  color: "#FF6900", // Always orange
}));

const Footer = styled(Box)({
  marginTop: "auto",
  padding: "16px 0",
});

const UserInfo = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ theme, $isDark }) => ({
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  borderBottom: `1px solid ${$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
}));

const Avatar = styled("div", {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ $isDark }) => ({
  width: 44,
  height: 44,
  borderRadius: "12px",
  backgroundColor: "#FF6900", // Always orange
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: "600",
  fontSize: "16px",
}));

const UserDetails = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const UserName = styled("div", {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ $isDark }) => ({
  fontSize: "15px",
  fontWeight: "600",
  color: $isDark ? "white" : "#1a1a1a",
}));

const UserEmail = styled("div", {
  shouldForwardProp: (prop) => prop !== '$isDark',
})(({ $isDark }) => ({
  fontSize: "13px",
  color: $isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
}));

export default function SwipeableTemporaryDrawer({ open, onClose, onOpen }) {
  const navigate = useNavigate();
  const { theme } = React.useContext(ThemeContext);
  const isDark = theme === "dark";
  const { authUser } = useAuth();

  const menuItems = [
    { label: "Dashboard", route: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Profile", route: "/profilePage", icon: <User size={18} /> },
    { label: "Settings", route: "/settings", icon: <Settings size={18} /> },
    { label: "My Interviews", route: "/candidate/dashboard", icon: <MessageSquare size={18} /> },
    { label: "Internships", route: "/internships", icon: <Briefcase size={18} /> },
    { label: "Resume", route: "/resume", icon: <FileText size={18} /> },
  ];

  // Sample user data - you would replace this with actual user data
  const user = {
    name: authUser.user.name,
    email: authUser.user.email,
    initial: authUser.user.name?.charAt(0).toUpperCase() || ""
  };

  const list = (
    <DrawerContainer role="presentation" $isDark={isDark}>
      <Header $isDark={isDark}>
        <Title $isDark={isDark}>Menu</Title>
        <CloseButton onClick={onClose} $isDark={isDark}>
          <X size={18} />
        </CloseButton>
      </Header>
      
      <UserInfo $isDark={isDark}>
        <Avatar $isDark={isDark}>{user.initial}</Avatar>
        <UserDetails>
          <UserName $isDark={isDark}>{user.name}</UserName>
          <UserEmail $isDark={isDark}>{user.email}</UserEmail>
        </UserDetails>
      </UserInfo>

      <Box sx={{ p: 1.5 }}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              navigate(item.route);
              onClose();
            }}
            $isDark={isDark}
          >
            <StyledListItemIcon $isDark={isDark}>{item.icon}</StyledListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ 
                fontSize: "0.9rem",
                fontWeight: 500 
              }} 
            />
          </MenuItem>
        ))}
      </Box>

      <Footer>
        <Divider sx={{ 
          bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', 
          mb: 2 
        }} />
        
        <LogoutButton 
          onClick={() => {
            navigate("/logout");
            onClose();
          }}
          $isDark={isDark}
        >
          <StyledListItemIcon $isDark={isDark}>
            <LogOut size={18} />
          </StyledListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ 
              fontWeight: 500,
              fontSize: "0.9rem"
            }}
          />
        </LogoutButton>
      </Footer>
    </DrawerContainer>
  );

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      ModalProps={{
        BackdropProps: {
          sx: { 
            backgroundColor: "transparent",
            backdropFilter: "blur(4px)",
            background: isDark 
              ? "rgba(0, 0, 0, 0.4)" 
              : "rgba(0, 0, 0, 0.1)",
          },
        },
      }}
      PaperProps={{
        sx: {
          bgcolor: "transparent",
          boxShadow: "none",
          overflow: "visible",
        },
      }}
    >
      {list}
    </SwipeableDrawer>
  );
}
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Navbar, {
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../components/ui/resizable-navbar.jsx";
import { useAuth } from "../context/AuthProvider.jsx";
import SwipeableTemporaryDrawer from "../components/drawerComponent.jsx";
import { Sun, Moon, ChevronDown, Sparkles, Target, FileText, Brain, Globe } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

export function NavbarDemo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'Hindi', 'Odia'];

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && languages.includes(savedLanguage)) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  // Placeholder setLanguage callback
  const setLanguage = (language) => {
    console.log('Language changed to:', language);
    // Add your language change logic here
  };

  const handleLanguageMenuOpen = (event) => setLanguageAnchorEl(event.currentTarget);
  const handleLanguageMenuClose = () => setLanguageAnchorEl(null);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    setLanguage(language);
    handleLanguageMenuClose();
  };

  const navItems = [
    { name: "Home", link: "/home2" },
    { name: "Find Internship", link: "/internships" },
    { name: "Interview", link: "/candidate/dashboard" },
  ];

  const features = [
    { 
      name: "Mock Interview", 
      link: "/mockInterviewLandingPage",
      icon: <Target size={18} />,
      description: "Practice with AI-powered interviews"
    },
    { 
      name: "Quiz", 
      link: "/quiz",
      icon: <Brain size={18} />,
      description: "Test your knowledge with quizzes"
    },
    { 
      name: "Resume", 
      link: "/resume",
      icon: <FileText size={18} />,
      description: "Create and analyze your resume"
    },
  ];

  const allNavFeatures = navItems.concat(features);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const toggleDrawer = (open) => (event) => {
    if (event?.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  };

  return (
    <div className="relative w-full z-50">
      <Navbar
        className={
          theme === "dark"
            ? "bg-[#141414] border-b border-[#2A2A2A]"
            : "bg-white border-b border-[#EAEAEA]"
        }
      >
        <NavBody>
          {/* Logo */}
          <Link to="/">
            <NavbarLogo theme={theme} />
          </Link>

          {/* Desktop Nav */}
          <NavItems items={navItems} theme={theme} currentPath={location.pathname} />

          {/* Right Actions */}
          <div className="flex items-center gap-3 z-50">
            {/* Language Dropdown */}
            <button
              onClick={handleLanguageMenuOpen}
              className={`px-3 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-1 ${
                theme === "dark"
                  ? "bg-[#1f2937] text-white hover:bg-[#273244] border border-[#2A2A2A]"
                  : "bg-white text-gray-800 border border-[#EAEAEA] hover:bg-gray-100"
              } ${languageAnchorEl ? "text-[#FF6900]" : ""}`}
            >
              <Globe size={16} className={languageAnchorEl ? "text-[#FF6900]" : ""} />
              {selectedLanguage}
              <ChevronDown
                size={16}
                className={`transition-transform ${languageAnchorEl ? "rotate-180 text-[#FF6900]" : ""}`}
              />
            </button>

            <Menu
              anchorEl={languageAnchorEl}
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
                  color: theme === "dark" ? "#ffffff" : "#111827",
                  border: theme === "dark" ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
                  borderRadius: "12px",
                  padding: "8px 0",
                  marginTop: "8px",
                  boxShadow: theme === "dark"
                    ? "0 10px 30px rgba(0, 0, 0, 0.4)"
                    : "0 10px 30px rgba(0, 0, 0, 0.1)",
                  minWidth: "120px",
                  overflow: "visible",
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: -6,
                    right: 14,
                    width: 12,
                    height: 12,
                    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
                    borderTop: theme === "dark" ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
                    borderLeft: theme === "dark" ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
                    transform: "rotate(45deg)",
                  }
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {languages.map((language) => (
                <MenuItem
                  key={language}
                  selected={language === selectedLanguage}
                  onClick={() => handleLanguageSelect(language)}
                  sx={{
                    padding: "10px 16px",
                    margin: "0 8px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: theme === "dark" ? "#2A2A2A" : "#F9FAFB",
                    },
                    "&.Mui-selected": {
                      backgroundColor: theme === "dark" ? "#FF6900]/20" : "#FF6900]/10",
                      color: "#FF6900",
                      "&:hover": {
                        backgroundColor: theme === "dark" ? "#FF6900]/30" : "#FF6900]/20",
                      },
                    },
                  }}
                >
                  {language}
                </MenuItem>
              ))}
            </Menu>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-colors ${
                theme === "dark"
                  ? "border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-white"
                  : "border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-white"
              }`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Features Dropdown */}
            <button
              onClick={handleMenuOpen}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-1 ${
                theme === "dark"
                  ? "bg-[#1f2937] text-white hover:bg-[#273244]"
                  : "bg-white text-gray-800 border border-[#EAEAEA] hover:bg-gray-100"
              } ${anchorEl ? "text-[#FF6900]" : ""}`}
            >
              <Sparkles size={16} className={anchorEl ? "text-[#FF6900]" : ""} />
              Features
              <ChevronDown
                size={16}
                className={`transition-transform ${anchorEl ? "rotate-180 text-[#FF6900]" : ""}`}
              />
            </button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
                  color: theme === "dark" ? "#ffffff" : "#111827",
                  border: theme === "dark" ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
                  borderRadius: "12px",
                  padding: "8px 0",
                  marginTop: "8px",
                  boxShadow: theme === "dark" 
                    ? "0 10px 30px rgba(0, 0, 0, 0.4)" 
                    : "0 10px 30px rgba(0, 0, 0, 0.1)",
                  minWidth: "280px",
                  overflow: "visible",
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: -6,
                    right: 14,
                    width: 12,
                    height: 12,
                    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
                    borderTop: theme === "dark" ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
                    borderLeft: theme === "dark" ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
                    transform: "rotate(45deg)",
                  }
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {features.map((item) => (
                <MenuItem
                  key={item.name}
                  onClick={() => {
                    handleMenuClose();
                    navigate(item.link);
                  }}
                  sx={{
                    padding: "12px 16px",
                    margin: "0 8px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: theme === "dark" ? "#2A2A2A" : "#F9FAFB",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-[#2A2A2A]" : "bg-[#FF6900]/10"}`}>
                    {React.cloneElement(item.icon, { 
                      size: 18, 
                      className: theme === "dark" ? "text-[#FF6900]" : "text-[#FF6900]" 
                    })}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                      {item.description}
                    </span>
                  </div>
                </MenuItem>
              ))}
            </Menu>

            {/* Auth */}
            {!authUser ? (
              <button
                onClick={() => navigate("/login")}
                className="border border-[#FF6900] text-[#FF6900] font-bold py-2 px-5 rounded-full hover:bg-[#FF6900] hover:text-white transition"
              >
                Login
              </button>
            ) : (
              <>
                <Avatar
                  alt="User"
                  className="bg-transparent text-white"
                  src={authUser.user?.profilePicURL}
                  sx={{ width: 44, height: 44, cursor: "pointer" }}
                  onClick={toggleDrawer(true)}
                />
                <SwipeableTemporaryDrawer
                  open={drawerOpen}
                  onClose={toggleDrawer(false)}
                  onOpen={toggleDrawer(true)}
                />
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Nav */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo theme={theme} />

            <div className="flex gap-4 items-center mr-3">
              {/* Language Dropdown for Mobile */}
              <button
                onClick={handleLanguageMenuOpen}
                className={`px-3 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-1 ${
                  theme === "dark"
                    ? "bg-[#1f2937] text-white hover:bg-[#273244] border border-[#2A2A2A]"
                    : "bg-white text-gray-800 border border-[#EAEAEA] hover:bg-gray-100"
                } ${languageAnchorEl ? "text-[#FF6900]" : ""}`}
              >
                <Globe size={16} className={languageAnchorEl ? "text-[#FF6900]" : ""} />
                {selectedLanguage}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${languageAnchorEl ? "rotate-180 text-[#FF6900]" : ""}`}
                />
              </button>

              <Menu
                anchorEl={languageAnchorEl}
                open={Boolean(languageAnchorEl)}
                onClose={handleLanguageMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
                    color: theme === "dark" ? "#ffffff" : "#111827",
                    border: theme === "dark" ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
                    borderRadius: "12px",
                    padding: "8px 0",
                    marginTop: "8px",
                    boxShadow: theme === "dark"
                      ? "0 10px 30px rgba(0, 0, 0, 0.4)"
                      : "0 10px 30px rgba(0, 0, 0, 0.1)",
                    minWidth: "120px",
                    overflow: "visible",
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: -6,
                      right: 14,
                      width: 12,
                      height: 12,
                      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
                      borderTop: theme === "dark" ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
                      borderLeft: theme === "dark" ? "1px solid #2A2A2A" : "1px solid #E5E7EB",
                      transform: "rotate(45deg)",
                    }
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {languages.map((language) => (
                  <MenuItem
                    key={language}
                    selected={language === selectedLanguage}
                    onClick={() => handleLanguageSelect(language)}
                    sx={{
                      padding: "10px 16px",
                      margin: "0 8px",
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: theme === "dark" ? "#2A2A2A" : "#F9FAFB",
                      },
                      "&.Mui-selected": {
                        backgroundColor: theme === "dark" ? "#FF6900]/20" : "#FF6900]/10",
                        color: "#FF6900",
                        "&:hover": {
                          backgroundColor: theme === "dark" ? "#FF6900]/30" : "#FF6900]/20",
                        },
                      },
                    }}
                  >
                    {language}
                  </MenuItem>
                ))}
              </Menu>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full border ${
                  theme === "dark"
                    ? "border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-white"
                    : "border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-white"
                }`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {authUser && (
                <>
                  <Avatar
                    alt="User"
                    src={authUser.user?.profilePicURL}
                    sx={{ width: 40, height: 40, cursor: "pointer" }}
                    onClick={toggleDrawer(true)}
                  />
                  <SwipeableTemporaryDrawer
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                  />
                </>
              )}

              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} theme={theme}>
            {allNavFeatures.map((item) => {
              const isActive = location.pathname === item.link;
              return (
                <a
                  key={item.name}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${
                    isActive
                      ? "text-[#FF6900] font-semibold"
                      : theme === "dark"
                      ? "text-neutral-300"
                      : "text-neutral-700"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}

            <div className="flex w-full flex-col gap-3 mt-2">
              {authUser ? (
                <NavbarButton
                  onClick={() => navigate("/logout")}
                  variant="primary"
                  className="w-full"
                >
                  Logout
                </NavbarButton>
              ) : (
                <NavbarButton
                  onClick={() => navigate("/login")}
                  variant="primary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

export default NavbarDemo;
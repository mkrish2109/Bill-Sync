import { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(prev => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isMobileOpen,
        isHovered,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setIsExpanded,
        setIsMobileOpen
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
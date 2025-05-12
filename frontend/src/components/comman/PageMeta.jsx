import { useEffect } from "react";

// Alternative PageMeta.jsx for projects
export const PageMeta = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return null;
};
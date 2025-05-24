// components/common/TechStackItem.jsx
import { motion } from "framer-motion";

const TechStackItem = ({ name, logo, delay = 0, className = "" }) => {
  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-all ${className}`}
    >
      <img 
        src={logo} 
        alt={name} 
        className="h-12 w-12 object-contain mb-3"
      />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
    </motion.div>
  );
};

export default TechStackItem;
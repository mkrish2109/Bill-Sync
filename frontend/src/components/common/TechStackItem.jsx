// components/common/TechStackItem.jsx
import { motion } from "framer-motion";

const TechStackItem = ({ name, logo, color, delay = 0, className = "" }) => {
  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center p-6 bg-background-surfaceLight dark:bg-background-surfaceDark rounded-lg
        hover:shadow-lg transition-all border border-border-light dark:border-border-dark
        hover:border-primary-light dark:hover:border-primary-light ${className}`}
    >
      <div className="p-3 rounded-lg mb-4">
        <div
          className="h-16 w-16 flex items-center justify-center"
          style={{ color }}
        >
          {logo}
        </div>
      </div>
      <span className="text-base font-medium text-text-mutedLight dark:text-text-mutedDark">
        {name}
      </span>
    </motion.div>
  );
};

export default TechStackItem;

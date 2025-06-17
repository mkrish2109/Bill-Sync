// components/common/StatItem.jsx
import { motion } from "framer-motion";

const StatItem = ({ number, label, icon, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`p-4 text-center ${className}`}
    >
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-3xl md:text-4xl font-bold mb-2 text-text-light dark:text-text-dark">
        {number}
      </div>
      <div className="text-text-light dark:text-text-dark">{label}</div>
    </motion.div>
  );
};

export default StatItem;

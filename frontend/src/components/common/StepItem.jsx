// components/common/StepItem.jsx
import { motion } from "framer-motion";

const StepItem = ({
  number,
  title,
  description,
  icon,
  delay = 0,
  className = "",
}) => {
  return (
    <motion.div
      className={`flex items-start ${className}`}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 mr-4 flex-shrink-0">
        {icon ? (
          icon
        ) : (
          <span className="text-blue-600 dark:text-blue-300 font-bold text-xl">
            {number}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
};

export default StepItem;

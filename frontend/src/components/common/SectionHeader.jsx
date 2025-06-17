import { motion } from "framer-motion";

const SectionHeader = ({
  title,
  subtitle,
  tagline,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`text-center mb-12 ${className}`}
    >
      {tagline && (
        <span className="inline-block px-3 py-1 text-sm font-semibold text-primary-light dark:text-primary-dark bg-primary-light/10 dark:bg-primary-dark/10 rounded-full mb-4">
          {tagline}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4 ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-text-secondaryLight dark:text-text-secondaryDark max-w-2xl mx-auto ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;

import { Button, Card, Avatar } from "flowbite-react";
import { 
  FaUsers, 
  FaLightbulb, 
  FaChartLine, 
  FaHandshake,
  FaGlobeAmericas,
  FaAward,
  FaUserTie,
  FaCode,
  FaLayerGroup
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const AnimatedCard = ({ icon, title, description, color, delay }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full hover:shadow-xl transition-all dark:bg-gray-800">
        <div className={`text-${color}-500 dark:text-${color}-400 text-4xl mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </Card>
    </motion.div>
  );
};

export default function AboutPage() {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-28 px-4 text-center bg-gradient-to-r from-[#44b8ff] to-[#BCFD4C] dark:from-blue-900 dark:to-green-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="white" opacity="0.2"/>
                </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
            </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            About <span className="text-yellow-300">Tex Bill</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-white mb-8"
          >
            Revolutionizing the way businesses manage transactions and workflows
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              gradientDuoTone="cyanToBlue"
              size="xl"
              className="mx-2 mb-4 group"
              onClick={() => navigate('/register')}
            >
              <span className="group-hover:scale-105 transition-transform">
                Get Started Free
              </span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Happy Customers", icon: <FaUsers className="w-8 h-8 mx-auto mb-2 text-[#44b8ff] dark:text-blue-400" /> },
              { number: "50+", label: "Countries", icon: <FaGlobeAmericas className="w-8 h-8 mx-auto mb-2 text-[#BCFD4C] dark:text-green-400" /> },
              { number: "5+", label: "Industry Awards", icon: <FaAward className="w-8 h-8 mx-auto mb-2 text-[#44b8ff] dark:text-blue-400" /> },
              { number: "24/7", label: "Support", icon: <FaHandshake className="w-8 h-8 mx-auto mb-2 text-[#BCFD4C] dark:text-green-400" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-4"
              >
                {stat.icon}
                <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 dark:text-white">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            OUR PURPOSE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Our Mission & Vision</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            To empower businesses with intuitive tools that simplify complex processes, 
            enabling growth and efficiency at every level.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaLightbulb className="text-[#BCFD4C] dark:text-green-400 mr-3" />
              Our Vision
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              To become the global standard for business transaction management, 
              recognized for our innovation, reliability, and commitment to customer success.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaChartLine className="text-[#44b8ff] dark:text-blue-400 mr-3" />
              Our Mission
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              To develop solutions that eliminate friction in business operations, 
              allowing companies to focus on what they do best while we handle the complexity.
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            OUR VALUES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8">
            What We Stand For
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatedCard
            icon={<FaUsers />}
            title="Customer Focus"
            description="We prioritize our users' needs in every decision we make."
            color="blue"
            delay={0.1}
          />
          <AnimatedCard
            icon={<FaLightbulb />}
            title="Innovation"
            description="Constantly pushing boundaries to deliver cutting-edge solutions."
            color="green"
            delay={0.2}
          />
          <AnimatedCard
            icon={<FaChartLine />}
            title="Growth"
            description="Helping businesses scale efficiently with our tools."
            color="blue"
            delay={0.3}
          />
          <AnimatedCard
            icon={<FaHandshake />}
            title="Integrity"
            description="Honest, transparent dealings with all stakeholders."
            color="green"
            delay={0.4}
          />
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              OUR TEAM
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Meet The Leadership
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The brilliant minds behind Tex Bill's success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-xl transition-shadow dark:bg-gray-700 h-full">
                  <Avatar
                    img={member.image}
                    alt={member.name}
                    rounded
                    size="xl"
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{member.name}</h3>
                  <p className="text-[#44b8ff] dark:text-blue-400 mb-2">{member.position}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-3">
                    {member.socialLinks.map((link, i) => (
                      <a 
                        key={i} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#44b8ff] dark:hover:text-blue-400 transition-colors"
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              TECHNOLOGY
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Our Tech Stack
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with cutting-edge technologies for maximum performance and reliability
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-all"
              >
                <img 
                  src={tech.logo} 
                  alt={tech.name} 
                  className="h-12 w-12 object-contain mb-3"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-[#44b8ff] to-[#BCFD4C] dark:from-blue-900 dark:to-green-900">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your business?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust Tex Bill for their transaction management needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              gradientDuoTone="cyanToBlue"
              size="xl"
              className="mx-2 mb-4 group"
              onClick={() => navigate('/register')}
            >
              <span className="group-hover:scale-105 transition-transform">
                Get Started Free
              </span>
            </Button>
            <Button
              outline
              color="light"
              size="xl"
              className="mx-2 hover:bg-white hover:text-blue-600 transition-colors"
              onClick={() => navigate('/contact')}
            >
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

const teamMembers = [
  {
    id: 1,
    name: "John Smith",
    position: "CEO & Founder",
    bio: "Visionary leader with 15+ years in tech innovation. Passionate about creating solutions that solve real business problems.",
    image: "/images/teams/team1.jpg",
    socialLinks: [
      { icon: <FaUserTie />, url: "#" },
      { icon: <FaCode />, url: "#" }
    ]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "CTO",
    bio: "Tech expert specializing in scalable architectures. Leads our engineering team with a focus on performance and security.",
    image: "/images/teams/team2.jpg",
    socialLinks: [
      { icon: <FaLayerGroup />, url: "#" },
      { icon: <FaCode />, url: "#" }
    ]
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Product Lead",
    bio: "Passionate about creating intuitive user experiences. Ensures our products meet the highest standards of usability.",
    image: "/images/teams/team3.jpg",
    socialLinks: [
      { icon: <FaUserTie />, url: "#" },
      { icon: <FaLightbulb />, url: "#" }
    ]
  }
];

const techStack = [
  { name: "React", logo: "/images/tech/react.svg" },
  { name: "Node.js", logo: "/images/tech/nodejs.svg" },
  { name: "MongoDB", logo: "/images/tech/mongodb.svg" },
  { name: "AWS", logo: "/images/tech/aws.svg" },
  { name: "Docker", logo: "/images/tech/docker.svg" },
  { name: "Kubernetes", logo: "/images/tech/kubernetes.svg" }
];
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
import { motion } from "framer-motion";
import { PageMeta } from "../components/comman/PageMeta";
import GradientHero from "../components/comman/GradientHero";
import SectionHeader from "../components/comman/SectionHeader";
import AnimatedCard from "../components/comman/AnimatedCard";
import TeamMemberCard from "../components/comman/TeamMemberCard";
import TechStackItem from "../components/comman/TechStackItem";
import StatItem from "../components/comman/StatItem";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageMeta title="About Us" />
      {/* Hero Section */}
      <GradientHero
        title="About"
        highlight="Tex Bill"
        subtitle="Revolutionizing the way businesses manage transactions and workflows"
        primaryButtonText="Get Started Free"
        primaryButtonAction={() => navigate('/register')}
        gradientFrom="from-[#44b8ff]"
        gradientTo="to-[#BCFD4C]"
        darkGradientFrom="from-blue-900"
        darkGradientTo="to-green-900"
      />

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem
              number="10K+"
              label="Happy Customers"
              icon={<FaUsers className="w-8 h-8 mx-auto mb-2 text-[#44b8ff] dark:text-blue-400" />}
            />
            <StatItem
              number="50+"
              label="Countries"
              icon={<FaGlobeAmericas className="w-8 h-8 mx-auto mb-2 text-[#BCFD4C] dark:text-green-400" />}
              delay={0.1}
            />
            <StatItem
              number="5+"
              label="Industry Awards"
              icon={<FaAward className="w-8 h-8 mx-auto mb-2 text-[#44b8ff] dark:text-blue-400" />}
              delay={0.2}
            />
            <StatItem
              number="24/7"
              label="Support"
              icon={<FaHandshake className="w-8 h-8 mx-auto mb-2 text-[#BCFD4C] dark:text-green-400" />}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <SectionHeader
          tagline="OUR PURPOSE"
          title="Our Mission & Vision"
          subtitle="To empower businesses with intuitive tools that simplify complex processes, enabling growth and efficiency at every level."
        />

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
        <SectionHeader
          tagline="OUR VALUES"
          title="What We Stand For"
        />

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
          <SectionHeader
            tagline="OUR TEAM"
            title="Meet The Leadership"
            subtitle="The brilliant minds behind Tex Bill's success"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                position={member.position}
                bio={member.bio}
                image={member.image}
                socialLinks={member.socialLinks}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tagline="TECHNOLOGY"
            title="Our Tech Stack"
            subtitle="Built with cutting-edge technologies for maximum performance and reliability"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <TechStackItem
                key={tech.name}
                name={tech.name}
                logo={tech.logo}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <GradientHero
        title="Ready to transform your business?"
        subtitle="Join thousands of businesses that trust Tex Bill for their transaction management needs."
        primaryButtonText="Get Started Free"
        primaryButtonAction={() => navigate('/register')}
        secondaryButtonText="Contact Sales"
        secondaryButtonAction={() => navigate('/contact')}
        gradientFrom="from-[#44b8ff]"
        gradientTo="to-[#BCFD4C]"
        darkGradientFrom="from-blue-900"
        darkGradientTo="to-green-900"
        className="py-20"
      />
    </div>
  );
};

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

export default AboutPage;
import { Button, Card } from "flowbite-react";
import { FaUsers, FaLightbulb, FaChartLine, FaHandshake } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
    const navigate = useNavigate();
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-[#44b8ff] to-[#BCFD4C] dark:from-blue-900 dark:to-green-900">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Tex Bill</h1>
        <p className="text-xl text-white max-w-3xl mx-auto">
          Revolutionizing the way businesses manage their transactions and workflows
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            To empower businesses with intuitive tools that simplify complex processes, 
            enabling growth and efficiency at every level.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
            <div className="text-center">
              <FaUsers className="w-12 h-12 mx-auto text-[#44b8ff] dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Customer Focus</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We prioritize our users' needs in every decision we make.
              </p>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
            <div className="text-center">
              <FaLightbulb className="w-12 h-12 mx-auto text-[#BCFD4C] dark:text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Constantly pushing boundaries to deliver cutting-edge solutions.
              </p>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
            <div className="text-center">
              <FaChartLine className="w-12 h-12 mx-auto text-[#44b8ff] dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Growth</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Helping businesses scale efficiently with our tools.
              </p>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
            <div className="text-center">
              <FaHandshake className="w-12 h-12 mx-auto text-[#BCFD4C] dark:text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Integrity</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Honest, transparent dealings with all stakeholders.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center dark:bg-gray-700">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{member.name}</h3>
                <p className="text-[#44b8ff] dark:text-blue-400 mb-2">{member.position}</p>
                <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-white dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Ready to transform your business?
        </h2>
        <Button
          gradientDuoTone="cyanToBlue"
          size="xl"
          className="mx-auto"
          onClick={() => navigate('/register')}
        >
          Get Started Today
        </Button>
      </section>
    </div>
  );
}

const teamMembers = [
  {
    id: 1,
    name: "John Smith",
    position: "CEO & Founder",
    bio: "Visionary leader with 15+ years in tech innovation.",
    image: "/images/team1.jpg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "CTO",
    bio: "Tech expert specializing in scalable architectures.",
    image: "/images/team2.jpg",
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Product Lead",
    bio: "Passionate about creating intuitive user experiences.",
    image: "/images/team3.jpg",
  },
];
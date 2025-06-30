import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Users, Heart, Award, Globe } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Brain,
      title: 'Intellectual Curiosity',
      description: 'We believe in the power of questioning, exploring, and continuous learning to expand our understanding of the world.',
    },
    {
      icon: Target,
      title: 'Quality Content',
      description: 'Every piece of content is carefully crafted, researched, and reviewed to ensure it meets our high standards.',
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Building a community of thoughtful individuals who engage in meaningful discussions and share diverse perspectives.',
    },
    {
      icon: Heart,
      title: 'Authentic Voice',
      description: 'We value genuine insights and authentic perspectives over trending topics and clickbait content.',
    },
  ];

  const achievements = [
    { 
      icon: Award, 
      title: 'Quality Recognition', 
      description: 'Featured in top industry publications for our thoughtful approach to content creation.' 
    },
    { 
      icon: Globe, 
      title: 'Global Reach', 
      description: 'Our content reaches readers across 25+ countries, fostering international dialogue.' 
    },
    { 
      icon: Users, 
      title: 'Expert Network', 
      description: 'Collaborating with 50+ subject matter experts and thought leaders worldwide.' 
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-serif text-neutral-900 mb-6">
            About Top Thought
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to elevate minds through thoughtful content that challenges perspectives, 
            inspires action, and fosters meaningful conversations about the ideas that shape our world.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-neutral-200">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-neutral-700 space-y-6">
              <p>
                Top Thought was born from a simple belief: that in our fast-paced, information-saturated world, 
                there's a growing need for content that makes us pause, think, and reflect. We saw too many 
                platforms prioritizing quick consumption over deep understanding.
              </p>
              <p>
                Founded in 2024, we set out to create a different kind of platform—one that celebrates 
                intellectual curiosity, encourages thoughtful discourse, and provides a space for ideas 
                that matter. Our team of writers, researchers, and thinkers comes from diverse backgrounds, 
                united by a shared passion for exploring complex topics with nuance and depth.
              </p>
              <p>
                Today, Top Thought serves thousands of readers worldwide who seek more than just information—they 
                seek insight, understanding, and the kind of content that sparks meaningful conversations and 
                personal growth.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{value.title}</h3>
                <p className="text-neutral-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Achievements Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="bg-black rounded-2xl p-8 lg:p-12 text-white">
            <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <achievement.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{achievement.title}</h3>
                  <p className="text-white/90 text-sm">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-neutral-50 rounded-2xl p-8 lg:p-12">
            <Globe className="w-16 h-16 text-black mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Mission</h2>
            <p className="text-lg text-neutral-700 max-w-2xl mx-auto leading-relaxed">
              To create a global community of thoughtful individuals who engage with ideas that matter, 
              fostering understanding, empathy, and positive change through the power of well-crafted content 
              and meaningful dialogue.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
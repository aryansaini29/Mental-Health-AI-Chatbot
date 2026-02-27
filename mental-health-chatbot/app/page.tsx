'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiSparkles,
  HiShieldCheck,
  HiChatBubbleLeftRight,
  HiLockClosed,
  HiHeart,
  HiFaceSmile,
  HiArrowRight,
  HiStar,
} from 'react-icons/hi2';
import ThemeToggle from '@/components/ThemeToggle';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const FEATURES = [
  {
    icon: HiChatBubbleLeftRight,
    title: '24/7 Support',
    desc: 'Always available when you need someone to talk to, day or night.',
    gradient: 'from-primary-400 to-primary-600',
  },
  {
    icon: HiFaceSmile,
    title: 'Emotion Detection',
    desc: 'Intelligent sentiment analysis to understand your emotional state.',
    gradient: 'from-secondary-400 to-secondary-500',
  },
  {
    icon: HiShieldCheck,
    title: 'Privacy Focused',
    desc: 'Your conversations stay on your device. No data leaves your browser.',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    icon: HiLockClosed,
    title: 'Secure Chat',
    desc: 'End-to-end encrypted conversations for complete peace of mind.',
    gradient: 'from-accent-300 to-accent-400',
  },
];

const STEPS = [
  { step: '01', title: 'Create Your Account', desc: 'Sign up in seconds to start your wellness journey.' },
  { step: '02', title: 'Start Chatting', desc: 'Share your thoughts with our empathetic AI companion.' },
  { step: '03', title: 'Track Progress', desc: 'Monitor your mood patterns and emotional growth over time.' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    text: "MindfulAI has been a game changer. It's like having a supportive friend available 24/7.",
    role: 'Graduate Student',
    rating: 5,
  },
  {
    name: 'James K.',
    text: 'The mood tracking feature helps me identify patterns I never noticed before.',
    role: 'Software Engineer',
    rating: 5,
  },
  {
    name: 'Priya L.',
    text: 'I feel safe sharing my thoughts knowing my data stays private and secure.',
    role: 'Healthcare Worker',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/30 dark:border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center shadow-lg">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">MindfulAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex text-sm font-medium hover:text-primary-500 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-40" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139,92,246,0.08) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100/60 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 text-sm font-medium mb-8 backdrop-blur-sm"
            >
              <HiHeart className="w-4 h-4" />
              AI-Powered Emotional Wellness
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Your AI Companion for{' '}
              <span className="bg-gradient-to-r from-primary-500 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                Emotional Support
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              A safe, private space to explore your feelings with an empathetic AI. Track your moods,
              gain insights, and build emotional resilience — all on your own terms.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/30 transition-shadow"
                >
                  Start Chatting <HiArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-primary-200 dark:border-primary-700 font-semibold text-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  Learn More
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Floating soft blobs */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-secondary-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold mb-4">
              Designed for Your{' '}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-400 bg-clip-text text-transparent">
                Well-being
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Powerful features that prioritize your mental health and privacy.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-3xl p-6 hover:shadow-xl transition-shadow group cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-primary-50/30 dark:via-primary-950/20 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-500 dark:text-gray-400">
              Three simple steps to start your wellness journey.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative text-center"
              >
                <div className="text-6xl font-black text-primary-100 dark:text-primary-900/40 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 text-primary-300 dark:text-primary-700">
                    <HiArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold mb-4">
              What People Are Saying
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="glass rounded-3xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <HiStar key={j} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4 text-gray-600 dark:text-gray-300">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-300 to-secondary-300 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 gradient-bg opacity-20" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              Join thousands who have found comfort and support through MindfulAI.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg shadow-xl shadow-primary-500/25"
              >
                Get Started Free <HiArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                  <HiSparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">MindfulAI</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your trusted AI companion for emotional wellness.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#features" className="hover:text-primary-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-primary-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200/50 dark:border-white/5 text-center text-sm text-gray-400">
            © 2026 MindfulAI. All rights reserved. Built with 💜 for mental wellness.
          </div>
        </div>
      </footer>
    </div>
  );
}

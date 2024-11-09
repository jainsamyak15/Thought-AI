import React from 'react';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'How does Thought AI work?',
    answer: 'AI Design Studio uses advanced artificial intelligence to generate professional designs based on your input. Simply describe what you want, and our AI will create unique visuals tailored to your needs.'
  },
  {
    question: 'What types of designs can I create?',
    answer: 'You can create logos, Twitter banners, and custom taglines. Our AI is trained to generate high-quality visuals suitable for various business and personal needs.'
  },
  {
    question: 'How many designs can I generate?',
    answer: 'The number of designs depends on your plan and available credits. Each generation costs a specific number of credits, and you can purchase more credits as needed.'
  },
  {
    question: 'Can I modify the generated designs?',
    answer: 'Yes, you can generate multiple variations of your design by adjusting your prompt and preferences until you get the perfect result.'
  },
  {
    question: 'Do I own the rights to the generated designs?',
    answer: 'Yes, all designs generated through Thought AI are yours to use commercially and personally without any restrictions.'
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about AI Design Studio
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-6"
            >
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
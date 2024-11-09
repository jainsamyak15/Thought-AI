import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import TShirt from '@/components/TShirt';

const TaglinePage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>AI Design Studio - Tagline Generator</title>
        <meta name="description" content="Generate catchy taglines for your brand with AI" />
      </Head>
      <TShirt/>
    </Layout>
  );
};

export default TaglinePage;
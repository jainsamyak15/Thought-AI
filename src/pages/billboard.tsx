import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Hoding from '@/components/Hoding';

const TaglinePage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Thought AI - Tagline Generator</title>
        <meta name="description" content="Generate catchy taglines for your brand with AI" />
      </Head>
      <Hoding/>
    </Layout>
  );
};

export default TaglinePage;
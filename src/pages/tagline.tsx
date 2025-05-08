import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import TaglineGenerator from '../components/TaglineGenerator';

const TaglinePage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Thought AI - Tagline Generator</title>
        <meta name="description" content="Generate catchy taglines for your brand with AI" />
      </Head>
      <TaglineGenerator />
    </Layout>
  );
};

export default TaglinePage;
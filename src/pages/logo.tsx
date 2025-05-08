import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import LogoGenerator from '../components/LogoGenerator';

const LogoPage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Thought AI - Logo Generator</title>
        <meta name="description" content="Generate unique logos for your brand with AI" />
      </Head>
      <LogoGenerator />
    </Layout>
  );
};

export default LogoPage;
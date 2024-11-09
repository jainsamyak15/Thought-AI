import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import BrandNameGenerator from '../components/BrandNameGenerator';

const BrandNamePage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>AI Design Studio - Brand Name Generator</title>
        <meta name="description" content="Generate unique brand names for your startup" />
      </Head>
      <BrandNameGenerator />
    </Layout>
  );
};

export default BrandNamePage;
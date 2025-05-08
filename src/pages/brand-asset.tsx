import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import BrandAssetGenerator from '../components/BrandAssetGenerator';

const BrandAssetPage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Thought AI - Brand Name Generator</title>
        <meta name="description" content="Generate unique brand names for your startup" />
      </Head>
      <BrandAssetGenerator />
    </Layout>
  );
};

export default BrandAssetPage;
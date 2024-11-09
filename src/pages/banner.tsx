import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import TwitterBannerGenerator from '../components/TwitterBannerGenerator';

const BannerPage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>AI Design Studio - Twitter Banner Generator</title>
        <meta name="description" content="Generate eye-catching Twitter banners with AI" />
      </Head>
      <TwitterBannerGenerator />
    </Layout>
  );
};

export default BannerPage;
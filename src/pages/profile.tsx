import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Profile from '../components/Profile';

const ProfilePage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>AI Design Studio - Profile</title>
        <meta name="description" content="View your generated designs" />
      </Head>
      <Profile />
    </Layout>
  );
};

export default ProfilePage;
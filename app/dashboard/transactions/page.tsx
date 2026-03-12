"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import DASHBOARDAdminTransactions from '@/components/DASHBOARDAdminTransactions';
import DASHBOARDClientTransactions from '@/components/DASHBOARDClientTransactions';

const TransactionsPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return user.email === 'ayush.bhujle@gmail.com' ? (
    <DASHBOARDAdminTransactions />
  ) : (
    <DASHBOARDClientTransactions />
  );
};

export default TransactionsPage;

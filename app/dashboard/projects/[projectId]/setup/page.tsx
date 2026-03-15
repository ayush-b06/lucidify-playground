"use client";

import { Suspense } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DASHBOARDClientProjectSetup from '@/components/DASHBOARDClientProjectSetup';
import { useSearchParams } from 'next/navigation';

const SetupPageInner = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return null;
    if (!userId || !projectId) return null;

    return <DASHBOARDClientProjectSetup userId={userId} projectId={projectId} />;
};

const SetupPage = () => (
    <Suspense fallback={null}>
        <SetupPageInner />
    </Suspense>
);

export default SetupPage;

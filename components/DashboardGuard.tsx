"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/signup");
            return;
        }

        const checkSetup = async () => {
            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (!docSnap.exists()) {
                router.replace("/signup/get-started");
            } else {
                setChecking(false);
            }
        };

        checkSetup();
    }, [user, loading, router]);

    if (loading || checking) return null;

    return <>{children}</>;
}

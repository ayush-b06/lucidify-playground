"use client";

import { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import DashboardAdminSideNav from './DashboardAdminSideNav';
import NotificationBell from './NotificationBell';
import { writeNotification } from '../utils/notifications';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
    id: string;
    projectName: string;
    logoAttachment?: string | null;
    paymentPlan?: number;
    paymentAmount?: number;
    paymentStatus?: string;
    weeksPaid?: number;
    paymentStartDate?: string;
    status?: number;
}

interface ClientEntry {
    userId: string;
    firstName: string;
    lastName: string;
    selectedAvatar?: string;
    projects: Project[];
}

const PLAN_LABELS: Record<number, string> = {
    1: '100% Upfront',
    2: '2-Week',
    3: '3-Week',
    4: '4-Week',
    5: '5-Week',
};

const getTotalCost = (p: Project) => {
    const plan = p.paymentPlan ?? 0;
    const amount = p.paymentAmount ?? 0;
    if (!plan || !amount) return 0;
    return plan === 1 ? amount : amount * plan;
};
const getPaid = (p: Project) => (p.weeksPaid ?? 0) * (p.paymentAmount ?? 0);
const getRemaining = (p: Project) => Math.max(0, getTotalCost(p) - getPaid(p));
const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const StatusBadge = ({ status }: { status?: string }) => {
    if (!status) return <span className="text-[11px] opacity-25 font-light italic">Not started</span>;
    const styles: Record<string, string> = {
        'On Time': 'bg-green-500/15 border-green-500/30 text-green-400',
        'Overdue': 'bg-red-500/15 border-red-500/30 text-red-400',
        'Paid': 'bg-[#725CF7]/15 border-[#725CF7]/30 text-[#a89cff]',
    };
    const cls = styles[status] ?? 'bg-white/10 border-white/10 text-white/50';
    return <span className={`text-[11px] px-[8px] py-[2px] rounded-full border font-light ${cls}`}>{status}</span>;
};

const DASHBOARDAdminTransactions = () => {
    const [clients, setClients] = useState<ClientEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingPaid, setMarkingPaid] = useState<string | null>(null); // `${userId}_${projectId}`

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const usersSnap = await getDocs(collection(db, 'users'));
                const entries: ClientEntry[] = [];

                for (const userDoc of usersSnap.docs) {
                    const userData = userDoc.data();
                    // Skip admin account
                    if (userData.email === 'ayush.bhujle@gmail.com') continue;

                    const projectsSnap = await getDocs(collection(db, 'users', userDoc.id, 'projects'));
                    const projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
                    const activeProjects = projects.filter(p => (p.paymentPlan ?? 0) > 0 && (p.paymentAmount ?? 0) > 0);

                    if (activeProjects.length > 0) {
                        entries.push({
                            userId: userDoc.id,
                            firstName: userData.firstName || 'Client',
                            lastName: userData.lastName || '',
                            selectedAvatar: userData.selectedAvatar,
                            projects: activeProjects,
                        });
                    }
                }

                setClients(entries);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleMarkPaid = async (client: ClientEntry, project: Project) => {
        const key = `${client.userId}_${project.id}`;
        const totalPayments = project.paymentPlan === 1 ? 1 : (project.paymentPlan ?? 1);
        const currentPaid = project.weeksPaid ?? 0;
        if (currentPaid >= totalPayments) return;

        setMarkingPaid(key);
        try {
            const newWeeksPaid = currentPaid + 1;
            await updateDoc(doc(db, 'users', client.userId, 'projects', project.id), {
                weeksPaid: newWeeksPaid,
                ...(newWeeksPaid >= totalPayments ? { paymentStatus: 'Paid' } : {}),
            });

            // Notify client
            const isFullyPaid = newWeeksPaid >= totalPayments;
            writeNotification(
                client.userId,
                isFullyPaid ? 'Payment complete!' : 'Payment received',
                isFullyPaid
                    ? `Your project "${project.projectName}" is fully paid. Thank you!`
                    : `Payment ${newWeeksPaid} of ${totalPayments} received for "${project.projectName}".`,
                'payment',
                project.id,
                `/dashboard/projects/${project.id}?projectId=${project.id}&userId=${client.userId}`,
            );

            // Update local state
            setClients(prev => prev.map(c =>
                c.userId === client.userId
                    ? {
                        ...c,
                        projects: c.projects.map(p =>
                            p.id === project.id
                                ? { ...p, weeksPaid: newWeeksPaid, ...(isFullyPaid ? { paymentStatus: 'Paid' } : {}) }
                                : p
                        ),
                    }
                    : c
            ));
        } catch (e) {
            console.error(e);
        } finally {
            setMarkingPaid(null);
        }
    };

    // Totals across all clients
    const allProjects = clients.flatMap(c => c.projects);
    const totalCollected = allProjects.reduce((s, p) => s + getPaid(p), 0);
    const totalOutstanding = allProjects.reduce((s, p) => s + getRemaining(p), 0);
    const activePlans = allProjects.filter(p => (p.weeksPaid ?? 0) < (p.paymentPlan === 1 ? 1 : (p.paymentPlan ?? 1))).length;

    return (
        <div className="flex flex-col xl:flex-row h-screen DashboardBackgroundGradient overflow-hidden">
            <DashboardAdminSideNav highlight="transactions" />

            <div className="flex-1 flex flex-col pt-[60px] xl:pt-0 min-h-0 overflow-hidden">
                <div className="absolute BottomGradientBorder left-0 top-[103px] w-full" />

                {/* Top Bar */}
                <div className="flex items-center justify-between px-[20px] sm:px-[50px] py-6 flex-shrink-0">
                    <div className="inline-flex items-center gap-[5px]">
                        <div className="inline-flex items-center gap-[5px] opacity-40">
                            <div className="w-[15px]">
                                <Image src="/Home Icon.png" alt="Home" layout="responsive" width={0} height={0} />
                            </div>
                            <div className="font-light text-sm hidden sm:block">Admin</div>
                        </div>
                        <div className="font-light text-sm">/ Transactions</div>
                    </div>
                    <div className="inline-flex items-center gap-3">
                        <NotificationBell />
                        <Link href="/dashboard/settings" className="hidden sm:flex w-[129px] h-[55px] items-center justify-center gap-2.5 rounded-[15px] BlackGradient ContentCardShadow">
                            <div className="font-light text-sm">Settings</div>
                            <div className="w-[30px]">
                                <Image src="/Settings Icon.png" alt="Settings" layout="responsive" width={0} height={0} />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-[20px] sm:px-[50px] pt-[30px] pb-[40px]">
                    <div className="mb-[28px]">
                        <h1 className="text-[28px] font-semibold mb-[4px]">Transactions</h1>
                        <p className="text-[14px] font-light opacity-50">Manage client payment schedules and mark payments as received.</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-[80px]">
                            <p className="opacity-30 font-light text-[14px]">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px] mb-[30px]">
                                {[
                                    { label: 'Total Collected', value: fmt(totalCollected), sub: 'across all clients', icon: '✅' },
                                    { label: 'Total Outstanding', value: fmt(totalOutstanding), sub: 'remaining to collect', icon: '⏳' },
                                    { label: 'Active Plans', value: String(activePlans), sub: `project${activePlans !== 1 ? 's' : ''} with pending payments`, icon: '📋' },
                                ].map(card => (
                                    <div key={card.label} className="BlackGradient ContentCardShadow rounded-[20px] px-[24px] py-[22px]">
                                        <div className="flex items-center gap-[8px] mb-[12px]">
                                            <span className="text-[16px]">{card.icon}</span>
                                            <p className="text-[12px] opacity-40 font-light">{card.label}</p>
                                        </div>
                                        <p className="text-[26px] font-semibold mb-[3px]">{card.value}</p>
                                        <p className="text-[11px] opacity-25 font-light">{card.sub}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Client payment list */}
                            <div className="flex items-center gap-[10px] mb-[14px]">
                                <h2 className="text-[16px] font-semibold">Client Payments</h2>
                                <span className="text-[11px] opacity-35 font-light">{clients.length} client{clients.length !== 1 ? 's' : ''}</span>
                            </div>

                            {clients.length === 0 ? (
                                <div className="BlackGradient ContentCardShadow rounded-[20px] flex flex-col items-center justify-center py-[60px] gap-[10px]">
                                    <div className="text-[32px] opacity-20">💳</div>
                                    <p className="text-[14px] opacity-35 font-light">No active payment schedules</p>
                                    <p className="text-[12px] opacity-25 font-light">Set payment amounts on project pages to see them here.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-[14px]">
                                    {clients.map(client => (
                                        <div key={client.userId} className="BlackGradient ContentCardShadow rounded-[20px] overflow-hidden">
                                            {/* Client header */}
                                            <div className="flex items-center gap-[12px] px-[24px] py-[18px] border-b border-white/5">
                                                <div className="w-[36px] h-[36px] rounded-full overflow-hidden flex-shrink-0 BlackWithLightGradient flex items-center justify-center">
                                                    {client.selectedAvatar
                                                        ? <Image src={`/${client.selectedAvatar}`} alt={client.firstName} layout="responsive" width={0} height={0} />
                                                        : <span className="text-[14px] opacity-30">👤</span>
                                                    }
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-semibold">{client.firstName} {client.lastName}</p>
                                                    <p className="text-[11px] opacity-35 font-light">{client.projects.length} project{client.projects.length !== 1 ? 's' : ''}</p>
                                                </div>
                                                <div className="ml-auto text-right">
                                                    <p className="text-[12px] opacity-35 font-light">Outstanding</p>
                                                    <p className="text-[15px] font-semibold">{fmt(client.projects.reduce((s, p) => s + getRemaining(p), 0))}</p>
                                                </div>
                                            </div>

                                            {/* Project rows */}
                                            {client.projects.map((p, i) => {
                                                const total = getTotalCost(p);
                                                const paid = getPaid(p);
                                                const remaining = getRemaining(p);
                                                const totalPayments = p.paymentPlan === 1 ? 1 : (p.paymentPlan ?? 1);
                                                const paidCount = p.weeksPaid ?? 0;
                                                const pct = totalPayments > 0 ? Math.min(100, Math.round((paidCount / totalPayments) * 100)) : 0;
                                                const isComplete = paidCount >= totalPayments && totalPayments > 0;
                                                const key = `${client.userId}_${p.id}`;
                                                const isMarking = markingPaid === key;

                                                return (
                                                    <div key={p.id} className={`px-[24px] py-[18px] ${i < client.projects.length - 1 ? 'border-b border-white/5' : ''}`}>
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[14px]">
                                                            {/* Project name + status */}
                                                            <div className="flex items-center gap-[12px] min-w-0">
                                                                <div className="w-[36px] h-[36px] rounded-[10px] overflow-hidden flex-shrink-0 BlackWithLightGradient flex items-center justify-center">
                                                                    {p.logoAttachment
                                                                        ? <img src={p.logoAttachment} alt={p.projectName} className="w-full h-full object-cover" />
                                                                        : <span className="text-[14px] opacity-25">🌐</span>
                                                                    }
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-[8px] flex-wrap mb-[2px]">
                                                                        <p className="text-[14px] font-medium truncate">{p.projectName}</p>
                                                                        <StatusBadge status={p.paymentStatus} />
                                                                    </div>
                                                                    <p className="text-[11px] opacity-30 font-light">{PLAN_LABELS[p.paymentPlan ?? 0] ?? 'Custom'} · {paidCount}/{totalPayments} paid</p>
                                                                </div>
                                                            </div>

                                                            {/* Amounts + action */}
                                                            <div className="flex items-center gap-[20px] sm:gap-[24px] flex-shrink-0">
                                                                <div className="text-center">
                                                                    <p className="text-[11px] opacity-30 font-light mb-[1px]">Per Payment</p>
                                                                    <p className="text-[14px] font-semibold">{fmt(p.paymentAmount ?? 0)}</p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-[11px] opacity-30 font-light mb-[1px]">Collected</p>
                                                                    <p className="text-[14px] font-semibold text-green-400">{fmt(paid)}</p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-[11px] opacity-30 font-light mb-[1px]">Remaining</p>
                                                                    <p className={`text-[14px] font-semibold ${remaining === 0 && total > 0 ? 'text-green-400' : ''}`}>
                                                                        {remaining === 0 && total > 0 ? 'Done ✓' : fmt(remaining)}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleMarkPaid(client, p)}
                                                                    disabled={isComplete || isMarking}
                                                                    className={`flex-shrink-0 px-[14px] py-[8px] rounded-[10px] text-[12px] font-medium transition-all whitespace-nowrap ${
                                                                        isComplete
                                                                            ? 'opacity-30 cursor-not-allowed BlackWithLightGradient ContentCardShadow'
                                                                            : 'PopupAttentionGradient PopupAttentionShadow active:scale-95 cursor-pointer'
                                                                    }`}
                                                                >
                                                                    {isMarking ? '...' : isComplete ? '✓ Paid' : 'Mark Paid'}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Progress bar */}
                                                        <div className="mt-[12px]">
                                                            <div className="w-full h-[4px] rounded-full bg-white/8 overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full transition-all duration-500"
                                                                    style={{ width: `${pct}%`, background: isComplete ? '#4ade80' : 'linear-gradient(90deg, #725CF7, #6265f0)' }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <Link
                                                            href={`/dashboard/projects/${p.id}?projectId=${p.id}&userId=${client.userId}`}
                                                            className="inline-flex items-center gap-[4px] mt-[8px] text-[11px] opacity-25 hover:opacity-55 font-light transition-opacity"
                                                        >
                                                            View project →
                                                        </Link>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DASHBOARDAdminTransactions;

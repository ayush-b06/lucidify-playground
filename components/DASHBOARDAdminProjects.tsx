import { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Link from 'next/link';
import Image from 'next/image';
import DashboardAdminSideNav from './DashboardAdminSideNav';
import DashboardTopBar from './DashboardTopBar';

interface Project {
    uid: string;
    projectName: string;
    progress?: string;
    logoAttachment?: string | null;
    logoUrl?: string | null;
    recentActivity?: string;
    dateCreated?: string;
    comments?: string;
    approval?: string;
    paymentPlan?: number;
    weeksPaid?: number;
    dueDate?: string;
    status?: number;
}

interface User {
    displayName: string;
    email: string;
    photoURL: string;
    selectedAvatar?: string;
    firstName?: string;
    lastName?: string;
}

interface UserProjects {
    userId: string;
    projects: Project[];
}

const ADMIN_EMAIL = 'ayush.bhujle@gmail.com';

const parseDate = (d?: string) => {
    if (!d || d === 'N/A') return 0;
    return new Date(d).getTime() || 0;
};

const DASHBOARDAdminProjects = () => {
    const [userProjects, setUserProjects] = useState<UserProjects[]>([]);
    const [userProfiles, setUserProfiles] = useState<{ [userId: string]: User }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllUserProjects = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const allUserProjects: UserProjects[] = [];
                const profiles: { [userId: string]: User } = {};

                for (const userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const userData = userDoc.data() as User & { email?: string; selectedAvatar?: string; firstName?: string; lastName?: string };

                    if (userData.email === ADMIN_EMAIL) continue;

                    profiles[userId] = {
                        displayName: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown',
                        email: userData.email || '',
                        photoURL: userData.photoURL,
                        selectedAvatar: userData.selectedAvatar || undefined,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                    };

                    const projectsSnapshot = await getDocs(collection(db, 'users', userId, 'projects'));
                    const projectsList: Project[] = [];
                    projectsSnapshot.forEach((projectDoc) => {
                        const d = projectDoc.data() as Project;
                        projectsList.push({
                            uid: projectDoc.id,
                            projectName: d.projectName || 'Unnamed Project',
                            progress: d.progress || '5',
                            logoAttachment: d.logoUrl || d.logoAttachment || null,
                            recentActivity: d.recentActivity || 'N/A',
                            dateCreated: d.dateCreated || 'N/A',
                            comments: d.comments || 'No new tasks',
                            approval: d.approval || 'Pending',
                            paymentPlan: d.paymentPlan || 0,
                            weeksPaid: d.weeksPaid || 0,
                            dueDate: d.dueDate || 'No deadline',
                            status: d.status || 1,
                        });
                    });

                    // Sort projects newest first
                    projectsList.sort((a, b) => parseDate(b.dateCreated) - parseDate(a.dateCreated));

                    if (projectsList.length > 0) {
                        allUserProjects.push({ userId, projects: projectsList });
                    }
                }

                // Sort clients by their most recent project
                allUserProjects.sort((a, b) =>
                    parseDate(b.projects[0]?.dateCreated) - parseDate(a.projects[0]?.dateCreated)
                );

                setUserProfiles(profiles);
                setUserProjects(allUserProjects);
            } catch (error) {
                console.error('Error fetching user projects: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllUserProjects();
    }, []);

    const handleApproval = async (userId: string, projectId: string, newStatus: 'Approved' | 'Declined') => {
        try {
            const projectRef = doc(db, 'users', userId, 'projects', projectId);
            await updateDoc(projectRef, {
                approval: newStatus,
                recentActivity: newStatus === 'Approved' ? 'Project approved by Lucidify.' : 'Project declined by Lucidify.',
            });
            window.location.reload();
        } catch (error) {
            console.error('Error updating approval status: ', error);
        }
    };

    const handleDeleteProject = async (userId: string, projectId: string) => {
        const confirmed = window.confirm('Are you sure you want to cancel this project?');
        if (!confirmed) return;
        try {
            await deleteDoc(doc(db, 'users', userId, 'projects', projectId));
            window.location.reload();
        } catch (error) {
            alert('Error deleting project');
            console.error('Error deleting project: ', error);
        }
    };

    const totalProjects = userProjects.reduce((s, u) => s + u.projects.length, 0);

    return (
        <div className="flex flex-col xl:flex-row h-screen DashboardBackgroundGradient overflow-hidden">
            <DashboardAdminSideNav highlight="projects" />

            <div className="flex-1 flex flex-col pt-[60px] xl:pt-0 min-h-0 overflow-hidden">
                <DashboardTopBar title="Projects" />

                <div className="flex-1 overflow-y-auto px-[20px] sm:px-[50px] pt-[30px] pb-[40px]">
                    {/* Page Header */}
                    <div className="mb-[28px]">
                        <h1 className="text-[28px] font-semibold mb-[4px]">Projects</h1>
                        <p className="text-[14px] font-light opacity-50">
                            {loading ? 'Loading...' : `${totalProjects} project${totalProjects !== 1 ? 's' : ''} across ${userProjects.length} client${userProjects.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-[80px]">
                            <p className="opacity-30 font-light text-[14px]">Loading...</p>
                        </div>
                    ) : userProjects.length === 0 ? (
                        <div className="BlackGradient ContentCardShadow rounded-[20px] flex flex-col items-center justify-center py-[60px] gap-[10px]">
                            <div className="text-[32px] opacity-20">📂</div>
                            <p className="text-[14px] opacity-35 font-light">No projects yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-[36px]">
                            {userProjects.map((user) => {
                                const profile = userProfiles[user.userId];
                                const displayName = profile?.firstName && profile?.lastName
                                    ? `${profile.firstName} ${profile.lastName}`
                                    : profile?.displayName || 'Unknown Client';
                                const avatarSrc = profile?.selectedAvatar
                                    ? `/${profile.selectedAvatar}`
                                    : profile?.photoURL || '/Lucidify Umbrella.png';

                                return (
                                    <div key={user.userId}>
                                        {/* Client Header */}
                                        <div className="flex items-center gap-[12px] mb-[14px]">
                                            <div className="w-[32px] h-[32px] rounded-full overflow-hidden flex-shrink-0">
                                                <Image src={avatarSrc} alt={displayName} layout="responsive" width={0} height={0} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-[8px]">
                                                    <span className="text-[15px] font-semibold">{displayName}</span>
                                                    <span className="text-[11px] opacity-35 font-light">{user.projects.length} project{user.projects.length !== 1 ? 's' : ''}</span>
                                                </div>
                                                <p className="text-[12px] opacity-35 font-light">{profile?.email}</p>
                                            </div>
                                        </div>

                                        {/* Projects Grid */}
                                        <div className="flex flex-wrap gap-[16px]">
                                            {user.projects.map((project) => (
                                                <div
                                                    key={project.uid}
                                                    className={`${project.approval !== 'Approved' ? 'pointer-events-none' : ''} relative w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] px-[24px] py-[20px] BlackGradient ContentCardShadow rounded-[10px] flex flex-col gap-4`}
                                                >
                                                    {/* Top Section: Title and Logo */}
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex flex-col min-w-0 pr-2">
                                                            <h3 className="text-[15px] font-semibold truncate">{project.projectName}</h3>
                                                            <p className="text-[11px] text-white opacity-50 mt-[2px]">Created: {project.dateCreated}</p>
                                                            <p className="text-[11px] text-white opacity-50">Due: {project.dueDate}</p>
                                                        </div>
                                                        {project.logoAttachment && (
                                                            <div className="w-[40px] flex-shrink-0">
                                                                <Image src={project.logoAttachment} alt={project.projectName} layout="responsive" width={0} height={0} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Status and Progress */}
                                                    <div className="flex flex-col gap-[10px]">
                                                        <div className="flex justify-between items-center">
                                                            {/* Status dots */}
                                                            <div className="relative font-normal text-[14px]">
                                                                {project.status === 1 && (
                                                                    <div className="flex gap-[8px] items-center">
                                                                        <div className="flex gap-[3px]">
                                                                            <div className="rounded-full bg-[#ADA0FF] w-[5px] h-[5px]" />
                                                                            <div className="opacity-40 rounded-full bg-[#ADA0FF] w-[5px] h-[5px]" />
                                                                            <div className="opacity-40 rounded-full bg-[#ADA0FF] w-[5px] h-[5px]" />
                                                                            <div className="opacity-40 rounded-full bg-[#ADA0FF] w-[5px] h-[5px]" />
                                                                        </div>
                                                                        <h3 className="text-[#ADA0FF]">Planning</h3>
                                                                    </div>
                                                                )}
                                                                {project.status === 2 && (
                                                                    <div className="flex gap-[8px] items-center">
                                                                        <div className="flex gap-[3px]">
                                                                            <div className="rounded-full bg-[#FFD563] w-[5px] h-[5px]" />
                                                                            <div className="rounded-full bg-[#FFD563] w-[5px] h-[5px]" />
                                                                            <div className="opacity-40 rounded-full bg-[#FFD563] w-[5px] h-[5px]" />
                                                                            <div className="opacity-40 rounded-full bg-[#FFD563] w-[5px] h-[5px]" />
                                                                        </div>
                                                                        <h3 className="text-[#FFD563]">Designing</h3>
                                                                    </div>
                                                                )}
                                                                {project.status === 3 && (
                                                                    <div className="flex gap-[8px] items-center">
                                                                        <div className="flex gap-[3px]">
                                                                            <div className="rounded-full bg-[#467CD9] w-[5px] h-[5px]" />
                                                                            <div className="rounded-full bg-[#467CD9] w-[5px] h-[5px]" />
                                                                            <div className="rounded-full bg-[#467CD9] w-[5px] h-[5px]" />
                                                                            <div className="opacity-40 rounded-full bg-[#467CD9] w-[5px] h-[5px]" />
                                                                        </div>
                                                                        <h3 className="text-[#6294E9]">Developing</h3>
                                                                    </div>
                                                                )}
                                                                {project.status === 4 && (
                                                                    <div className="flex gap-[8px] items-center">
                                                                        <div className="flex gap-[3px]">
                                                                            <div className="rounded-full bg-[#46D999] w-[5px] h-[5px]" />
                                                                            <div className="rounded-full bg-[#46D999] w-[5px] h-[5px]" />
                                                                            <div className="rounded-full bg-[#46D999] w-[5px] h-[5px]" />
                                                                            <div className="rounded-full bg-[#46D999] w-[5px] h-[5px]" />
                                                                        </div>
                                                                        <h3 className="text-[#62E98F]">Launching</h3>
                                                                    </div>
                                                                )}
                                                                {project.status === 5 && (
                                                                    <div className="flex gap-[8px] items-center">
                                                                        <h3 className="text-[#6294E9]">Maintaining</h3>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="flex flex-col items-end gap-[6px]">
                                                            <div className="w-full h-[9px] bg-[#333741] rounded-full ContentCardLightShadow">
                                                                <div
                                                                    className={`h-[9px] ContentCardLightShadow rounded-full ${project.status === 1 ? 'bg-[#ADA0FF]' :
                                                                        project.status === 2 ? 'bg-[#FFD563]' :
                                                                            project.status === 3 ? 'bg-[#467CD9]' :
                                                                                project.status === 4 ? 'bg-[#46D999]' :
                                                                                    project.status === 5 ? 'bg-[#6294E9]' :
                                                                                        'bg-[#ADA0FF]'
                                                                        }`}
                                                                    style={{ width: `${project.progress}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-[13px]">{project.progress}%</p>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    {project.approval === 'Pending' ? (
                                                        <div className="pointer-events-auto flex justify-between items-center">
                                                            <button
                                                                className="button-86 button-approve hover:cursor-pointer pointer-events-auto" role="button"
                                                                onClick={() => handleApproval(user.userId, project.uid, 'Approved')}>
                                                                Approve
                                                            </button>
                                                            <button
                                                                className="button-86 button-decline hover:cursor-pointer pointer-events-auto" role="button"
                                                                onClick={() => handleApproval(user.userId, project.uid, 'Declined')}>
                                                                Decline
                                                            </button>
                                                        </div>
                                                    ) : project.approval === 'Declined' ? (
                                                        <div className="pointer-events-auto flex justify-between items-center">
                                                            <button
                                                                className="button-86 button-override hover:cursor-pointer pointer-events-auto" role="button"
                                                                onClick={() => handleApproval(user.userId, project.uid, 'Approved')}>
                                                                Reapprove
                                                            </button>
                                                            <div className="body">
                                                                <div className="container container2">
                                                                    <div className="btn" style={{ width: '100px', height: '40px' }}>
                                                                        <a className="hover:cursor-pointer" onClick={() => handleDeleteProject(user.userId, project.uid)}>Delete</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : project.approval === 'Approved' ? (
                                                        <div className="flex justify-between items-center">
                                                            <div className="body">
                                                                <div className="container container1">
                                                                    <div className="btn" style={{ width: '140px', height: '40px' }}>
                                                                        <a href={`/dashboard/projects/${project.uid}?projectId=${project.uid}&userId=${user.userId}`}>
                                                                            View Project
                                                                            <div className="-rotate-45 w-[12px] ml-[4px] rounded-full pointer-events-auto overflow-clip">
                                                                                <Image src="/White Top Right Arrow.png" alt="Right Arrow" layout="responsive" width={0} height={0} />
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="body">
                                                                <div className="container container2">
                                                                    <div className="btn" style={{ width: '100px', height: '40px' }}>
                                                                        <a className="hover:cursor-pointer" onClick={() => handleDeleteProject(user.userId, project.uid)}>Delete</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DASHBOARDAdminProjects;

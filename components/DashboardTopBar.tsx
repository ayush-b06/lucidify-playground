"use client";

import Image from 'next/image';
import Link from 'next/link';
import NotificationBell from './NotificationBell';

interface DashboardTopBarProps {
    title: string;
}

const DashboardTopBar = ({ title }: DashboardTopBarProps) => {
    return (
        <>
            <div className="absolute BottomGradientBorder left-0 top-[103px] w-full" />
            <div className="flex items-center justify-between px-[20px] sm:px-[50px] py-6 flex-shrink-0">
                <div className="hidden xl:block font-semibold text-[15px]">{title}</div>
                <div className="inline-flex items-center gap-3">
                    <span className="hidden xl:block"><NotificationBell /></span>
                    <Link href="/dashboard/settings" className="hidden sm:flex w-[129px] h-[55px] items-center justify-center gap-2.5 rounded-[15px] BlackGradient ContentCardShadow">
                        <div className="font-light text-sm">Settings</div>
                        <div className="w-[30px]">
                            <Image src="/Settings Icon.png" alt="Settings" layout="responsive" width={0} height={0} />
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default DashboardTopBar;

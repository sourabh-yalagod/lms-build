'use client';
import AppSideBar from '@/components/AppSideBar';
import DashboardNavbar from '@/components/DashboardNavBar';
import Loading from '@/components/Loading';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ChaptersSidebar from './user/courses/[courseId]/ChaptersSidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const [courseId, setCourseId] = useState('');
  const { user, isLoaded } = useUser();
  const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
    pathName
  );
  useEffect(() => {
    if (isCoursePage) {
      const match = pathName.match(/\/user\/courses\/([^\/]+)/);
      setCourseId(match ? match[1] : '');
    } else {
      setCourseId('');
    }
  }, []);

  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please Sign In</div>;

  return (
    <SidebarProvider>
      <AppSideBar />
      <div className="dashboard">
        <div className="dashboard__content">
          <ChaptersSidebar />
          <main className="dashboard__body">
            <DashboardNavbar isProfilePage={isCoursePage} />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

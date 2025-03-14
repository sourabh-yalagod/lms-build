'use client';

import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/nextjs';
import { Bell, BookOpen, Menu } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { SidebarTrigger } from './ui/sidebar';
import { dark } from '@clerk/themes';

const DashboardNavbar = ({ isProfilePage = false }: { isProfilePage: boolean }) => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as 'student' | 'teacher';
  console.log('🚀 ~ DashboardNavbar ~ userRole:', userRole);

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar__container">
        <div className="dashboard-navbar__search">
          <div className="md:hidden">
            <SidebarTrigger className="dashboard-navbar__sidebar-trigger">
              {/* <Menu /> */}
            </SidebarTrigger>
          </div>

          <div className="flex items-center">
            <div className="relative group">
              <Link href="/search" className="nondashboard-navbar__search-input" scroll={false}>
                <span className="hidden sm:inline">Search Courses</span>
                <span className="sm:hidden">Search</span>
              </Link>
              <BookOpen className="nondashboard-navbar__search-icon" size={18} />
            </div>
          </div>
        </div>
        <div className="nondashboard-navbar__actions">
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"></span>
            <Bell className="nondashboard-navbar__notification-icon" />
          </button>
          <SignedIn>
            <UserButton
              showName
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonBox: 'border-2 border-gray-400 p-[6px] outline-none rounded-2xl',
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;

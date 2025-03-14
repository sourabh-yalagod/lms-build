import Footer from '@/components/Footer';
import NonDashboardNavbar from '@/components/NonDashboardNavBar';
import React from 'react';

const NonDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar />
      <main className="nondashboard-layout__main">{children}</main>
      <Footer />
    </div>
  );
};
export default NonDashboardLayout;

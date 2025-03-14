import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__main">{children}</div>
    </div>
  );
};

export default layout;

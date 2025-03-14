import Header from '@/components/Headers';
import { UserProfile } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import React from 'react';

const TeacherProfile = () => {
  return (
    <div>
      <Header title="Profile" subtitle="View your profile" />
      <UserProfile
        path="teacher/profile"
        routing={'path'}
        appearance={{
          baseTheme: dark,
          elements: {
            scrollBox: 'bg-customgreys-darkGrey',
            navbar: {
              '& > div:nth-child(1)': {
                background: 'none',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default TeacherProfile;

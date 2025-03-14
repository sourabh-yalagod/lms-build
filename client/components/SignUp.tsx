'use client';
import { SignUp, useUser } from '@clerk/nextjs';
import React from 'react';
import { dark } from '@clerk/themes';
import { useSearchParams } from 'next/navigation';
const SignUpComponent = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const isCheckOutPage = searchParams.get('checkout') != '';
  const { user } = useUser();
  const signInUrl = isCheckOutPage ? `/checkout?step=1&id=${courseId}&showSignUp=false` : '/signin';
  const userRole = user?.publicMetadata?.userType as string;
  const roleBaseRouting = () => {
    if (isCheckOutPage) {
      return `/checkout?step=1&id=${courseId}&showSignUp=false`;
    }
    if (userRole == 'teacher') {
      return `/teacher/courses`;
    }
    return `/user/courses`;
  };
  return (
    <SignUp
      appearance={{
        baseTheme: dark,
        elements: {
          headerTitle: 'text-2xl',
          headerSubtitle: 'text-xs underline',
          cardBox: 'shadow-[1px_1px_5px_0.5px_gray]',
        },
      }}
      forceRedirectUrl={roleBaseRouting()}
      afterSignOutUrl={'/'}
      routing={'hash'}
      signInUrl={signInUrl}
    />
  );
};

export default SignUpComponent;

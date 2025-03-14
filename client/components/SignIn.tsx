'use client';
import { SignIn, useUser } from '@clerk/nextjs';
import React from 'react';
import { dark } from '@clerk/themes';
import { useSearchParams } from 'next/navigation';
const SignInComponent = () => {
  const searchParams = useSearchParams();
  const { user } = useUser();
  console.log('user : ', user);

  const isCheckOutPage = searchParams.get('showSignUp') !== null;
  const courseId = searchParams.get('id');
  const signUpUrl = isCheckOutPage ? `/checkout?step=1&id=${courseId}&showSignUp=true` : `/signup`;
  const userRole = user?.publicMetadata?.userType as string;
  const roleBaseRouting = () => {
    if (isCheckOutPage) {
      return `/checkout?step=2&id=${courseId}&showSignUp=true`;
    }
    if (userRole == 'teacher') {
      return `teacher/courses`;
    }
    return `user/courses`;
  };
  return (
    <SignIn
      appearance={{
        baseTheme: dark,
        elements: {
          headerTitle: 'text-2xl',
          headerSubtitle: 'text-xs underline',
          cardBox: 'shadow-[1px_1px_5px_0.5px_gray]',
        },
      }}
      signUpUrl={signUpUrl}
      forceRedirectUrl={roleBaseRouting()}
      routing={'hash'}
      afterSignOutUrl={'/'}
    />
  );
};

export default SignInComponent;

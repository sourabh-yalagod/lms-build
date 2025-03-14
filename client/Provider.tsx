'use client';

import StoreProvider from './state/redux';

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <StoreProvider>{children}</StoreProvider>;
};

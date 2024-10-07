import React from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { ProfileProvider } from "@/context/profile-context";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AvatarProvider } from './context/avatar-context';

const SessionWrapper = dynamic(() => import("@/components/SessionWrapper"), {
  ssr: false,
});

const toastConfig = { 
  autoClose: 1000, 
};

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionWrapper>
      <ProfileProvider>
        <AvatarProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastContainer {...toastConfig} />
        </ThemeProvider>
        </AvatarProvider>
      </ProfileProvider>
    </SessionWrapper>
  );
}
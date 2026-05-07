"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import AuthSessionProvider from "./SessionProvider";
import { Toaster } from "./ui/sonner";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <AuthSessionProvider>
      <Toaster position="bottom-right" richColors={true} />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthSessionProvider>
  );
}
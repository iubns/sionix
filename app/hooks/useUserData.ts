"use client";

import { useEffect } from "react";
import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  provider: string;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
}

const useUserStore = create<{
  user: User | null;
  setUser: (user: User | null) => void;
}>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));

export default function useUserData() {
  function checkAuth() {
    fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        useUserStore.setState({ user: data.user ?? null });
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
        useUserStore.setState({ user: null });
      });
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    checkAuth,
    user: useUserStore((state) => state.user),
    setUser: useUserStore((state) => state.setUser),
  };
}

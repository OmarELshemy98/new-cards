"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";

type AuthUser = {
  uid: string;
  email: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // الاستماع لحالة الأوث (مفتاح الحفاظ على الجلسة بعد الريفريش)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        setUser({ uid: fbUser.uid, email: fbUser.email });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    // مش محتاج setUser هنا؛ onAuthStateChanged هو اللي هيحدّث user
  };

  const logout = async () => {
    await signOut(auth);
    // برضه onAuthStateChanged هيخلي user = null تلقائيًا
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {/* نأخر الرندر لحد ما نعرف حالة الأوث */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useUserData from "../hooks/useUserData";

export default function Header() {
  const pathname = usePathname();
  const { push } = useRouter();
  const { user, setUser } = useUserData();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function handleLoginClick() {
    push("/login");
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-900/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="text-lg font-black tracking-tight text-slate-900 sm:text-xl"
        >
          sionix
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={() => push("/dashboard")}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  pathname === "/dashboard"
                    ? "border-sky-600 bg-sky-50 text-sky-700"
                    : "border-slate-300 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-700"
                }`}
                type="button"
              >
                대시보드
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-rose-400 hover:text-rose-700"
                type="button"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  pathname === "/login"
                    ? "border-sky-600 bg-sky-50 text-sky-700"
                    : "border-slate-300 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-700"
                }`}
                type="button"
              >
                로그인
              </button>
              <Link
                href="/signup"
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  pathname === "/signup"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
                }`}
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

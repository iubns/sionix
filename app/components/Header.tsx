"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const { push } = useRouter();

  function handleLoginClick() {
    push("/login");
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-900/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-8 lg:px-12">
        <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">sionix</h1>
        <button
          onClick={handleLoginClick}
          className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-700"
          type="button"
        >
          로그인
        </button>
      </div>
    </header>
  );
}

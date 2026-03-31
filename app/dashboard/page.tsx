"use client";

import useUserData from "../hooks/useUserData";

export default function DashboardPage() {
  const { user } = useUserData();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            AI 에이전트 대시보드
          </h1>
          <p className="mt-2 text-lg text-slate-600">{user?.email}</p>
        </div>

        {/* 상태 카드 */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "활성 에이전트",
              value: "0",
              icon: "🤖",
              color: "from-sky-400 to-cyan-400",
            },
            {
              label: "실행 이력",
              value: "0회",
              icon: "📊",
              color: "from-emerald-400 to-teal-400",
            },
            {
              label: "에러",
              value: "0건",
              icon: "⚠️",
              color: "from-orange-400 to-red-400",
            },
            {
              label: "할당 리소스",
              value: "4GB RAM",
              icon: "💾",
              color: "from-purple-400 to-pink-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl bg-gradient-to-br ${stat.color} p-6 text-white shadow-lg`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="mt-2 text-3xl font-black">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 에이전트 관리 섹션 */}
        <div className="mb-10">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  에이전트 관리
                </h2>
                <p className="mt-1 text-slate-600">
                  AI 에이전트를 생성하고 관리해보세요.
                </p>
              </div>
              <button className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
                + 새 에이전트 생성
              </button>
            </div>

            {/* 에이전트 리스트 (빈 상태) */}
            <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <p className="text-lg font-medium text-slate-600">
                생성된 에이전트가 없습니다.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                &quot;새 에이전트 생성&quot; 버튼을 클릭하여 첫 번째 에이전트를
                만들어보세요.
              </p>
            </div>
          </div>
        </div>

        {/* 최근 활동 섹션 */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              최근 실행 이력
            </h3>
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
              <p className="text-sm text-slate-500">
                최근 실행 이력이 없습니다.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              시스템 알림
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-sky-50 p-3 text-left">
                <p className="text-sm font-medium text-sky-900">
                  ℹ️ 환영합니다!
                </p>
                <p className="mt-1 text-xs text-sky-700">
                  Sionix 대시보드에 접속하셨습니다. 에이전트를 생성하여 자동화
                  작업을 시작하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 사용자 정보 섹션 */}
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-black text-slate-900">계정 정보</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">이메일</p>
              <p className="mt-1 font-medium text-slate-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">이메일 인증 상태</p>
              <p className="mt-1">
                {user?.isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                    ✓ 인증됨
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                    ⚠ 미인증
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">가입일</p>
              <p className="mt-1 font-medium text-slate-900">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("ko-KR")
                  : "알 수 없음"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">제공자</p>
              <p className="mt-1 font-medium text-slate-900">
                {user?.provider === "local" ? "로컬 계정" : user?.provider}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { SERVICE_CATALOG } from "@/lib/shared/service-catalog";

import useUserData from "../hooks/useUserData";

export default function DashboardPage() {
  const { user } = useUserData();
  const serviceIntegrations = user?.serviceIntegrations ?? {};

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            AI 에이전트 대시보드
          </h1>
          <p className="mt-2 text-lg text-slate-600" suppressHydrationWarning>
            {user?.email ?? "로그인 정보를 불러오는 중..."}
          </p>
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

        {/* 사용자 정보 섹션 */}
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-black text-slate-900">
            서비스 연결 상태
          </h3>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {SERVICE_CATALOG.map((service) => {
                const config = serviceIntegrations[service.key];
                const isConnected = Boolean(config?.enabled && config?.url);

                return (
                  <div
                    key={service.key}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {service.label}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {service.description}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          isConnected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isConnected ? "연결됨" : "미연결"}
                      </span>
                    </div>

                    <div className="mt-4 rounded-md border border-slate-200 bg-white px-3 py-2">
                      <p
                        className="break-all text-sm text-slate-700"
                        suppressHydrationWarning
                      >
                        {config?.url ?? "등록된 접속 주소 없음"}
                      </p>
                    </div>

                    {config?.url ? (
                      <a
                        href={config.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`mt-4 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 ${service.accentClass}`}
                      >
                        서비스 열기
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <h3 className="mb-4 mt-8 text-lg font-black text-slate-900">
            계정 정보
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">이메일</p>
              <p
                className="mt-1 font-medium text-slate-900"
                suppressHydrationWarning
              >
                {user?.email ?? "-"}
              </p>
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
              <p
                className="mt-1 font-medium text-slate-900"
                suppressHydrationWarning
              >
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("ko-KR")
                  : "알 수 없음"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">제공자</p>
              <p
                className="mt-1 font-medium text-slate-900"
                suppressHydrationWarning
              >
                {user?.provider === "local" ? "로컬 계정" : user?.provider}
              </p>
            </div>
          </div>
        </div>
        {/* 최근 활동 섹션 */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
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
      </div>
    </main>
  );
}

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.18),transparent_35%),linear-gradient(180deg,#f8fbff_0%,#edf5ff_45%,#f3faf4_100%)] px-4 py-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:54px_54px]" />

      <section className="reveal relative mx-auto flex w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-900/10 bg-white/90 shadow-[0_30px_90px_-42px_rgba(15,23,42,0.55)] backdrop-blur">
        <div className="hidden w-[46%] flex-col justify-between bg-[linear-gradient(145deg,#0f172a_0%,#0f3a68_45%,#0369a1_100%)] p-8 text-white lg:flex">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-sky-200">
              SIONIX ACCESS
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight">
              AI 에이전트 운영
              <br />
              통합 대시보드
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-sky-100/90">
              결제 즉시 할당된 전용 서버에 접속해 자동화 워크플로우를
              관리하세요. 로그인 후 에이전트 상태, 실행 이력, 알림 설정을 확인할
              수 있습니다.
            </p>
          </div>

          <div className="space-y-2 text-sm text-sky-100/90">
            <p>24시간 무중단 운영 모니터링</p>
            <p>외부 LLM API 연동 상태 확인</p>
            <p>자동 재시작 및 이벤트 로그 추적</p>
          </div>
        </div>

        <div className="w-full p-6 sm:p-10 lg:w-[54%]">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              로그인
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              등록된 계정으로 접속하여 AI 에이전트 환경을 시작하세요.
            </p>

            <form className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력하세요"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                로그인하기
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="font-semibold text-sky-700 underline-offset-2 hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

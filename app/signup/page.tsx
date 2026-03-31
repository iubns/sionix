import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_12%_0%,rgba(16,185,129,0.16),transparent_36%),radial-gradient(circle_at_88%_0%,rgba(14,165,233,0.18),transparent_36%),linear-gradient(180deg,#f8fbff_0%,#edf7f8_45%,#f3f8ff_100%)] px-4 py-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:54px_54px]" />

      <section className="reveal relative mx-auto flex w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-900/10 bg-white/90 shadow-[0_30px_90px_-42px_rgba(15,23,42,0.55)] backdrop-blur">
        <div className="w-full p-6 sm:p-10 lg:w-[56%]">
          <div className="mx-auto w-full max-w-md">
            <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600">
              CREATE ACCOUNT
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
              회원가입
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              이메일과 비밀번호를 입력하고 비밀번호 확인까지 완료해 주세요.
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="8자 이상 입력"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                회원가입하기
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-700 underline-offset-2 hover:underline"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden w-[44%] flex-col justify-between bg-[linear-gradient(150deg,#052e2b_0%,#065f46_40%,#0ea5e9_100%)] p-8 text-white lg:flex">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-emerald-100">
              START FAST
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight">
              결제 즉시,
              <br />
              바로 자동화 시작
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-emerald-50/95">
              회원가입 후 API 키를 연결하면 서버 유지보수 없이 AI 에이전트
              운영을 시작할 수 있습니다.
            </p>
          </div>

          <ul className="space-y-2 text-sm text-emerald-50/95">
            <li>STANDARD / DELUXE / PREMIUM 선택 운영</li>
            <li>외부 LLM API 연동 기반</li>
            <li>1인 1서버 전용 인프라 할당</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

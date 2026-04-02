const solutions = [
  {
    tier: "STANDARD",
    name: "베이직 AI 에이전트 및 서버",
    summary:
      "1인 1서버 기반의 SaaS형 AI 비서 서비스로, 결제 즉시 독립 실행 환경을 할당받아 기본 행정 업무를 자동화할 수 있는 엔트리 플랜",
    specs: ["RAM 4GB", "저장공간 60GB", "24시간 무중단 환경"],
    features: [
      "경량 가상화 기반으로 OS 오버헤드를 최소화한 독립 실행 환경",
      "OpenAI, Claude 등 외부 LLM 연동용 RESTful API 커넥터 사전 구성",
      "웹훅 기반 비동기 이벤트 처리로 알림/요약 업무를 실시간 처리",
      "프로세스 모니터링 기반 자동 재시작(Self-Healing) 지원",
      "슬랙, 텔레그램 등 메신저 연동으로 반복 행정 자동화",
    ],
    useCase:
      "백오피스/경영: 일정 관리, 정보 리서치, 단순 반복 행정 자동화로 초기 창업자의 핵심 업무 집중 지원",
    price: "2개월 200,000원 (VAT 포함)",
    accent: "from-sky-500/20 to-cyan-400/15",
  },
  {
    tier: "DELUXE",
    name: "프로 AI 에이전트 및 서버",
    summary:
      "고사양 리소스와 브라우저 자동화 런타임을 포함해, 조사/분석 중심의 고차원 자동화 업무를 수행하는 성장형 플랜",
    specs: ["RAM 8GB", "저장공간 100GB", "브라우저 자동화 런타임"],
    features: [
      "KVM 기반 VM으로 리소스 간섭 없는 전용 연산 환경 제공",
      "헤드리스 브라우저 엔진으로 실제 웹 탐색, 폼 작성, 동적 데이터 수집 지원",
      "Playwright/Puppeteer 최적화로 DOM 해석 및 자동 제어 성능 강화",
      "확장 메모리를 활용한 긴 문맥 유지 및 임베딩 데이터 처리",
      "PDF, 엑셀 등 문서 기반 비교 분석 및 보고서 초안 자동화",
    ],
    useCase:
      "전략 기획/마케팅: 시장 조사, 타겟 고객 분석, 데이터 수집 및 보고서 자동 생성 지원",
    price: "2개월 400,000원 (VAT 포함)",
    accent: "from-emerald-500/20 to-teal-400/15",
  },
  {
    tier: "PREMIUM",
    name: "기업용 통합 수석 AI 에이전트 및 서버",
    summary:
      "대용량 데이터 처리와 멀티 자동화 워크플로우를 위한 엔터프라이즈급 인프라를 제공하는 최고 사양 플랜",
    specs: ["RAM 16GB", "저장공간 100GB NVMe", "격리 보안 네트워크(VPC)"],
    features: [
      "하이퍼바이저 기반 고성능 인프라로 I/O 병목 최소화",
      "사용자별 Isolated Network 적용으로 데이터 유출 리스크 차단",
      "복수 브라우저/프로세스 병렬 구동 멀티-에이전트 워크플로우 지원",
      "RAG 인프라 지원으로 로컬 지식 베이스 구축 및 실시간 검색 강화",
      "대용량 지식 창고 기반의 통합 업무 대행 및 자동 보고 체계 구성",
    ],
    useCase:
      "데이터/인프라 및 백오피스: 팀 단위 대규모 데이터 운영과 복합 프로세스 자동화",
    price: "2개월 600,000원 (VAT 포함)",
    accent: "from-amber-500/20 to-orange-400/15",
  },
];

const commonGuide = [
  "독립형 전용 인프라: 1인 1서버 Virtual Private Desktop 즉시 할당",
  "외부 LLM API 연동: OpenAI, Claude, Gemini 등 사용자 보유 API 키 기반",
  "인프라 패키징: 에이전트 소프트웨어 + 고성능 실행 서버 즉시 제공",
  "올인원 인도: 결제 즉시 사용 가능, 유지보수/업데이트는 당사 전담",
];

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_10%,rgba(14,165,233,0.14),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(16,185,129,0.12),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_35%,#f5fbf7_100%)] px-4 pb-24 pt-12 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:56px_56px]" />

      <section className="reveal relative mx-auto max-w-6xl rounded-3xl border border-slate-900/10 bg-white/85 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur sm:p-12">
        <h1 className="mt-6 max-w-4xl text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
          AI 솔루션 소개자료
          <span className="block text-sky-700">
            결제 즉시 배정되는 독립형 AI 에이전트 서버
          </span>
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          하드웨어 구매나 복잡한 설치 없이, 사용자 API 키만 입력하면 바로 운영
          가능한 AI 자동화 환경을 제공합니다. 24시간 무중단 구동, 비동기 메시징,
          자동 복구, 외부 LLM 연동까지 SaaS 방식으로 즉시 시작할 수 있습니다.
        </p>

        <div className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            1인 1서버 즉시 할당
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            외부 LLM API 연동 지원
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            비동기 이벤트 기반 자동화
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            Self-Healing 24시간 운용
          </div>
        </div>
      </section>

      <section className="reveal reveal-delay-1 relative mx-auto mt-12 max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            플랜별 솔루션 구성
          </h2>
          <p className="text-sm text-slate-500">
            플랫폼 등록 기준: 월정액(구독) / 용량 기반 / 크레딧·토큰 무료+유료
            혼합
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {solutions.map((solution) => (
            <article
              key={solution.tier}
              className="group relative overflow-hidden rounded-3xl border border-slate-900/10 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-28px_rgba(2,132,199,0.4)]"
            >
              <div
                className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-r ${solution.accent}`}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-bold tracking-wide text-slate-700">
                    {solution.tier}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    AI 에이전트 + 전용 서버
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black leading-snug text-slate-900">
                  {solution.name}
                </h3>
                <p className="mt-10 text-sm leading-relaxed text-slate-600">
                  {solution.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {solution.specs.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <ul className="mt-5 space-y-2 text-sm leading-relaxed text-slate-700">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  <strong className="text-slate-900">활용 분야</strong>
                  <br />
                  {solution.useCase}
                </p>

                <p className="price-tag mt-5 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                  {solution.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal reveal-delay-2 relative mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-900/10 bg-white/90 p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.5)] sm:p-8">
          <h4 className="text-xl font-extrabold text-slate-900">
            공통 서비스 제공 범위 및 가이드
          </h4>
          <div className="mt-5 grid gap-3 text-sm leading-relaxed text-slate-700 sm:grid-cols-2">
            {commonGuide.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

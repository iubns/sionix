export const SERVICE_CATALOG = [
  {
    key: "openclaw",
    label: "OpenClaw",
    description: "에이전트 실행용 OpenClaw 엔드포인트",
    accentClass: "from-sky-500 to-cyan-500",
  },
  {
    key: "claude",
    label: "Claude",
    description: "Anthropic Claude 작업 공간 연결",
    accentClass: "from-amber-500 to-orange-500",
  },
  {
    key: "chatgpt",
    label: "ChatGPT",
    description: "OpenAI ChatGPT 자동화 연결",
    accentClass: "from-emerald-500 to-teal-500",
  },
] as const;

export type SupportedServiceKey = (typeof SERVICE_CATALOG)[number]["key"];

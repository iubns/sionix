# Sionix

Sionix는 Next.js App Router 기반의 웹 애플리케이션입니다.
현재 로그인/회원가입 인증 흐름과 PostgreSQL(TypeORM) 백엔드 API를 포함합니다.

## 핵심 기능

- Next.js 16 App Router 기반 프론트엔드
- Route Handler 기반 인증 API
- PostgreSQL + TypeORM 데이터 저장
- 로그인/회원가입 폼의 실제 API 연동
- 헬스체크 엔드포인트 제공

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- PostgreSQL
- TypeORM
- Tailwind CSS 4

## 프로젝트 구조

```text
app/
	api/
		auth/
			login/route.ts
			signup/route.ts
		health/route.ts
	login/page.tsx
	signup/page.tsx

lib/server/
	repositories/user.repository.ts
	services/auth.service.ts
	validators/auth.validator.ts
	typeorm/
		data-source.ts
		entities/user.entity.ts

db/
	init.sql
```

## 빠른 시작

### 1) 의존성 설치

```bash
pnpm install
```

### 2) 환경 변수 설정

`.env.example`을 복사해서 `.env.local`을 만듭니다.

```bash
cp .env.example .env.local
```

필수 변수:

- `DATABASE_URL`: PostgreSQL 연결 문자열
- `AUTH_SALT`: 비밀번호 해시용 salt
- `APP_BASE_URL`: 인증 링크 생성용 앱 주소

선택 변수(SMTP 설정 시 실제 메일 발송):

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

예시:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sionix
AUTH_SALT=change-this-in-production
APP_BASE_URL=http://localhost:3000

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=smtp-user
SMTP_PASS=smtp-password
SMTP_FROM=no-reply@example.com
```

### 3) DB 스키마 초기화

```bash
psql "$DATABASE_URL" -f db/init.sql
```

### 4) 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속

## API 명세

### GET /api/health

서비스 상태 확인

성공 응답 예시:

```json
{
  "ok": true,
  "service": "sionix-api",
  "timestamp": "2026-03-31T10:00:00.000Z"
}
```

### POST /api/auth/signup

회원가입

요청 본문:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

성공 응답(201):

```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "provider": "local",
    "createdAt": "2026-03-31T10:00:00.000Z"
  }
}
```

주요 실패 코드:

- `400`: 유효성 검증 실패
- `409`: 이미 가입된 이메일
- `500`: 서버/DB 오류

참고:

- SMTP 미설정 개발 환경에서는 서버 로그에 인증 링크가 출력됩니다.
- 응답 본문에 `verificationUrl`이 포함될 수 있으며, 개발용 확인 목적으로 사용합니다.

### POST /api/auth/login

로그인

요청 본문:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

성공 응답(200):

```json
{
  "success": true,
  "message": "로그인에 성공했습니다.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "provider": "local",
    "createdAt": "2026-03-31T10:00:00.000Z"
  }
}
```

주요 실패 코드:

- `400`: 유효성 검증 실패
- `401`: 이메일/비밀번호 불일치
- `403`: 이메일 인증 미완료
- `500`: 서버 오류

### GET /api/auth/verify-email?token=...

이메일 인증 링크에서 호출되는 엔드포인트

성공 시 이메일 인증 상태가 활성화되며, 이후 로그인 가능합니다.

## 주요 스크립트

```bash
pnpm dev      # 개발 서버
pnpm build    # 프로덕션 빌드
pnpm start    # 프로덕션 서버 실행
pnpm lint     # ESLint
pnpm deploy   # 배포 스크립트 실행
```

## 배포

`pnpm deploy`는 `.scripts/deploy.sh`를 실행합니다.

배포 스크립트 동작:

1. 로컬에서 `pnpm install` 및 `pnpm run build`
2. 배포 산출물(`.next`, `public`, `package.json`, `pnpm-lock.yaml`, `next.config.ts`) 패키징
3. 원격 서버 업로드
4. 서버에서 압축 해제 후 `pnpm install --prod`
5. `pm2`로 앱 재시작

## 운영 메모

- TypeORM DataSource는 서버 런타임에서 싱글톤으로 초기화됩니다.
- `synchronize`는 현재 `NODE_ENV !== "production"`일 때만 활성화됩니다.
- 운영 환경에서는 마이그레이션 기반 관리 권장.

## Troubleshooting

### 빌드 시 workspace root 경고가 뜨는 경우

상위 경로의 lockfile이 함께 감지되면 Next.js가 root 추론 경고를 출력할 수 있습니다.
필요 시 `next.config.ts`에서 `turbopack.root`를 명시하거나, 불필요한 lockfile을 정리하세요.

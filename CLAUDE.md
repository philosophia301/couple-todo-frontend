# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LoveTodo 프론트엔드 — 커플을 위한 할일 관리 & 배틀 앱의 프론트엔드. Next.js 16, React 19, TypeScript, pnpm 기반.

백엔드 레포: `philosophia301/couple-todo-backend`

## Commands

```bash
pnpm install        # 의존성 설치
pnpm dev            # 개발 서버 (localhost:3000)
pnpm build          # 프로덕션 빌드
pnpm start          # 프로덕션 서버 시작
pnpm lint           # ESLint 실행
```

테스트 프레임워크는 아직 설정되지 않음.

## Architecture

### 데이터 흐름

`app/page.tsx`에서 마운트 시 `GET /api/todos`로 백엔드 데이터를 로드하고, 추가/토글/삭제 시 낙관적 업데이트 + API 호출.

```
Page (app/page.tsx) — 루트 상태: boyTodos[], girlTodos[], activeTab, loading
├── BirdIcon — 앱 로고 애니메이션
├── TodoList — todo 목록 + 추가 폼 (accentColor로 boy/girl 테마 분기)
│   └── TodoItem — 개별 항목 (완료 토글, 삭제)
├── BattleDashboard — 완료율 비교, 승자 판정, 통계 카드
└── TabBar — 하단 탭 네비게이션 (남자 | 배틀 | 여자)
```

### 핵심 타입

```typescript
interface TodoItemData { id: string; text: string; completed: boolean }
type TabId = "boy" | "girl" | "dashboard"
type Accent = "boy" | "girl"  // 테마 색상 분기용
```

### 탭/테마 시스템

- 3개 탭: `boy`(파란), `dashboard`, `girl`(핑크)
- `accentColor` prop으로 boy/girl 색상 분기 — CSS 변수(`--boy-color`, `--girl-color`)와 Tailwind 커스텀 색상(`text-boy`, `bg-girl-bg` 등) 사용
- 색상 정의: `app/globals.css` (CSS 변수) + `tailwind.config.ts` (Tailwind 색상 매핑)

### UI 컴포넌트

- **shadcn/ui**: `components/ui/` 디렉토리 — Radix UI 기반 프리빌트 컴포넌트. `components.json`으로 설정.
- **애니메이션**: Framer Motion (`AnimatePresence`, `motion.*`) 전체 사용
- **아이콘**: Lucide React
- **폰트**: Noto Sans KR (Google Fonts)

### Path Alias

`@/*` → 프로젝트 루트 매핑. 예: `@/components/todo-item`

### 빌드 설정 참고

- `next.config.mjs`: TypeScript 빌드 에러 무시(`ignoreBuildErrors: true`), 이미지 최적화 비활성화
- 다크 모드: class 기반으로 설정되어 있으나 현재 실제 다크 테마 CSS 변수 미정의

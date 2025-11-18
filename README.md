# 파티 스케줄러(Party Scheduler)

> 바쁜 현대인을 위한 스마트한 약속 관리 솔루션

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.0-646cff?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-12.5.0-FFCA28?logo=firebase)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)

## 프로젝트 소개

**파티 스케줄러(Party Scheduler)**는 친구들과의 약속을 더 쉽고 빠르게 잡을 수 있도록 돕는 PWA 기반 웹 어플리케이션입니다.

### 개요

바쁜 일상 속에서 친구들과 시간을 맞추는 것은 여간 번거로운 일이 아닙니다.

- "이번 주말 언제 시간 돼?"
- "나는 토요일 오후 2시 이후만 가능해"
- "그럼 일요일은 어때?"

이런 대화가 반복되면서 약속 하나 잡는 데 며칠이 걸리기도 합니다.

**파티 스케줄러(Party Scheduler)**는 MBTI J인 계획형 사람들을 위한 최적의 서비스로, 친구들의 약속 가능한 시간을 한눈에 확인하고 최적의 시간을 찾아줍니다. 약속이 결정된 후에도 실시간으로 계획을 공유하고 관리하여 약속을 성공적으로 성사시킬 수 있습니다.

---

## 주요 기능

### 1. 다양한 약속 유형 지원

액티비티, 핫플 탐방, 게임, 식사 등 다양한 종류의 약속을 생성하고 관리할 수 있습니다.

### 2. 스마트 일정 매칭

- **30분 단위** 시간 선택으로 정밀한 일정 조율
- 참가자 모두의 가능한 시간대를 **시각적으로 표시**
- 공통 가능 시간대를 **자동으로 하이라이트**
- 최적의 약속 시간을 빠르게 결정

### 3. 실시간 계획 공유

- 확정된 약속의 **일정, 장소, 세부 내용** 실시간 공유
- 공지 혹은 계획 변경 시 참가자 전원에게 **즉시 알림**
- 약속 당일까지 **리마인드 알림**
- 모바일 푸시 알림 지원 (PWA)

### 4. 의사결정 도구

- 일정, 장소, 계획에 대한 **투표 기능**
- 약속을 간단하게 **공유**
- 참가자 응답 현황 **실시간 트래킹**

---

## 기술 스택

### Frontend

- **React** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **React Router** - 클라이언트 라우팅
- **Vite** - 빠른 개발 환경 및 빌드 도구

### Styling

- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **SCSS** - CSS 전처리기

### State Management & Data Fetching

- **Zustand** - 경량 상태 관리
- **TanStack Query** - 서버 상태 관리

### Backend & Database

- **Firebase** - 인증, 데이터베이스, 호스팅
  - Authentication (이메일/비밀번호, 소셜 로그인)
  - Cloud Firestore (실시간 데이터베이스)

### Form & Validation

- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증

### UI Libraries

- **Swiper** - 모바일 터치 슬라이더
- **React Transition Group** - 애니메이션 전환

### PWA

- **Vite Plugin PWA** - PWA 통합
- **Service Worker** - 오프라인 지원
- **Web App Manifest** - 앱 같은 경험
- **Push Notifications** - 실시간 알림 (예정)

### Development Tools

- **ESLint** - 코드 품질 검사
- **Stylelint** - 스타일 린팅
- **SVGR** - SVG를 React 컴포넌트로 변환
- **React Compiler** - React 컴파일러

---

## 프로젝트 구조

```
party-scheduler/
├── public/                  # 정적 파일
└── src/
    ├── assets/             # 정적 리소스
    │   ├── fonts/          # 폰트 파일
    │   ├── icons/          # SVG 아이콘
    │   └── styles/         # 스타일
    ├── components/         # 컴포넌트
    ├── constants/          # 상수
    ├── hooks/              # 훅
    ├── layouts/            # 레이아웃
    ├── lib/                # 외부 라이브러리 설정
    ├── pages/              # 페이지
    ├── providers/          # providers
    ├── schemas/            # 스키마
    ├── services/           # API
    ├── types/              # 타입 정의
    ├── utils/              # 유틸 함수
    ├── main.tsx            # 앱 진입점
    ├── router.tsx          # 라우터 설정
    └── Wrapper.tsx         # 앱 래퍼
```

## 시작하기

### 요구사항

- Node.js v22.12.0
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview

# 린팅
npm run lint
```

---

## 주요 기술 특징

### 🎨 디자인 시스템

- **Tailwind CSS 4.1** + **SCSS 모듈**의 하이브리드 스타일링
- SCSS 변수, 믹스인, 함수가 전역으로 자동 임포트
- CSS 모듈과 camelCase 네이밍 컨벤션
- 일관된 디자인 토큰 시스템

### ⚡ 성능 최적화

- **React 19 Compiler** - 자동 메모이제이션
- **Vite** - 빠른 번들링
- **Code Splitting** - 동적 임포트
- **SVG 컴포넌트화** - SVGR을 통한 아이콘 최적화

### 🔒 타입 안전성

- **TypeScript 5.8** - 엄격한 타입 체크
- **Zod** - 런타임 스키마 검증
- **React Hook Form** - 타입 안전한 폼 관리

### 📱 PWA 기능

- **빠른 로딩** - 프리캐싱 전략
- **푸시 알림** - 실시간 업데이트

### 🔥 Firebase 통합

- **Authentication** - 이메일/소셜 로그인
- **Cloud Firestore** - 실시간 NoSQL 데이터베이스

## 개발 가이드

### 컴포넌트 개발

프로젝트는 재사용 가능한 컴포넌트 라이브러리를 포함하고 있습니다.
가이드 페이지(`/guide/*`)에서 각 컴포넌트의 사용법을 확인할 수 있습니다.

### 스타일링 규칙

- **전역 SCSS**: `src/assets/styles/abstracts/`의 변수, 믹스인, 함수는 자동으로 사용 가능
- **컴포넌트 SCSS 모듈**: 공통 컴포넌트 스타일은 SCSS MODULE을 사용
- **인라인 스타일 지양**: 불가피한 경우를 제외하고 피할 것

### 타입 체크

TypeScript Project References를 사용하므로 다음 명령어를 사용하세요:

```bash
# 올바른 방법
npx tsc -b --noEmit

# 잘못된 방법 (모든 참조를 체크하지 않음)
npx tsc --noEmit
```

### 아이콘 추가

SVG 아이콘을 React 컴포넌트로 변환:

```bash
npm run svgr
```

## 디자인 철학

- **Simple**: 복잡하지 않고 직관적인 사용자 경험
- **Fast**: 빠른 로딩과 부드러운 인터랙션
- **Accessible**: 모든 사용자가 접근 가능한 디자인
- **Mobile-First**: 모바일 환경 우선 최적화

---

## 문의

seongchan95s@gmail.com

---

<div align="center">

**Party Scheduler** - 약속을 더 쉽게, 더 즐겁게

[Back to Top](#파티-스케줄러party-scheduler)

</div>

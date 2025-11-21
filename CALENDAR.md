# SelectCalendar 컴포넌트 로직 및 흐름

## 개요

`SelectCalendar`는 FullCalendar를 기반으로 한 그룹 일정 조율 컴포넌트입니다. 사용자들이 자신의 가용 시간을 선택하고, 모든 참가자의 가용 시간이 겹치는 구간을 시각적으로 표시합니다.

## 파일 구조

SelectCalendar 컴포넌트는 관심사 분리를 위해 다음과 같이 세 개의 파일로 구성됩니다:

### 1. SelectCalendar.tsx
- 메인 컴포넌트 파일
- UI 렌더링 및 전체 구조
- hooks와 utils를 조합하여 사용
- `renderDayCellContent` 함수 포함 (JSX 포함)

### 2. SelectCalendar.hooks.ts
- 커스텀 훅 모음
- **useCurrentView**: 현재 뷰 상태 관리
- **useCalendarEvents**: 가용 시간을 캘린더 이벤트로 변환
- **useCalendarHandlers**: FullCalendar 이벤트 핸들러 관리

### 3. SelectCalendar.utils.ts
- 순수 유틸리티 함수 모음
- **USER_COLORS**: 사용자별 색상 배열
- **getOverlapColor**: 인원수에 따른 색상 계산
- **hasTimeConflict**: 시간대 겹침 확인
- **calculateDailyMaxOverlap**: 날짜별 최대 겹침 인원수 계산

## 주요 기능

### 1. 가용 시간 관리
- **시간대 추가**: 캘린더에서 드래그하여 새로운 가용 시간 추가
- **시간대 삭제**: 자신의 가용 시간 클릭으로 삭제
- **시간대 수정**: 드래그 앤 드롭 또는 리사이즈로 시간 조정

### 2. 겹치는 시간대 시각화
- 여러 참가자의 가용 시간이 겹치는 구간을 자동으로 계산
- 겹치는 인원수에 따라 색상 그라데이션 적용 (연한 노랑 → 진한 녹색)
- 월간 뷰에서 일별 최대 겹침 인원수 표시

### 3. 다중 뷰 지원
- **월간 뷰** (dayGridMonth): 전체 일정 개요 확인
- **주간 뷰** (timeGridWeek): 시간대별 상세 일정
- **일간 뷰** (timeGridDay): 하루 일정 집중 보기

## 데이터 흐름

```
Firebase Firestore
    ↓
usePartyAvailabilities Hook
    ↓
availabilities (모든 참가자의 가용 시간)
    ↓
useCalendarEvents Hook (SelectCalendar.hooks.ts)
    ↓
calendarEvents (캘린더 이벤트 변환)
    ↓
fullCalendarEvents (FullCalendar 형식)
    ↓
FullCalendar 컴포넌트
```

## 핵심 데이터 구조

### TimeSlotStamp
```typescript
{
  start: Timestamp,  // Firebase Timestamp
  end: Timestamp
}
```

### CalendarEvent
```typescript
{
  id: string,
  title: string,
  start: Date,
  end: Date,
  userId?: string,
  userName: string,
  isMyEvent?: boolean,
  isOverlapping?: boolean,
  overlapCount?: number
}
```

## 주요 로직

### 1. useCalendarEvents Hook (SelectCalendar.hooks.ts)

이 훅은 가용 시간을 FullCalendar 이벤트로 변환합니다.

**calendarEvents 생성:**
```
availabilities 배열 순회
  ↓
각 사용자의 slots 순회
  ↓
TimeSlotStamp → CalendarEvent 변환
  ↓
개별 이벤트 생성 (파랑/보라 등 사용자별 색상)
  +
overlappingSlots 배열 순회
  ↓
겹치는 이벤트 생성 (노랑~녹색 그라데이션)
```

**fullCalendarEvents 변환:**

각 CalendarEvent에 대해:

1. **겹치는 시간대** (isOverlapping = true):
   - `backgroundColor`: 겹침 인원수에 따른 색상 계산
   - `borderColor`: 전체 참가자 겹침 시 진한 녹색, 아니면 연한 녹색
   - `display`: 'background' (배경으로 표시)
   - `editable`: false
   - `classNames`: [styles.overlappingEvent]

2. **내 이벤트** (isMyEvent = true):
   - `backgroundColor`: 사용자별 고유 색상
   - `borderColor`: '#2E6BB0'
   - `display`: 'auto' (일반 이벤트)
   - `editable`: true (드래그/리사이즈 가능)
   - `classNames`: [styles.myEvent]

3. **다른 사람 이벤트**:
   - `backgroundColor`: 사용자별 고유 색상
   - `borderColor`: 'transparent'
   - `display`: 'background' (배경으로 표시)
   - `editable`: false
   - `classNames`: [styles.otherEvent]

**반환값:**
- `fullCalendarEvents`: FullCalendar 형식 이벤트 배열
- `totalParticipants`: 총 참가자 수
- `userColorMap`: 사용자 ID → 색상 매핑

### 2. useCalendarHandlers Hook (SelectCalendar.hooks.ts)

모든 FullCalendar 이벤트 핸들러를 관리합니다.

**반환하는 핸들러:**
- `handleMouseDown`: 마우스 다운 시간 기록
- `handleSelect`: 새 가용 시간 추가
- `handleEventClick`: 이벤트 클릭 (삭제)
- `handleEventDrop`: 이벤트 드래그
- `handleEventResize`: 이벤트 리사이즈
- `handleDatesSet`: 뷰/날짜 변경 추적

### 3. useCurrentView Hook (SelectCalendar.hooks.ts)

현재 캘린더 뷰 상태를 관리합니다.

**반환값:**
- `currentView`: 현재 뷰 타입 (string)
- `setCurrentView`: 뷰 업데이트 함수

### 4. 유틸리티 함수 (SelectCalendar.utils.ts)

#### getOverlapColor 함수

```
인원수 비율 = (현재 겹침 인원 - 1) / (전체 참가자 - 1)
  ↓
RGB 보간: #FFF3B0 (연한 노랑) → #2E7D32 (진한 녹색)
  ↓
최종 색상 반환
```

#### calculateDailyMaxOverlap 함수

```
overlappingSlots 배열 순회
  ↓
각 슬롯의 날짜 추출 (YYYY-MM-DD)
  ↓
Map<날짜, 최대 인원수> 생성
  ↓
각 날짜별로 최대값만 저장
```

#### hasTimeConflict 함수

새로운 시간대가 기존 슬롯들과 겹치는지 확인합니다.

**겹침 조건**: `start < slotEnd && end > slotStart`

## 이벤트 핸들러 (useCalendarHandlers Hook)

### 1. 시간대 선택 (handleSelect)

위치: `SelectCalendar.hooks.ts`

```
사용자 드래그 완료
  ↓
로그인 확인
  ↓
월간 뷰인 경우? → 주간 뷰로 전환 후 종료
  ↓
기존 시간대와 겹침 확인 (hasTimeConflict 사용)
  ↓
겹침 없음 → 새 TimeSlot 생성
  ↓
saveAvailability 호출 (Firestore 저장)
```

### 2. 이벤트 클릭 (handleEventClick)

위치: `SelectCalendar.hooks.ts`

```
이벤트 클릭
  ↓
내 이벤트인가?
  ↓
Yes: 삭제 확인 다이얼로그
      ↓
      확인 → 해당 슬롯 제거 후 저장
  ↓
No: 겹치는 시간대인가?
      ↓
      Yes: 참가자 목록 토스트 표시
```

### 3. 이벤트 드래그 (handleEventDrop)

위치: `SelectCalendar.hooks.ts`

```
이벤트 드래그 완료
  ↓
내 이벤트 확인 (아니면 revert)
  ↓
새 시간대 추출
  ↓
다른 슬롯과 겹침 확인 (hasTimeConflict 사용)
  ↓
겹침 있음 → revert
  ↓
겹침 없음 → 해당 슬롯 업데이트 후 저장
```

### 4. 이벤트 리사이즈 (handleEventResize)

위치: `SelectCalendar.hooks.ts`

드래그와 동일한 로직 (시간대 겹침 확인 후 저장/revert)

### 5. 뷰 변경 추적 (handleDatesSet)

위치: `SelectCalendar.hooks.ts`

```
뷰 변경 또는 날짜 이동
  ↓
현재 뷰 타입 반환
```

**Note**: SelectCalendar.tsx에서 `handleDatesSetWithViewUpdate`로 래핑하여 `setCurrentView` 호출

### 6. 마우스 다운 (handleMouseDown)

위치: `SelectCalendar.hooks.ts`

마우스 다운 시간을 기록하여 클릭과 드래그를 구분합니다.

### 7. 월간 뷰 날짜 셀 렌더링 (renderDayCellContent)

위치: `SelectCalendar.tsx` (JSX 포함으로 인해 컴포넌트 내부에 유지)

```
월간 뷰인가?
  ↓
Yes: 날짜 키 생성 (YYYY-MM-DD)
      ↓
      dailyMaxOverlap에서 해당 날짜의 최대 겹침 조회
      ↓
      2명 이상이면 빨간 배지로 인원수 표시
  ↓
No: 기본 날짜 텍스트만 표시
```

## 색상 시스템

### 사용자별 색상 (USER_COLORS 상수)

위치: `SelectCalendar.utils.ts`

8가지 색상을 순환하여 각 사용자에게 할당:
- 파랑 (#4A90E2), 보라 (#7B68EE), 청록 (#20B2AA), 빨강 (#FF6B6B)
- 주황 (#F39C12), 녹색 (#27AE60), 핑크 (#E91E63), 자주 (#9C27B0)

### 겹침 색상 그라데이션

위치: `SelectCalendar.utils.ts` (getOverlapColor 함수)

- **2명**: 연한 노랑 (#FFF3B0)
- **중간**: 그라데이션
- **전체 참가자**: 진한 녹색 (#2E7D32)

## 상태 관리

### 커스텀 훅 (SelectCalendar.hooks.ts)

**useCurrentView:**
- `currentView`: 현재 캘린더 뷰 타입
- `setCurrentView`: 뷰 업데이트 함수

**useCalendarEvents:**
- `fullCalendarEvents`: FullCalendar 형식 이벤트
- `totalParticipants`: 총 참가자 수
- `userColorMap`: 사용자 ID → 색상 매핑

**useCalendarHandlers:**
- 모든 FullCalendar 이벤트 핸들러 반환

### 외부 상태 (Hooks)
- `useUserState`: 현재 로그인 사용자 정보
- `usePartyAvailabilities`: 모든 참가자의 가용 시간 조회
- `useAvailabilityMutations`: 가용 시간 저장 mutation

### 계산된 값 (useMemo - SelectCalendar.tsx)
- `dailyMaxOverlap`: 날짜별 최대 겹침 인원수

## 성능 최적화

### 파일 분리를 통한 최적화
- **관심사 분리**: hooks, utils, 컴포넌트를 분리하여 유지보수성 향상
- **재사용성**: 유틸리티 함수와 훅을 다른 컴포넌트에서도 활용 가능
- **테스트 용이성**: 각 파일의 함수를 독립적으로 테스트 가능

### React 최적화
1. **useMemo** (SelectCalendar.hooks.ts):
   - `userColorMap`: 사용자별 색상 매핑 캐싱
   - `calendarEvents`: 가용 시간 → 캘린더 이벤트 변환 캐싱
   - `fullCalendarEvents`: FullCalendar 형식 이벤트 캐싱

2. **useMemo** (SelectCalendar.tsx):
   - `dailyMaxOverlap`: 날짜별 최대 겹침 계산 캐싱

3. **useCallback** (SelectCalendar.hooks.ts):
   - 모든 이벤트 핸들러 메모이제이션

4. **display: 'background'**:
   - 다른 사용자 이벤트를 배경으로 처리하여 성능 향상

## 사용자 경험 (UX)

### 월간 뷰 동작
- 날짜 클릭 시 주간 뷰로 자동 전환
- 각 날짜에 최대 겹침 인원수 배지 표시

### 시간대 겹침 방지
- 자신의 가용 시간끼리 겹치지 않도록 검증
- 겹치면 토스트 메시지 + 작업 취소

### 권한 제어
- 자신의 이벤트만 수정/삭제 가능
- 다른 사용자 이벤트 조작 시도 시 revert + 토스트 메시지

### 시각적 피드백
- 범례를 통한 색상 의미 설명
- 겹치는 시간대 클릭 시 참가자 목록 표시
- 로딩 중 Skeleton UI 표시

## 주요 의존성

### 외부 라이브러리
- `@fullcalendar/react`: 캘린더 UI 컴포넌트
- `@fullcalendar/daygrid`: 월간 뷰 플러그인
- `@fullcalendar/timegrid`: 주간/일간 뷰 플러그인
- `@fullcalendar/interaction`: 드래그/리사이즈/선택 기능
- `firebase/firestore`: 데이터 저장소

### 내부 모듈
- **hooks**: `usePartyAvailabilities`, `useAvailabilityMutations`, `useUserState`
- **stores**: `useGlobalToastStore`
- **services**: `timeSlotToDate` (party.ts)
- **components**: `Skeleton`

### SelectCalendar 내부 모듈
- `SelectCalendar.hooks.ts`: 커스텀 훅
- `SelectCalendar.utils.ts`: 유틸리티 함수
- `SelectCalendar.module.scss`: 스타일

## 파일별 책임

### SelectCalendar.tsx
- FullCalendar 컴포넌트 렌더링
- 전체 레이아웃 및 UI 구조
- hooks와 utils의 조합
- `renderDayCellContent` 함수 (JSX 포함)

### SelectCalendar.hooks.ts
- 상태 관리 로직
- 이벤트 핸들러 정의
- 데이터 변환 로직
- FullCalendar props 준비

### SelectCalendar.utils.ts
- 순수 함수 유틸리티
- 색상 계산
- 시간 겹침 검증
- 데이터 집계 (일별 최대 겹침)

## 코드 구조 예시

```typescript
// SelectCalendar.tsx
import { useCalendarEvents, useCalendarHandlers, useCurrentView } from './SelectCalendar.hooks';
import { USER_COLORS, getOverlapColor, calculateDailyMaxOverlap } from './SelectCalendar.utils';

export default function SelectCalendar({ partyId }) {
  const { currentView, setCurrentView } = useCurrentView();
  const { fullCalendarEvents, totalParticipants } = useCalendarEvents({ ... });
  const handlers = useCalendarHandlers({ ... });

  // ... 렌더링
}
```

```typescript
// SelectCalendar.hooks.ts
export const useCalendarEvents = ({ availabilities, overlappingSlots, user }) => {
  // 이벤트 변환 로직
  return { fullCalendarEvents, totalParticipants, userColorMap };
};

export const useCalendarHandlers = ({ user, currentView, ... }) => {
  // 이벤트 핸들러 정의
  return { handleSelect, handleEventClick, ... };
};
```

```typescript
// SelectCalendar.utils.ts
export const getOverlapColor = (count, totalParticipants) => {
  // 색상 계산 로직
};

export const hasTimeConflict = (start, end, slots, excludeIndex?) => {
  // 겹침 검증 로직
};
```

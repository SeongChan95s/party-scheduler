# SelectCalendar 로직 흐름

## 📊 전체 흐름 요약

```
사용자 액션 → 이벤트 핸들러 → Firestore 저장 → React Query 캐시 갱신 → UI 업데이트
```

---

## 1️⃣ 데이터 가져오기 (읽기)

```typescript
const { timeSlots, isLoading, overlappingSlots } = useTimeSlotsByPlan(partyId, planId);
```

**흐름:**
1. `useTimeSlotsByPlan` Hook 실행
2. Firestore에서 `parties/{partyId}/plans/{planId}/timeSlots` 전체 조회
3. 각 문서에 userName 추가 (userId로 사용자 이름 조회)
4. 겹치는 시간대 자동 계산 (`calculateOverlappingSlots`)

**결과 데이터:**
- `timeSlots`: 모든 사용자의 가용 시간 배열
- `overlappingSlots`: 2명 이상 겹치는 시간대 배열

---

## 2️⃣ 캘린더 이벤트로 변환 (표시)

```typescript
const { fullCalendarEvents, totalParticipants } = useCalendarEvents({
  timeSlots,
  overlappingSlots,
  user
});
```

**흐름:**
1. `timeSlots`를 순회하며 각 사용자의 시간 슬롯을 FullCalendar 이벤트로 변환
2. 내 이벤트 → 파란색, 편집 가능
3. 다른 사람 이벤트 → 회색 배경
4. 겹치는 시간대 → 초록색 배경 (사람 수에 따라 진해짐)

**FullCalendar에 표시:**
```
┌─────────────────────┐
│ 김철수 (파란색)      │  ← 내 이벤트 (드래그/리사이즈 가능)
├─────────────────────┤
│ 이영희 (회색 배경)   │  ← 다른 사람 (클릭만 가능)
├─────────────────────┤
│ 3명 (초록색 배경)    │  ← 겹치는 시간대 (읽기 전용)
└─────────────────────┘
```

---

## 3️⃣ 사용자 액션 처리 (쓰기)

### 📌 새 시간 추가 (드래그해서 선택)

```typescript
handleSelect(selectInfo) {
  1. 로그인 체크
  2. 월간뷰에서 클릭 → 주간뷰로 전환
  3. 기존 시간과 겹치는지 확인
  4. 겹치지 않으면 → saveTimeSlots 호출
}
```

**실제 동작:**
```
사용자: 월요일 10시~12시 드래그
  ↓
handleSelect: 겹치는지 확인
  ↓
saveTimeSlots({ partyId, planId, userId, slots: [...기존slots, 새slot] })
  ↓
Firestore: parties/partyId/plans/planId/timeSlots/userId 문서 업데이트
  ↓
React Query: 캐시 무효화 및 재조회
  ↓
화면: 파란색 이벤트 추가됨 + "가용 시간이 추가되었습니다" 토스트
```

### 📌 시간 삭제 (클릭)

```typescript
handleEventClick(clickInfo) {
  1. 내 이벤트인지 확인
  2. 삭제 확인 대화상자
  3. 해당 slot만 제거하고 saveTimeSlots 호출
}
```

**실제 동작:**
```
사용자: 내 이벤트 클릭
  ↓
confirm("삭제하시겠습니까?")
  ↓
기존 slots에서 해당 index 제거
  ↓
saveTimeSlots({ partyId, planId, userId, slots: 업데이트된배열 })
  ↓
화면: 이벤트 사라짐
```

### 📌 시간 이동/조정 (드래그/리사이즈)

```typescript
handleEventDrop / handleEventResize {
  1. 내 이벤트인지 확인
  2. 새 시간이 기존 시간과 겹치는지 확인
  3. 겹치지 않으면 해당 slot 시간 업데이트
}
```

---

## 4️⃣ 데이터 저장 흐름

### useTimeSlotsMutations의 save 함수:

```typescript
// 1. Hook 호출
const { save: saveTimeSlots } = useTimeSlotsMutations(partyId, planId);

// 2. 실제 저장
saveTimeSlots({ partyId, planId, userId, slots }, {
  onSuccess: () => { /* 성공 토스트 */ }
});

// 3. 내부 동작
useMutation({
  mutationFn: (input) => {
    // Firestore 저장
    await setSubDocument(
      'parties',
      partyId,
      'plans/planId/timeSlots',
      userId,
      { slots, createdAt, updatedAt }
    )
  },
  onSuccess: () => {
    // React Query 캐시 무효화
    queryClient.invalidateQueries(['timeSlots', 'party', partyId, 'plan', planId])
  }
})
```

**Firestore 경로:**
```
parties/{partyId}/plans/{planId}/timeSlots/{userId}
└── 문서 내용:
    {
      slots: [
        { start: Timestamp, end: Timestamp },
        { start: Timestamp, end: Timestamp }
      ],
      createdAt: Timestamp,
      updatedAt: Timestamp
    }
```

---

## 5️⃣ 겹치는 시간 계산 알고리즘

```typescript
calculateOverlappingSlots(timeSlots, minOverlapCount=2)
```

**이벤트 스위핑 방식:**

```
사용자A: ■■■■■■■ (10-12시)
사용자B:     ■■■■■■■ (11-13시)
사용자C:   ■■■■■ (10:30-12시)

이벤트로 변환:
10:00 → A 시작
10:30 → C 시작  (활성: A, C)
11:00 → B 시작  (활성: A, B, C) ← 3명 겹침!
12:00 → A 종료, C 종료 (활성: B)
13:00 → B 종료

결과:
11:00-12:00 → 3명 겹침 (A, B, C)
```

---

## 6️⃣ 월간뷰 배지 표시

```typescript
const dailyMaxOverlap = useMemo(() =>
  calculateDailyMaxOverlap(overlappingSlots),
  [overlappingSlots]
);
```

**동작:**
1. `overlappingSlots`에서 각 날짜별 최대 겹침 인원수 추출
2. 월간뷰에서 각 날짜에 빨간 배지로 숫자 표시

```
┌──────┬──────┬──────┐
│ 1    │ 2    │ 3    │
│      │  🔴3 │      │  ← 2일에 3명 겹침
├──────┼──────┼──────┤
│ 4    │ 5    │ 6    │
│      │      │  🔴2 │
└──────┴──────┴──────┘
```

---

## 🎯 핵심 포인트

1. **단방향 데이터 흐름**: Firestore → React Query → 화면
2. **낙관적 업데이트 없음**: 저장 완료 후 재조회
3. **실시간 계산**: 겹치는 시간은 클라이언트에서 매번 계산
4. **캐시 관리**: React Query가 자동으로 캐시 무효화 및 재조회

간단히 말하면:
- **읽기**: Firestore → Hook → 화면
- **쓰기**: 사용자 액션 → 핸들러 → Firestore → Hook → 화면 갱신

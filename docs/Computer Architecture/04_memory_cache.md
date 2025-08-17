---
title: "Memory cache"
---

# 캐시 심화 (Cache Deep Dive)

이 문서는 캐시 구조의 내부 동작, 설계 선택, 멀티코어 환경에서의 일관성 문제까지 포괄적으로 설명합니다.

## 캐시 레벨과 역할
- L1: 코어당 초고속 캐시(작고 낮은 지연)
- L2/L3: 코어간 공유 또는 코어별 중간 계층, 용량과 지연의 균형

## 매핑 및 연관성
- 직접 사상(Direct-mapped): 각 메모리 블록은 오직 한 라인으로만
- 집합 연관(Set-associative): 각 주소는 특정 세트에 매핑되고 그 세트 내에서 여러 라인 중 선택
- 완전 연관(Fully-associative): 어떤 블록도 어느 라인에나 저장 가능(비교적 드물음)

## 교체 정책
- LRU(Least Recently Used), LFU, FIFO, Random
- 하드웨어 구현의 복잡성과 오버헤드 고려

## 쓰기 및 일관성
- Write-through vs Write-back
- 캐시 일관성(COHERENCE): MESI, MOESI 같은 프로토콜을 사용하여 멀티코어에서의 일관성 유지
- 쓰기 버퍼, 쓰기 합병 등의 기법으로 쓰기 성능 향상

## 성능 최적화
- 라인 크기: 너무 크면 공간적 지역성은 살리지만 과도한 오버페치 발생
- 연관성 조정: 충돌 미스 감소를 위해 적절한 연관성 선택
- 소프트웨어 최적화: 데이터 구조/알고리즘을 캐시 친화적으로 설계

## 측정 및 프로파일링
- 미스율(Miss rate), 중간-레벨 미스, 오프코어 대역폭 측정
- 성능 카운터(Performance Counters)를 이용한 분석

---

### 캐시 예시: set-associative 조회 (의사코드)
```c
// set 인덱스를 계산하고 태그를 검사
int set = (address >> LINE_OFFSET) & (NUM_SETS-1);
for (int i = 0; i < ASSOCIATIVITY; ++i) {
	if (cache[set].lines[i].valid && cache[set].lines[i].tag == tag_of(address)) {
		// 히트: 데이터 반환
		return cache[set].lines[i].data[offset(address)];
	}
}
// 미스: 하위 계층에서 가져와 설치
```

### 시각적 비교: Direct-mapped vs Set-assoc (2-way)
```
Direct-mapped: 각 세트가 1개의 라인만 가짐 -> 충돌이 쉽게 발생
Set-assoc (2-way): 각 세트가 2개의 라인을 가짐 -> 충돌이 줄어듦

Set 0: [lineA] [lineB]
Set 1: [lineC] [lineD]
```

*** End Patch

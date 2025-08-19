---
title: '01 Components
date: '2025-08-19T16:31:12+09:00'
---



title: "컴퓨터의 핵심 부품"
# 컴퓨터의 핵심 부품

이 문서는 컴퓨터 시스템을 구성하는 주요 하드웨어 블록과 각 블록의 역할을 간단히 정리합니다: CPU, 레지스터 파일, ALU, 파이프라인 단계, 메모리 계층(L1/L2/L3, DRAM), 스토리지(SSD/HDD), I/O, 그리고 인터커넥트/버스.


## 주요 부품별 역할 요약
- **CPU**: 연산과 제어의 중심, 프로그램 명령어 해석 및 실행
- **레지스터/ALU**: 초고속 임시 저장 및 산술 논리 연산
- **파이프라인**: 명령어 처리 효율화, 동시 처리 증가
- **메모리 계층**: 캐시(L1/L2/L3)는 속도, DRAM은 용량 담당
- **스토리지**: SSD/HDD 등 대용량 비휘발성 저장
- **I/O와 버스**: 외부 장치와 데이터 교환, 시스템 확장성

## 실무 팁 및 성능 고려
- CPU와 메모리 사이의 병목이 전체 성능을 좌우함
- 캐시 미스, 메모리 대역폭, I/O 지연 등 병목 포인트 파악이 중요
- DMA(Direct Memory Access)는 CPU 개입 없이 대용량 데이터 전송에 활용

## 간단한 구조 도식

간단한 ASCII 도식
```
   +------+    +------+    +------+
   | CPU  |<-->| L1   |<-->| L2   |
   +------+    +------+    +------+
      |                       |
      v                       v
   +-------------------------------+
   |             DRAM              |
   +-------------------------------+
      |
      v
   +----------------+
   |   Storage (SSD)|
   +----------------+
```


## 예시: 메모리 접근 순서와 성능

```c
// Two loops that access the same array; the first is cache-friendly
int sum_row_major(int *a, int rows, int cols) {
   int s = 0;
   for (int r = 0; r < rows; ++r)
      for (int c = 0; c < cols; ++c)
         s += a[r*cols + c]; // sequential accesses
   return s;
}

int sum_col_major(int *a, int rows, int cols) {
   int s = 0;
   for (int c = 0; c < cols; ++c)
      for (int r = 0; r < rows; ++r)
         s += a[r*cols + c]; // many cache misses if rows>>cols
   return s;
}
```


설명: 위 예시는 접근 순서가 캐시 동작에 어떻게 영향을 주는지 보여줍니다. 파이프라이닝, 분기 예측, 캐시 일관성 등은 별도 문서에서 다룹니다.

---
### 연습 문제
1) CPU, 메모리, I/O 중 시스템 전체 성능에 가장 큰 영향을 주는 병목은 무엇인지, 그리고 그 이유를 간단히 설명하라.

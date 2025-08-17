---
---

---
title: "컴퓨터의 핵심 부품"
---

# 컴퓨터의 핵심 부품

이 문서는 컴퓨터 시스템을 구성하는 주요 하드웨어 블록과 각 블록의 역할을 간단히 정리합니다: CPU, 레지스터 파일, ALU, 파이프라인 단계, 메모리 계층(L1/L2/L3, DRAM), 스토리지(SSD/HDD), I/O, 그리고 인터커넥트/버스.

섹션
- 각 블록의 역할 요약
- CPU 내부: registers, ALU, control logic, pipeline
- 메모리 계층: caches, DRAM, latency vs bandwidth
- I/O와 interrupts, DMA 개요
- 실무 팁 및 성능 고려사항

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

간단 예시: 메모리 접근 순서가 성능에 미치는 영향

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

설명: 위 예시는 접근 순서가 cache 동작에 어떻게 영향을 주는지 보여줍니다. 파이프라이닝, branch prediction, cache coherence 같은 심화 주제는 관련 문서를 참조하세요.

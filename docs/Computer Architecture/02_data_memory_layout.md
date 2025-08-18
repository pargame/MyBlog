---
title: "메모리 레이아웃과 정렬(Padding & Alignment)"
---

# 메모리 레이아웃과 정렬(Padding & Alignment)

메모리에 변수와 구조체가 배치되는 방식, 엔디언과 정렬이 성능에 미치는 영향에 대해 설명합니다.

## 엔디언 복습
- Little-endian vs Big-endian: 바이트 순서의 차이
- 네트워크 바이트 순서는 보통 Big-endian

## 구조체 정렬
- 각 멤버는 자신의 정렬 요구(alignment)로 배치
- 컴파일러는 멤버 사이에 패딩을 삽입해 다음 멤버의 정렬을 보장
- 구조체 전체 크기는 멤버 중 최대 정렬의 배수로 패딩 될 수 있음

예시:
```c
struct A {
  char c;   // offset 0
  int  x;   // offset 4 (padding 3 bytes)
  short y;  // offset 8
};

// sizeof(struct A) == 12 (ABI에 따라 달라질 수 있음)
```

## misaligned access
- 일부 아키텍처는 misaligned access에서 예외를 발생시키거나 성능 패널티가 크다
- 성능 최적화를 위해 데이터 정렬을 고려

## 캐시 라인과 성능
- 구조체 크기/정렬은 캐시 라인 사용률에 영향을 미친다
- 패딩을 줄이고 캐시 지역성을 개선하면 성능 향상

---
title: '정수 표현과 비트 연산 (Integers & Bitwise)
date: '2025-08-18T13:44:57+09:00'
---



# 정수 표현과 비트 연산 (Integers & Bitwise)

이 문서는 정수의 표현 방식, 범위, 2의 보수, 비트 연산과 관련된 실용 예시를 다룹니다.

## 비트 너비와 표현 범위
- n-bit unsigned: 0 .. 2^n - 1
- n-bit two's complement: -2^(n-1) .. 2^(n-1)-1

예: 8-bit

```
unsigned:  0 .. 255
two's complement: -128 .. 127
```

## 2의 보수 (Two's complement)
- 음수 생성: 모든 비트 반전 후 1 더하기
- 덧셈 회로는 signed/unsigned 구분 없이 동일하게 동작

예시 (8-bit):

```
3 =  00000011
~3 =  11111100
~3+1 = 11111101 => -3
```

## 비트 연산
- AND, OR, XOR, NOT: 플래그 마스크, 비트 필드 조작에 사용
- 시프트: logical vs arithmetic (부호 비트 유지 여부)

예: 마스크로 하위 4비트 추출

```c
int x = 0xAB; // 1010 1011
int low4 = x & 0xF; // 0xB (1011)
```

## 오버플로우와 안전한 연산
- Signed overflow는 정의되지 않거나(언어에 따라) 구현 의존적일 수 있음
- 언어에서 안전한 산술(예: saturating, checked add)을 사용하거나 더 넓은 타입으로 승격

## 연습 문제
- 주어진 8-bit 패턴 0b10000000을 signed/unsigned로 각각 해석하라.
- 두 8-bit 수를 더할 때 signed overflow를 감지하는 코드를 작성해 보라.

---
title: "Data fp"
---

# 부동소수점(IEEE 754) 심화 (Floating Point)
# 부동소수점(IEEE 754) 심화 (Floating Point)

이 문서는 IEEE-754 표준의 기본 구조, 표현 한계, 특수값 및 흔한 문제(반올림, 정규화, denormal)를 설명합니다.

## 구성 요소
- sign (1 bit)
- exponent (bias 적용)
- significand (가수, hidden bit 포함)

예: binary32 (float)
- sign: 1비트
- exponent: 8비트 (bias = 127)
- significand: 23비트

## 표현 예시
13.5를 binary32로 표현하는 과정(요약):
- 13.5 = 1101.1(2) = 1.1011 x 2^3
- exponent = 3 + 127 = 130 -> 10000010
- significand = 1011000... (23비트)

## 특수값
- exponent 전부 1, significand 0 -> Infinity
- exponent 전부 1, significand != 0 -> NaN
- exponent 전부 0, significand != 0 -> denormal

## 수치 오류와 권장 실무
- 비교 시 절대/상대 오차 기준 사용
- 누적합은 Kahan summation 등 오차 보정 기법 고려

## 유틸리티
- 비트 레벨 확인용 함수(문서의 `02_data.md`에 있는 예시 코드 참고)

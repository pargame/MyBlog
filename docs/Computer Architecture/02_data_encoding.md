---
title: "Data encoding"
---

# 문자 인코딩과 UTF-8 (Encoding & Unicode)
# 문자 인코딩과 UTF-8 (Encoding & Unicode)

문자 인코딩의 원리, UTF-8의 구조, 그리고 문자열 처리 시 주의점을 정리합니다.

## 기본 개념
- Unicode code point: 문자의 번호(U+....)
- Encoding: 코드 포인트를 바이트 시퀀스로 변환(UTF-8, UTF-16 등)
- UTF-8: ASCII와 호환되는 가변 길이 인코딩

## UTF-8 구조
- 1-byte: 0xxxxxxx (ASCII)
- 2-byte: 110xxxxx 10xxxxxx
- 3-byte: 1110xxxx 10xxxxxx 10xxxxxx
- 4-byte: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx

## 실무 팁
- 문자열 길이(len)와 코드 포인트 수는 다를 수 있음
- 바이트 단위 조작(예: slicing)은 멀티바이트 문자를 깨뜨릴 수 있음
- 파일/네트워크 입출력 시 인코딩을 명시적으로 처리

## 예시
- 'A' -> 0x41
- '€' (U+20AC) -> E2 82 AC (UTF-8)

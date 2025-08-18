---
title: "컴퓨터가 이해하는 정보"
---
# 컴퓨터가 이해하는 정보


이 문서에서는 데이터의 표현 방식과 명령어의 기본 개념을 다룹니다.

## __데이터 - 0과 1로 숫자 표현하기
- 정수 표현
  - 부호 없는 정수(unsigned): 단순히 이진 비트를 정수로 해석
  - 2의 보수(2's complement): 음수 표현에 일반적으로 사용, 덧셈 회로가 단순해짐
- 고정소수점 vs 부동소수점
  - 고정소수점: 소수점 위치를 고정
  - 부동소수점(IEEE 754): 가수(significand)와 지수(exponent)로 넓은 범위를 표현

## __데이터 - 0과 1로 문자 표현하기
- ASCII, UTF-8 같은 문자 인코딩을 통해 바이트(또는 멀티바이트)를 문자로 매핑
- 유니코드(UTF-8)의 가변 길이 인코딩 특성은 문자열 처리와 메모리 관리에 영향

## __명령어
- 명령어(Instruction): CPU가 수행할 동작을 정의. 일반적으로 Opcode + Operands 구조
- ISA(Instruction Set Architecture): 프로그래머와 컴파일러가 보는 명령어 집합의 규격
- 명령어 형식: 즉시값(immediate), 레지스터, 메모리 주소 등 다양한 오퍼랜드 모드

간단 예시:
- `ADD R1, R2, R3` — R2와 R3를 더해 R1에 저장
- `LOAD R1, [R2]` — 주소 R2가 가리키는 메모리에서 값을 읽어 R1에 저장

명령어 형식과 데이터 표현은 ISA 설계에서 밀접히 연관되어 있습니다.

## 세부 문서

다음 문서들에서 각 주제를 더 자세히 다룹니다:

- [정수와 비트 연산](02_data_integers.md)
- [부동소수점(IEEE-754) 심화](02_data_fp.md)
- [문자 인코딩과 UTF-8](02_data_encoding.md)
- [메모리 레이아웃, 정렬, 패딩](02_data_memory_layout.md)

## __비트와 바이트: 레이아웃 시각화
```
바이트(Byte, 8 bits) 레이아웃 (bit 7 .. bit 0)
  [ b7 b6 b5 b4 b3 b2 b1 b0 ]

다바이트 값 예시(여기서는 big-endian 순서로 표시)
  주소 0: [ byte0 ]  (가장 중요한 바이트, most significant)
  주소 1: [ byte1 ]
  주소 2: [ byte2 ]  (가장 덜 중요한 바이트, least significant)
```

### Endianness (간단히)
- Big-endian: 가장 중요한 바이트(MSB)가 낮은 주소에 저장됩니다.
- Little-endian: 가장 중요한 바이트(MSB)가 낮은 주소가 아닌 반대 순서로 저장됩니다.
- 동일한 다바이트 값을 메모리에 쓸 때 바이트 순서가 다르게 보입니다.

예시(32-bit 값 0x11223344):
```
Big-endian   @addr: 11 22 33 44
Little-endian@addr: 44 33 22 11
```

## __정수의 범위와 변환
- 비트 수에 따른 표현 범위(예: 8-bit):
  - unsigned 8-bit: 0 .. 255
  - signed 8-bit (two's complement): -128 .. 127
- n-bit에서의 unsigned 최대값: 2^n - 1
- n-bit에서의 two's complement 최소값: -2^(n-1), 최대값: 2^(n-1)-1

예시(8-bit):
```
unsigned:  0 .. 255
two's complement: -128 .. 127
```

Signed/Unsigned 변환은 비트 패턴은 같지만 해석이 달라진다는 점을 기억해야 합니다.

## __2의 보수와 산술(간단한 규칙)
- 2의 보수로 음수를 만들려면 비트를 반전시키고 1을 더합니다.
- 덧셈 회로는 signed/unsigned를 구분하지 않고 동일한 하드웨어로 동작하지만 오버플로우 판단은 해석에 따라 다릅니다.

예시: 8-bit에서 -3
```
3 = 00000011
invert = 11111100
add 1 = 11111101  => -3
```

오버플로우 예시(8-bit, signed):
```
  100 + 50 = 150 -> 비트 결과는 10010110 (interpreted as -106) => signed overflow
```

## __비트 연산과 시프트
- AND, OR, XOR, NOT는 비트 레벨로 동작하며 마스크, 플래그 검사에 유용합니다.
- 논리적 시프트(logical shift)와 산술적 시프트(arithmetic shift)의 차이를 이해해야 합니다(부호 비트 취급).

예: 오른쪽 산술 시프트는 음수의 경우 최상위 비트를 유지합니다.

## __부동소수점(IEEE 754) 요약
- 부동소수점은 sign(1비트), exponent(바이어스 적용), significand(가수)로 구성됩니다.
- IEEE-754 binary32(32-bit float) 예:
  - sign: 1비트
  - exponent: 8비트 (bias 127)
  - significand: 23비트

예: 13.5를 binary32로 표현하면 (간단히 과정) 13.5 = 1101.1(2) => 정규화 1.1011 x 2^3
  - exponent = 3 + 127 = 130 => 10000010
  - significand = 1011000... (23비트)

특수값: Infinity, -Infinity, NaN(부동소수점 연산 불능/비정상 결과), denormal(gradual underflow)

### 부동소수점 비트 출력 유틸리티 (C)
```c
#include <stdio.h>
#include <stdint.h>

void print_float_bits(float f) {
  uint32_t u;
  memcpy(&u, &f, sizeof(u));
  for (int i = 31; i >= 0; --i) putchar((u & (1u<<i)) ? '1' : '0');
  putchar('\n');
}

// 사용 예: print_float_bits(13.5f);
```

## __문자 인코딩과 UTF-8 심화
- UTF-8은 가변 길이 인코딩으로 ASCII와 하위 호환됩니다.
- 코드포인트와 코드 유닛의 차이: Unicode code point는 문자 번호, UTF-8의 코드 유닛은 바이트값(8-bit)
- 문자열 조작 시 바이트 단위와 문자(유니코드 코드 포인트) 단위를 구분해야 합니다(예: slicing, length 계산).

## __메모리 정렬(Alignment)과 패딩
- 구조체(struct)의 멤버는 보통 타입의 정렬 요구(예: 4-byte alignment)에 맞춰 배치됩니다.
- 컴파일러는 패딩을 넣어 다음 멤버의 정렬을 보장하고, 구조체 전체 크기를 멤버 최대 정렬의 배수로 만듭니다.

예시:
```c
struct A {
  char c;   // offset 0
  int  x;   // offset 4 (padding 3 bytes after c)
  short y;  // offset 8
};

// sizeof(struct A) == 12 (종속적일 수 있음: ABI/컴파일러에 따라 다름)
```

패딩과 정렬은 메모리 접근 성능과 데이터 공유(캐시 라인 경계)에도 영향을 줍니다.

## __엔디언과 메모리 보기 (더 많은 예시)
다음은 메모리 상의 바이트 주소와 값 예시입니다(32-bit 값 0xAABBCCDD):

Little-endian 호스트에서의 메모리(주소 증가 방향) :
```
addr:  0x00 -> DD
addr:  0x01 -> CC
addr:  0x02 -> BB
addr:  0x03 -> AA
```

Big-endian 호스트:
```
addr:  0x00 -> AA
addr:  0x01 -> BB
addr:  0x02 -> CC
addr:  0x03 -> DD
```

네트워크 바이트순서(network byte order)는 일반적으로 Big-endian으로 정의됩니다.

## __메모리에서의 데이터와 명령어(짧은 연결)
- CPU는 메모리에서 바이트를 읽어와 내부 레지스터에 로드하고, 명령어는 opcode와 오퍼랜드를 바탕으로 동작합니다.
- `LOAD`와 `STORE` 연산은 메모리 정렬과 endian에 민감합니다(예: misaligned access는 성능 저하나 예외를 발생시킬 수 있음).

## __유틸리티 함수 업데이트
이전의 `print_bytes`와 `print_binary`를 보완하여, 부동소수점과 구조체 바이트를 확인할 수 있습니다.

```c
#include <stdio.h>
#include <string.h>
#include <stdint.h>

void print_bytes(const void *ptr, size_t len) {
  const unsigned char *p = (const unsigned char*)ptr;
  for (size_t i = 0; i < len; ++i) printf("%02X ", p[i]);
  printf("\n");
}

void print_binary_uint(uint32_t v, int bits) {
  for (int i = bits-1; i >= 0; --i) putchar((v & (1u<<i)) ? '1' : '0');
  putchar('\n');
}

// 예: int x = 13; print_bytes(&x, sizeof(x)); print_binary_uint((uint32_t)x, 32);
```

---

### 예시 다시보기

이진 정수 (8-bit unsigned):
```
  13 -> 00001101
```

2의 보수(8-bit)로 -3 표현 예:
```
  -3 -> 11111101  (two's complement)
```

ASCII vs UTF-8 예시:
```
  'A' -> 0x41 (ASCII)
  '€' -> 0xE2 0x82 0xAC (UTF-8, 3 bytes)
```

명령어 예시(의사어셈블리) 및 등가 C 코드:
```asm
; assembly-like pseudo
LOAD R1, [R0]   ; load value at address in R0
ADD  R1, R1, #1 ; increment
STORE R1, [R0]  ; write back
```

```c
// C equivalent
int *p = (int*)addr;
*p = *p + 1;
```

위 예시들은 데이터 표현과 명령어 인코딩이 실제 동작으로 어떻게 연결되는지 보여줍니다.

## 참고 문서
- CPU 관련 심화 항목: [03_cpu.md](03_cpu.md)
- 메모리 관련 심화: [04_memory.md](04_memory.md)

## __문자 인코딩과 바이트 출력 예시
간단한 C 예시: 문자열을 바이트(16진수)로 출력
```c
#include <stdio.h>
#include <string.h>

void print_bytes(const char *s) {
  for (size_t i = 0; i < strlen(s); ++i)
    printf("%02X ", (unsigned char)s[i]);
  printf("\n");
}

int main(void) {
  const char *a = "A";         // ASCII
  const char *euro = "€";      // UTF-8: 3 bytes
  print_bytes(a);    // prints: 41
  print_bytes(euro); // prints: E2 82 AC
  return 0;
}
```

## __바이너리 출력 예시 (유틸리티 함수)
짧은 C 함수: 정수를 이진 문자열로 출력
```c
#include <stdio.h>

void print_binary(unsigned int v, int bits) {
  for (int i = bits-1; i >= 0; --i)
    putchar((v & (1u<<i)) ? '1' : '0');
  putchar('\n');
}

// 사용 예: print_binary(13, 8) -> 00001101
```

---

### 예시

이진 정수 (8-bit unsigned):
```
  13 -> 00001101
```

2의 보수(8-bit)로 -3 표현 예:
```
  -3 -> 11111101  (two's complement)
```

ASCII vs UTF-8 예시:
```
  'A' -> 0x41 (ASCII)
  '€' -> 0xE2 0x82 0xAC (UTF-8, 3 bytes)
```

명령어 예시(의사어셈블리) 및等가 C 코드:
```asm
; assembly-like pseudo
LOAD R1, [R0]   ; load value at address in R0
ADD  R1, R1, #1 ; increment
STORE R1, [R0]  ; write back
```

```c
// C equivalent
int *p = (int*)addr;
*p = *p + 1;
```

위 예시들은 데이터 표현과 명령어 인코딩이 실제 동작으로 어떻게 연결되는지 보여줍니다.

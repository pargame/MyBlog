---
title: 'FRotator'
date: '2025-08-17T16:17:41+09:00'
---
> **오일러 각(Euler angles)을 사용하여 3차원 공간에서의 '회전'을 나타내는 구조체입니다.** 인간이 직관적으로 이해하고 에디터에서 값을 편집하기 쉬운 Roll, Pitch, Yaw 세 가지 축에 대한 회전 값으로 구성됩니다.

### **1. 주요 역할 및 책임**
> **각 축에 대한 회전 각도를 직접 보여주므로, 디자이너나 아티스트가 언리얼 에디터의 'Details' 패널에서 회전 값을 쉽게 설정하고 이해할 수 있습니다.**
* **직관적인 회전 표현 (Intuitive Rotation Representation)**:
	각 축에 대한 회전 각도를 직접 보여주므로, 디자이너나 아티스트가 언리얼 에디터의 'Details' 패널에서 회전 값을 쉽게 설정하고 이해할 수 있습니다.
* **간단한 회전 설정 (Simple Rotation Setup)**:
	특정 축을 중심으로 간단한 회전을 적용하고자 할 때 사용하기 편리합니다.

### **2. 핵심 멤버 변수**
> **Y축을 중심으로 한 회전입니다.**
* **`Pitch` (`float`)**:
	Y축을 중심으로 한 회전입니다. (고개를 위아래로 끄덕이는 움직임)
* **`Yaw` (`float`)**:
	Z축을 중심으로 한 회전입니다. (고개를 좌우로 도리도리하는 움직임)
* **`Roll` (`float`)**:
	X축을 중심으로 한 회전입니다. (고개를 좌우로 갸우뚱하는 움직임)

> 각 값의 단위는 '도(Degree)'입니다.

### **3. 주요 함수 및 연산자**
> **두 `FRotator`를 더하거나 빼서 회전 값을 조합할 수 있습니다.**
* **`+`, `-`**:
	두 `FRotator`를 더하거나 빼서 회전 값을 조합할 수 있습니다.
* **`RotateVector(FVector V)`**:
	주어진 [[FVector]]를 이 `FRotator`만큼 회전시킨 결과를 반환합니다.
* **`Vector()`**:
	이 `FRotator`가 향하는 방향의 단위 [[FVector]](방향 벡터)를 반환합니다.
* **`Quaternion()`**:
	`FRotator`를 [[FQuat]]로 변환합니다. 복잡한 회전 연산 전에는 쿼터니언으로 변환하는 것이 권장됩니다.

### **4. 짐벌 락 (Gimbal Lock)**
> **`FRotator`는 오일러 각을 사용하기 때문에 '짐벌 락'이라는 문제에 취약합니다.**
`FRotator`는 오일러 각을 사용하기 때문에 '짐벌 락'이라는 문제에 취약합니다. Pitch 값이 ±90도에 가까워지면 Roll과 Yaw가 같은 회전을 표현하게 되어 자유로운 회전이 불가능해지는 현상입니다. 이 때문에 여러 회전을 조합하거나 부드럽게 보간하는 등의 복잡한 계산에는 내부적으로 [[FQuat]]을 사용하는 것이 안전하고 효율적입니다.

## 관련 클래스
> **수학적으로 더 안정적인 회전 표현 방식인 쿼터니언입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[FQuat]]**:
	수학적으로 더 안정적인 회전 표현 방식인 쿼터니언입니다.
* **[[FVector]]**:
	3차원 벡터로, `FRotator`에 의해 회전될 수 있습니다.
* **[[FTransform]]**:
	이동, 회전, 크기를 모두 포함하는 구조체로, 에디터에서는 회전을 `FRotator`로 표시하지만 내부적으로는 [[FQuat]]으로 관리합니다.

## 코드 예시
> **// FRotator로 전방 벡터 회전 및 쿼터니언 변환 예시 FRotator R(0.f, 90.f, 0.f); // Yaw 90도 FVector Forward = FVector::ForwardVector; FVector Right = R.RotateVector(Forward); // 전방을 우측으로 회전**
```cpp
// FRotator로 전방 벡터 회전 및 쿼터니언 변환 예시
FRotator R(0.f, 90.f, 0.f); // Yaw 90도
FVector Forward = FVector::ForwardVector;
FVector Right = R.RotateVector(Forward); // 전방을 우측으로 회전

// 복잡한 연산 전 쿼터니언으로 변환
FQuat Q = R.Quaternion();
FVector Rotated = Q.RotateVector(Forward);
```

---
title: 'FQuat'
date: '2025-08-17T16:17:41+09:00'
---
> **쿼터니언(Quaternion, 사원수)을 사용하여 3차원 공간에서의 '회전'을 나타내는 구조체입니다.** [[FRotator]]가 제공하는 오일러 각(Euler angles) 방식의 단점(예: 짐벌 락)을 해결하고, 여러 회전을 조합하거나 보간(Interpolation)하는 데 있어 더 안정적이고 효율적인 방법을 제공합니다.

### **1. 주요 역할 및 책임**
> **4개의 부동소수점 값(X, Y, Z, W)을 사용하여 회전을 표현합니다.**
* **안정적인 회전 표현 (Stable Rotation Representation)**:
	4개의 부동소수점 값(X, Y, Z, W)을 사용하여 회전을 표현합니다. 이는 짐벌 락(Gimbal Lock) 현상이 발생하지 않아 복잡한 회전 계산에 매우 유리합니다.
* **효율적인 회전 연산 (Efficient Rotation Operations)**:
	두 회전을 곱하여(조합하여) 새로운 회전을 만들거나, 두 회전 사이를 부드럽게 보간(Slerp)하는 연산이 [[FRotator]]보다 수학적으로 더 간단하고 빠릅니다.
* **[[FTransform]]의 일부**:
	[[FTransform]] 구조체 내부에서 회전은 `FQuat`로 저장되어 처리됩니다.

### **2. 핵심 멤버 변수**
> **회전을 정의하는 4개의 `float` 값입니다.**
* **`X`, `Y`, `Z`, `W`**:
	회전을 정의하는 4개의 `float` 값입니다.

### **3. 주요 함수 및 연산자**
> **두 `FQuat`를 곱하면 두 회전이 순서대로 적용된 새로운 회전이 반환됩니다.**
* **`*` (곱셈 연산자)**:
	두 `FQuat`를 곱하면 두 회전이 순서대로 적용된 새로운 회전이 반환됩니다. `A * B`는 B 회전을 먼저 적용하고 그 다음 A 회전을 적용하는 것과 같습니다.
* **`Slerp(const FQuat &Quat1, const FQuat &Quat2, float Slerp)`**:
	구면 선형 보간(Spherical Linear Interpolation)을 수행합니다. 두 회전 사이를 가장 짧은 호를 그리며 부드럽게 보간한 결과를 반환합니다. 애니메이션이나 카메라 이동에 필수적입니다.
* **`Inverse()`**:
	현재 회전의 역회전을 반환합니다.
* **`RotateVector(FVector V)`**:
	주어진 [[FVector]]를 이 쿼터니언만큼 회전시킨 결과를 반환합니다.
* **`MakeFromEuler(const FVector& Euler)`**:
	오일러 각(X: Roll, Y: Pitch, Z: Yaw)으로 표현된 [[FVector]]로부터 `FQuat`를 생성합니다.

### **4. 변환**
> **`FQuat`는 [[FRotator]]와 상호 변환이 가능합니다.**
`FQuat`는 [[FRotator]]와 상호 변환이 가능합니다.
* **`FQuat(FRotator R)`**:
	생성자를 통해 [[FRotator]]로부터 `FQuat`를 만듭니다.
* **`MyQuat.Rotator()`**:
	`FQuat`를 [[FRotator]]로 변환합니다.

### **5. 관련 구조체**
> **인간이 이해하기 쉬운 오일러 각(Roll, Pitch, Yaw)으로 회전을 표현하는 방식입니다.**
* **[[FRotator]]**:
	인간이 이해하기 쉬운 오일러 각(Roll, Pitch, Yaw)으로 회전을 표현하는 방식입니다. 에디터에서 값을 설정할 때 주로 사용됩니다.
* **[[FVector]]**:
	3차원 벡터로, `FQuat`에 의해 회전될 수 있습니다.
* **[[FTransform]]**:
	이동, 회전, 크기를 모두 포함하며, 내부적으로 회전을 `FQuat`로 관리합니다.

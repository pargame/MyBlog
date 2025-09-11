---
title: 'FVector'
date: '2025-08-17T16:17:41+09:00'
---
> **3차원 공간에서의 위치, 방향, 크기 등을 나타내는 데 사용되는 가장 기본적인 부동소수점(float) 3개(X, Y, Z)의 집합 구조체입니다.** 언리얼 엔진의 거의 모든 곳에서 3D 좌표를 다루기 위해 사용되는 핵심 데이터 타입입니다.

### **1. 주요 역할 및 책임**
> **월드나 특정 액터를 기준으로 한 좌표(Location)를 나타냅니다.**
* **위치 표현 (Representing Position)**:
	월드나 특정 액터를 기준으로 한 좌표(Location)를 나타냅니다. (예: [[AActor]]의 위치)
* **방향과 크기 표현 (Representing Direction and Magnitude)**:
	어떤 지점에서 다른 지점으로의 방향과 거리를 나타내는 벡터로 사용됩니다. 이 경우 벡터의 길이는 크기(예: 속도)를, 정규화된 벡터는 순수한 방향을 나타냅니다.
* **크기 조절 표현 (Representing Scale)**:
	오브젝트의 각 축(X, Y, Z)에 대한 크기 비율을 나타냅니다.

### **2. 핵심 멤버 변수**
> **3차원 공간의 각 축에 해당하는 `float` 타입의 값입니다.**
* **`X`, `Y`, `Z`**:
	3차원 공간의 각 축에 해당하는 `float` 타입의 값입니다.

### **3. 주요 함수 및 연산자**
> **`FVector`는 벡터 수학을 편리하게 할 수 있도록 다양한 함수와 연산자를 제공합니다.**
`FVector`는 벡터 수학을 편리하게 할 수 있도록 다양한 함수와 연산자를 제공합니다.
* **`+`, `-`, `*`, `/`**:
	벡터 간의 덧셈, 뺄셈 및 스칼라(단일 `float` 값) 곱셈, 나눗셈을 지원합니다.
* **`Size()` 또는 `Length()`**:
	벡터의 크기(길이)를 반환합니다.
* **`GetSafeNormal()` 또는 `Normalize()`**:
	벡터의 크기를 1로 만들면서 방향은 그대로 유지하는 '단위 벡터'를 구합니다. 방향 계산에 매우 중요합니다.
* **`DotProduct(const FVector& V1, const FVector& V2)`**:
	두 벡터의 내적을 계산합니다. 두 벡터가 얼마나 같은 방향을 향하는지(각도)를 알아내는 데 사용됩니다.
* **`CrossProduct(const FVector& V1, const FVector& V2)`**:
	두 벡터의 외적을 계산합니다. 두 벡터에 모두 수직인 새로운 벡터를 구하는 데 사용됩니다.

### **4. 정적 변수 (Static Variables)**
> **자주 사용되는 벡터 값들이 미리 정의되어 있습니다.**
자주 사용되는 벡터 값들이 미리 정의되어 있습니다.
* **`FVector::ZeroVector`**:
	(0, 0, 0)
* **`FVector::OneVector`**:
	(1, 1, 1)
* **`FVector::UpVector`**:
	(0, 0, 1)
* **`FVector::ForwardVector`**:
	(1, 0, 0)
* **`FVector::RightVector`**:
	(0, 1, 0)

### **5. 관련 클래스**
> **회전을 나타내는 구조체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[FRotator]]**:
	회전을 나타내는 구조체입니다.
* **[[FQuat]]**:
	회전을 나타내는 또 다른 방식의 구조체로, 주로 복잡한 회전 계산에 사용됩니다.
* **[[FTransform]]**:
	이동(Location, `FVector`), 회전(Rotation, [[FQuat]]), 크기(Scale, `FVector`)를 모두 포함하는 변환 정보의 집합입니다.

### **6. 코드 예시**
> **// 벡터 정규화와 내적/외적 사용 예시 FVector A(1.f, 2.f, 0.f); FVector B(0.f, 1.f, 0.f);**
```cpp
// 벡터 정규화와 내적/외적 사용 예시
FVector A(1.f, 2.f, 0.f);
FVector B(0.f, 1.f, 0.f);

FVector ANorm = A.GetSafeNormal();
float Dot = FVector::DotProduct(ANorm, B);
FVector Cross = FVector::CrossProduct(ANorm, B);

// 캐릭터 전방으로 이동 입력 전달
APawn* Pawn = /* ... */;
if (Pawn)
{
    Pawn->AddMovementInput(Pawn->GetActorForwardVector(), 1.0f);
}
```

---
title: 'FTransform'
date: '2025-08-17T16:17:41+09:00'
---
> **3차원 공간에서 한 오브젝트의 '변환(Transform)' 정보, 즉 이동(Location), 회전(Rotation), 크기(Scale)를 모두 포함하는 핵심 구조체입니다.** [[USceneComponent]]를 가진 모든 액터는 `FTransform`을 사용하여 월드에서의 자신의 상태를 나타냅니다.

### **1. 주요 역할 및 책임**
> **오브젝트의 위치, 방향, 크기를 하나의 단위로 묶어 관리합니다.**
* **변환 정보 통합**:
	오브젝트의 위치, 방향, 크기를 하나의 단위로 묶어 관리합니다. 이를 통해 변환과 관련된 계산을 간소화하고 일관성을 유지합니다.
* **계층 구조 계산**:
	부모-자식 관계에 있는 컴포넌트들의 최종 월드 변환을 계산하는 데 사용됩니다. 자식의 월드 변환은 부모의 월드 변환에 자식의 상대 변환을 곱하여 계산됩니다.
* **효율적인 연산**:
	내부적으로 회전은 [[FQuat]]으로, 이동과 크기는 [[FVector]]로 저장하여 빠르고 안정적인 수학적 연산을 보장합니다.

### **2. 핵심 멤버 변수**
> **오브젝트의 회전을 나타냅니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Rotation` (`FQuat`)**:
	오브젝트의 회전을 나타냅니다.
* **`Translation` (`FVector`)**:
	오브젝트의 위치(Location)를 나타냅니다.
* **`Scale3D` (`FVector`)**:
	오브젝트의 각 축에 대한 크기 비율을 나타냅니다.

### **3. 주요 함수 및 연산자**
> **두 `FTransform`을 곱하면 변환이 순서대로 적용됩니다.**
* **`*` (곱셈 연산자)**:
	두 `FTransform`을 곱하면 변환이 순서대로 적용됩니다. `A * B`는 B 변환을 먼저 적용하고, 그 결과를 기준으로 A 변환을 적용하는 것과 같습니다. 부모-자식 관계의 변환 계산에 핵심적으로 사용됩니다.
* **`Inverse()`**:
	현재 변환의 역변환을 반환합니다. 월드 공간 좌표를 로컬 공간 좌표로 변환하는 등의 작업에 사용됩니다.
* **`TransformPosition(const FVector& V)`**:
	로컬 공간에 있는 벡터 `V`를 이 `FTransform`을 적용하여 월드 공간 위치로 변환합니다.
* **`InverseTransformPosition(const FVector& V)`**:
	월드 공간에 있는 벡터 `V`를 이 `FTransform`의 역변환을 적용하여 로컬 공간 위치로 변환합니다.

### **4. 사용 방법·패턴**
> **4. 사용 방법·패턴 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
*   [[AActor]]의 월드 트랜스폼 얻기:
	`GetActorTransform()`은 루트 컴포넌트의 월드 `FTransform`을 반환합니다.
*   컴포넌트 부착:
	`AttachToComponent` 시 자식은 부모 기준의 Relative `FTransform`을 가집니다.
*   좌표 변환:
	`GetActorTransform().TransformPosition(FVector(100,0,0))`처럼 로컬 → 월드 변환을 수행합니다.

### **5. 관련 구조체**
> **이동과 크기를 나타냅니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[FVector]]**:
	이동과 크기를 나타냅니다.
* **[[FQuat]]**:
	회전을 나타냅니다.
* **[[FRotator]]**:
	에디터 편집용 회전 표현으로, 내부적으로 [[FQuat]]과 상호 변환됩니다.

### **6. 코드 예시**
> **// 새로운 FTransform을 생성하고 액터에 적용, 그리고 두 트랜스폼 결합 예시 FVector Location(100.f, 0.f, 50.f); FRotator Rotation(0.f, 90.f, 0.f); FVector Scale(1.f, 1.f, 1.f); FTransform MyTransform(Rotation, Location, Scale);**
```cpp
// 새로운 FTransform을 생성하고 액터에 적용, 그리고 두 트랜스폼 결합 예시
FVector Location(100.f, 0.f, 50.f);
FRotator Rotation(0.f, 90.f, 0.f);
FVector Scale(1.f, 1.f, 1.f);
FTransform MyTransform(Rotation, Location, Scale);

// 액터의 트랜스폼을 설정합니다.
MyActor->SetActorTransform(MyTransform);

// 두 트랜스폼을 결합합니다. (부모 트랜스폼 * 자식의 상대 트랜스폼)
FTransform WorldTransform = ParentTransform * RelativeChildTransform;
```
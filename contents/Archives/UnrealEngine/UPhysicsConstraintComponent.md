---
title: 'UPhysicsConstraintComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **두 물체를 물리적으로 연결하여 제약 조건을 적용하는 컴포넌트입니다.** [[AActor]]에 부착되어, 힌지, 스프링, 슬라이더 등 다양한 물리적 제약을 구현할 수 있습니다.

### **1. 주요 역할 및 책임**
> **물체가 특정 축을 중심으로 회전하도록 제한합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **힌지 제약 (Hinge Constraint)**:
	물체가 특정 축을 중심으로 회전하도록 제한합니다.
* **슬라이더 제약 (Slider Constraint)**:
	물체가 특정 축을 따라 이동하도록 제한합니다.
* **스프링 제약 (Spring Constraint)**:
	물체 간의 거리를 유지하면서 스프링 효과를 적용합니다.

### **2. 핵심 속성**
> **제약 조건이 적용될 두 액터를 설정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`ConstraintActor1` / `ConstraintActor2`**:
	제약 조건이 적용될 두 액터를 설정합니다.
* **`LinearXLimit`**:
	X축 이동 제한을 설정합니다.
* **`AngularSwing1Limit`**:
	첫 번째 스윙 축의 회전 제한을 설정합니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1. **컴포넌트 추가**:
	[[AActor]]의 블루프린트에서 `Physics Constraint Component`를 추가합니다.
2. **제약 조건 설정**:
	`ConstraintActor1`과 `ConstraintActor2`를 설정하고, 필요한 제약 속성을 조정합니다.
3. **물리 시뮬레이션 활성화**:
	제약 조건이 적용될 물체에 물리 시뮬레이션을 활성화합니다.

### **4. 관련 클래스**
> **제약 조건이 적용될 수 있는 액터. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[APawn]]**:
	제약 조건이 적용될 수 있는 액터.
* **[[UStaticMeshComponent]]**:
	물리 시뮬레이션이 활성화된 메시 컴포넌트.

### **5. 코드 예시**
> **#include "PhysicsEngine/PhysicsConstraintComponent.h" 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
```cpp
#include "PhysicsEngine/PhysicsConstraintComponent.h"

void AMyActor::BeginPlay()
{
    Super::BeginPlay();

    UPhysicsConstraintComponent* Constraint = NewObject<UPhysicsConstraintComponent>(this);
    Constraint->SetupAttachment(RootComponent);
    Constraint->ConstraintActor1 = Actor1;
    Constraint->ConstraintActor2 = Actor2;
    Constraint->SetLinearXLimit(ELinearConstraintMotion::LCM_Limited, 50.0f);
    Constraint->RegisterComponent();
}
```

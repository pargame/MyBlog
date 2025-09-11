---
title: 'UPhysicsHandleComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **물체를 잡고 이동하거나 회전시키는 데 사용되는 물리 핸들 컴포넌트입니다.** [[UActorComponent]]를 상속받아, 물리 기반 상호작용을 구현하는 데 사용됩니다.

### **1. 주요 역할 및 책임**
> **물리적으로 시뮬레이션되는 물체를 잡아 특정 위치로 이동시킬 수 있습니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **물체 잡기 (Grabbing Objects)**:
	물리적으로 시뮬레이션되는 물체를 잡아 특정 위치로 이동시킬 수 있습니다.
* **물체 회전 (Rotating Objects)**:
	잡은 물체를 특정 회전 값으로 조정할 수 있습니다.
* **물리적 상호작용 (Physical Interaction)**:
	물리 엔진과의 상호작용을 통해 자연스러운 움직임을 구현합니다.

### **2. 핵심 함수 및 속성**
> **현재 잡고 있는 물체를 놓습니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`GrabComponentAtLocation(UPrimitiveComponent* Component, FName BoneName, FVector Location)`**:
	지정된 위치에서 물체를 잡습니다.
* **`ReleaseComponent()`**:
	현재 잡고 있는 물체를 놓습니다.
* **`SetTargetLocationAndRotation(FVector Location, FRotator Rotation)`**:
	잡은 물체의 목표 위치와 회전을 설정합니다.

### **3. 사용 예시**
> **#include "PhysicsEngine/PhysicsHandleComponent.h" 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
```cpp
#include "PhysicsEngine/PhysicsHandleComponent.h"

void AMyActor::GrabObject(UPrimitiveComponent* TargetComponent, FVector GrabLocation)
{
    if (PhysicsHandle)
    {
        PhysicsHandle->GrabComponentAtLocation(TargetComponent, NAME_None, GrabLocation);
    }
}

void AMyActor::ReleaseObject()
{
    if (PhysicsHandle)
    {
        PhysicsHandle->ReleaseComponent();
    }
}
```

### **4. 관련 클래스**
> **물리적으로 시뮬레이션되는 모든 컴포넌트의 부모 클래스. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UPrimitiveComponent]]**:
	물리적으로 시뮬레이션되는 모든 컴포넌트의 부모 클래스.
* **[[AActor]]**:
	물리 핸들이 부착될 수 있는 액터.
```

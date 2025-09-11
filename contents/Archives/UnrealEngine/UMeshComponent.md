---
title: 'UMeshComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **3D 메시를 렌더링하고, 물리적 상호작용을 처리하는 컴포넌트입니다.** [[AActor]]에 부착되어, 게임 월드에 시각적 요소를 추가하고, 물리 엔진과의 상호작용을 제공합니다.

### **1. 주요 역할 및 책임**
> **메시를 화면에 렌더링합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **렌더링 (Rendering)**:
	메시를 화면에 렌더링합니다.
* **물리 상호작용 (Physics Interaction)**:
	메시의 충돌 및 물리적 상호작용을 처리합니다.

### **2. 핵심 속성**
> **렌더링할 메시를 설정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`StaticMesh`**:
	렌더링할 메시를 설정합니다.
* **`Material`**:
	메시에 적용할 머티리얼을 설정합니다.
* **`bSimulatePhysics`**:
	물리 시뮬레이션을 활성화할지 여부를 설정합니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1. **컴포넌트 추가**:
	[[AActor]]의 블루프린트에서 `Mesh Component`를 추가합니다.
2. **메시 및 머티리얼 설정**:
	`StaticMesh`와 `Material` 속성을 설정합니다.
3. **물리 시뮬레이션 활성화**:
	`bSimulatePhysics`를 활성화하여 물리적 상호작용을 설정합니다.

### **4. 관련 클래스**
> **정적 메시를 렌더링하는 데 사용되는 서브클래스. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UStaticMeshComponent]]**:
	정적 메시를 렌더링하는 데 사용되는 서브클래스.
* **[[USkeletalMeshComponent]]**:
	스켈레탈 메시를 렌더링하고 애니메이션을 처리하는 서브클래스.

### **5. 코드 예시**
> **#include "Components/StaticMeshComponent.h"**
```cpp
#include "Components/StaticMeshComponent.h"

void AMyActor::BeginPlay()
{
    Super::BeginPlay();

    UStaticMeshComponent* MeshComponent = NewObject<UStaticMeshComponent>(this);
    MeshComponent->SetupAttachment(RootComponent);
    MeshComponent->SetStaticMesh(MyStaticMesh);
    MeshComponent->SetMaterial(0, MyMaterial);
    MeshComponent->SetSimulatePhysics(true);
    MeshComponent->RegisterComponent();
}
```

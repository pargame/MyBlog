---
title: 'UStaticMeshComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **움직이지 않는 3D 모델([[UStaticMesh]])을 월드에 렌더링하고, 물리적으로 상호작용하게 만드는 가장 기본적인 '시각적 부품'입니다.** [[AActor]]에 시각적 형태와 물리적 실체를 부여하는 데 가장 널리 사용되는 컴포넌트입니다.

### **1. 주요 역할 및 책임**
> **지정된 [[UStaticMesh]] 에셋을 월드의 특정 위치에 렌더링하는 주된 역할을 합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **메시 렌더링 (Mesh Rendering)**:
	지정된 [[UStaticMesh]] 에셋을 월드의 특정 위치에 렌더링하는 주된 역할을 합니다. 머티리얼을 적용하여 메시의 표면 재질을 결정할 수 있습니다.
* **충돌 및 물리 (Collision and Physics)**:
	[[UStaticMesh]] 에셋에 포함된 충돌 설정을 사용하여, 다른 오브젝트와의 충돌(Block)이나 간섭(Overlap) [[Event]]를 감지합니다. 또한, 물리 시뮬레이션을 활성화하여 중력의 영향을 받거나 외부 힘에 반응하게 만들 수 있습니다.
* **레벨 디자인의 기본 단위 (Fundamental Unit of Level Design)**:
	벽, 바닥, 가구, 소품 등 레벨을 구성하는 대부분의 시각적 요소는 [[AStaticMeshActor]]에 포함된 이 `UStaticMeshComponent`를 통해 구현됩니다.

### **2. 핵심 함수 및 속성**
> **이 컴포넌트가 렌더링할 [[UStaticMesh]] 에셋을 런타임에 변경합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `SetStaticMesh(UStaticMesh* NewMesh)`:
	이 컴포넌트가 렌더링할 [[UStaticMesh]] 에셋을 런타임에 변경합니다.
* `SetMaterial(int32 ElementIndex, UMaterialInterface* Material)`:
	메시의 특정 머티리얼 슬롯에 새로운 머티리얼을 적용합니다.
* `SetSimulatePhysics(bool bSimulate)`:
	이 컴포넌트의 물리 시뮬레이션을 활성화하거나 비활성화합니다. `true`로 설정하면, 컴포넌트는 중력의 영향을 받고 다른 물리 오브젝트와 사실적으로 상호작용하기 시작합니다.
* `AddImpulse(FVector Impulse, ...)`:
	물리 시뮬레이션이 활성화된 상태에서, 컴포넌트에 순간적인 힘(충격량)을 가하여 특정 방향으로 튕겨나가게 합니다.

### **3. `UStaticMeshComponent` vs. `USkeletalMeshComponent`**
> **뼈대([[USkeleton]])가 없어 애니메이션을 재생할 수 없습니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`UStaticMeshComponent` (정적)**:
	뼈대([[USkeleton]])가 없어 애니메이션을 재생할 수 없습니다. 주로 환경이나 소품에 사용됩니다.
* **[[USkeletalMeshComponent]] (동적)**:
	뼈대를 가지고 있어 복잡한 애니메이션을 재생할 수 있습니다. 주로 캐릭터나 살아있는 생명체에 사용됩니다.

### **4. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  [[AActor]]를 상속받는 새로운 블루프린트 클래스를 생성합니다.
2.  컴포넌트 패널에서 `+ 추가` 버튼을 누르고 `Static Mesh Component`를 검색하여 추가합니다.
3.  디테일 패널의 `Static Mesh` 속성에서 원하는 [[UStaticMesh]] 에셋을 할당합니다.
4.  필요에 따라 충돌 설정이나 머티리얼 등을 변경합니다.
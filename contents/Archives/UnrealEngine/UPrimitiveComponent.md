---
title: 'UPrimitiveComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **화면에 보이거나 물리적으로 상호작용하는 모든 것의 '원형(Primitive)'입니다.** [[USceneComponent]]가 가진 추상적인 위치 정보에 '형태'와 '물질'을 부여한 첫 번째 단계로, 렌더링과 충돌이 가능한 모든 [[UActorComponent]]의 최종 부모 클래스입니다.

### **1. 주요 역할 및 책임**
> **화면에 렌더링될 수 있는 능력을 가집니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **시각적 표현 (Visual Representation)**:
	화면에 렌더링될 수 있는 능력을 가집니다. Material을 적용할 수 있으며, `Visible` 및 `HiddenInGame` 속성을 통해 보일지 말지를 제어할 수 있습니다.
* **물리적 충돌 (Physical Collision)**:
	물리 엔진과 상호작용할 수 있는 형태를 가집니다. 다른 오브젝트와의 충돌을 감지(Hit [[Event]])하거나, 특정 영역에 들어왔음을 감지(Overlap [[Event]])하는 모든 기능의 기반이 됩니다.
* **레이캐스트 타겟 (Raycast Target)**:
	라인 트레이스(레이캐스트)에 감지될 수 있습니다. 플레이어가 바라보는 오브젝트를 찾거나, 총알이 맞았는지 판정하는 등의 기능은 모두 이 `UPrimitiveComponent`의 충돌 설정에 의존합니다.

### **2. 핵심 속성 (주로 충돌 관련)**
> **`UPrimitiveComponent`가 렌더링될지 여부를 결정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `bVisible`:
	`UPrimitiveComponent`가 렌더링될지 여부를 결정합니다. `false`이면 화면에 보이지 않습니다.
* `bHiddenInGame`:
	`true`이면 에디터에서는 보이지만, 실제 게임 플레이 중에는 보이지 않게 됩니다.
* `BodyInstance`:
	질량, 감속 등 상세한 물리 속성을 담고 있는 [[FBodyInstance]] 구조체입니다.
* `CollisionEnabled`:
	충돌을 어떻게 처리할지 결정하는 열거형(`enum`)입니다. (`NoCollision`, `QueryOnly`, `PhysicsOnly`, `QueryAndPhysics`)
* `CollisionObjectType`:
	이 오브젝트가 어떤 유형(채널)에 속하는지를 결정합니다. (예: `WorldStatic`, `WorldDynamic`, `Pawn`)
* `CollisionResponse`:
	다른 오브젝트 유형(채널)에 어떻게 반응할지를 설정합니다. (예: `Ignore`, `Overlap`, `Block`)

### **3. 주요 [[Event|이벤트]]**
> **다른 `UPrimitiveComponent`와 처음으로 겹치기 시작했을 때 호출됩니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* `OnComponentBeginOverlap`:
	다른 `UPrimitiveComponent`와 처음으로 겹치기 시작했을 때 호출됩니다.
* `OnComponentEndOverlap`:
	다른 `UPrimitiveComponent`와의 겹침이 끝났을 때 호출됩니다.
* `OnComponentHit`:
	물리적으로 막혀있는 다른 `UPrimitiveComponent`와 부딪혔을 때(블로킹 히트) 호출됩니다.

### **4. 주요 서브클래스**
> **[[UBoxComponent]], [[USphereComponent]], [[UCapsuleComponent]] 등 간단한 기하학적 형태를 가진 `UPrimitiveComponent`입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **기본 도형 컴포넌트 (Shape Components)**:
	[[UBoxComponent]], [[USphereComponent]], [[UCapsuleComponent]] 등 간단한 기하학적 형태를 가진 `UPrimitiveComponent`입니다.
* **메시 컴포넌트 (Mesh Components)**:
	[[UStaticMeshComponent]]와 [[USkeletalMeshComponent]]처럼 복잡한 3D 모델을 표시하는 `UPrimitiveComponent`입니다.

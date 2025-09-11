---
title: 'UPhysicsAsset'
date: '2025-08-17T16:17:41+09:00'
---
> **[[USkeletalMesh]]에 물리적인 실체를 부여하는 '래그돌(Ragdoll) 생성기'이자 '물리 골격'입니다.** 애니메이션이 적용된 뼈대 위에, 간단한 물리 도형(캡슐, 구, 박스)들을 조합하여 충돌 및 물리 시뮬레이션이 가능한 형태를 만드는 데 사용되는 핵심적인 물리 에셋입니다.

### **1. 주요 역할 및 책임**
> **[[USkeletalMeshComponent]]의 `SetSimulatePhysics(true)`가 호출될 때, 캐릭터가 애니메이션 대신 물리 법칙에 따라 힘없이 쓰러지거나 날아가는 래그돌 효과를 구현하는 데 사용됩니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **래그돌 시뮬레이션 (Ragdoll Simulation)**:
	[[USkeletalMeshComponent]]의 `SetSimulatePhysics(true)`가 호출될 때, 캐릭터가 애니메이션 대신 물리 법칙에 따라 힘없이 쓰러지거나 날아가는 래그돌 효과를 구현하는 데 사용됩니다. 각 뼈에 연결된 물리 바디들이 실제 물리 엔진의 제어를 받게 됩니다.
* **정확한 충돌 감지 (Accurate Collision Detection)**:
	단순한 캡슐 컴포넌트만으로는 불가능한, 팔, 다리, 머리 등 신체 부위별 정밀한 충돌 감지를 가능하게 합니다. 예를 들어, "오른쪽 팔에만 총알이 맞았는지"를 판정할 수 있습니다.
* **물리 기반 보조 애니메이션 (Physics-Based Secondary Animation)**:
	'`Anim Dynamics`'나 '`Rigid Body`' 애님 노드와 함께 사용하여, 캐릭터의 움직임에 따라 자연스럽게 흔들리는 머리카락, 장신구, 사슬 등의 2차적인 움직임을 물리적으로 시뮬레이션할 수 있습니다.
* **성능 최적화**:
	수만 개의 폴리곤으로 이루어진 렌더링 메시 대신, 몇 개에서 수십 개의 단순한 물리 도형으로 충돌을 계산하므로 매우 효율적이고 빠릅니다.

### **2. 주요 구성 요소**
> **[[USkeleton]]의 특정 뼈에 연결되는 충돌 도형입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **물리 바디 (Physics Bodies)**:
	[[USkeleton]]의 특정 뼈에 연결되는 충돌 도형입니다. `SKEL_BodySetup`의 형태로 존재하며, `Sphere`, `Capsule`, `Box` 등의 간단한 도형을 사용합니다.
* **물리 제약 (Physics Constraints)**:
	두 물리 바디 사이의 연결을 정의합니다. 실제 관절처럼, 특정 축으로만 회전하거나 움직임의 범위를 제한하는 역할을 합니다. (예: 팔꿈치는 한 방향으로만 접히도록 설정)

### **3. 사용 흐름**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1. **`UPhysicsAsset` 생성**:
	[[USkeletalMesh]] 에셋을 우클릭하여 `생성 > Physics Asset`을 선택하고, 자동 생성 옵션을 통해 기본적인 물리 바디와 제약을 만듭니다.
2. **에디터에서 편집**:
	생성된 `UPhysicsAsset`을 열어, 각 뼈에 할당된 물리 바디의 크기와 위치를 조정하고, 관절의 움직임 범위를 제약으로 설정하여 원하는 래그돌 동작을 만듭니다.
3. **[[USkeletalMeshComponent]]에 할당**:
	캐릭터의 [[USkeletalMeshComponent]] 디테일 패널에서, `Physics > Physics Asset` 속성에 방금 만든 `UPhysicsAsset`을 할당합니다.
4. **활성화**:
	코드나 블루프린트에서 [[USkeletalMeshComponent]]의 `SetSimulatePhysics(true)`를 호출하면, 애니메이션이 중단되고 `UPhysicsAsset`에 정의된 대로 물리 시뮬레이션이 시작됩니다.
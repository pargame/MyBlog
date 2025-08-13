---
---

> **움직이는 모든 것의 '뼈대'이자 '피부'입니다.** 3D 모델에 [[USkeleton]]이라는 뼈대를 심어, 애니메이션을 통해 생동감 넘치는 움직임을 만들어내는 모든 캐릭터와 생명체의 시각적 핵심입니다. 

### **1. 주요 역할 및 책임**
> `USkeletalMeshComponent`는 [[UPrimitiveComponent]]를 상속받아 렌더링과 충돌이 가능하면서도, 뼈대를 이용한 애니메이션이라는 강력한 기능을 추가로 제공합니다.
* **애니메이션 구동 (Driving Animation):**
      [[USkeleton]] 애셋을 기반으로 3D 모델의 각 정점을 변형시켜 움직임을 만들어냅니다. [[UAnimBlueprint]]라는 강력한 애니메이션 로직 그래프를 통해, 캐릭터의 상태에 따라 걷기, 뛰기, 공격 등 다양한 애니메이션을 실시간으로 조합하고 제어합니다.
* **소켓 시스템 (Socket System):**
      내부 뼈대의 특정 뼈(Bone)에 '소켓'이라는 이름 붙은 위치를 지정할 수 있습니다. 이를 통해 캐릭터의 손에 무기를 붙이거나, 발밑에서 먼지 파티클을 생성하는 등, 애니메이션에 맞춰 다른 오브젝트를 정교하게 부착할 수 있습니다.
* **물리 기반 애니메이션 (Physics-Based Animation):**
      [[UPhysicsAsset]]을 사용하여 래그돌(Ragdoll) 물리 시뮬레이션을 지원합니다. `SetSimulatePhysics(true)`를 호출하면, 애니메이션 대신 물리 법칙에 따라 캐릭터가 쓰러지거나 날아가는 효과를 만들 수 있습니다.

### **2. 핵심 함수 및 속성**
> 컴포넌트의 외형과 애니메이션을 제어하는 데 사용되는 필수적인 변수와 함수들입니다.
* `SkeletalMesh`:
      화면에 표시할 [[USkeletalMesh]] 애셋을 지정합니다.
* `AnimationMode`:
      애니메이션을 어떻게 구동할지 결정하는 열거형(enum)입니다.
* `EAnimationMode::AnimationBlueprint`:
	[[UAnimBlueprint]]를 사용합니다. (가장 일반적)
* `EAnimationMode::AnimationAsset`: 
	단일 [[UAnimationAsset]]을 재생합니다.
* `AnimClass`:
      `AnimationMode`가 `AnimationBlueprint`일 때, 사용할 [[UAnimBlueprint]] 클래스를 지정합니다.
* `PlayAnimation(UAnimationAsset* NewAnimToPlay, bool bLooping)`:
      지정한 단일 [[UAnimationAsset]]을 한 번 또는 반복하여 재생합니다.
* `GetSocketTransform(FName InSocketName)`:
      지정한 이름의 소켓이 현재 프레임의 애니메이션에서 차지하는 `WorldTransform`을 반환합니다.
* `SetSimulatePhysics(bool bSimulate)`:
      이 컴포넌트의 래그돌 물리 시뮬레이션을 켜거나 끕니다.

### **3. 주요 관련 애셋**
> `USkeletalMeshComponent`는 단독으로 존재할 수 없으며, 여러 종류의 애셋이 유기적으로 결합되어야 완전한 기능을 발휘합니다.
* **[[USkeletalMesh]]:**
      정점, 폴리곤, UV 정보 등 3D 모델의 시각적 데이터와 함께, 어떤 [[USkeleton]]을 사용하는지에 대한 참조를 포함하는 핵심 애셋입니다.
* **[[USkeleton]]:**
      뼈들의 계층 구조(Hierarchy) 정보만을 담고 있는 애셋입니다. 하나의 [[USkeleton]]을 여러 [[USkeletalMesh]]가 공유할 수 있어, 같은 뼈대 구조를 가진 다른 캐릭터들이 동일한 애니메이션을 재사용할 수 있게 해줍니다.
* **[[UPhysicsAsset]]:**
      각 뼈에 대응하는 물리 충돌체(Shape)들의 집합입니다. 래그돌 시뮬레이션과 정확한 물리적 상호작용을 위해 사용됩니다.
* **[[UAnimBlueprint]]:**
      애니메이션 상태 머신, 블렌드 스페이스, 뼈 직접 제어 등 복잡한 애니메이션 로직을 그래프 기반으로 설계하는 강력한 애셋입니다. 캐릭터 애니메이션의 '뇌'와 같은 역할을 합니다.

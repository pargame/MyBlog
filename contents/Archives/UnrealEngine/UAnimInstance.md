---
title: 'UAnimInstance'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UAnimBlueprint]]라는 '설계도'를 바탕으로, 게임 월드에서 실제로 살아 움직이며 애니메이션을 실행하는 '인스턴스'이자 '일꾼'입니다.** `UAnimBlueprint`가 에디터에서 편집하는 애셋이라면, `UAnimInstance`는 게임이 실행될 때 [[USkeletalMeshComponent]] 내에서 생성되어 매 프레임마다 애니메이션 로직을 업데이트하는 실제 C++ 객체입니다.

### **1. 주요 역할 및 책임**
> **`UAnimInstance`는 게임플레이 세계와 애니메이션 시스템 사이의 실질적인 데이터 통로 역할을 합니다.**
`UAnimInstance`는 게임플레이 세계와 애니메이션 시스템 사이의 실질적인 데이터 통로 역할을 합니다.
* **애니메이션 로직 실행 (Executing Animation Logic)**:
	[[UAnimBlueprint]]의 이벤트 그래프와 애님 그래프에 정의된 로직을 매 프레임 실행하여, 최종적으로 뼈대의 포즈를 계산하고 [[USkeletalMeshComponent]]에 전달합니다.
* **게임플레이 데이터 수집 (Gathering Gameplay Data)**:
	자신이 소유한 [[APawn]]으로부터 속도, 방향, 공중 부양 여부, 조준 각도 등 애니메이션에 필요한 변수들을 가져와서, 애님 그래프에서 사용할 수 있도록 내부 변수에 저장하는 역할을 합니다. 이 작업은 주로 이벤트 그래프의 `BlueprintUpdateAnimation` [[Event]]에서 이루어집니다.
* **상태 정보 제공 (Providing State Information)**:
	현재 어떤 상태 머신에 있는지, 어떤 애니메이션이 재생 중인지 등의 정보를 외부에 제공하여, 게임플레이 코드가 애니메이션 상태에 따라 특정 로직을 실행할 수 있도록 돕습니다.
* **몽타주 제어 (Controlling Montages)**:
	게임플레이 코드로부터 [[UAnimMontage]] 재생 요청을 받아, 이를 애님 그래프의 '슬롯' 노드를 통해 현재 포즈 위에 덮어씌우는 역할을 직접 수행합니다.

### **2. 핵심 함수 및 변수**
> **`UAnimInstance`의 C++ 클래스 또는 [[UAnimBlueprint]]의 이벤트 그래프에서 주로 사용되는 핵심 요소들입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
`UAnimInstance`의 C++ 클래스 또는 [[UAnimBlueprint]]의 이벤트 그래프에서 주로 사용되는 핵심 요소들입니다.
* `NativeInitializeAnimation()`:
	`UAnimInstance`가 처음 생성될 때 한 번 호출되는 C++ 초기화 함수입니다.
* `NativeUpdateAnimation(float DeltaSeconds)`:
	매 프레임 호출되는 C++ 업데이트 함수입니다. 블루프린트의 `BlueprintUpdateAnimation` [[Event]]와 동일한 역할을 하며, 여기서 게임플레이 변수를 가져와 업데이트합니다.
* `TryGetPawnOwner()`:
	이 `UAnimInstance`를 소유하고 있는 [[APawn]]에 대한 포인터를 안전하게 가져옵니다. 애니메이션에 필요한 데이터를 얻기 위해 가장 먼저 호출되는 함수 중 하나입니다.
* `Montage_Play(UAnimMontage* MontageToPlay, ...)`:
	지정된 [[UAnimMontage]]를 재생합니다.
* `Montage_Stop(float InBlendOutTime, const UAnimMontage* Montage)`:
	현재 재생 중인 몽타주를 중지시킵니다.
* `Montage_IsPlaying(const UAnimMontage* Montage)`:
	특정 [[UAnimMontage]]가 현재 재생 중인지 확인합니다.

### **3. `UAnimBlueprint`와의 관계**
> **이 둘의 관계는 클래스와 인스턴스의 관계와 같습니다.**
이 둘의 관계는 클래스와 인스턴스의 관계와 같습니다.
* **[[UAnimBlueprint]] (클래스/설계도)**:
	개발자가 에디터에서 편집하는 애셋입니다. 컴파일하면 내부적으로 `UAnimInstance`를 상속받는 새로운 C++ 클래스가 생성됩니다.
* **`UAnimInstance` (객체/인스턴스)**:
	게임이 실행될 때, [[USkeletalMeshComponent]]는 [[UAnimBlueprint]]가 정의한 `UAnimInstance` 클래스의 인스턴스를 생성하여 메모리에 올립니다. 모든 애니메이션 계산은 이 인스턴스 객체에서 이루어집니다.
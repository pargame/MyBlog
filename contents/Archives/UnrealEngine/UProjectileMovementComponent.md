---
title: 'UProjectileMovementComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **총알, 로켓, 수류탄 등 '발사체'의 움직임을 시뮬레이션하는 데 특화된 강력한 [[UMovementComponent]]입니다.** 단순한 직선 운동을 넘어, 탄도(포물선) 운동, 바운스(튐), 목표 추적(호밍) 등 발사체에 필요한 거의 모든 물리적 동작을 손쉽게 구현할 수 있도록 설계되었습니다.

### **1. 주요 역할 및 책임**
> **`ProjectileGravityScale` 속성을 통해 발사체에 적용되는 중력을 조절하여, 현실적인 포물선 궤적을 자동으로 계산하고 시뮬레이션합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **탄도 운동 시뮬레이션 (Ballistic Simulation)**:
	`ProjectileGravityScale` 속성을 통해 발사체에 적용되는 중력을 조절하여, 현실적인 포물선 궤적을 자동으로 계산하고 시뮬레이션합니다.
* **충돌 및 정지/파괴 처리 (Collision and Stop/Destroy Logic)**:
	발사체가 다른 오브젝트와 충돌했을 때의 동작을 정의합니다. 충돌 즉시 멈추거나(`bShouldBounce`=false), 튕겨 나오거나(`bShouldBounce`=true), 관통하는 등의 동작을 설정할 수 있습니다.
* **바운스(튐) 처리 (Bounce Handling)**:
	`bShouldBounce`를 활성화하면, 발사체가 벽이나 바닥에 부딪혔을 때 튕겨 나옵니다. `Bounciness` 속성을 통해 반발 계수를 조절하여 얼마나 탄력적으로 튈지 결정할 수 있습니다.
* **목표 추적 (Homing / Target Following)**:
	`HomingTargetComponent`에 특정 컴포넌트(예: 적 캐릭터의 [[USceneComponent]])를 지정하면, 발사체가 목표를 향해 유도탄처럼 날아갑니다. `HomingAccelerationMagnitude`를 통해 얼마나 빠르게 방향을 전환할지 조절할 수 있습니다.

### **2. 핵심 속성**
> **발사체의 초기 속도와 최대 속도를 설정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`InitialSpeed` / `MaxSpeed`**:
	발사체의 초기 속도와 최대 속도를 설정합니다.
* **`bShouldBounce`**:
	발사체가 충돌 시 튕겨 나갈지 여부를 결정합니다.
* **`Bounciness`**:
	튕겨 날아갈 때의 반발력입니다. `1.0`이면 에너지를 잃지 않고 튕깁니다.
* **`ProjectileGravityScale`**:
	발사체에 적용되는 중력의 크기를 조절합니다. `0`이면 중력의 영향을 받지 않고 직선으로 날아갑니다.
* **`HomingTargetComponent`**:
	유도탄이 추적할 목표 컴포넌트를 지정합니다.
* **`HomingAccelerationMagnitude`**:
	목표를 향해 방향을 바꾸는 가속도의 크기입니다. 값이 클수록 더 급격하게 목표를 추적합니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  발사체로 사용할 [[AActor]] 블루프린트를 생성합니다.
2.  컴포넌트 패널에서 `Projectile Movement Component`를 추가합니다. (이 컴포넌트는 시각적 형태가 없으므로, 보통 [[USphereComponent]]나 [[UStaticMeshComponent]]를 루트로 설정하고 그 아래에 추가합니다.)
3.  디테일 패널에서 `InitialSpeed`, `ProjectileGravityScale` 등 원하는 속성을 설정합니다.
4.  게임플레이 코드(예:
	무기 클래스)에서 `SpawnActor` 함수를 통해 이 발사체 액터를 월드에 스폰합니다. 스폰과 동시에 `UProjectileMovementComponent`가 자동으로 발사체의 움직임을 시뮬레이션하기 시작합니다.
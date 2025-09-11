---
title: 'UMovementComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **[[AActor]]에게 '움직이는 능력' 그 자체를 부여하는 물리 엔진의 핵심입니다.** 중력의 영향을 받고, 속도를 조절하며, 다른 물체와의 충돌을 처리하는 등, [[AActor]]가 월드 내에서 물리 법칙에 따라 움직이도록 만드는 모든 복잡한 계산을 담당합니다.

### **1. 주요 역할 및 책임**
> **[[APawn]]이 `AddMovementInput()`으로 전달한 '이동 의도'를 받아, 실제 물리 세계에서의 위치 변화를 계산하고 적용합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **이동의 실행자 (Executor of Movement)**:
	[[APawn]]이 `AddMovementInput()`으로 전달한 '이동 의도'를 받아, 실제 물리 세계에서의 위치 변화를 계산하고 적용합니다.
* **물리 시뮬레이션 (Physics Simulation)**:
	중력, 마찰, 가속도, 감속도 등 물리적인 힘을 계산하여 [[AActor]]의 움직임에 반영합니다. 이를 통해 현실감 있는 움직임을 만들어냅니다.
* **네트워크 동기화 (Network Synchronization)**:
	서버에서의 움직임을 클라이언트에 효율적으로 복제하고, 클라이언트에서는 예측과 보정을 통해 부드러운 움직임을 보여주는 복잡한 로직을 내장하고 있습니다. (특히 [[UCharacterMovementComponent]]에서 두드러집니다.)

### **2. 핵심 함수 및 속성**
> **현재 `UMovementComponent`가 움직이는 속도와 방향을 나타내는 벡터(FVector)입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Velocity`**:
	현재 `UMovementComponent`가 움직이는 속도와 방향을 나타내는 벡터(FVector)입니다.
* **`GravityScale`**:
	이 `UMovementComponent`에 적용되는 중력의 크기를 조절합니다. 0으로 설정하면 중력의 영향을 받지 않습니다.
* **`MaxSpeed`**:
	이 `UMovementComponent`가 도달할 수 있는 최대 속도를 제한합니다.
* **`StopMovementImmediately()`**:
	모든 움직임을 즉시 멈춥니다. `Velocity`를 `0`으로 설정합니다.
* **`IsFalling()` / `IsMovingOnGround()`**:
	`UMovementComponent`가 현재 공중에 떠 있는지(낙하 중인지) 또는 지면에 붙어 있는지 확인합니다.

### **3. 주요 서브클래스**
> **[[ACharacter]]를 위해 특별히 설계된 가장 복잡하고 강력한 무브먼트 컴포넌트입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **[[UCharacterMovementComponent]]**:
	[[ACharacter]]를 위해 특별히 설계된 가장 복잡하고 강력한 무브먼트 컴포넌트입니다. 걷기, 점프, 수영, 경사면 이동 등 인간형 캐릭터에 필요한 거의 모든 이동 로직을 처리합니다.
* **[[UProjectileMovementComponent]]**:
	총알, 로켓과 같은 발사체의 움직임을 시뮬레이션하는 데 특화되어 있습니다. 탄도 계산, 바운스(튐), 목표 추적 등 기능을 제공합니다.
* **[[UFloatingPawnMovement]]**:
	중력의 영향을 받지 않고 공중을 자유롭게 떠다니는 움직임을 구현합니다. 드론이나 유령 카메라 등에 사용하기 적합합니다.

---
---

> **[[ACharacter]]의 '다리'이자 '운동 신경계'입니다.** 걷고, 뛰고, 미끄러지고, 헤엄치는 등 인간형 [[ACharacter]]가 할 수 있는 거의 모든 종류의 이동을 물리적으로 시뮬레이션하고 네트워크상에서 동기화하는, 언리얼 엔진에서 가장 복잡하고 정교한 [[UActorComponent]] 중 하나입니다.

### **1. 주요 역할 및 책임**
> 단순한 이동을 넘어, 지형과 환경에 반응하며 살아있는 듯한 움직임을 만들어내는 모든 규칙의 집합체입니다.
* **고급 이동 로직 (Advanced Movement Logic):**
      지면을 따라 걷는 것뿐만 아니라, 경사면을 오르내리고, 계단을 처리하며, 공중에서 방향을 제어하는 등 복잡한 이동 메커니즘을 모두 처리합니다.
* **이동 모드 관리 (Movement Mode Management):**
      [[ACharacter]]의 상태에 따라 `Walking`, `Falling`, `Swimming`, `Flying` 등 다양한 `MovementMode`를 자동으로 전환하고, 각 모드에 맞는 물리 규칙을 적용합니다.
* **네트워크 예측의 핵심 (Heart of Network Prediction):**
      서버의 최종 판정(Authoritative)을 기다리는 동안, 클라이언트에서 먼저 입력을 예측하여 [[ACharacter]]를 움직입니다. 이후 서버로부터 받은 실제 위치와 차이가 나면 부드럽게 보정(Correction)하여, 랙이 있는 환경에서도 즉각적이고 부드러운 조작감을 제공합니다.
* **물리적 상호작용 (Physical Interaction):**
      움직이는 동안 다른 물리 오브젝트를 밀거나, 특정 표면 위에서 미끄러지는 등의 상호작용을 처리합니다.

### **2. 핵심 함수 및 속성**
> [[ACharacter]]의 이동 특성을 세밀하게 조정하고 현재 상태를 파악하는 데 사용되는 필수적인 변수와 함수들입니다.
* **`MaxWalkSpeed`:**
	`Walking` 모드일 때의 최대 속도를 결정합니다.
* **`JumpZVelocity`:**
      `Jump()`가 호출될 때 위쪽으로 가해지는 순간적인 속도의 크기입니다. 점프 높이를 결정합니다.
* **`GravityScale`:**
      [[ACharacter]]에 적용되는 중력의 배율을 조절합니다.
* **`AirControl`:**
	공중에 떠 있는(`Falling`) 상태일 때, [[ACharacter]]의 방향을 얼마나 제어할 수 있는지를 나타내는 값입니다. (`0.0` ~ `1.0`)
* **`SetMovementMode(EMovementMode NewMovementMode)`:
	[[ACharacter]]의 이동 모드를 강제로 변경합니다. (예: 특정 볼륨에 들어가면 `Swimming` 모드로 전환)
* **`IsFalling()`:**
      현재 [[ACharacter]]가 공중에 떠 있는지(지면에 닿아있지 않은지) 여부를 반환합니다.
* **`MovementMode`:**
      현재 [[ACharacter]]의 이동 상태를 나타내는 열거형(`enum`) 변수입니다. [[UAnimBlueprint]] 등에서 이 값을 확인하여 상태에 맞는 애니메이션을 재생하는 데 핵심적으로 사용됩니다.

### **3. 이동 모드 (Movement Modes)**
> `UCharacterMovementComponent`의 상태를 정의하는 핵심적인 열거형 값들입니다.
* **`MOVE_Walking`:** 
      지면에 붙어서 이동하는 기본 상태입니다.
* **`MOVE_Falling`:**
	공중에 떠서 중력의 영향을 받는 상태입니다. 점프나 낙하 시에 해당됩니다.
* **`MOVE_Swimming`:**
      [[PhysicsVolume]]이 물로 설정된 공간 안에서 헤엄치는 상태입니다.
* **`MOVE_Flying`:**
	중력의 영향을 받지 않고 자유롭게 비행하는 상태입니다. (예: noclip 치트)
* **`MOVE_Custom`:**
	개발자가 직접 정의한 커스텀 이동 로직을 사용할 때 설정하는 상태입니다. (예: 벽 타기, 그래플링 훅)

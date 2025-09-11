---
title: 'PhysicsVolume'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UWorld]]의 특정 공간에 보이지 않는 물리 법칙을 적용하는 영역입니다.** 이 `Volume` 안에 들어온 [[AActor]]는 평소와 다른 중력, 저항, 부력의 영향을 받게 됩니다. 물 속이나 무중력 공간처럼 특별한 환경을 만드는 데 사용됩니다.

### **1. 주요 역할 및 책임**
> **`PhysicsVolume`은 [[AActor]]가 들어왔을 때, 그 공간의 환경적인 물리 효과를 국소적으로 변경하는 역할을 합니다.**
`PhysicsVolume`은 [[AActor]]가 들어왔을 때, 그 공간의 환경적인 물리 효과를 국소적으로 변경하는 역할을 합니다. 맵 전체의 규칙을 바꾸지 않고 특정 구역에만 다른 규칙을 부여하는 '규칙의 필드'입니다.
* **공간적 물리 설정 (Spatial Physics Settings)**:
	[[AActor]]가 특정 `Volume` 내에 있는지 감지하여, 해당 공간에만 적용될 별도의 물리 속성(중력, 마찰력 등)을 부여합니다.
* **유체 시뮬레이션 (Fluid Simulation)**:
	`bWaterVolume` 속성을 활성화하여 해당 영역을 물 속으로 만들 수 있습니다. 이 안에 들어온 [[ACharacter]]는 자동으로 `MovementMode`가 `Swimming`으로 변경됩니다.
* **터미널 속도 제어 (Terminal Velocity Control)**:
	`Volume` 내에서 [[AActor]]가 도달할 수 있는 최대 속도, 특히 최대 낙하 속도를 제한하여 특정 환경(예: 점성이 높은 액체 속)을 표현할 수 있습니다.
* **캐릭터 이동에 영향 (Influence on Character Movement)**:
	[[UCharacterMovementComponent]]는 자신이 속한 `PhysicsVolume`을 항상 확인하고, 그곳의 물리 설정(중력, 부력 등)을 자신의 이동 계산에 즉시 반영합니다.

### **2. 핵심 속성**
> **`Volume` 내의 물리 환경을 세밀하게 조정하는 데 사용되는 주요 변수들입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
`Volume` 내의 물리 환경을 세밀하게 조정하는 데 사용되는 주요 변수들입니다.
* **`bWaterVolume`**:
	`true`로 설정하면 이 `Volume`을 물로 취급합니다. [[ACharacter]]가 헤엄칠 수 있게 됩니다.
* **`GravityZ`**:
	`Volume` 내의 Z축(수직) 중력을 설정합니다. [[UWorld]] 기본 중력을 덮어쓰며, 양수 값은 반중력을 의미합니다. `0`으로 설정하면 무중력 상태가 됩니다.
* **`TerminalVelocity`**:
	이 `Volume` 안에서 [[AActor]]가 가질 수 있는 최대 속도를 제한합니다.
* **`FluidFriction`**:
	`Volume` 내 유체의 저항(마찰력)을 설정합니다. 값이 높을수록 [[AActor]]의 움직임이 둔해집니다.
* **`Priority`**:
	여러 `PhysicsVolume`이 겹쳐 있을 때, 어떤 `Volume`의 설정을 적용할지 결정합니다. 더 높은 `Priority` 값을 가진 `Volume`이 우선권을 가집니다.

### **3. 주요 [[Event]]**
> **[[AActor]]가 `Volume`에 들어오고 나가는 순간을 감지하여 특정 로직을 실행할 수 있는 [[Event]]들입니다.**
[[AActor]]가 `Volume`에 들어오고 나가는 순간을 감지하여 특정 로직을 실행할 수 있는 [[Event]]들입니다.
* `OnActorEnteredVolume`:
	[[AActor]]가 이 `PhysicsVolume` 안으로 처음 들어왔을 때 호출되는 [[Event]]입니다.
* `OnActorLeftVolume`:
	[[AActor]]가 이 `PhysicsVolume` 밖으로 나갔을 때 호출되는 [[Event]]입니다.
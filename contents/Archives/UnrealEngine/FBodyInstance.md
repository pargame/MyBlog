---
title: 'FBodyInstance'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UPrimitiveComponent]]의 모든 물리적 속성을 담고 있는 '물리 속성 데이터 묶음'입니다.** 질량, 마찰력, 감쇠, 물리 활성화 여부 등 물리 엔진이 오브젝트를 시뮬레이션하는 데 필요한 모든 정보를 포함하는 핵심적인 C++ 구조체(`struct`)입니다.

### **1. 주요 역할 및 책임**
> **오브젝트의 질량(`Mass`), 선형/각속도 감쇠(`Linear/Angular Damping`), 물리 머티리얼(`PhysMaterial`) 등을 설정하여, 오브젝트가 물리 세계에서 어떻게 반응할지를 결정합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **물리 속성 정의 (Defining Physics Properties)**:
	오브젝트의 질량(`Mass`), 선형/각속도 감쇠(`Linear/Angular Damping`), 물리 머티리얼(`PhysMaterial`) 등을 설정하여, 오브젝트가 물리 세계에서 어떻게 반응할지를 결정합니다.
* **충돌 설정 관리 (Managing Collision Settings)**:
	오브젝트의 충돌 프로파일 이름, 충돌 활성화 상태(`CollisionEnabled`), 오브젝트 타입, 다른 타입에 대한 반응(`CollisionResponses`) 등 충돌과 관련된 모든 설정을 담고 있습니다.
* **물리 상태 제어 (Controlling Physics State)**:
	물리 시뮬레이션 활성화 여부(`bSimulatePhysics`), 중력 적용 여부(`bEnableGravity`), 운동학적(Kinematic) 오브젝트 여부 등 오브젝트의 물리적 상태를 제어하는 플래그들을 관리합니다.

### **2. 주요 속성**
> **`true`이면, 이 바디는 물리 엔진에 의해 완벽하게 시뮬레이션됩니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`bSimulatePhysics` (`bool`)**:
	`true`이면, 이 바디는 물리 엔진에 의해 완벽하게 시뮬레이션됩니다. (힘에 반응하고, 중력의 영향을 받음)
* **`MassInKg` (`float`)**:
	오브젝트의 질량을 킬로그램(kg) 단위로 설정합니다. 질량이 클수록 움직이기 어렵습니다.
* **`LinearDamping` / `AngularDamping` (`float`)**:
	움직임과 회전에 대한 저항(감쇠)의 크기입니다. 값이 높을수록 더 빨리 멈춥니다.
* **`bEnableGravity` (`bool`)**:
	이 바디에 중력을 적용할지 여부를 결정합니다.
* **`CollisionProfileName` (`FName`)**:
	프로젝트 설정에 미리 정의된 충돌 프로파일(예: `Pawn`, `BlockAll`)의 이름을 사용하여 충돌 설정을 한 번에 적용합니다.
* **`CollisionEnabled` (`ECollisionEnabled::Type`)**:
	충돌을 어떻게 처리할지 결정합니다. (`NoCollision`, `QueryOnly`, `PhysicsOnly`, `QueryAndPhysics`)
* **`ObjectType` (`ECollisionChannel`)**:
	이 오브젝트가 어떤 충돌 채널에 속하는지를 정의합니다. (예: `WorldStatic`, `Pawn`)

### **3. 접근 및 사용 방법**
> **`FBodyInstance`의 속성들은 대부분 런타임에 직접 수정하기보다는, [[UPrimitiveComponent]]가 제공하는 래퍼(wrapper) 함수(예: `SetSimulatePhysics`, `AddImpulse`)를 통해 제어하는 것이 더 안전하고 일반적입니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**

`FBodyInstance`의 속성들은 대부분 런타임에 직접 수정하기보다는, [[UPrimitiveComponent]]가 제공하는 래퍼(wrapper) 함수(예: `SetSimulatePhysics`, `AddImpulse`)를 통해 제어하는 것이 더 안전하고 일반적입니다.

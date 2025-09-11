---
title: 'APlayerStart'
date: '2025-08-17T16:17:41+09:00'
---
> **플레이어가 게임을 시작하거나 리스폰할 때 나타날 '출발 지점'을 지정하는, 보이지 않는 표식입니다.** [[AGameModeBase]]는 이 액터를 찾아 플레이어의 [[APawn]]을 월드에 배치합니다. 레벨 디자이너가 플레이어의 시작 위치를 시각적으로 지정하는 가장 간단하고 명확한 방법입니다.

### **1. 주요 역할 및 책임**
> **[[AGameModeBase]]의 `FindPlayerStart_Implementation` 함수가 호출될 때, 가장 적합한 스폰 위치 후보로 사용됩니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **스폰 위치 제공 (Providing a Spawn Location)**:
	[[AGameModeBase]]의 `FindPlayerStart_Implementation` 함수가 호출될 때, 가장 적합한 스폰 위치 후보로 사용됩니다. 월드에 배치된 여러 `APlayerStart` 중 하나를 선택하여 플레이어의 `Transform`(위치 및 회전)을 결정합니다.
* **시작 방향 결정 (Determining Start Rotation)**:
	`APlayerStart`의 화살표 방향은 플레이어가 처음 스폰될 때 바라볼 방향을 결정합니다.
* **플레이어별 시작 지점 (Player-Specific Start Points)**:
	`PlayerStartTag` 속성을 사용하여 특정 플레이어나 팀을 위한 전용 시작 지점을 만들 수 있습니다. [[AGameModeBase]]에서 이 태그를 확인하여 조건에 맞는 `APlayerStart`를 선택할 수 있습니다.

### **2. 핵심 속성**
> **이 `APlayerStart`를 식별하는 데 사용되는 `FName` 태그입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `PlayerStartTag`:
	이 `APlayerStart`를 식별하는 데 사용되는 `FName` 태그입니다.
* **`CapsuleComponent`**:
	에디터에서 `APlayerStart`의 위치를 시각적으로 표현하고 선택할 수 있도록 도와주는 [[UCapsuleComponent]]입니다. 게임 플레이 중에는 일반적으로 충돌이나 렌더링이 비활성화됩니다.

### **3. 게임 모드와의 관계**
> **[[AGameModeBase]]에 있는 이 함수는 플레이어를 어디에 스폰할지 결정하는 로직을 담고 있습니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`FindPlayerStart_Implementation`**:
	[[AGameModeBase]]에 있는 이 함수는 플레이어를 어디에 스폰할지 결정하는 로직을 담고 있습니다. 기본 구현은 월드에 있는 모든 `APlayerStart`를 찾고, 그중 다른 플레이어에게 점유되지 않은 최적의 위치를 선택합니다.
* **선택 로직 커스터마이징**:
	개발자는 `FindPlayerStart_Implementation` 함수를 오버라이드하여 자신만의 스폰 위치 선택 로직을 구현할 수 있습니다. 예를 들어, 특정 `PlayerStartTag`를 가진 `APlayerStart`만 찾거나, 플레이어의 진행 상황에 따라 다른 시작 지점을 선택하도록 만들 수 있습니다.

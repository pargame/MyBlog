---
title: 'USaveGameSubsystem'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UGameplayStatics]]의 전통적인 저장/불러오기 방식을 넘어, 더욱 체계적이고 유연한 데이터 관리를 지원하는 '차세대 저장 관리 시스템'입니다.** [[USaveGame]] 객체의 생성, 저장, 불러오기 작업을 중앙에서 관리하며, 특히 비동기 처리에 강점을 가집니다.

### **1. 주요 역할 및 책임**
> **게임의 저장 및 불러오기 로직을 한 곳에서 관리하여 코드의 일관성을 유지하고 분산을 막습니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **중앙 집중식 관리 (Centralized Management)**:
	게임의 저장 및 불러오기 로직을 한 곳에서 관리하여 코드의 일관성을 유지하고 분산을 막습니다. 어느 클래스에서든 쉽게 접근하여 사용할 수 있습니다.
* **델리게이트 기반 비동기 처리 (Delegate-based Async Handling)**:
	저장 또는 불러오기 작업이 완료되었을 때 [[Delegate]]를 통해 콜백을 받을 수 있어, 비동기 작업 관리가 매우 편리해집니다.
* **플러그인 및 모듈화 지원 (Plugin & Modularization Support)**:
	[[Subsystem]]의 특성상, 게임의 다른 모듈이나 플러그인에서 쉽게 접근하고 확장할 수 있습니다.

### **2. 핵심 함수 및 속성**
> **지정된 슬롯에서 [[USaveGame]] 객체를 동기적으로 불러옵니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`SaveGameToSlot(USaveGame* SaveGameObject, const FString& SlotName)`**:
	[[USaveGame]] 객체를 지정된 슬롯에 동기적으로 저장합니다. 게임 스레드가 잠시 멈출 수 있습니다.
* **`LoadGameFromSlot(const FString& SlotName)`**:
	지정된 슬롯에서 [[USaveGame]] 객체를 동기적으로 불러옵니다.
* **`AsyncSaveGameToSlot(USaveGame* SaveGameObject, const FString& SlotName, FSaveGameDelegate SavedDelegate)`**:
	게임 스레드를 차단하지 않고 비동기적으로 게임을 저장하고, 완료 시 `SavedDelegate`를 호출합니다.
* **`AsyncLoadGameFromSlot(const FString& SlotName, FLoadGameDelegate LoadedDelegate)`**:
	비동기적으로 게임을 불러오고, 완료 시 `LoadedDelegate`를 호출합니다.

### **3. 관련 클래스**
> **실제 저장될 데이터를 담고 있는 객체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[USaveGame]]**:
	실제 저장될 데이터를 담고 있는 객체입니다. `USaveGameSubsystem`은 이 객체를 관리하는 주체입니다.
* **[[UGameInstanceSubsystem]]**:
	`USaveGameSubsystem`은 [[UGameInstanceSubsystem]]의 일종으로, 게임 인스턴스의 생명주기를 따릅니다. 즉, 게임이 실행되는 동안 항상 유일한 인스턴스로 존재합니다.
* **[[UGameplayStatics]]**:
	전통적으로 저장/불러오기 기능을 제공했던 클래스입니다. `USaveGameSubsystem`은 이 기능들을 더 발전시킨 형태라고 볼 수 있습니다.
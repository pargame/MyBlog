---
title: 'Subsystem'
date: '2025-08-17T16:17:41+09:00'
---
> **언리얼 엔진의 기능을 체계적으로 모듈화하고, 특정 생명 주기에 맞춰 자동으로 관리되는 '서비스 관리자'입니다.** `Subsystem`은 복잡한 기능에 대한 접근점을 단일화하고, 개발자가 직접 객체를 생성하거나 소멸시킬 필요 없이 엔진의 흐름에 따라 자동으로 관리되는 편리함을 제공합니다.

### **1. 주요 역할 및 책임**
> **`Subsystem`은 특정 기능의 API를 제공하고, 그 기능의 생명 주기를 엔진의 특정 부분(게임 인스턴스, 월드 등)과 동기화하는 핵심적인 역할을 합니다.**
`Subsystem`은 특정 기능의 API를 제공하고, 그 기능의 생명 주기를 엔진의 특정 부분(게임 인스턴스, 월드 등)과 동기화하는 핵심적인 역할을 합니다.
* **기능의 중앙화 (Centralization of Functionality)**:
	저장/불러오기, 온라인 서비스, AI 관리 등 특정 도메인에 관련된 로직과 데이터를 하나의 클래스에 모아 관리합니다. 이를 통해 코드를 찾고 유지보수하기 쉬워집니다.
* **자동 생명 주기 관리 (Automatic Lifecycle Management)**:
	`Subsystem`은 자신이 속한 부모 객체와 생명 주기를 함께합니다. 부모가 생성될 때 `Initialize()` 함수가 호출되고, 소멸될 때 `Deinitialize()` 함수가 호출되어, 개발자는 이 두 함수 안에 필요한 로직만 구현하면 됩니다.
* **싱글턴과 유사한 접근성 (Singleton-like Accessibility)**:
	각 `Subsystem`은 자신의 스코프 내에서 유일한 인스턴스로 존재합니다. `GetSubsystem<T>()` 함수를 통해 어디서든 쉽게 해당 기능의 관리자 객체에 접근할 수 있어, 복잡한 싱글턴 패턴을 직접 구현할 필요가 없습니다.

### **2. Subsystem의 종류 (스코프에 따른 분류)**
> **`Subsystem`은 그 기능이 유효한 범위와 생명 주기에 따라 네 가지 주요 유형으로 나뉩니다.**
`Subsystem`은 그 기능이 유효한 범위와 생명 주기에 따라 네 가지 주요 유형으로 나뉩니다.
* **[[UEngineSubsystem]]**:
	엔진 프로세스와 생명 주기를 같이합니다. 에디터와 런타임 모두에서 존재하며, 가장 오래 지속됩니다. 플러그인의 핵심 기능이나 저수준 시스템을 구현하는 데 적합합니다.
* **[[UGameInstanceSubsystem]]**:
	게임 인스턴스([[UGameInstance]])와 생명 주기를 같이합니다. 게임이 실행되고 종료될 때까지 유지되며, 레벨 전환 시에도 파괴되지 않습니다. 게임 세션 전체에 걸쳐 필요한 데이터(예: 플레이어 프로필, 저장 데이터 관리)를 관리하기에 이상적입니다.
* **[[UWorldSubsystem]]**:
	게임 월드([[UWorld]])와 생명 주기를 같이합니다. 레벨이 로드될 때 생성되고, 다른 레벨로 이동하면 파괴됩니다. 특정 레벨에만 종속적인 시스템(예: 해당 레벨의 테스트 관리자, AI 총괄 관리자)을 구현하는 데 사용됩니다.
* **[[ULocalPlayerSubsystem]]**:
	로컬 플레이어([[ULocalPlayer]])와 생명 주기를 같이합니다. 플레이어 개개인에게 특화된 기능을 관리합니다. [[UEnhancedInputLocalPlayerSubsystem]]이 대표적인 예입니다.

### **3. 사용 방법**
> **`Subsystem`을 사용하는 방법은 타입에 관계없이 매우 일관되고 간단합니다.**
`Subsystem`을 사용하는 방법은 타입에 관계없이 매우 일관되고 간단합니다.
```cpp
// 게임 인스턴스 서브시스템 가져오기
UMyGameSubsystem* MyGameSubsystem = GetGameInstance()->GetSubsystem<UMyGameInstanceSubsystem>();

// 월드 서브시스템 가져오기
AMyWorldSubsystem* MyWorldSubsystem = GetWorld()->GetSubsystem<AMyWorldSubsystem>();

// 로컬 플레이어 서브시스템 가져오기
UMyInputSubsystem* MyInputSubsystem = ULocalPlayer::GetSubsystem<UMyInputSubsystem>(PlayerController->GetLocalPlayer());
```

### **4. 관련 클래스**
> **4. 관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[UEngineSubsystem]]
* [[UGameInstanceSubsystem]]
* [[UWorldSubsystem]]
* [[ULocalPlayerSubsystem]]
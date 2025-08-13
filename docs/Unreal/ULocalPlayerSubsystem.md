---
---
> **각각의 로컬 플레이어([[ULocalPlayer]])와 생명 주기를 함께하는 '플레이어 전용 서비스'입니다.** 화면 분할(Split-screen) 환경을 포함하여, 각 플레이어에게 개별적으로 필요한 시스템을 관리하는 데 사용됩니다. [[UGameInstanceSubsystem]]이나 [[UWorldSubsystem]]보다 더 좁은, 개인화된 스코프를 가집니다.

### **1. 주요 역할 및 책임**
> `ULocalPlayerSubsystem`은 플레이어 개개인에게 종속적인 기능을 모듈화하고, 그 생명 주기를 [[ULocalPlayer]]의 존재와 동기화하는 역할을 합니다.
* **플레이어-한정 기능 제공 (Player-Specific Functionality):**
    각 플레이어의 입력 설정, UI 상태, 개인화된 데이터 등, 다른 플레이어와 공유되지 않는 기능을 구현하는 데 이상적입니다.
* **자동 생명 주기 관리 (Automatic Lifecycle Management):**
    [[ULocalPlayer]]가 생성될 때(예: 게임에 참여할 때) 함께 `Initialize()`가 호출되고, [[ULocalPlayer]]가 소멸될 때(예: 게임에서 나갈 때) `Deinitialize()`가 호출됩니다.
* **입력 시스템의 핵심:**
    가장 대표적인 예시인 [[UEnhancedInputLocalPlayerSubsystem]]은 각 플레이어의 입력 컨텍스트([[UInputMappingContext]])를 관리하는 역할을 합니다. 이를 통해 각 플레이어는 서로 다른 입력 설정을 가질 수 있습니다.

### **2. 핵심 함수 (생명 주기)**
> 다른 [[Subsystem]]과 마찬가지로, `Initialize`와 `Deinitialize` 함수를 오버라이드하여 로직을 구현합니다.
* `Initialize(FSubsystemCollectionBase& Collection)`:
    [[ULocalPlayer]]가 초기화될 때 호출됩니다. 이 플레이어만을 위한 시스템을 준비하고 초기화합니다.
* `Deinitialize()`:
    [[ULocalPlayer]]가 소멸되기 직전에 호출됩니다. 사용했던 리소스를 정리합니다.

### **3. 사용 예시**
> `ULocalPlayerSubsystem`은 각 플레이어별로 독립적인 상태를 가져야 하는 시스템에 적합합니다.
* **`PlayerSettingsSubsystem`:**
    각 플레이어의 개인 설정(예: 감도, 키 바인딩, UI 색상)을 관리하고 저장합니다.
* **`PlayerTutorialSubsystem`:**
    각 플레이어의 튜토리얼 진행 상황을 추적하고, 해당 플레이어에게만 튜토리얼 메시지를 표시합니다.
* **[[UEnhancedInputLocalPlayerSubsystem]]:**
    언리얼 엔진에 내장된 가장 중요한 `ULocalPlayerSubsystem`으로, 각 플레이어의 [[Enhanced Input System]] 관련 설정을 모두 관리합니다.

### **4. 어떤 서브시스템을 사용해야 할까?**
* **[[UEngineSubsystem]]:** 에디터를 포함한 엔진 전체에서 필요한 기능.
* **[[UGameInstanceSubsystem]]:** 게임 세션 전체에 걸쳐 레벨 전환과 상관없이 유지되어야 하는 기능.
* **[[UWorldSubsystem]]:** 특정 월드(레벨)에만 종속적인 기능.
* **`ULocalPlayerSubsystem`:** 각 플레이어에게만 개별적으로 필요한 기능.
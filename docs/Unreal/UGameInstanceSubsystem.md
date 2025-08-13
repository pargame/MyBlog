---
---

> **게임이 실행되는 순간부터 종료될 때까지, 레벨 전환과 관계없이 항상 살아있는 '전역 서비스'입니다.** 게임 세션 전체에 걸쳐 단 하나만 존재하며, 저장/불러오기, 플레이어 프로필 관리, 온라인 세션 정보 유지 등 영속성이 필요한 모든 기능을 담기에 가장 이상적인 공간입니다.

### **1. 주요 역할 및 책임**
> `UGameInstanceSubsystem`은 [[UGameInstance]]의 생명 주기에 완벽하게 동기화되어, 개발자가 직접 생성하거나 소멸시킬 필요 없이 편리하게 전역 기능을 구현할 수 있도록 돕습니다.
* **영속적인 기능 제공 (Providing Persistent Functionality):**
      메인 메뉴 레벨에서 게임 플레이 레벨로 이동하더라도, 이 `UGameInstanceSubsystem`은 파괴되지 않고 그대로 유지됩니다. 따라서 여러 레벨에 걸쳐 공유되어야 하는 데이터나 시스템을 관리하기에 적합합니다.
* **자동 생명 주기 관리 (Automatic Lifecycle Management):**
      [[UGameInstance]]가 생성될 때 함께 `Initialize()` 함수가 호출되고, 게임이 종료되어 [[UGameInstance]]가 소멸될 때 `Deinitialize()` 함수가 호출됩니다. 개발자는 이 두 함수 안에 필요한 로직을 작성하기만 하면 됩니다.
* **쉬운 접근성 (Easy Accessibility):**
      게임 코드 어디서든 `GetGameInstance()->GetSubsystem<T>()`를 통해 쉽게 접근할 수 있습니다. 복잡한 싱글턴 패턴을 직접 구현할 필요 없이, 엔진이 제공하는 안전하고 표준화된 방법으로 전역 시스템에 접근할 수 있습니다.

### **2. 핵심 함수 (생명 주기)**
> 개발자는 이 함수들을 오버라이드하여 `UGameInstanceSubsystem`의 초기화 및 정리 로직을 구현합니다.
* `Initialize(FSubsystemCollectionBase& Collection)`:
      `UGameInstanceSubsystem`이 생성되고 초기화될 때 호출됩니다. 다른 [[Subsystem]]에 대한 참조를 얻거나, 필요한 변수를 초기화하고, 외부 시스템에 연결하는 등의 준비 작업을 수행합니다.
* `Deinitialize()`:
      `UGameInstanceSubsystem`이 소멸되기 직전에 호출됩니다. `Initialize`에서 설정했던 것들을 정리하는 작업을 수행합니다. (예: 이벤트 핸들러 해제, 파일 저장)

### **3. 사용 예시**
> `UGameInstanceSubsystem`은 다양한 종류의 전역 관리자를 만드는 데 사용될 수 있습니다.
* **[[USaveGameSubsystem]]:**
      게임의 저장 및 불러오기 로직을 총괄합니다.
* **[[UAchievementSubsystem]]:**
      플레이어의 도전 과제 달성 여부를 추적하고 관리합니다.
* **[[UMusicManagerSubsystem]]:**
      레벨이 바뀌어도 끊기지 않고 배경 음악을 계속 재생하는 시스템을 관리합니다.
* **[[USettingsSubsystem]]:**
      플레이어의 그래픽, 오디오, 게임플레이 설정 등을 관리하고 파일에 저장합니다.

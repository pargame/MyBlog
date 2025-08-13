---
---

> **이 컴퓨터 앞에 앉아 실제로 게임을 플레이하고 있는 '나 자신'을 나타내는 객체입니다.** 멀티플레이어 게임에 여러 플레이어가 접속해 있더라도, `ULocalPlayer`는 오직 이 기기에서 게임을 조작하는 로컬 플레이어만을 지칭합니다. 화면 분할(Split-screen) 환경이 아니라면, 게임에는 단 하나의 `ULocalPlayer`만 존재합니다.

### **1. 주요 역할 및 책임**
> `ULocalPlayer`는 게임 엔진과 실제 플레이어 사이를 연결하는 다리 역할을 하며, 플레이어 개개인에 특화된 설정을 관리합니다.
* **플레이어의 유일한 대리인 (Player's Unique Representative):**
      [[UGameInstance]] 내에서 로컬 플레이어 한 명을 고유하게 식별합니다. 이 객체를 통해 [[APlayerController]], 뷰포트, 개인 설정 등에 접근할 수 있습니다.
* **뷰포트 생성 및 관리 (Viewport Creation and Management):**
      자신이 세상을 바라볼 '창문'인 [[UGameViewportClient]]를 생성하고 관리할 책임을 가집니다.
* **플레이어 컨트롤러 소유 (Ownership of Player Controller):**
      자신을 대변하는 [[APlayerController]]를 소유하고 관리합니다. `ULocalPlayer`가 생성될 때, 이 플레이어를 위한 [[APlayerController]]도 함께 생성됩니다.
* **개인 설정 저장 (Storage for Player-Specific Settings):**
      온라인 서브시스템 ID, 닉네임, 접근성 설정(예: 색맹 모드) 등 플레이어 개개인에게 종속되는 데이터를 관리합니다.

### **2. 핵심 함수 및 속성**
> 로컬 플레이어와 관련된 핵심 객체에 접근하거나 플레이어 정보를 가져올 때 사용하는 함수들입니다.
* `GetPlayerController()`:
      이 로컬 플레이어가 소유한 [[APlayerController]]에 대한 포인터를 반환합니다.
* `GetViewportClient()`:
      이 로컬 플레이어가 사용하고 있는 [[UGameViewportClient]]에 대한 포인터를 반환합니다.
* `GetPreferredUniqueNetId()`:
      이 플레이어의 고유한 네트워크 ID(예: 스팀 ID, 에픽 계정 ID)를 반환합니다. 멀티플레이어 세션에서 플레이어를 식별하는 데 사용됩니다.
* `GetNickname()`:
      이 플레이어의 닉네임을 반환합니다.
* `SpawnPlayActor(const FString& URL, FString& OutError, UWorld* InWorld)`:
      지정된 월드에 이 플레이어를 위한 액터(주로 [[APlayerController]])를 스폰하는 프로세스를 시작합니다.

### **3. 로컬 플레이어와 게임 인스턴스**
> `ULocalPlayer`는 게임 전체의 생명 주기를 관리하는 [[UGameInstance]]에 의해 소유되고 관리됩니다.
* **[[UGameInstance]]:**
      게임이 실행되는 동안 단 하나만 존재하는 최상위 객체입니다. [[UGameInstance]]는 현재 게임에 참여하고 있는 모든 `ULocalPlayer`의 목록을 관리하며, 플레이어가 게임에 참여(`AddLocalPlayer`)하거나 떠날 때(`RemoveLocalPlayer`) 이를 처리합니다.

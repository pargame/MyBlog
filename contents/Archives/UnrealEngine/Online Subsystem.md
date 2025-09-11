---
title: 'Online Subsystem'
date: '2025-08-17T16:17:41+09:00'
---
> **스팀, Xbox Live, PlayStation Network 등 플랫폼별 온라인 서비스를 통합된 방식으로 접근하게 해주는 '표준 인터페이스'입니다.** 이를 통해 개발자는 플랫폼에 종속되지 않는 코드로 멀티플레이어 세션, 친구 목록, 도전 과제, 리더보드 등의 기능을 구현할 수 있습니다.

### **1. 주요 역할 및 책임**
> **`Online Subsystem`은 각기 다른 플랫폼 서비스들의 차이점을 추상화하여, 개발자가 일관된 API로 온라인 기능을 개발할 수 있도록 돕습니다.**
`Online Subsystem`은 각기 다른 플랫폼 서비스들의 차이점을 추상화하여, 개발자가 일관된 API로 온라인 기능을 개발할 수 있도록 돕습니다.
* **플랫폼 추상화 (Platform Abstraction)**:
	`CreateSession`, `FindSessions`, `UnlockAchievement`와 같은 표준 함수를 호출하면, `Online Subsystem`이 현재 실행 중인 플랫폼(스팀, 에픽 온라인 서비스 등)에 맞는 실제 함수를 내부적으로 호출합니다.
* **모듈식 설계 (Modular Design)**:
	각 플랫폼에 대한 지원은 별도의 플러그인 모듈(예: `OnlineSubsystemSteam`, `OnlineSubsystemEOS`)로 제공됩니다. `DefaultEngine.ini` 설정 파일을 통해 어떤 서브시스템을 사용할지 지정할 수 있습니다.
* **핵심 온라인 기능 제공 (Core Online Features)**:
	대부분의 온라인 게임에 필요한 핵심 기능들을 인터페이스 형태로 제공합니다.

### **2. 주요 인터페이스**
> **`Online Subsystem`의 각 기능은 특정 인터페이스를 통해 접근합니다.**
`Online Subsystem`의 각 기능은 특정 인터페이스를 통해 접근합니다. `IOnlineSubsystem::Get()`을 통해 현재 활성화된 서브시스템의 인스턴스를 얻고, 거기서 다시 각 기능 인터페이스를 가져오는 방식으로 사용합니다.
* **`Sessions`**:
	멀티플레이어 게임 방(세션)을 생성, 검색, 참여, 파괴하는 기능을 담당합니다.
* **`Friends`**:
	플랫폼의 친구 목록을 가져오고, 친구의 상태를 확인하며, 게임에 초대하는 기능을 제공합니다.
* **`Identity`**:
	플레이어의 로그인 상태를 확인하고, 고유 ID 등의 계정 정보를 가져옵니다.
* **`Achievements`**:
	도전 과제를 쓰거나 읽고, 달성률을 표시하는 기능을 관리합니다.
* **`Leaderboards`**:
	순위표(리더보드) 데이터를 읽고 쓰는 기능을 담당합니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  **모듈 활성화**:
	`build.cs` 파일에 `OnlineSubsystem`과 사용할 플랫폼 모듈(예: `OnlineSubsystemNull`)을 추가합니다.
2.  **설정**:
	`DefaultEngine.ini` 파일에 사용할 기본 온라인 서브시스템을 지정합니다.
    
3.  **코드에서 접근**:
	```cpp
    #include "OnlineSubsystem.h"
    #include "Interfaces/OnlineSessionInterface.h" // 필요한 인터페이스 헤더 포함
    
    // 온라인 서브시스템 인스턴스 가져오기
    IOnlineSubsystem* OnlineSub = IOnlineSubsystem::Get();
    if (OnlineSub)
    {
        // 세션 인터페이스 가져오기
        IOnlineSessionPtr SessionInterface = OnlineSub->GetSessionInterface();
        if (SessionInterface.IsValid())
        {
            // 세션 생성, 검색, 참여 등 온라인 기능 사용
            // SessionInterface->CreateSession(...);
        }
    }
    ```

### **4. 관련 클래스**
> **핵심 엔트리/인증/도전과제 인터페이스. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[IOnlineSubsystem]] / [[IOnlineIdentity]] / [[IOnlineAchievements]]**:
	핵심 엔트리/인증/도전과제 인터페이스.
* **[[UGameInstance]] / [[UGameInstanceSubsystem]]**:
	온라인 기능을 수명주기와 함께 관리하기 좋은 지점.
* **[[APlayerState]] / [[FUniqueNetId]]**:
	네트워크 플레이어 식별/상태 관리.

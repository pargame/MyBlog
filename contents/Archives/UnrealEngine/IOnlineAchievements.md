---
title: 'IOnlineAchievements'
date: '2025-08-17T16:17:41+09:00'
---
> **[[Online Subsystem]] 내에서 플랫폼별 '도전과제(Achievements)' 시스템과 상호작용하기 위한 기능을 제공하는 C++ 인터페이스입니다.** 이 인터페이스를 통해 도전과제 정보를 쿼리하고, 도전과제를 해제하며, 진행률을 업데이트하는 등의 작업을 플랫폼에 독립적인 방식으로 수행할 수 있습니다.

### **1. 주요 역할 및 책임**
> **Steam, Xbox Live, PlayStation Network 등 각기 다른 플랫폼의 도전과제 API를 공통된 함수 호출로 사용할 수 있게 해줍니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **플랫폼 추상화 (Platform Abstraction)**:
	Steam, Xbox Live, PlayStation Network 등 각기 다른 플랫폼의 도전과제 API를 공통된 함수 호출로 사용할 수 있게 해줍니다. 개발자는 `IOnlineAchievements`의 함수만 호출하면, [[Online Subsystem]]이 현재 플랫폼에 맞는 실제 API를 내부적으로 호출해줍니다.
* **도전과제 데이터 관리 (Achievement Data Management)**:
	도전과제 목록과 각 도전과제의 설명, 아이콘 등의 정보를 플랫폼으로부터 비동기적으로 읽어오는 기능을 제공합니다.
* **도전과제 상태 업데이트 (Achievement Status Update)**:
	특정 도전과제를 해제하거나, 진행형 도전과제의 진행률을 플랫폼에 보고하는 기능을 제공합니다.

### **2. 핵심 함수**
> **도전과제의 상태(진행률 등)를 플랫폼에 기록(업데이트)합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`WriteAchievements(const FUniqueNetId& PlayerId, FOnlineAchievementsWriteRef& WriteObject, ...)`**:
	도전과제의 상태(진행률 등)를 플랫폼에 기록(업데이트)합니다. `WriteObject`에 업데이트할 도전과제 ID와 진행률을 담아 전달합니다.
* **`QueryAchievements(const FUniqueNetId& PlayerId, ...)`**:
	플레이어의 모든 도전과제에 대한 현재 상태([[FAchievementStatus]])를 플랫폼에 요청합니다. 비동기적으로 작동하며, 완료 시 델리게이트가 호출됩니다.
* **`QueryAchievementDescriptions(const FUniqueNetId& PlayerId, ...)`**:
	모든 도전과제에 대한 설명, 제목, 잠금/해제 아이콘 등의 정적인 정보를 플랫폼에 요청합니다.
* **`GetCachedAchievements(const FUniqueNetId& PlayerId, TArray<FAchievementStatus>& OutAchievements)`**:
	`QueryAchievements`가 성공적으로 완료된 후, 캐시된 도전과제 상태 정보를 가져옵니다.

### **3. 사용 방법**
> **// Online Subsystem 인스턴스를 가져옵니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
```cpp
// Online Subsystem 인스턴스를 가져옵니다.
IOnlineSubsystem* Subsystem = IOnlineSubsystem::Get();
if (Subsystem)
{
    // Achievements 인터페이스를 가져옵니다.
    IOnlineAchievementsPtr Achievements = Subsystem->GetAchievementsInterface();
    if (Achievements.IsValid())
    {
        // Achievements->QueryAchievements(...) 등을 호출하여 사용합니다.
    }
}
```
이 인터페이스의 함수들은 대부분 비동기적으로 작동하므로, 결과를 처리하기 위해 델리게이트를 바인딩해야 합니다.

### **4. 관련 클래스 및 구조체**
> **이 인터페이스를 포함한 모든 온라인 기능에 대한 접근점을 제공합니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[Online Subsystem]]**:
	이 인터페이스를 포함한 모든 온라인 기능에 대한 접근점을 제공합니다.
* **[[FAchievementStatus]]**:
	도전과제의 현재 진행 상태를 나타내는 구조체입니다.
* **`FOnlineAchievement`, `FOnlineAchievementDesc`**:
	도전과제의 정적 데이터와 설명을 담는 구조체입니다.
* **[[FUniqueNetId]]**:
	온라인상의 플레이어를 고유하게 식별하는 ID입니다.

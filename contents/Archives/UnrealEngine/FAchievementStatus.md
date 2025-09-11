---
title: 'FAchievementStatus'
date: '2025-08-17T16:17:41+09:00'
---
> **[[Online Subsystem]]을 통해 조회된 단일 '도전과제(Achievement)'의 상태 정보를 담는 구조체입니다.** 도전과제의 ID, 진행률, 잠금 해제 여부 등을 포함합니다.

### **1. 주요 역할 및 책임**
> **특정 도전과제의 현재 상태를 나타내는 데이터를 구조화하여 담고 있습니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **도전과제 상태 표현 (Representing Achievement Status)**:
	특정 도전과제의 현재 상태를 나타내는 데이터를 구조화하여 담고 있습니다.
* **플랫폼 간의 데이터 전달 (Data Transfer Across Platforms)**:
	[[Online Subsystem]]이 각 플랫폼(Steam, Xbox Live, PSN 등)의 도전과제 시스템으로부터 받아온 정보를 C++ 코드에서 일관된 형식으로 사용할 수 있도록 변환해주는 역할을 합니다.

### **2. 핵심 멤버 변수**
> **도전과제의 고유한 ID입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Id` (`FString`)**:
	도전과제의 고유한 ID입니다.
* **`PercentComplete` (`double`)**:
	도전과제의 진행률을 나타냅니다 (0.0 ~ 100.0).
* **`bUnlocked` (`bool`)**:
	이 도전과제가 잠금 해제되었는지 여부를 나타냅니다.

### **3. 사용 방법**
> **`FAchievementStatus`는 개발자가 직접 생성하는 경우는 거의 없습니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
`FAchievementStatus`는 개발자가 직접 생성하는 경우는 거의 없습니다. 대신, [[Online Subsystem]]의 도전과제 인터페이스(`IOnlineAchievements`)를 통해 도전과제 정보를 쿼리했을 때, 그 결과로 이 구조체의 배열을 전달받게 됩니다.

```cpp
// IOnlineAchievements::QueryAchievements의 결과로 호출되는 델리게이트 예시
void OnQueryAchievementsComplete(const FUniqueNetId& PlayerId, const bool bWasSuccessful)
{
    if (bWasSuccessful)
    {
        TArray<FAchievementStatus> Achievements;
        AchievementsSubsystem->GetCachedAchievements(PlayerId, Achievements);

        for (const FAchievementStatus& Ach : Achievements)
        {
            // Ach.Id, Ach.PercentComplete, Ach.bUnlocked 값을 사용
        }
    }
}
```

### **4. 관련 클래스 및 구조체**
> **도전과제를 포함한 다양한 온라인 기능을 플랫폼에 독립적인 방식으로 제공하는 시스템입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[Online Subsystem]]**:
	도전과제를 포함한 다양한 온라인 기능을 플랫폼에 독립적인 방식으로 제공하는 시스템입니다.
* **`IOnlineAchievements`**:
	[[Online Subsystem]] 내에서 도전과제와 관련된 기능(쿼리, 잠금 해제 등)을 제공하는 인터페이스입니다.
* **[[UAchievementSubsystem]]**:
	도전과제 기능을 더 쉽게 사용할 수 있도록 래핑된 [[UGameInstanceSubsystem]]의 예시가 될 수 있습니다.

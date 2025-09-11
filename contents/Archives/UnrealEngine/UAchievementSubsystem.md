---
title: 'UAchievementSubsystem'
date: '2025-08-17T16:17:41+09:00'
---
> **플레이어의 도전 과제(Achievement) 달성 상태를 추적, 관리하고, 영구적으로 저장하는 '업적 관리자'입니다.** [[UGameInstanceSubsystem]]으로 구현하여, 게임 세션 전체에 걸쳐 플레이어의 업적 데이터를 유지하고, 특정 조건이 충족되었을 때 업적 달성 [[Event]]를 발생시키는 역할을 합니다.

### **1. 주요 역할 및 책임**
> **`UAchievementSubsystem`은 게임의 다양한 시스템으로부터 업적 관련 [[Event]]를 받아, 중앙에서 이를 처리하고 저장하는 역할을 합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
`UAchievementSubsystem`은 게임의 다양한 시스템으로부터 업적 관련 [[Event]]를 받아, 중앙에서 이를 처리하고 저장하는 역할을 합니다.
* **업적 상태 관리 (Managing Achievement Status)**:
	어떤 업적이 잠겨 있고, 어떤 업적이 해제되었으며, 특정 업적의 진행도(예: 100마리 중 50마리 처치)가 얼마나인지 관리합니다.
* **데이터 영속성 (Data Persistence)**:
	업적 달성 상태를 [[USaveGame]] 객체를 사용하여 디스크에 저장하고, 게임을 다시 시작했을 때 불러와서 유지합니다.
* **[[Event]] 기반 시스템 (Event-Driven System)**:
	게임 내 다른 시스템(예: 몬스터 사망, 아이템 획득)으로부터 "몬스터가 죽었다"와 같은 [[Event]]를 받습니다. 서브시스템은 이 [[Event]]를 듣고, 해당 [[Event]]와 관련된 업적의 조건을 확인하여 진행도를 업데이트하거나 업적을 해제합니다.
* **UI 알림 및 연동 (UI Notification and Integration)**:
	새로운 업적이 달성되었을 때, `OnAchievementUnlocked`와 같은 [[Delegate]]를 `Broadcast`하여, UI 시스템이 "업적 달성!"과 같은 팝업을 화면에 표시하도록 합니다.

### **2. 구현 아이디어**
> **`UAchievementSubsystem`을 구현할 때 고려할 수 있는 주요 기능과 구조입니다.**
`UAchievementSubsystem`을 구현할 때 고려할 수 있는 주요 기능과 구조입니다.
* **`AchievementData` (`TMap<FName, FAchievementStatus>`)**:
	업적의 고유 ID(`FName`)를 키로, 업적의 상태(잠금/해제, 현재 진행도)를 담는 구조체([[FAchievementStatus]])를 값으로 가지는 맵(Map) 변수입니다.
* **`Initialize()`**:
	서브시스템이 초기화될 때, [[USaveGame]] 파일로부터 이전에 저장된 업적 데이터를 불러와 `AchievementData` 맵을 채웁니다.
* **`Deinitialize()`**:
	서브시스템이 소멸될 때(게임 종료 시), 현재의 업적 데이터를 [[USaveGame]] 파일에 저장합니다.
* **`ReportProgress(FName AchievementID, int32 ProgressAmount)`**:
	게임 내 다른 시스템에서 호출하는 함수입니다. 특정 업적 ID에 대해 진행도를 추가하고, 만약 진행도가 목표치를 달성하면 업적을 해제합니다.
* **`UnlockAchievement(FName AchievementID)`**:
	업적을 '해제됨' 상태로 변경하고, `OnAchievementUnlocked` [[Delegate]]를 호출하며, 변경된 상태를 저장 파일에 기록합니다.
* **`OnAchievementUnlocked` (`FOnAchievementUnlocked` [[Delegate]])**:
	새로운 업적이 해제될 때 호출되는 멀티캐스트 [[Delegate]]입니다. UI 시스템이 이 [[Delegate]]에 자신의 함수를 바인딩하여 알림을 받습니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  [[UGameInstanceSubsystem]]을 상속받는 `UAchievementSubsystem` C++ 클래스를 생성합니다.
2.  업적 데이터를 정의하는 [[UPrimaryDataAsset]] (예:
	`UAchievementDataAsset`)을 만들어, 각 업적의 이름, 설명, 목표치 등을 정의합니다.
3.  서브시스템이 초기화될 때, `Asset Manager`를 통해 모든 `UAchievementDataAsset`을 찾아 `AchievementData` 맵을 초기화합니다.
4.  게임플레이 코드에서 특정 조건이 만족되면(예:
	적이 죽으면), `GetGameInstance()->GetSubsystem<UAchievementSubsystem>()->ReportProgress("Kill100Enemies", 1)`과 같이 호출하여 진행 상황을 알립니다.
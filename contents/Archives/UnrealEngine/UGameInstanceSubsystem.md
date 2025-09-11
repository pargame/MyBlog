---
title: 'UGameInstanceSubsystem'
date: '2025-08-17T16:17:41+09:00'
---
> **게임이 실행되는 순간부터 종료될 때까지, 레벨 전환과 관계없이 항상 살아있는 '전역 서비스'입니다.** 게임 세션 전체에 걸쳐 단 하나만 존재하며, 저장/불러오기, 플레이어 프로필 관리, 온라인 세션 정보 유지 등 영속성이 필요한 모든 기능을 담기에 가장 이상적인 공간입니다.

### **1. 주요 역할 및 책임**
> **메인 메뉴 레벨에서 게임 플레이 레벨로 이동하더라도, 이 `UGameInstanceSubsystem`은 파괴되지 않고 그대로 유지됩니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **영속적인 기능 제공 (Providing Persistent Functionality)**:
	메인 메뉴 레벨에서 게임 플레이 레벨로 이동하더라도, 이 `UGameInstanceSubsystem`은 파괴되지 않고 그대로 유지됩니다. 따라서 여러 레벨에 걸쳐 공유되어야 하는 데이터나 시스템을 관리하기에 적합합니다.
* **자동 생명 주기 관리 (Automatic Lifecycle Management)**:
	[[UGameInstance]]가 생성될 때 함께 `Initialize()` 함수가 호출되고, 게임이 종료되어 [[UGameInstance]]가 소멸될 때 `Deinitialize()` 함수가 호출됩니다. 개발자는 이 두 함수 안에 필요한 로직을 작성하기만 하면 됩니다.
* **쉬운 접근성 (Easy Accessibility)**:
	게임 코드 어디서든 `GetGameInstance()->GetSubsystem<T>()`를 통해 쉽게 접근할 수 있습니다. 복잡한 싱글턴 패턴을 직접 구현할 필요 없이, 엔진이 제공하는 안전하고 표준화된 방법으로 전역 시스템에 접근할 수 있습니다.

### **2. 핵심 함수 (생명 주기)**
> **`UGameInstanceSubsystem`이 생성되고 초기화될 때 호출됩니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `Initialize(FSubsystemCollectionBase& Collection)`:
	`UGameInstanceSubsystem`이 생성되고 초기화될 때 호출됩니다. 다른 [[Subsystem]]에 대한 참조를 얻거나, 필요한 변수를 초기화하고, 외부 시스템에 연결하는 등의 준비 작업을 수행합니다.
* `Deinitialize()`:
	`UGameInstanceSubsystem`이 소멸되기 직전에 호출됩니다. `Initialize`에서 설정했던 것들을 정리하는 작업을 수행합니다. (예: 이벤트 핸들러 해제, 파일 저장)

### **3. 사용 예시**
> **게임의 저장 및 불러오기 로직을 총괄합니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
* **[[USaveGameSubsystem]]**:
	게임의 저장 및 불러오기 로직을 총괄합니다.
* **[[UAchievementSubsystem]]**:
	플레이어의 도전 과제 달성 여부를 추적하고 관리합니다.
* **[[UMusicManagerSubsystem]]**:
	레벨이 바뀌어도 끊기지 않고 배경 음악을 계속 재생하는 시스템을 관리합니다.
* **[[USettingsSubsystem]]**:
	플레이어의 그래픽, 오디오, 게임플레이 설정 등을 관리하고 파일에 저장합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[Subsystem]]
* [[UGameInstance]]
* [[UEngineSubsystem]]
* [[UWorldSubsystem]]

## 코드 예시
> **// 게임 인스턴스 서브시스템 구현 및 사용 UCLASS() class UMySaveSubsystem : public UGameInstanceSubsystem { GENERATED_BODY() public: virtual void Initialize(FSubsystemCollectionBase& Collection) override { // 저장 데이터 로드 등 }**
```cpp
// 게임 인스턴스 서브시스템 구현 및 사용
UCLASS()
class UMySaveSubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override
    {
        // 저장 데이터 로드 등
    }

    virtual void Deinitialize() override
    {
        // 저장 데이터 flush 등
    }
};

// 사용 예시 (아무 곳에서나)
void UseSaveSubsystem(UGameInstance* GI)
{
    if (!GI) return;
    if (auto* Save = GI->GetSubsystem<UMySaveSubsystem>())
    {
        // 기능 호출
    }
}
```

---
title: 'UGameInstance'
date: '2025-08-17T16:17:41+09:00'
---
> **게임이 시작되고 끝날 때까지 단 하나만 존재하며, 게임의 전체 생명 주기를 관리하는 최상위 관리자입니다.** 레벨이 바뀌거나 플레이어가 월드를 떠나도 `UGameInstance`는 파괴되지 않고 계속 유지됩니다. 게임 세션 전체에 걸쳐 유지되어야 할 데이터와 기능을 담는 완벽한 장소입니다.

### **1. 주요 역할 및 책임**
> **플레이어의 정보, 게임 설정, 세션 상태 등 레벨이 바뀌어도 유지되어야 하는 데이터를 저장하기에 가장 이상적인 곳입니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **영속적인 데이터 저장소 (Persistent Data Storage)**:
	플레이어의 정보, 게임 설정, 세션 상태 등 레벨이 바뀌어도 유지되어야 하는 데이터를 저장하기에 가장 이상적인 곳입니다. 예를 들어, A 레벨에서 얻은 아이템 정보를 B 레벨로 가져가야 할 때 `UGameInstance`를 사용할 수 있습니다.
* **로컬 플레이어 관리 (Local Player Management)**:
	게임에 참여하는 [[ULocalPlayer]]들을 생성하고 관리합니다. 화면 분할(Split-screen)을 위해 새로운 로컬 플레이어를 추가하는 등의 작업을 담당합니다.
* **온라인 세션 관리의 시작점 (Entry Point for Online Session)**:
	온라인 세션을 생성(CreateSession)하거나, 다른 세션을 검색(FindSessions)하고, 특정 세션에 참여(JoinSession)하는 등 온라인 기능의 시작점이 되는 경우가 많습니다. 이러한 기능들은 주로 [[Online Subsystem]]을 통해 처리됩니다.
* **전역 [[Event]] 처리 (Handling Global Events)**:
	네트워크 오류, 컨트롤러 연결/해제와 같이 게임 월드와는 독립적으로 발생하는 전역적인 [[Event]]를 처리하기에 적합합니다.

### **2. 핵심 함수**
> **`UGameInstance`가 처음 생성될 때 호출되는 초기화 함수입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `Init()`:
	`UGameInstance`가 처음 생성될 때 호출되는 초기화 함수입니다. 게임 세션에 필요한 시스템(예: [[Subsystem]])을 초기화하고, 전역 [[Event]]에 대한 바인딩을 설정하기에 좋은 위치입니다.
* `Shutdown()`:
	게임이 종료될 때 호출되는 함수입니다. `Init()`에서 설정했던 것들을 정리하고, 필요한 데이터를 저장하는 등의 마무리 작업을 수행합니다.
* `StartGameInstance()`:
	`UGameInstance`가 완전히 초기화되고 게임을 시작할 준비가 되었을 때 호출됩니다.

### **3. `UGameInstance`와 `UWorld`**
> **게임 실행 당 단 하나만 존재합니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`UGameInstance` (1개)**:
	게임 실행 당 단 하나만 존재합니다. 게임의 '프로세스'와 생명 주기를 같이합니다.
* **[[UWorld]] (여러 개일 수 있음)**:
	레벨을 담는 그릇입니다. 메인 메뉴 레벨, 게임 플레이 레벨 등 각각의 월드가 존재할 수 있습니다. 레벨이 전환되면 이전 [[UWorld]]는 파괴되고 새로운 [[UWorld]]가 생성되지만, `UGameInstance`는 그대로 유지됩니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[UGameInstanceSubsystem]]
* [[ULocalPlayer]]
* [[UWorld]]
* [[Online Subsystem]] / [[IOnlineSubsystem]]

## 코드 예시
> **// GameInstance 파생 클래스에서 초기화/종료 처리와 Subsystem 접근 UCLASS() class UMyGameInstance : public UGameInstance { GENERATED_BODY()**
```cpp
// GameInstance 파생 클래스에서 초기화/종료 처리와 Subsystem 접근
UCLASS()
class UMyGameInstance : public UGameInstance
{
    GENERATED_BODY()

public:
    virtual void Init() override
    {
        Super::Init();
        // 전역 초기화, 서브시스템 준비
        if (auto* Save = GetSubsystem<UMySaveSubsystem>())
        {
            // 저장 데이터 로드 등
        }
    }

    virtual void Shutdown() override
    {
        // 종료 처리, 데이터 flush 등
        Super::Shutdown();
    }
};
```

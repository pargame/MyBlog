---
title: 'UWorldSubsystem'
date: '2025-08-17T16:17:41+09:00'
---
> **각각의 월드([[UWorld]])가 살아 숨 쉬는 동안에만 존재하는 '월드 전용 관리자'입니다.** 레벨이 로드될 때 함께 생성되고, 다른 레벨로 이동하여 현재 월드가 파괴될 때 함께 소멸합니다. 특정 맵이나 게임 모드에 종속적인 동적인 시스템을 관리하기에 완벽한 장소입니다.

### **1. 주요 역할 및 책임**
> **특정 레벨에만 존재하는 퀘스트 시스템, 해당 레벨의 모든 AI를 총괄하는 AI 관리자, 동적인 날씨 시스템 등, 현재 월드의 상태와 밀접하게 관련된 기능을 구현하는 데 사용됩니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **월드-한정 기능 제공 (World-Specific Functionality)**:
	특정 레벨에만 존재하는 퀘스트 시스템, 해당 레벨의 모든 AI를 총괄하는 AI 관리자, 동적인 날씨 시스템 등, 현재 월드의 상태와 밀접하게 관련된 기능을 구현하는 데 사용됩니다.
* **자동 생명 주기 관리 (Automatic Lifecycle Management)**:
	[[UWorld]]가 초기화될 때 `Initialize()`가 호출되고, [[UWorld]]가 소멸될 때 `Deinitialize()`가 호출됩니다. 개발자는 월드의 생성과 소멸에 맞춰 필요한 로직을 안전하게 실행할 수 있습니다.
* **게임플레이 시스템에 이상적 (Ideal for Gameplay Systems)**:
	[[AActor]]와 컴포넌트들을 직접 쿼리하고 관리하는 시스템에 매우 적합합니다. 예를 들어, 월드 내의 모든 특정 유형의 적을 찾아 목록을 유지하거나, 주기적으로 모든 플레이어의 위치를 검사하는 등의 작업을 수행할 수 있습니다.

### **2. 핵심 함수 (생명 주기)**
> **월드가 초기화될 때 호출됩니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `Initialize(FSubsystemCollectionBase& Collection)`:
	월드가 초기화될 때 호출됩니다. 이 월드에서 사용할 시스템을 준비하고, 월드 내의 [[AActor]]들을 탐색하여 초기 상태를 설정하는 등의 작업을 수행합니다.
* `Deinitialize()`:
	월드가 소멸되기 직전에 호출됩니다. 이 월드에서 사용했던 리소스를 정리하고, 필요한 상태를 [[UGameInstanceSubsystem]] 등에 저장하여 다음 레벨로 넘겨주는 등의 마무리 작업을 할 수 있습니다.

### **3. 사용 예시**
> **월드 내의 모든 AI 캐릭터를 추적하고, 플레이어의 위치에 따라 AI들의 행동을 총괄적으로 지시합니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
* **`AIQueryManagerSubsystem`**:
	월드 내의 모든 AI 캐릭터를 추적하고, 플레이어의 위치에 따라 AI들의 행동을 총괄적으로 지시합니다.
* **`DynamicWorldEventSubsystem`**:
	현재 월드에서 발생하는 동적인 [[Event]](예: 특정 지역에 몬스터 무리 스폰, 보급품 투하)를 관리합니다.
* **`ProceduralGenerationSubsystem`**:
	현재 월드가 시작될 때, 절차적 생성 알고리즘을 통해 맵의 일부를 동적으로 생성하고 배치합니다.

### **4. 관련 클래스**
> **이 서브시스템의 생명주기를 관리하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UWorld]]**:
	이 서브시스템의 생명주기를 관리하는 주체입니다.
* **[[UGameInstanceSubsystem]]**:
	게임 전체 생명주기 동안 유지되는 서브시스템입니다.
* **[[AActor]]**:
	월드를 구성하는 기본 단위로, 서브시스템이 관리할 수 있는 대상입니다.
* **[[Event]]**:
	서브시스템 내에서 동적인 이벤트를 처리하는 데 사용될 수 있습니다.

### **5. 코드 예시**
> **// 간단한 월드 서브시스템 구현 예시 #include "Subsystems/WorldSubsystem.h"**
```cpp
// 간단한 월드 서브시스템 구현 예시
#include "Subsystems/WorldSubsystem.h"

class UMyWorldSubsystem : public UWorldSubsystem
{
    GENERATED_BODY()

public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override
    {
        UE_LOG(LogTemp, Log, TEXT("UMyWorldSubsystem::Initialize for world %s"), *GetWorld()->GetName());
    }

    virtual void Deinitialize() override
    {
        UE_LOG(LogTemp, Log, TEXT("UMyWorldSubsystem::Deinitialize"));
    }

    // 월드 틱에 맞춰 동작하려면 월드의 틱 이벤트에 델리게이트로 바인딩하는 방식 등을 사용
    void TickWorld(float DeltaSeconds)
    {
        // 월드 단위의 주기적 로직
    }
};
```

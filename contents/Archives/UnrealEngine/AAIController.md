---
title: 'AAIController'
date: '2025-08-17T16:17:41+09:00'
---
> 인공지능(AI) 캐릭터의 '뇌'가 되어, 스스로 판단하고 행동하며 [[APawn]]을 제어하는 특수한 [[AController]]입니다.

## 주요 역할 및 책임
> **월드 인식 → 의사결정 → 이동/행동 실행의 전체 루프를 총괄합니다.**
월드 인식 → 의사결정 → 이동/행동 실행의 전체 루프를 총괄합니다.
* **의사 결정 (Decision Making)**:
	[[UBehaviorTree]]를 실행해 현재 상황에 맞는 행동(예: 순찰, 추적, 엄폐)을 선택합니다.
* **월드 인식 (World Perception)**:
	[[UAIPerceptionComponent]]로 시각/청각 등 자극을 감지해 목표를 갱신합니다.
* **내비게이션 (Navigation)**:
	[[UNavigationSystemV1]]·NavMesh 기반으로 경로를 계산해 목표 지점까지 이동합니다.
* **[[APawn]] 제어 (Pawn Control)**:
	`Possess`로 [[APawn]]을 빙의하고 `MoveTo*` 계열로 실제 이동을 수행합니다.

## 핵심 속성·함수
> **행동 제어와 상태 관리를 위한 핵심 API입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
행동 제어와 상태 관리를 위한 핵심 API입니다.
* **`RunBehaviorTree(UBehaviorTree* BTAsset)`**:
	비헤이비어 트리를 실행합니다.
* **`MoveToActor(AActor* Goal, ...)` / `MoveToLocation(const FVector& Dest, ...)`**:
	목표 액터 또는 위치로 이동 명령을 내립니다.
* **`GetBlackboardComponent()`**:
	블랙보드 컴포넌트를 반환합니다.
* **`SetFocus(AActor* NewFocus)` / `ClearFocus(EAIFocusPriority::Type)`**:
	특정 액터에 포커스를 맞추거나 해제합니다.
* **`BrainComponent` (`UBrainComponent*`)**:
	AI의 두뇌 역할을 하는 컴포넌트입니다.

## 사용 패턴 및 워크플로우
> **`OnPossess`에서 `RunBehaviorTree`를 호출하고, 블랙보드 키를 일관된 네이밍으로 관리합니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
* **Behavior Tree 구동**:
	`OnPossess`에서 `RunBehaviorTree`를 호출하고, 블랙보드 키를 일관된 네이밍으로 관리합니다.
* **Perception 설정**:
	[[UAIPerceptionComponent]]를 추가하고 시야/청각 설정을 분리해 튜닝합니다. `OnTargetPerceptionUpdated`에서 목표를 블랙보드에 반영합니다.
* **이동 명령**:
	`MoveToActor/Location`은 기존 이동이 있으면 자동 취소될 수 있으니, 조건부 재발행 또는 `FAIMoveRequest`로 세밀하게 제어합니다.
* **Focus 운용**:
	장거리 추적/근접 전투 등 상황에 따라 `SetFocus` 대상을 바꾸고 필요 시 `ClearFocus`로 해제합니다.

## 관련 클래스
> **트리 기반 의사결정 툴입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UBehaviorTree]]**:
	트리 기반 의사결정 툴입니다.
* **[[UBlackboardComponent]]**:
	공유 데이터 저장소입니다.
* **[[UAIPerceptionComponent]]**:
	감각(시각/청각) 처리를 담당합니다.
* **[[UNavigationSystemV1]]**:
	경로 탐색 시스템입니다.
* **[[APawn]]**:
	제어 대상 본체입니다.

## 코드 예시
> **// 간단한 AIController: 비헤이비어 트리 실행 + 플레이어를 목표로 이동 #include "AIController.h" #include "BehaviorTree/BehaviorTree.h" #include "BehaviorTree/BlackboardComponent.h" #include "Kismet/GameplayStatics.h"**
```cpp
// 간단한 AIController: 비헤이비어 트리 실행 + 플레이어를 목표로 이동
#include "AIController.h"
#include "BehaviorTree/BehaviorTree.h"
#include "BehaviorTree/BlackboardComponent.h"
#include "Kismet/GameplayStatics.h"

class AMyAIController : public AAIController
{
    GENERATED_BODY()

public:
    UPROPERTY(EditDefaultsOnly, Category="AI")
    UBehaviorTree* BehaviorTreeAsset = nullptr;

    virtual void OnPossess(APawn* InPawn) override
    {
        Super::OnPossess(InPawn);

        if (BehaviorTreeAsset)
        {
            RunBehaviorTree(BehaviorTreeAsset);
        }

        // 간단한 예: 첫 번째 플레이어 폰을 찾아 이동
        APawn* PlayerPawn = UGameplayStatics::GetPlayerPawn(this, 0);
        if (PlayerPawn)
        {
            // 블랙보드 사용 시 키에 저장해도 됨
            if (UBlackboardComponent* BB = GetBlackboardComponent())
            {
                BB->SetValueAsObject(TEXT("TargetActor"), PlayerPawn);
            }
            MoveToActor(PlayerPawn, /*AcceptanceRadius=*/100.f);
            SetFocus(PlayerPawn);
        }
    }
};
```

이 모든 요소들이 결합되어, `AAIController`는 복잡하고 지능적인 AI 캐릭터를 만들어내는 강력한 기반이 됩니다.

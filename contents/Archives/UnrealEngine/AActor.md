---
title: 'AActor'
date: '2025-08-17T16:17:41+09:00'
---
> **언리얼 엔진 월드를 구성하는 가장 기본적인 '오브젝트'이자 '존재'입니다.** 레벨에 배치할 수 있는 모든 것, 즉 캐릭터, 소품, 조명, 카메라 등은 모두 `AActor`로부터 시작됩니다. 월드에 존재하려면 반드시 `AActor`여야 합니다.

## 주요 역할 및 책임
> **`AActor`는 월드 내에서 위치, 회전, 크기를 가지며, 스스로 존재하고 행동할 수 있는 모든 것의 청사진입니다.**
* **월드 내 존재의 단위 (Unit of Existence in World)**:
	레벨에 배치(Spawn)될 수 있는 가장 기본적인 클래스입니다. 위치([[FTransform]]), 회전, 스케일 값을 가집니다.
* **컴포넌트의 컨테이너 (Container for Components)**:
	`AActor` 자체는 많은 기능을 가지고 있지 않습니다. 대신, 기능 단위인 [[UActorComponent]]들을 담는 그릇 역할을 합니다. 예를 들어, 시각적 외형은 [[UStaticMeshComponent]]가, 이동 능력은 [[UMovementComponent]]가 담당하며, `AActor`는 이들을 조합하여 완성됩니다.
* **네트워크 복제 (Network Replication)**:
	서버에서 클라이언트로 상태를 복제(Replicate)할 수 있는 능력을 갖추고 있습니다. 멀티플레이어 게임의 모든 동기화는 `AActor` 단위로 이루어집니다.
* **생명 주기 관리 (Lifecycle Management)**:
	월드에 스폰될 때(`BeginPlay`), 매 프레임마다(`Tick`), 그리고 월드에서 사라질 때(`EndPlay`)의 생명 주기 [[Event]]를 가지고 있어, 개발자가 원하는 시점에 특정 로직을 실행할 수 있습니다.

## 핵심 속성·함수
> **`AActor`의 상태를 제어하고 월드와 상호작용하기 위한 가장 기본적인 도구들입니다.**
* **`GetTransform()` / `SetActorTransform(const FTransform& NewTransform)`**:
	`AActor`의 위치, 회전, 스케일 정보를 한 번에 얻거나 설정합니다.
* **`GetActorLocation()` / `SetActorLocation(const FVector& NewLocation)`**:
	`AActor`의 월드 내 위치(좌표)를 얻거나 설정합니다.
* **`GetActorRotation()` / `SetActorRotation(const FRotator& NewRotation)`**:
	`AActor`의 회전 값을 얻거나 설정합니다.
* **`Destroy()`**:
	이 `AActor`를 월드에서 제거하도록 요청합니다. 실제 파괴는 약간의 지연 이후에 일어납니다.
* **`OnActorBeginOverlap`**:
	다른 `AActor`와 처음으로 겹치기 시작했을 때 호출되는 [[Event]]입니다.
* **`OnActorEndOverlap`**:
	다른 `AActor`와의 겹침이 끝났을 때 호출되는 [[Event]]입니다.
* **`GetComponents(TArray<UActorComponent*>& Components)`**:
	이 `AActor`에 붙어있는 모든 컴포넌트의 목록을 가져옵니다.

## 주요 서브클래스
> **`AActor`는 매우 범용적이므로, 특정 목적에 맞게 기능이 추가된 다양한 자식 클래스들이 존재합니다.**
* **[[APawn]]**:
	[[AController]]에 의해 제어될 수 있는 `AActor`입니다. 플레이어나 AI의 '아바타' 역할을 합니다.
* **[[ACharacter]]**:
	걷고, 뛰고, 점프하는 등 인간형 이동에 특화된 폰입니다.
* **[[AStaticMeshActor]]**:
	레벨에 배치되는 돌, 나무, 건물 등 움직이지 않는 정적인 메쉬를 표현하는 데 사용되는 간단한 `AActor`입니다.
* **[[ALight]]**:
	월드를 밝히는 조명의 역할을 하는 `AActor`입니다.
* **[[ACameraActor]]**:
	특정 시점을 나타내는 카메라 역할을 하는 `AActor`입니다.

## 사용 패턴 및 워크플로우
> **사용 패턴 및 워크플로우 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
* 레벨에 `AActor`를 배치하고, 필요한 컴포넌트를 추가하여 기능을 부여합니다.
* 스폰이 필요한 경우 [[UGameplayStatics]]의 `SpawnActor` 계열 함수를 사용합니다.

## 관련 클래스
> **`AActor`의 기능을 이루는 구성 요소 단위입니다.**
* **[[UActorComponent]]**:
	`AActor`의 기능을 이루는 구성 요소 단위입니다.
* **[[USceneComponent]]**:
	트랜스폼(위치/회전/스케일)을 가지는 컴포넌트의 베이스입니다.
* **[[UPrimitiveComponent]]**:
	렌더링/물리/충돌 등 시각·물리 표현을 담당합니다.
* **[[UGameplayStatics]]**:
	액터 스폰/검색 등 유틸리티 함수 모음입니다.
* **[[AController]] / [[APawn]]**:
	제어 가능한 액터 계층으로, 게임플레이의 핵심 주체입니다.

## 코드 예시
> **// 가장 기본적인 AActor 서브클래스와 스폰 예시 #include "GameFramework/Actor.h" #include "Kismet/GameplayStatics.h"**
```cpp
// 가장 기본적인 AActor 서브클래스와 스폰 예시
#include "GameFramework/Actor.h"
#include "Kismet/GameplayStatics.h"

class AMyActor : public AActor
{
    GENERATED_BODY()

public:
    virtual void BeginPlay() override
    {
        Super::BeginPlay();
        UE_LOG(LogTemp, Log, TEXT("AMyActor::BeginPlay"));
    }
};

// 다른 액터에서 스폰
void ASpawner::SpawnSimpleActor()
{
    UWorld* World = GetWorld();
    if (!World) return;
    FActorSpawnParameters Params;
    Params.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButAlwaysSpawn;
    World->SpawnActor<AMyActor>(AMyActor::StaticClass(), GetActorLocation() + FVector(100,0,0), FRotator::ZeroRotator, Params);
}
```


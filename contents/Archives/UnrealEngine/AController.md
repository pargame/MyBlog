---
title: 'AController'
date: '2025-08-17T16:17:41+09:00'
---
> [[APawn]]의 의지를 결정하는 원격 조종사로, 플레이어 입력 또는 AI 로직을 [[APawn]]의 행동으로 변환합니다.

## 개요/정의
> **`AController`는 [[APawn]] 제어 로직을 본체로부터 분리해, 같은 폰을 사람이든 AI든 유연하게 조종하도록 합니다.**
`AController`는 [[APawn]] 제어 로직을 본체로부터 분리해, 같은 폰을 사람이든 AI든 유연하게 조종하도록 합니다.

## 주요 역할 및 책임
> **특정 [[APawn]]에 제어권을 부여(`Possess`)하거나 해제(`UnPossess`)합니다.**
* **빙의 (Possession)**:
	특정 [[APawn]]에 제어권을 부여(`Possess`)하거나 해제(`UnPossess`)합니다.
* **상태/시점 관리**:
	[[APlayerState]](영속 상태), [[APlayerCameraManager]](카메라)와 연동합니다.
* **의지 전달**:
	입력/AI 의사결정을 이동·행동 명령으로 변환합니다.

## 핵심 속성·함수
> **Pawn의 소유권을 획득하거나 해제합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Possess(APawn* InPawn)` / `UnPossess()`**:
	Pawn의 소유권을 획득하거나 해제합니다.
* **`GetPawn()` / `GetCharacter()`**:
	현재 소유 중인 Pawn 또는 Character를 반환합니다.
* **`OnPossess(APawn* InPawn)` / `OnUnPossess()`**:
	Pawn 소유/해제 시 호출되는 [[Event]]입니다.
* **`PlayerState` ([[APlayerState]]*)**:
	플레이어의 상태 정보를 담고 있습니다.
* **`SetControlRotation(const FRotator& NewRotation)`**:
	컨트롤러의 회전값을 설정합니다.

## 사용 패턴 및 워크플로우
> **사용 패턴 및 워크플로우 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
* 서버 권한에서 스폰 → `Possess` 순으로 초기화합니다.
* 카메라 방향은 컨트롤 로테이션 기준으로, 폰 회전과 분리할 수 있습니다.
* 플레이어/AI 컨트롤러 간 전환 시 `UnPossess` 정리 후 `Possess`를 재부여합니다.

## 관련 클래스
> **플레이어 및 AI 컨트롤러의 구분입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[APlayerController]] / [[AAIController]]**:
	플레이어 및 AI 컨트롤러의 구분입니다.
* **[[APawn]] / [[ACharacter]]**:
	제어 대상 본체 및 캐릭터입니다.
* **[[APlayerState]]**:
	플레이어의 상태 정보를 담는 클래스입니다.
* **[[APlayerCameraManager]]**:
	플레이어의 카메라 뷰를 관리합니다.

## 코드 예시
> **// 컨트롤러가 기본 폰을 스폰하고 빙의 #include "GameFramework/Controller.h" #include "GameFramework/Pawn.h"**
```cpp
// 컨트롤러가 기본 폰을 스폰하고 빙의
#include "GameFramework/Controller.h"
#include "GameFramework/Pawn.h"

class AMyController : public AController
{
    GENERATED_BODY()

public:
    UPROPERTY(EditDefaultsOnly, Category="Controller")
    TSubclassOf<APawn> PawnClassToControl;

    virtual void BeginPlay() override
    {
        Super::BeginPlay();

        if (HasAuthority() && PawnClassToControl)
        {
            FActorSpawnParameters Params;
            Params.Owner = this;
            if (APawn* NewPawn = GetWorld()->SpawnActor<APawn>(PawnClassToControl, FVector::ZeroVector, FRotator::ZeroRotator, Params))
            {
                Possess(NewPawn);
            }
        }
    }

    virtual void OnPossess(APawn* InPawn) override
    {
        Super::OnPossess(InPawn);
        SetControlRotation(FRotator(0.f, 90.f, 0.f));
    }
};
```
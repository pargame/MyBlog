---
title: 'APlayerController'
date: '2025-08-17T16:17:41+09:00'
---
> **게임 세계와 실제 플레이어를 연결하는 '신경계'이자, 플레이어의 의지를 [[APawn]]에 전달하는 대리인입니다.** 키보드, 마우스, 게임패드로부터 입력을 받아 처리하고, 화면에 UI(HUD)를 그리며, 서버와 통신하는 등 플레이어와 관련된 모든 상호작용을 총괄합니다.

## 주요 역할 및 책임
> **[[UEnhancedInputLocalPlayerSubsystem]]과 같은 시스템을 통해 하드웨어 입력을 받아, 이를 '이동', '점프', '공격'과 같은 게임 내 행동으로 변환하고, 제어 중인 [[APawn]]에게 명령을 내립니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **입력 처리 및 변환 (Input Processing and Conversion)**:
	[[UEnhancedInputLocalPlayerSubsystem]]과 같은 시스템을 통해 하드웨어 입력을 받아, 이를 '이동', '점프', '공격'과 같은 게임 내 행동으로 변환하고, 제어 중인 [[APawn]]에게 명령을 내립니다.
* **HUD 및 UI 관리 (HUD and UI Management)**:
	플레이어의 화면에 체력 바, 미니맵, 메뉴 등 사용자 인터페이스(UI)를 표시하는 역할을 합니다. HUD 클래스를 소유하고 관리합니다.
* **카메라 제어 (Camera Control)**:
	[[APlayerCameraManager]]를 통해 플레이어의 시점을 관리합니다. 1인칭, 3인칭, 자유 시점 등 다양한 카메라 동작을 구현하고, 카메라 흔들림([[UCameraShake]])과 같은 효과를 제어합니다.
* **서버와의 통신 (Client-Server Communication)**:
	클라이언트 측의 입력을 서버로 전송하고, 서버로부터 받은 게임 상태(예: 다른 플레이어의 위치)를 클라이언트에 반영하는 등 네트워크 통신의 핵심적인 역할을 수행합니다. 클라이언트에서 실행되어야 하는 RPC(원격 프로시저 호출)는 대부분 `APlayerController`에 작성됩니다.

## 핵심 함수 및 속성
> **이 `APlayerController`에 대한 카메라를 관리하는 [[APlayerCameraManager]] 클래스에 대한 포인터입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `PlayerCameraManager`:
	이 `APlayerController`에 대한 카메라를 관리하는 [[APlayerCameraManager]] 클래스에 대한 포인터입니다.
* `bShowMouseCursor` / `bEnableClickEvents` / `bEnableMouseOverEvents`:
	마우스 커서를 화면에 표시하고, 클릭 및 마우스 오버 [[Event]]를 활성화할지 여부를 결정하는 `bool` 변수들입니다. UI와 상호작용할 때 주로 사용됩니다.
* `Possess(APawn* InPawn)`:
	지정된 [[APawn]]에 빙의하여 제어권을 획득합니다. 이 함수가 호출되면, 플레이어의 입력이 해당 [[APawn]]에게 전달되기 시작합니다.
* `UnPossess()`:
	현재 제어 중인 [[APawn]]으로부터 빙의를 해제합니다.
* `ClientPlayCameraShake(TSubclassOf<UCameraShakeBase> Shake)`:
	클라이언트의 화면에만 카메라 흔들림 효과를 재생합니다. (예: 피격, 폭발)
* `ServerSetViewTarget(AActor* NewViewTarget)`:
	서버에 요청하여 이 `APlayerController`의 시점을 특정 [[AActor]]로 고정합니다. (예: 관전 모드)

## `APlayerController`와 `APawn`의 관계
> **`APlayerController`는 [[APawn]]이 죽거나 교체되어도 파괴되지 않고 계속 존재할 수 있습니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **분리된 존재**:
	`APlayerController`는 [[APawn]]이 죽거나 교체되어도 파괴되지 않고 계속 존재할 수 있습니다. 리스폰 시, 동일한 `APlayerController`가 새로운 [[APawn]]에 `Possess`하여 게임을 이어갑니다.
* **유연한 제어**:
	이러한 분리 덕분에, 하나의 `APlayerController`가 상황에 따라 다른 종류의 [[APawn]] (예: 평소에는 캐릭터, 특정 구간에서는 차량)을 제어하는 것이 가능해집니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[APawn]] / [[ACharacter]]:
	소유(Possess) 대상. 입력을 실행 단위 동작으로 변환해 전달합니다.
* [[APlayerCameraManager]]:
	카메라 시점과 흔들림을 관리합니다.
* [[AHUD]]:
	HUD와 UI 렌더링을 담당하는 액터입니다.
* [[UEnhancedInputLocalPlayerSubsystem]] / [[UInputComponent]]:
	입력 시스템과의 브릿지 역할을 합니다.
* [[UGameViewportClient]] / [[ULocalPlayer]]:
	로컬 플레이어/뷰포트와 컨트롤러의 연결 지점입니다.

## 코드 예시
> **// 플레이어 컨트롤러: Pawn 빙의와 간단한 UI 토글 예시 #include "GameFramework/PlayerController.h" #include "Blueprint/UserWidget.h"**
```cpp
// 플레이어 컨트롤러: Pawn 빙의와 간단한 UI 토글 예시
#include "GameFramework/PlayerController.h"
#include "Blueprint/UserWidget.h"

class AMyPlayerController : public APlayerController
{
	GENERATED_BODY()

public:
	UPROPERTY(EditAnywhere)
	TSubclassOf<UUserWidget> MenuClass;

	UFUNCTION(Exec)
	void ToggleMenu()
	{
		if (!MenuClass) return;

		if (!Menu)
		{
			Menu = CreateWidget<UUserWidget>(this, MenuClass);
			if (Menu)
			{
				Menu->AddToViewport(10);
				bShowMouseCursor = true;
				FInputModeUIOnly InputMode;
				InputMode.SetWidgetToFocus(Menu->TakeWidget());
				SetInputMode(InputMode);
			}
		}
		else
		{
			Menu->RemoveFromParent();
			Menu = nullptr;
			bShowMouseCursor = false;
			SetInputMode(FInputModeGameOnly());
		}
	}

protected:
	UPROPERTY()
	UUserWidget* Menu = nullptr;
};
```


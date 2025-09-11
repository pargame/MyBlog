---
title: 'AGameModeBase'
date: '2025-08-17T16:17:41+09:00'
---
> **게임의 규칙과 흐름을 총괄하는 보이지 않는 지휘자입니다.** 서버에만 존재하며, 플레이어의 접속부터 스폰, 게임의 시작과 종료까지 모든 것을 관장합니다. 클라이언트는 이 복잡한 규칙을 알 필요 없이, 오직 서버의 안내에 따라 월드에 참여하고 상호작용합니다. 즉, 게임의 '뇌'와 같은 역할을 수행합니다.

## 클래스 기본값 설정
> **게임에 필요한 핵심 클래스들의 기본 타입을 정의합니다.**
게임에 필요한 핵심 클래스들의 기본 타입을 정의합니다. 어떤 종류의 플레이어, 컨트롤러, 게임 상태를 사용할지 미리 지정하는 청사진과 같습니다.
* **`DefaultPawnClass`**:
	`RestartPlayer`가 호출될 때 스폰할 기본 [[APawn]] 클래스를 지정합니다.
* **`PlayerControllerClass`**:
	`Login` 시 생성할 [[APlayerController]] 클래스를 지정합니다.
* **`PlayerStateClass`**:
	`Login` 시 생성할 [[APlayerState]] 클래스를 지정합니다.
* **`GameStateClass`**:
	이 게임 모드와 함께 사용할 [[AGameStateBase]] 클래스를 지정합니다.
* **`HUDClass`**:
	플레이어 컨트롤러가 사용할 기본 HUD 클래스를 지정합니다.

## 플레이어 접속 및 초기화
> **플레이어가 월드에 들어와 게임에 참여하기까지의 전반적인 과정을 관리합니다.**
플레이어가 월드에 들어와 게임에 참여하기까지의 전반적인 과정을 관리합니다. 접속 승인부터 컨트롤러와 상태 정보 초기화, 그리고 최종 로그인 완료까지의 흐름을 제어합니다.
* **`PreLogin(FString& Options, ...)`**:
	플레이어가 접속을 시도할 때 가장 먼저 호출됩니다. 여기서 접속을 허용할지 거부할지 결정할 수 있습니다. (예: 비밀번호 확인, 밴 목록 확인)
* **`Login(APlayerController* NewPlayer, ...)`**:
	`PreLogin`을 통과한 플레이어를 위해 [[APlayerController]]를 생성하고 초기화한 후 호출됩니다. 이 함수는 `InitNewPlayer`와 `PostLogin`을 순차적으로 호출합니다.
* **`InitNewPlayer(APlayerController* NewPlayerController, ...)`**:
	새로 생성된 [[APlayerController]]에 대한 추가적인 초기화 로직을 수행합니다. 여기서 [[APlayerState]]가 생성되고 컨트롤러에 연결됩니다.
* **`PostLogin(APlayerController* NewPlayer)`**:
	플레이어가 성공적으로 로그인하고 모든 초기화가 끝난 후 호출됩니다. 이 함수가 플레이어를 월드에 스폰시키는 `RestartPlayer`를 호출하는 가장 일반적인 위치입니다.

## 폰 스폰 및 리스폰 (Pawn Spawning & Respawning)
> **플레이어의 폰을 월드에 생성하고 제어권을 부여하는 과정을 관리합니다.**
플레이어의 폰을 월드에 생성하고 제어권을 부여하는 과정을 관리합니다. 어디서, 어떤 모습으로, 어떻게 나타날지를 결정하는 규칙의 집합입니다.
* **`RestartPlayer(AController* NewPlayer)`**:
	`NewPlayer` 컨트롤러를 위한 폰을 스폰하고 빙의시키는 전체 프로세스를 시작합니다.
* **`FindPlayerStart_Implementation(AController* Player, ...)`**:
	[[AActor]]를 반환하며, 플레이어가 스폰될 위치를 결정합니다. 기본적으로는 [[APlayerStart]] 액터를 찾습니다.
* **`GetDefaultPawnClassForController(AController* InController)`**:
	`InController`에 적합한 폰 클래스를 반환합니다. 기본적으로는 `DefaultPawnClass`를 사용하지만, 특정 컨트롤러에 따라 다른 폰을 스폰하도록 오버라이드할 수 있습니다.
* **`SpawnDefaultPawnFor(AController* NewPlayer, AActor* StartSpot)`**:
	결정된 위치(StartSpot)에 결정된 클래스(`GetDefaultPawnClassForController`의 반환값)의 폰을 스폰합니다.
* **`Possess(APawn* InPawn)`**:
	`NewPlayer` 컨트롤러의 이 함수를 호출하여, 방금 스폰된 폰에 대한 제어권을 부여합니다.
* **`K2_OnSetMatchState(FName NewState)`**:
	게임의 매치 상태(MatchState)가 변경될 때 호출되는 블루프린트 [[Event]]입니다. `WaitingToStart`, `InProgress`, `WaitingPostMatch` 등의 상태에 따라 특정 로직(예: `InProgress` 상태가 되면 모든 플레이어의 `RestartPlayer` 호출)을 실행하는 데 사용됩니다.

## 게임 흐름 및 규칙 관리 (Game Flow & Rule Management)
> **게임의 시작, 종료, 승패 조건 등 핵심 규칙을 처리합니다.**
게임의 시작, 종료, 승패 조건 등 핵심 규칙을 처리합니다. 게임의 전체적인 맥박과 생명주기를 관장하는 심장과도 같은 역할을 합니다.
* **`StartPlay()`**:
	`AGameModeBase`의 `BeginPlay`입니다. 모든 액터의 `BeginPlay`가 호출되기 전에 호출되어, 게임 시작을 위한 최종 준비를 합니다.
* **`Logout(AController* Exiting)`**:
	플레이어가 게임을 떠날 때 호출됩니다. 해당 플레이어의 폰과 컨트롤러를 파괴하는 등 정리 로직을 수행합니다.
* **`EndMatch()`**:
	게임이 끝났을 때 호출됩니다. 승리/패배 로직을 처리하고, `WaitingPostMatch` 상태로 전환하는 등의 작업을 수행합니다.
* **`CanDealDamage(APlayerState* DamageInstigator, APlayerState* DamagedPlayer)`**:
	특정 플레이어가 다른 플레이어에게 피해를 줄 수 있는지(예: 팀킬 방지)를 결정하는 훅(Hook) 함수입니다.

## 코드 예시
> **// 간단한 게임모드: 플레이어 로그인과 리스타트 로직 #include "GameFramework/GameModeBase.h"**
```cpp
// 간단한 게임모드: 플레이어 로그인과 리스타트 로직
#include "GameFramework/GameModeBase.h"

class AMyGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	virtual void PostLogin(APlayerController* NewPlayer) override
	{
		Super::PostLogin(NewPlayer);
		RestartPlayer(NewPlayer);
	}

	virtual AActor* FindPlayerStart_Implementation(AController* Player, const FString& IncomingName) override
	{
		// 기본 구현을 사용하거나, 태그 기준의 커스텀 선택 가능
		return Super::FindPlayerStart_Implementation(Player, IncomingName);
	}
};
```

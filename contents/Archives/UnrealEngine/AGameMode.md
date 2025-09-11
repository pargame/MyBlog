---
title: 'AGameMode'
date: '2025-08-17T16:17:41+09:00'
---
> `AGameMode`는 [[AGameModeBase]]를 상속받아, '데스매치'나 '깃발 뺏기'와 같이 명확한 시작, 진행, 종료 상태를 가지는 전통적인 멀티플레이어 게임을 위해 설계된 클래스입니다. [[AGameModeBase]]의 모든 기능 위에, **매치 상태 머신(Match State Machine)**과 관련된 추가적인 규칙 및 흐름 제어 기능을 제공합니다.

## 매치 상태 관리 (Match State Management)
> **게임의 현재 상태(대기 중, 진행 중, 종료 등)를 관리하고 전환하는 상태 머신을 제공합니다.**
게임의 현재 상태(대기 중, 진행 중, 종료 등)를 관리하고 전환하는 상태 머신을 제공합니다. 이 상태는 [[AGameState]]를 통해 모든 클라이언트에게 복제됩니다.
* **`MatchState`**:
	현재 게임의 상태를 나타내는 `FName` 변수입니다. (`WaitingToStart`, `InProgress`, `WaitingPostMatch` 등의 값을 가집니다.)
* **`SetMatchState(FName NewState)`**:
	게임의 MatchState를 지정된 상태로 변경합니다. 상태 변경 시 `OnMatchStateSet` [[Event]]가 호출됩니다.
* **`StartMatch()`**:
	`MatchState`를 `InProgress`로 설정하여 게임의 주요 로직이 시작되도록 합니다.
* **`EndMatch()`**:
	`MatchState`를 `WaitingPostMatch`로 설정하여 게임을 종료합니다. 승리/패배 로직을 처리하고, 플레이어들을 로비로 돌려보내는 등의 작업을 수행합니다.
* **`AbortMatch()`**:
	게임을 비정상적으로 중단시킵니다.

## 게임 규칙 및 스코어링 (Game Rules & Scoring)
> **플레이어의 행동에 따른 점수 계산 등, 구체적인 게임 승리 조건을 처리하는 함수들을 포함합니다.**
플레이어의 행동에 따른 점수 계산 등, 구체적인 게임 승리 조건을 처리하는 함수들을 포함합니다.
* **`Killed([[AController]]* Killer, [[AController]]* KilledPlayer, [[APawn]]* KilledPawn, TSubclassOf<[[UDamageType]]> DamageType)`**:
	폰이 죽었을 때 게임 모드에 알리기 위해 호출되는 함수입니다. 이 함수 내부에서 점수를 계산하고, 리스폰 로직(`RestartPlayer`)을 호출하는 등의 처리를 합니다.
* **`ShouldReset([[AActor]]* ActorToReset)`**:
	`EndMatch` 후 다음 매치를 위해 특정 액터를 리셋해야 하는지 여부를 결정합니다.

## 플레이어 및 세션 관리 (Player & Session Management)
> **매치 기반 게임에서 플레이어의 참여와 이탈을 관리합니다.**
매치 기반 게임에서 플레이어의 참여와 이탈을 관리합니다.
* **`HandleStartingNewPlayer([[APlayerController]]* NewPlayer)`**:
	`PostLogin` 이후, 그리고 `RestartPlayer` 이전에 호출됩니다. 매치가 이미 진행 중일 때 접속한 플레이어를 어떻게 처리할지(예: 관전자로 시작) 결정하는 로직을 넣기에 적합합니다.
* **`Logout([[AController]]* Exiting)`**:
	[[AGameModeBase]]에도 있지만, `AGameMode`에서는 매치와 관련된 추가적인 정리(예: 플레이어 점수판에서 제거)를 수행하도록 오버라이드할 수 있습니다.

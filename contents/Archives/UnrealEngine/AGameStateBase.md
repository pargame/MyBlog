---
title: 'AGameStateBase'
date: '2025-08-17T16:17:41+09:00'
---
> **게임의 '공개적인 상태 정보'를 모든 플레이어에게 복제(Replicate)하여 동기화하는 '게임의 전광판'입니다.** 게임의 경과 시간, 남은 플레이어 수, 현재 점수, 매치 상태 등, 서버뿐만 아니라 모든 클라이언트가 알아야 할 게임의 현재 상태를 담는 역할을 합니다.

## 주요 역할 및 책임
> **`AGameStateBase`는 서버에서 계산된 게임의 중요 상태를 모든 클라이언트에게 안전하게 전파하는 핵심적인 통신 채널입니다.**
`AGameStateBase`는 서버에서 계산된 게임의 중요 상태를 모든 클라이언트에게 안전하게 전파하는 핵심적인 통신 채널입니다.
* **게임 상태의 복제 (Replication of Game State)**:
	`AGameStateBase`에 `Replicated`로 지정된 모든 변수는 서버에서 값이 변경될 때마다 모든 클라이언트에게 자동으로 전송됩니다. 이를 통해 모든 플레이어가 동일한 게임 상태 정보를 공유하게 됩니다.
* **모든 플레이어 목록 관리 (Tracking All Players)**:
	`PlayerArray`라는 복제된 배열을 통해, 현재 게임 세션에 참여하고 있는 모든 [[APlayerState]]의 목록을 유지하고 동기화합니다. 이를 통해 각 클라이언트는 다른 모든 플레이어의 존재와 상태를 알 수 있습니다.
* **게임 규칙과의 연동 (Integration with Game Rules)**:
	[[AGameModeBase]]는 서버에만 존재하지만, `AGameStateBase`는 서버와 모든 클라이언트에게 존재합니다. [[AGameModeBase]]가 게임의 규칙을 실행하고 그 결과를 `AGameStateBase`의 변수에 저장하면, 이 정보가 모든 클라이언트에게 전달되어 UI(예: 점수판)에 표시될 수 있습니다.
* **매치 상태 동기화 (Synchronizing Match State)**:
	[[AGameMode]]에서 관리하는 게임의 매치 상태(`WaitingToStart`, `InProgress` 등)는 `AGameStateBase`의 `MatchState` 변수를 통해 클라이언트에 복제됩니다.

## 핵심 속성·함수
> **게임의 상태를 모든 클라이언트와 동기화하는 데 사용되는 핵심적인 변수와 함수들입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
게임의 상태를 모든 클라이언트와 동기화하는 데 사용되는 핵심적인 변수와 함수들입니다.
* **`PlayerArray`**:
	현재 게임에 있는 모든 플레이어의 [[APlayerState]]를 담고 있는 `TArray`입니다. 이 배열은 자동으로 복제되어 모든 클라이언트에서 접근할 수 있습니다.
* **`GetServerWorldTimeSeconds()`**:
	게임이 시작된 후 서버에서 흐른 시간을 정확하게 반환합니다. 모든 클라이언트에서 호출해도 동기화된 서버 시간을 얻을 수 있어, 게임 타이머를 구현하는 데 필수적입니다.
* **`MatchState`**:
	현재 게임의 매치 상태를 나타내는 `FName`입니다. [[AGameMode]]의 `MatchState`가 변경되면 이 변수에 복제되어 클라이언트로 전파됩니다.
* **`GameModeClass`**:
	이 게임 월드를 생성한 [[AGameModeBase]]의 클래스 타입을 알려줍니다.
* **`OnRep_MatchState()`**:
	`MatchState` 변수가 서버로부터 복제되어 클라이언트에서 변경되었을 때 호출되는 RepNotify 함수입니다. 클라이언트에서 매치 상태 변경에 따른 효과(예: '경기 시작!' 메시지 표시)를 처리하는 데 사용됩니다.

## `AGameStateBase` vs. `APlayerState`
> **이 둘은 '게임 전체의 상태'와 '개별 플레이어의 상태'라는 점에서 명확히 구분됩니다.**
이 둘은 '게임 전체의 상태'와 '개별 플레이어의 상태'라는 점에서 명확히 구분됩니다.
* **`AGameStateBase` (게임 전체)**:
	모든 플레이어에게 공유되는 전역적인 정보입니다. (예: 남은 시간, 팀 점수)
* **[[APlayerState]] (개인)**:
	특정 플레이어 한 명에게만 관련된 정보입니다. (예: 개인 킬/데스, 핑, 플레이어 이름)

`AGameStateBase`의 `PlayerArray`를 통해 모든 플레이어의 [[APlayerState]]에 접근할 수 있습니다.

## 코드 예시
> **// GameStateBase에서 서버 시간과 MatchState를 활용하는 간단 예시 #include "GameFramework/GameStateBase.h"**
```cpp
// GameStateBase에서 서버 시간과 MatchState를 활용하는 간단 예시
#include "GameFramework/GameStateBase.h"

class AMyGameStateBase : public AGameStateBase
{
    GENERATED_BODY()

public:
    virtual void OnRep_MatchState() override
    {
        Super::OnRep_MatchState();
        const float ServerSeconds = GetServerWorldTimeSeconds();
        // 상태 전환 시각을 로깅하거나 UI에 반영
        // UE_LOG(LogTemp, Log, TEXT("State: %s at %.2f"), *MatchState.ToString(), ServerSeconds);
    }
};
```
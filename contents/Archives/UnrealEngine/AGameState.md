---
title: 'AGameState'
date: '2025-08-17T16:17:41+09:00'
---
> **모든 클라이언트가 공유해야 할 '게임의 현재 상태 정보'를 담는 그릇입니다.** 게임 규칙, 남은 시간, 점수, 미션 목표 등, 게임에 참여한 모든 플레이어가 알아야 할 공개적인 정보를 복제(Replicate)하는 역할을 합니다.

## 주요 역할 및 책임
> **`AGameState`는 서버에만 존재하는 [[AGameMode]]의 "대변인"으로서, 게임의 중요한 상태 변화를 모든 클라이언트에게 전파합니다.**
`AGameState`는 서버에만 존재하는 [[AGameMode]]의 "대변인"으로서, 게임의 중요한 상태 변화를 모든 클라이언트에게 전파합니다.
* **상태 정보 복제 (State Replication)**:
	서버의 게임 상태 정보를 모든 클라이언트에게 실시간으로 복제하여 동기화를 유지합니다. (예: 팀 점수, 다음 라운드 시작 시간, 현재 맵 이름 등)
* **전역 데이터 저장소 (Global Data Storage)**:
	현재 게임 세션에 대한 데이터를 모든 플레이어가 접근할 수 있도록 관리합니다. 특정 플레이어에 종속되지 않는 정보들이 여기에 해당됩니다.
* **플레이어 목록 관리 (Player List Management)**:
	`PlayerArray` 속성을 통해 현재 게임에 참여 중인 모든 [[APlayerState]]의 목록을 가지고 있습니다. 순위표(Scoreboard)를 만들거나 모든 플레이어를 대상으로 무언가를 해야 할 때 필수적으로 사용됩니다.

## 핵심 속성·함수
> **게임에 연결된 모든 플레이어의 [[APlayerState]]를 담고 있는 `TArray`입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`PlayerArray`**:
	게임에 연결된 모든 플레이어의 [[APlayerState]]를 담고 있는 `TArray`입니다. 이 배열은 자동으로 서버에서 클라이언트로 복제됩니다.
* **`ElapsedTime`**:
	게임이 시작된 후 경과된 시간입니다. (서버 시간 기준) 클라이언트에서 이 시간을 기준으로 타이머 UI 등을 표시할 수 있습니다.
* **`MatchState`**:
	현재 게임의 매치 상태를 나타내는 `FName` 변수입니다.
* **`OnRep_MatchState()`**:
	`MatchState` 변수가 서버에서 클라이언트로 복제될 때, 클라이언트에서 자동으로 호출되는 함수입니다. 상태 변화에 따른 UI 업데이트 등을 처리하기에 좋은 장소입니다.

## 관련 클래스
> **`AGameState`의 더 가볍고 기본적인 버전입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[AGameStateBase]]**:
	`AGameState`의 더 가볍고 기본적인 버전입니다. 복잡한 매치 상태 로직이 필요 없는 경우 [[AGameStateBase]]를 사용하는 것이 권장됩니다.
* **[[AGameMode]]**:
	게임의 규칙과 로직을 서버에서만 실행하는 반면, `AGameState`는 그 결과를 모든 클라이언트에게 알리는 역할을 합니다. 둘은 항상 함께 작동합니다.
* **[[APlayerState]]**:
	개별 플레이어의 상태(이름, 점수, 핑 등)를 모든 클라이언트에게 복제하는 역할을 합니다. `AGameState`는 이 [[APlayerState]]들의 목록을 관리합니다.

## 코드 예시
> **// MatchState 변경을 감지해 클라이언트 UI/연출을 갱신하는 예시 #include "GameFramework/GameState.h"**
```cpp
// MatchState 변경을 감지해 클라이언트 UI/연출을 갱신하는 예시
#include "GameFramework/GameState.h"

class AMyGameState : public AGameState
{
    GENERATED_BODY()

public:
    virtual void OnRep_MatchState() override
    {
        Super::OnRep_MatchState();

        if (MatchState == FName(TEXT("InProgress")))
        {
            // 게임 시작 연출/메시지
        }
        else if (MatchState == FName(TEXT("WaitingPostMatch")))
        {
            // 결과 화면 표시
        }
    }
};
```
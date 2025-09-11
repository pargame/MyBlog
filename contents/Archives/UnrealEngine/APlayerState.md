---
title: 'APlayerState'
date: '2025-08-17T16:17:41+09:00'
---
> **게임 세션에 참여한 '플레이어 한 명'의 상태 정보를 담고, 이를 모든 클라이언트에게 복제(Replicate)하는 '개인의 명찰'이자 '상태 기록부'입니다.** 플레이어의 이름, 점수, 킬/데스, 핑, 팀 정보 등, 해당 플레이어와 관련된 모든 영속적인 데이터를 저장하고 동기화하는 역할을 합니다.

### **1. 주요 역할 및 책임**
> **`APlayerState`에 `Replicated`로 지정된 변수들은 서버에서 값이 변경될 때마다 모든 클라이언트에게 자동으로 전송됩니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **플레이어 상태의 복제 (Replication of Player State)**:
	`APlayerState`에 `Replicated`로 지정된 변수들은 서버에서 값이 변경될 때마다 모든 클라이언트에게 자동으로 전송됩니다. 이를 통해 모든 플레이어가 다른 플레이어의 점수나 이름을 실시간으로 확인할 수 있습니다. (예: 점수판 UI)
* **[[APawn]]과의 분리 (Decoupling from Pawn)**:
	플레이어의 [[APawn]]이 죽고 리스폰되어도, `APlayerState`는 파괴되지 않고 그대로 유지됩니다. 덕분에 플레이어의 점수나 킬/데스 기록이 리스폰 후에도 초기화되지 않고 계속 누적될 수 있습니다.
* **[[AController]]와의 연결 (Connection with Controller)**:
	각 [[AController]]는 자신에 해당하는 `APlayerState` 인스턴스를 소유합니다. 서버에서는 [[AController]]를 통해 `APlayerState`에 접근하고, 클라이언트에서는 복제된 `APlayerState`를 통해 다른 플레이어의 정보를 확인합니다.
* **고유 식별 정보 제공 (Providing Unique Identification)**:
	`GetUniqueId()` 함수를 통해 플레이어의 고유한 네트워크 ID(스팀 ID, 에픽 계정 ID 등)를 제공하여, 세션 내에서 각 플레이어를 명확하게 구분할 수 있게 해줍니다.

### **2. 핵심 함수 및 속성**
> **플레이어의 점수를 가져오거나 설정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `GetScore()` / `SetScore()`:
	플레이어의 점수를 가져오거나 설정합니다. 이 변수는 기본적으로 복제되도록 설정되어 있습니다.
* `GetPlayerName()` / `SetPlayerName()`:
	플레이어의 이름을 가져오거나 설정합니다.
* `GetPingInMilliseconds()`:
	서버와 클라이언트 사이의 네트워크 지연 시간(핑)을 밀리초 단위로 반환합니다.
* `GetPlayerController()`:
	이 `APlayerState`를 소유한 로컬 [[APlayerController]]를 반환합니다. (로컬 플레이어 자신에게만 유효)
* `OnRep_PlayerName`:
	`PlayerName` 변수가 서버로부터 복제되어 클라이언트에서 변경되었을 때 호출되는 RepNotify 함수입니다.

### **3. `APlayerState` vs. `AGameStateBase`**
> **플레이어 한 명에게만 관련된 정보입니다.**
* **`APlayerState` (개인)**:
	플레이어 한 명에게만 관련된 정보입니다. (예: 내 점수, 내 이름)
* **[[AGameStateBase]] (전체)**:
	게임에 참여한 모든 플레이어에게 공유되는 전역적인 정보입니다. (예: 게임의 남은 시간, 팀 전체의 점수)

[[AGameStateBase]]는 `PlayerArray`라는 배열을 통해 현재 게임에 있는 모든 `APlayerState`의 목록을 가지고 있으므로, [[AGameStateBase]]를 통해 다른 모든 플레이어의 `APlayerState`에 접근할 수 있습니다.
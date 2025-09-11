---
title: 'UNavigationSystemV1'
date: '2025-08-17T16:17:41+09:00'
---
> **AI가 월드에서 길을 찾을 수 있도록 '걸어 다닐 수 있는 영역(NavMesh)'을 생성하고, 목표 지점까지의 최적 경로를 계산해주는 '내비게이션 총괄 시스템'입니다.** 월드에 존재하는 모든 내비게이션 관련 데이터와 쿼리(Query)를 관리하는 최상위 싱글턴 객체입니다.

### **1. 주요 역할 및 책임**
> **레벨에 배치된 `NavMeshBoundsVolume` 영역 내에서, 걸어 다닐 수 있는 모든 표면을 분석하여 '내비메시(Navigation Mesh)'라는 폴리곤 네트워크를 자동으로 생성합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **내비메시 생성 (NavMesh Generation)**:
	레벨에 배치된 `NavMeshBoundsVolume` 영역 내에서, 걸어 다닐 수 있는 모든 표면을 분석하여 '내비메시(Navigation Mesh)'라는 폴리곤 네트워크를 자동으로 생성합니다. AI는 오직 이 메시 위로만 이동할 수 있습니다.
* **경로 탐색 (Pathfinding)**:
	A* (A-Star)와 같은 효율적인 알고리즘을 사용하여, 시작 지점부터 목표 지점까지 내비메시를 따라가는 최단 또는 최적의 경로를 계산합니다. 이 경로는 여러 개의 `FVector` 지점 목록으로 반환됩니다.
* **동적 환경 대응 (Handling Dynamic Environments)**:
	게임 중에 열리거나 닫히는 문, 파괴되는 다리 등 월드의 변화를 감지하고, 내비메시를 실시간으로 업데이트하여 AI가 변경된 환경에 맞춰 새로운 길을 찾을 수 있도록 지원합니다. (Recast & Detour 라이브러리 기반)
* **다양한 쿼리 제공 (Providing Various Queries)**:
	단순한 경로 탐색 외에도, "지정한 반경 내에서 도달 가능한 랜덤한 위치 찾기", "두 지점 사이에 내비메시 경로가 존재하는지 확인하기" 등 AI 이동에 필요한 다양한 유틸리티 함수를 제공합니다.

### **2. 핵심 구성 요소**
> **레벨에 배치하여, 내비메시를 생성할 영역을 지정하는 볼륨입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`NavMeshBoundsVolume`**:
	레벨에 배치하여, 내비메시를 생성할 영역을 지정하는 볼륨입니다.
* **`RecastNavMesh-Default`**:
	실제로 내비메시를 생성하고 관리하는 액터입니다. `NavMeshBoundsVolume`을 배치하면 월드에 자동으로 추가됩니다. 이 액터의 디테일 패널에서 에이전트의 크기, 경사 한계 등 내비메시 생성 옵션을 세밀하게 조절할 수 있습니다.
* **[[AAIController]]**:
	`MoveTo`와 같은 함수를 통해 `UNavigationSystemV1`에 경로 탐색을 요청하고, 반환된 경로를 따라 [[APawn]]을 이동시키는 주체입니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**

1.  **레벨에 `NavMeshBoundsVolume` 배치**:
	모드 패널에서 `NavMeshBoundsVolume`을 찾아 레벨에 배치하고, AI가 이동할 모든 영역을 포함하도록 크기를 조절합니다. (단축키 `P`를 누르면 생성된 내비메시를 녹색으로 시각화하여 볼 수 있습니다.)
2.  **AI 컨트롤러에서 `MoveTo` 호출**:
	[[AAIController]]에서 `MoveToLocation` 또는 `MoveToActor` 함수를 호출합니다.
3.  **내부 동작**:
	`MoveTo` 함수는 내부적으로 `UNavigationSystemV1::FindPathToLocationSynchronously`와 같은 함수를 호출하여 경로를 계산하고, 계산된 경로를 따라 [[APawn]]의 [[UCharacterMovementComponent]]에 이동 명령을 내립니다.
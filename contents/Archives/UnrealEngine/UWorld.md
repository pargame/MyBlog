---
title: 'UWorld'
date: '2025-08-17T16:17:41+09:00'
---
> **모든 [[AActor]]와 컴포넌트가 살아 숨 쉬는 '게임의 무대'이자 '시뮬레이션 공간'입니다.** 레벨에 배치된 모든 오브젝트를 담고 있으며, 물리 시뮬레이션, 렌더링, 게임플레이 규칙 등 월드에서 일어나는 모든 일을 총괄하는 최상위 컨테이너입니다.

### **1. 주요 역할 및 책임**
> **월드에 스폰된 모든 [[AActor]]의 목록을 유지하고 관리합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **[[AActor]]의 컨테이너 (Container for Actors)**:
	월드에 스폰된 모든 [[AActor]]의 목록을 유지하고 관리합니다. [[AActor]]를 스폰하거나 파괴하는 작업은 모두 `UWorld` 객체를 통해 이루어집니다.
* **게임플레이 시스템의 허브 (Hub for Gameplay Systems)**:
	[[AGameModeBase]], [[AGameStateBase]], [[APlayerController]] 등 게임의 규칙과 흐름을 관장하는 핵심적인 게임플레이 액터들을 소유하고 관리합니다.
* **시뮬레이션 관리 (Simulation Management)**:
	물리 엔진을 통해 월드 내의 오브젝트 간 상호작용을 시뮬레이션하고, 틱(`Tick`) 시스템을 통해 매 프레임마다 [[AActor]]와 컴포넌트들을 업데이트합니다.
* **스트리밍 및 레벨 관리 (Streaming and Level Management)**:
	하나의 월드는 여러 개의 레벨 파일로 구성될 수 있습니다. `UWorld`는 이 레벨들을 동적으로 로드하고 언로드하는 레벨 스트리밍을 관리하여, 거대한 맵을 효율적으로 처리할 수 있도록 합니다.

### **2. 핵심 함수**
> **지정한 클래스의 [[AActor]]를 월드에 스폰합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `SpawnActor<T>(UClass* Class, ...)`:
	지정한 클래스의 [[AActor]]를 월드에 스폰합니다. 가장 기본적인 [[AActor]] 생성 함수입니다.
* `GetPlayerController(int32 PlayerIndex)`:
	지정한 인덱스에 해당하는 [[APlayerController]]를 반환합니다. 싱글플레이어 게임에서는 보통 0번 인덱스를 사용합니다.
* `GetAuthGameMode()`:
	이 월드의 게임 규칙을 관장하는 [[AGameModeBase]]에 대한 포인터를 반환합니다. 서버에서만 유효한 값을 반환하며, 클라이언트에서는 nullptr를 반환합니다.
* `LineTraceSingleByChannel(...)` / `LineTraceMultiByChannel(...)`:
	월드에 가상의 선(레이)을 쏘아, 그 선과 처음으로 충돌하는 오브젝트나 충돌하는 모든 오브젝트를 찾는 라인 트레이스를 수행합니다.

### **3. `UWorld`의 종류**
> **:Game`:** 실제 플레이 가능한 게임 월드입니다.**
* **`EWorldType:
	:Game`**:
	실제 플레이 가능한 게임 월드입니다.
* **`EWorldType::PIE` (Play In Editor)**:
	에디터에서 '플레이' 버튼을 눌렀을 때 생성되는 테스트용 월드입니다.
* **`EWorldType:
	:Editor`**:
	에디터 뷰포트에 보이는, 편집 중인 상태의 월드입니다.
* **`EWorldType::Inactive`**:
	아직 초기화되지 않았거나, 더 이상 사용되지 않는 월드입니다.

### **4. `UWorld`와 `UGameInstance`**
> **레벨이 전환될 때마다 파괴되고 새로 생성됩니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`UWorld` (무대)**:
	레벨이 전환될 때마다 파괴되고 새로 생성됩니다. 메인 메뉴 월드, 1스테이지 월드, 2스테이지 월드 등 여러 개가 존재할 수 있습니다.
* **[[UGameInstance]] (극장)**:
	게임이 실행되는 동안 단 하나만 존재하며 파괴되지 않습니다. 어떤 월드(무대)를 올릴지 결정하고, 월드가 바뀌어도 유지되어야 할 정보(예: 플레이어의 누적 점수)를 보관합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[AActor]] / [[APlayerController]] / [[AGameModeBase]] / [[AGameStateBase]]
* [[FTimerManager]]
* [[UWorldSubsystem]]
* [[UGameInstance]]

## 코드 예시
> **// 라인트레이스 사용 예시 FHitResult Hit; FCollisionQueryParams Params(SCENE_QUERY_STAT(MyTrace), false); const FVector Start = /* ...**
```cpp
// 라인트레이스 사용 예시
FHitResult Hit;
FCollisionQueryParams Params(SCENE_QUERY_STAT(MyTrace), false);
const FVector Start = /* ... */;
const FVector End = /* ... */;
if (GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, Params))
{
    if (AActor* HitActor = Hit.GetActor())
    {
        // 맞은 액터 처리
    }
}
```

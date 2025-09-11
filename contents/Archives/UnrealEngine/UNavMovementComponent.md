---
title: 'UNavMovementComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **AI 또는 플레이어가 제어하는 액터가 내비게이션 메시(NavMesh)를 따라 이동할 수 있도록 지원하는 컴포넌트입니다.** [[APawn]]에 부착되어, 경로 탐색 및 이동 로직을 처리합니다.

### **1. 주요 역할 및 책임**
> **내비게이션 메시를 따라 최적의 경로를 계산하고 이동합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **경로 탐색 (Pathfinding)**:
	내비게이션 메시를 따라 최적의 경로를 계산하고 이동합니다.
* **동적 장애물 처리 (Dynamic Obstacle Handling)**:
	이동 중에 동적으로 생성된 장애물을 감지하고 회피합니다.

### **2. 핵심 함수 및 속성**
> **경로를 따라 이동을 요청합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`RequestPathMove`**:
	경로를 따라 이동을 요청합니다.
* **`StopActiveMovement`**:
	현재 진행 중인 이동을 중지합니다.
* **`bUseAccelerationForPaths`**:
	경로 이동 시 가속도를 사용할지 여부를 설정합니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1. **컴포넌트 추가**:
	[[APawn]]의 블루프린트에서 `Nav Movement Component`를 추가합니다.
2. **내비게이션 메시 설정**:
	레벨에 `NavMeshBoundsVolume`을 배치하여 내비게이션 메시를 생성합니다.
3. **이동 요청**:
	[[AAIController]] 또는 [[APawn]]에서 `MoveTo` 함수를 호출하여 이동을 요청합니다.

### **4. 관련 클래스**
> **`UNavMovementComponent`가 부착될 수 있는 액터. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[APawn]]**:
	`UNavMovementComponent`가 부착될 수 있는 액터.
* **[[AAIController]]**:
	이동 요청을 처리하는 컨트롤러.
* **[[UNavigationSystemV1]]**:
	내비게이션 메시를 생성하고 관리하는 시스템.

### **5. 코드 예시**
> **#include "GameFramework/NavMovementComponent.h" 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
```cpp
#include "GameFramework/NavMovementComponent.h"

void AMyPawn::BeginPlay()
{
    Super::BeginPlay();

    UNavMovementComponent* NavMovement = FindComponentByClass<UNavMovementComponent>();
    if (NavMovement)
    {
        NavMovement->RequestPathMove(TargetLocation);
    }
}
```

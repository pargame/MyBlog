---
title: 'UBTTask BlueprintBase'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UBehaviorTree]]에서 AI가 수행할 '행동' 하나를 블루프린트로 직접 구현할 수 있도록 제공되는 기반 클래스입니다.** '적에게 이동', '공격 실행', '특정 위치 순찰' 등 비헤이비어 트리의 리프(Leaf) 노드에서 실제 로직을 수행하는 역할을 합니다.

### **1. 주요 역할 및 책임**
> **비헤이비어 트리에서 실행될 수 있는 가장 작은 행동 단위를 만듭니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **행동 단위 정의 (Defining an Action Unit)**:
	비헤이비어 트리에서 실행될 수 있는 가장 작은 행동 단위를 만듭니다.
* **블루프린트 확장성 (Blueprint Extensibility)**:
	C++ 코딩 없이 블루프린트 [[Event]] 그래프를 통해 복잡한 AI 행동 로직을 구현할 수 있게 해줍니다.
* **성공/실패 반환 (Returning Success/Failure)**:
	태스크가 성공적으로 완료되었는지, 아니면 실패했는지를 비헤이비어 트리에 알립니다. 이 결과에 따라 트리의 다음 행동이 결정됩니다.

### **2. 핵심 이벤트 (Override in Blueprint)**
> **이 태스크가 비헤이비어 트리에 의해 실행될 때 호출되는 메인 이벤트입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`Event Receive Execute AI`**:
	이 태스크가 비헤이비어 트리에 의해 실행될 때 호출되는 메인 이벤트입니다. 이 곳에서 행동의 핵심 로직을 구현합니다. `Finish Execute` 노드를 호출하여 태스크의 성공/실패 여부를 반드시 알려주어야 합니다.
* **`Event Receive Tick AI`**:
	태스크가 완료되기 전까지 매 프레임 호출되는 이벤트입니다. 시간이 걸리는 작업(예: 특정 지점으로 이동)의 진행 상황을 체크하는 데 사용됩니다.
* **`Event Receive Abort AI`**:
	상위 노드(예: [[UBTDecorator_BlueprintBase]])의 조건이 실패하여 이 태스크가 중간에 중단될 때 호출됩니다. 진행 중이던 작업을 정리하는 로직(예: 몽타주 중지)을 넣습니다.

### **3. 사용 예시**
> **`Event Receive Execute AI`에서 `AI Move To` 노드를 호출하여 플레이어를 향해 이동하고, 이동이 완료되면 `Success`로 `Finish Execute`를 호출합니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
* **`BTTask_MoveToPlayer`**:
	`Event Receive Execute AI`에서 `AI Move To` 노드를 호출하여 플레이어를 향해 이동하고, 이동이 완료되면 `Success`로 `Finish Execute`를 호출합니다.
* **`BTTask_PlayAttackMontage`**:
	공격 [[UAnimMontage]]를 재생하고, 몽타주가 끝나는 시점에 호출되는 델리게이트에서 `Finish Execute`를 호출합니다.
* **`BTTask_FindPatrolPoint`**:
	다음 순찰 지점을 찾아 [[UBlackboardComponent]]에 저장하고 즉시 성공을 반환합니다.

### **4. 관련 클래스**
> **이 태스크를 노드로 포함하는 전체 AI 로직 트리입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UBehaviorTree]]**:
	이 태스크를 노드로 포함하는 전체 AI 로직 트리입니다.
* **[[UBTNode]]**:
	모든 비헤이비어 트리 노드의 부모 클래스입니다.
* **[[AAIController]]**:
	이 태스크를 실행하도록 명령하는 주체입니다.
* **[[UBlackboardComponent]]**:
	AI의 '메모리' 역할을 하며, 태스크의 실행 결과나 필요한 데이터를 저장하는 데 사용됩니다.

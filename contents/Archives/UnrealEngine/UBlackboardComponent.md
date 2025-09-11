---
title: 'UBlackboardComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **AI의 '두뇌' 또는 '단기 기억 저장소'입니다.** [[UBehaviorTree]]와 긴밀하게 연동하여, AI가 의사결정을 내리는 데 필요한 모든 데이터를 저장하고 공유하는 중앙 데이터 저장소 역할을 합니다.

### **1. 주요 역할 및 책임**
> **AI가 인지한 적(`TargetActor`), 다음 순찰 지점(`NextPatrolPoint`), 현재 상태(`AIState`) 등 다양한 타입의 데이터를 '키(Key)'와 '값(Value)'의 쌍으로 저장합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **데이터 저장 (Data Storage)**:
	AI가 인지한 적(`TargetActor`), 다음 순찰 지점(`NextPatrolPoint`), 현재 상태(`AIState`) 등 다양한 타입의 데이터를 '키(Key)'와 '값(Value)'의 쌍으로 저장합니다.
* **데이터 공유 (Data Sharing)**:
	[[UBehaviorTree]] 내의 모든 노드(태스크, 데코레이터, 서비스)는 이 블랙보드에 접근하여 데이터를 읽거나 쓸 수 있습니다. 이를 통해 트리 전체가 일관된 정보를 바탕으로 작동하게 됩니다.
* **조건부 실행 (Conditional Execution)**:
	[[UBehaviorTree]]의 데코레이터 노드는 블랙보드의 특정 키 값을 조건으로 사용하여, 하위 브랜치의 실행 여부를 결정합니다. (예: `TargetActor` 키가 설정되어 있을 때만 공격 패턴 실행)

### **2. 핵심 함수 및 속성**
> **지정한 키에 해당하는 값을 설정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`SetValueAs...` (예:
	`SetValueAsObject`, `SetValueAsVector`, `SetValueAsEnum`)**:
	지정한 키에 해당하는 값을 설정합니다. 데이터 타입에 맞는 함수를 사용해야 합니다.
* **`GetValueAs...` (예:
	`GetValueAsObject`, `GetValueAsVector`, `GetValueAsEnum`)**:
	지정한 키의 값을 읽어옵니다.
* **`BlackboardAsset`**:
	이 컴포넌트가 사용할 데이터 구조를 정의한 `Blackboard` 에셋을 지정하는 속성입니다. AI가 어떤 키들을 사용할지는 이 에셋에 미리 정의되어야 합니다.

### **3. 관련 클래스**
> **블랙보드에서 사용할 키들의 이름과 데이터 타입을 정의하는 에셋입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UBlackboardData]]**:
	블랙보드에서 사용할 키들의 이름과 데이터 타입을 정의하는 에셋입니다. `UBlackboardComponent`는 이 에셋을 기반으로 실제 데이터 저장 공간을 만듭니다.
* **[[UBehaviorTree]]**:
	AI의 행동 로직을 정의하는 그래프입니다. 블랙보드는 이 비헤이비어 트리와 한 쌍으로 작동합니다.
* **[[UBTTask_BlueprintBase]], [[UBTDecorator_BlueprintBase]], [[UBTService_BlueprintBase]]**:
	비헤이비어 트리를 구성하는 노드들입니다. 이 노드들은 블랙보드의 데이터에 접근하여 AI의 구체적인 행동을 실행하거나 흐름을 제어합니다.
* **[[AAIController]]**:
	`UBlackboardComponent`와 `UBehaviorTreeComponent`를 소유하고 AI의 전체적인 로직을 실행하는 주체입니다.
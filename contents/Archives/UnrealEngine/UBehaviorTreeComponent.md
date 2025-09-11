---
title: 'UBehaviorTreeComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UBehaviorTree]] 에셋을 실제로 실행하고 관리하는 '엔진' 역할을 하는 컴포넌트입니다.** [[AAIController]]에 부착되어, 할당된 비헤이비어 트리 로직에 따라 AI의 의사 결정을 매 프레임 처리합니다.

### **1. 주요 역할 및 책임**
> **`StartTree` 함수를 통해 지정된 [[UBehaviorTree]] 에셋을 실행하고, 트리의 노드를 순서대로 따라가며 AI의 행동을 지시합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **비헤이비어 트리 실행 (Executing Behavior Trees)**:
	`StartTree` 함수를 통해 지정된 [[UBehaviorTree]] 에셋을 실행하고, 트리의 노드를 순서대로 따라가며 AI의 행동을 지시합니다.
* **실행 상태 관리 (Managing Execution State)**:
	현재 트리의 어느 부분이 활성화되어 있는지, 어떤 태스크가 실행 중인지 등의 상태를 내부적으로 관리합니다.
* **블랙보드 연동 (Interfacing with Blackboard)**:
	자신과 상호작용하는 [[UBlackboardComponent]]에 접근하여 데이터를 읽고 쓰는 인터페이스를 제공합니다. 비헤이비어 트리의 노드들은 이 컴포넌트를 통해 블랙보드와 상호작용합니다.

### **2. 핵심 함수**
> **주어진 `UBehaviorTree` 에셋을 이 컴포넌트에서 실행 시작합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`StartTree(UBehaviorTree& Asset, EBTExecutionMode::Type ExecuteMode)`**:
	주어진 `UBehaviorTree` 에셋을 이 컴포넌트에서 실행 시작합니다.
* **`StopTree(EBTStopMode::Type StopMode)`**:
	현재 실행 중인 비헤이비어 트리를 중지시킵니다.
* **`GetBlackboardComponent()`**:
	이 컴포넌트가 사용하고 있는 [[UBlackboardComponent]]에 대한 포인터를 반환합니다. (주의: 직접 접근보다는 비헤이비어 트리 노드를 통해 상호작용하는 것이 일반적입니다.)

### **3. 사용 방법**
> **`UBehaviorTreeComponent`는 일반적으로 [[AAIController]] 클래스에 기본적으로 포함되어 있습니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
`UBehaviorTreeComponent`는 일반적으로 [[AAIController]] 클래스에 기본적으로 포함되어 있습니다. 개발자는 주로 [[AAIController]]의 `RunBehaviorTree` 함수를 호출하며, 이 함수는 내부적으로 `UBehaviorTreeComponent`를 찾아 `StartTree`를 실행하는 방식으로 작동합니다. 따라서 개발자가 직접 `UBehaviorTreeComponent`의 함수를 호출하는 경우는 드뭅니다.

### **4. 관련 클래스**
> **`UBehaviorTreeComponent`와 [[UBlackboardComponent]]를 소유하고 관리하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[AAIController]]**:
	`UBehaviorTreeComponent`와 [[UBlackboardComponent]]를 소유하고 관리하는 주체입니다.
* **[[UBehaviorTree]]**:
	이 컴포넌트가 실행할 AI 로직을 담고 있는 데이터 에셋입니다.
* **[[UBlackboardComponent]]**:
	AI의 메모리 역할을 하며, 이 컴포넌트와 긴밀하게 작동합니다.
* **[[UBTNode]]**:
	비헤이비어 트리를 구성하는 모든 노드(Task, Decorator, Service)의 기본 클래스로, 이 컴포넌트를 통해 실행됩니다.

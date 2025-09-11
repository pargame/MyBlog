---
title: 'UBlackboardData'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UBehaviorTree]]가 사용할 '메모리(키-값 쌍)'의 구조를 정의하는 데이터 에셋입니다.** AI가 기억해야 할 데이터의 종류(예: 타겟 액터, 목표 지점, 현재 상태 등)와 각 데이터의 이름(키)을 미리 정의해두는 '설계도' 역할을 합니다.

### **1. 주요 역할 및 책임**
> **AI가 어떤 종류의 데이터를 기억할지를 결정합니다.**
* **AI 메모리 구조 정의 (Defining AI Memory Structure)**:
	AI가 어떤 종류의 데이터를 기억할지를 결정합니다. 예를 들어, `TargetActor`라는 이름의 `Object` 키, `PatrolLocation`이라는 이름의 `Vector` 키 등을 추가할 수 있습니다.
* **데이터 타입 지정 (Specifying Data Types)**:
	각 키에 저장될 데이터의 타입을 명확히 합니다 (예: `Object`, `Vector`, `Float`, `Enum`, `Bool` 등). 이를 통해 잘못된 타입의 데이터가 저장되는 것을 방지합니다.
* **비헤이비어 트리와의 연동 (Integration with Behavior Tree)**:
	[[UBehaviorTree]] 에셋에 이 `UBlackboardData` 에셋을 할당하면, 해당 비헤이비어 트리는 여기 정의된 키들을 읽고 쓸 수 있게 됩니다.

### **2. 핵심 구성 요소**
> **블랙보드 에디터에서 추가하는 각각의 항목입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **Keys**:
	블랙보드 에디터에서 추가하는 각각의 항목입니다. 각 키는 이름과 데이터 타입을 가집니다.
* **Parent Blackboard**:
	다른 `UBlackboardData`를 부모로 지정하여 그 부모의 모든 키를 상속받을 수 있습니다. 이를 통해 공통적인 AI 메모리 구조를 재사용하고 확장할 수 있습니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  콘텐츠 브라우저에서 `UBlackboardData` 에셋을 새로 생성합니다.
2.  생성된 블랙보드 에디터를 열고, 'New Key' 버튼을 눌러 필요한 키들을 추가합니다 (예:
	`TargetActor` (Object), `Destination` (Vector)).
3.  사용할 [[UBehaviorTree]] 에셋을 열고, 'Details' 패널에서 `Blackboard Asset` 속성에 방금 만든 `UBlackboardData` 에셋을 할당합니다.
4.  이제 비헤이비어 트리의 데코레이터, 서비스, 태스크에서 블랙보드 노드를 통해 여기에 정의된 키 값을 읽거나 쓸 수 있습니다.

### **4. 관련 클래스**
> **`UBlackboardData`라는 '설계도'를 바탕으로, 실제 게임 월드에서 각 AI 인스턴스가 개별적으로 가지는 '메모리 인스턴스'입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UBlackboardComponent]]**:
	`UBlackboardData`라는 '설계도'를 바탕으로, 실제 게임 월드에서 각 AI 인스턴스가 개별적으로 가지는 '메모리 인스턴스'입니다. 실제 데이터는 여기에 저장됩니다.
* **[[UBehaviorTree]]**:
	이 블랙보드 데이터를 사용하여 의사 결정을 내리는 AI 로직의 집합입니다.
* **[[AAIController]]**:
	`UBlackboardComponent`를 소유하고 관리하는 주체입니다.

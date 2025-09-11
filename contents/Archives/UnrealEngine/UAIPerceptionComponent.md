---
title: 'UAIPerceptionComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **AI가 월드를 '보고 듣고 느끼게' 해주는 감각 기관입니다.** 시각, 청각, 촉각 등 다양한 감각(Sense)을 통해 주변 환경의 자극(Stimulus)을 감지하고, 이를 [[AAIController]]에게 보고하여 AI가 상황을 인지하고 반응할 수 있도록 돕습니다.

### **1. 주요 역할 및 책임**
> **`UAIPerceptionComponent`는 AI의 인지 기능을 담당하며, [[UBehaviorTree]]와 함께 AI의 의사결정 과정에서 핵심적인 역할을 합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
`UAIPerceptionComponent`는 AI의 인지 기능을 담당하며, [[UBehaviorTree]]와 함께 AI의 의사결정 과정에서 핵심적인 역할을 합니다.
* **자극 감지 (Stimulus Detection)**:
	설정된 감각들을 통해 주변에서 발생하는 다양한 자극을 감지합니다. 예를 들어, 시각(Sight)은 다른 액터를 보는 것을, 청각(Hearing)은 소리가 나는 것을 감지합니다.
* **인지 정보 관리 (Perception Data Management)**:
	감지한 자극에 대한 정보(자극의 종류, 발생 위치, 관련된 액터, 마지막으로 감지된 시간 등)를 관리하고 업데이트합니다.
* **[[Event]] 통지 (Event Notification)**:
	새로운 자극을 감지하거나 기존 자극의 상태가 변경되었을 때, `OnTargetPerceptionUpdated` 이벤트를 발생시켜 [[AAIController]]가 즉시 반응할 수 있도록 합니다.

### **2. 핵심 개념 및 속성**
> **이 컴포넌트가 사용할 감각의 종류와 각 감각의 세부 속성(예: 시야각, 시야 거리, 청각 범위 등)을 설정하는 배열입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Senses Config`**:
	이 컴포넌트가 사용할 감각의 종류와 각 감각의 세부 속성(예: 시야각, 시야 거리, 청각 범위 등)을 설정하는 배열입니다. [[UAISenseConfig_Sight]], [[UAISenseConfig_Hearing]] 등의 에셋을 여기에 추가하여 AI의 감각을 디자인합니다.
* **`OnTargetPerceptionUpdated`**:
	가장 중요한 [[Event]]입니다. 감지된 액터와 자극에 대한 정보를 받아 AI의 행동 로직을 시작하는 지점입니다. 이 [[Event]]에 함수를 바인딩하여, 적을 발견했을 때의 처리(예: 블랙보드에 적 정보 저장)를 구현합니다.
* **`Forgets stimulus`**:
	감각 설정에서, 특정 자극을 얼마나 오래동안 기억할지를 결정합니다. 시야에서 사라진 적을 즉시 잊을지, 아니면 마지막으로 본 위치를 잠시 기억하고 있을지를 제어할 수 있습니다.

### **3. 사용 흐름**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  **컴포넌트 추가**:
	[[AAIController]] 블루프린트에 `AIPerception` 컴포넌트를 추가합니다.
2.  **감각 설정**:
	컴포넌트의 `Senses Config`에 `AISense Config` 에셋(예: `Sight`, `Hearing`)을 추가하고 속성을 조절합니다.
3.  **이벤트 바인딩**:
	`OnTargetPerceptionUpdated` [[Event]]에 함수를 바인딩하여, 자극이 감지되었을 때 실행할 로직을 작성합니다.
4.  **자극 생성**:
	다른 액터에 `AIPerceptionStimuliSource` 컴포넌트를 추가하여, 해당 액터가 특정 감각에 의해 감지될 수 있도록 등록합니다. 또는 `UAIBlueprintHelperLibrary::ReportNoiseEvent` 같은 함수를 사용하여 소리 자극을 직접 발생시킬 수도 있습니다.

### **4. 관련 클래스**
> **`UAIPerceptionComponent`를 소유하고, 감지된 정보를 바탕으로 [[UBehaviorTree]]를 실행하는 등 실질적인 AI 로직을 총괄합니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[AAIController]]**:
	`UAIPerceptionComponent`를 소유하고, 감지된 정보를 바탕으로 [[UBehaviorTree]]를 실행하는 등 실질적인 AI 로직을 총괄합니다.
* **[[UAISenseConfig]]**:
	개별 감각의 속성을 정의하는 설정 클래스의 부모 클래스입니다. ([[UAISenseConfig_Sight]], [[UAISenseConfig_Hearing]] 등)
* **[[AIPerceptionStimuliSourceComponent]]**:
	이 컴포넌트를 가진 액터는 `UAIPerceptionComponent`에 의해 감지될 수 있는 '자극원'이 됩니다.
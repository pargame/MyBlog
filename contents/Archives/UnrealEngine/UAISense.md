---
title: 'UAISense'
date: '2025-08-17T16:17:41+09:00'
---
> **AI의 '감각(Sense)' 하나하나의 실제 로직을 처리하는 핵심 클래스입니다.** 시각, 청각, 촉각 등 특정 감각이 어떻게 자극(Stimulus)을 등록하고, 처리하며, 만료시키는지를 정의합니다. 개발자가 직접 상호작용하기보다는 [[UAIPerceptionComponent]]와 [[UAISenseConfig]]를 통해 간접적으로 사용됩니다.

### **1. 주요 역할 및 책임**
> **각 감각의 핵심 로직을 담고 있습니다.**
* **감각 로직 구현 (Sense Logic Implementation)**:
	각 감각의 핵심 로직을 담고 있습니다. 예를 들어, `UAISense_Sight`는 시야각과 거리 계산 및 장애물 검사를 수행하는 로직을 포함합니다.
* **자극 관리 (Stimulus Management)**:
	외부에서 발생한 자극 이벤트(예: `ReportNoiseEvent` 호출)를 수신하고, 이를 감지할 수 있는 AI들에게 전파하며, 자극의 유효 시간(Age)을 관리합니다.
* **리스너(Listener) 관리**:
	어떤 [[UAIPerceptionComponent]]들이 현재 이 감각을 사용하고 있는지(즉, '듣고 있는지')를 추적하고 관리합니다.

### **2. 주요 서브클래스**
> **언리얼 엔진은 기본적인 감각들에 대한 구현 클래스를 미리 제공합니다.**
언리얼 엔진은 기본적인 감각들에 대한 구현 클래스를 미리 제공합니다.
* **`UAISense_Sight`**:
	시각 감각의 로직을 처리합니다.
* **`UAISense_Hearing`**:
	청각 감각의 로직을 처리합니다. `ReportNoiseEvent`를 통해 발생한 소리를 감지합니다.
* **`UAISense_Damage`**:
	피해 이벤트를 감지합니다. `ApplyDamage`가 호출될 때 자동으로 자극이 생성됩니다.
* **`UAISense_Touch`**:
	액터 간의 터치(Overlap) 이벤트를 감지합니다.
* **`UAISense_Prediction`**:
	다른 AI의 행동 예측 요청을 감지합니다.

### **3. 개발자와의 상호작용**
> **개발자는 보통 `UAISense` 클래스를 직접 다루지 않습니다.**
개발자는 보통 `UAISense` 클래스를 직접 다루지 않습니다. 대신 다음과 같은 방식으로 상호작용합니다.
* **자극 발생시키기**:
	* **청각:**
		블루프린트에서 `Make Noise` 노드를 사용하거나 C++에서 `UAISense_Hearing::ReportNoiseEvent`를 호출합니다.
    * **피해**:
    	`UGameplayStatics::ApplyDamage`를 호출합니다.
    * **시각/촉각**:
    	[[AIPerceptionStimuliSourceComponent]]를 부착하는 것만으로도 자극의 원천이 됩니다.
* **감각 설정하기**:
	[[UAIPerceptionComponent]]에 [[UAISenseConfig]]의 자식 클래스(예: [[UAISenseConfig_Sight]])를 추가하여 각 감각의 세부 사항을 설정합니다.

### **4. 관련 클래스**
> **여러 `UAISense`를 사용하여 종합적인 감각 판단을 내리는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UAIPerceptionComponent]]**:
	여러 `UAISense`를 사용하여 종합적인 감각 판단을 내리는 주체입니다.
* **[[UAISenseConfig]]**:
	`UAISense`의 작동 방식을 결정하는 설정 값들의 모음입니다.
* **[[AIPerceptionStimuliSourceComponent]]**:
	`UAISense`에 의해 감지될 수 있는 자극을 제공하는 컴포넌트입니다.

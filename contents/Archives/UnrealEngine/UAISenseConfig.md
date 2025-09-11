---
title: 'UAISenseConfig'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UAIPerceptionComponent]]가 사용할 '감각(Sense)'의 세부 설정을 정의하는 데이터 클래스입니다.** 시각, 청각, 촉각 등 특정 감각이 어떻게 작동할지(예: 시야 범위, 감지 거리, 유효 시간 등)에 대한 규칙을 담고 있습니다.

### **1. 주요 역할 및 책임**
> **하나의 감각에 대한 모든 설정 값을 정의합니다.**
* **감각 능력 정의 (Defining a Sense's Capabilities)**:
	하나의 감각에 대한 모든 설정 값을 정의합니다. 예를 들어, 시각 감각의 경우 시야각(FOV), 시야 거리, 자동 성공 범위 등을 설정합니다.
* **데이터 기반 설정 (Data-Driven Configuration)**:
	[[UAIPerceptionComponent]]의 'Senses Config' 배열에 이 `UAISenseConfig`의 자식 클래스 인스턴스들을 추가함으로써, AI의 감각 능력을 코드 변경 없이 데이터 에셋 레벨에서 설정하고 수정할 수 있습니다.
* **확장성 (Extensibility)**:
	`UAISenseConfig`를 상속하여 완전히 새로운 종류의 감각(예: 마법 감지, 냄새 감지)에 대한 설정 클래스를 만들 수 있습니다.

### **2. 주요 서브클래스**
> **시각(Sight)에 대한 설정을 담고 있습니다.**
* **[[UAISenseConfig_Sight]]**:
	시각(Sight)에 대한 설정을 담고 있습니다.
* **[[UAISenseConfig_Hearing]]**:
	청각(Hearing)에 대한 설정을 담고 있습니다.
* **`UAISenseConfig_Damage`**:
	피해(Damage)를 감지하는 감각에 대한 설정을 담고 있습니다.
* **`UAISenseConfig_Touch`**:
	촉각(Touch)에 대한 설정을 담고 있습니다.
* **`UAISenseConfig_Prediction`**:
	다른 AI의 행동 예측 요청을 감지하는 감각에 대한 설정을 담고 있습니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  [[AAIController]] 또는 AI 캐릭터의 블루프린트를 엽니다.
2.  [[UAIPerceptionComponent]]를 추가합니다.
3.  컴포넌트의 'Details' 패널에서 'AI Perception' > 'Senses Config' 배열에 '+' 버튼을 눌러 항목을 추가합니다.
4.  추가된 항목을 눌러, 원하는 감각 설정 클래스(예:
	`AISense_Sight_Config`)를 선택하고 세부 속성을 조절합니다.

### **4. 관련 클래스**
> **이 설정 클래스를 사용하여 실제로 감각을 처리하고 [[Event]]를 발생시키는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UAIPerceptionComponent]]**:
	이 설정 클래스를 사용하여 실제로 감각을 처리하고 [[Event]]를 발생시키는 주체입니다.
* **`UAISense`**:
	각 감각의 실제 로직을 처리하는 내부 클래스입니다. `UAISenseConfig`는 이 클래스에 대한 설정 값 모음입니다.
* **[[AIPerceptionStimuliSourceComponent]]**:
	다른 AI에게 감지될 수 있는 '자극'을 발생시키는 컴포넌트입니다.

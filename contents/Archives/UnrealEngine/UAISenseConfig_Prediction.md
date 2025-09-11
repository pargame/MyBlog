---
title: 'UAISenseConfig Prediction'
date: '2025-08-17T16:17:41+09:00'
---
> **AI의 '예측(Prediction)' 감각에 대한 세부 설정을 정의하는 데이터 클래스입니다.** [[UAIPerceptionComponent]]에 추가되어, AI가 다른 AI의 행동을 예측하고 이에 반응할 수 있도록 설정합니다.

### **1. 주요 역할 및 책임**
> **AI가 다른 AI의 행동을 예측하고, 이를 기반으로 전략을 수립합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **예측 감각 정의 (Defining Prediction Sense)**:
	AI가 다른 AI의 행동을 예측하고, 이를 기반으로 전략을 수립합니다.
* **데이터 기반 설정 (Data-Driven Configuration)**:
	이 설정 객체를 [[UAIPerceptionComponent]]의 'Senses Config' 배열에 추가하여 AI의 예측 감각을 쉽게 조정할 수 있습니다.

### **2. 핵심 속성**
> **사용할 예측 감각의 구현체를 지정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Implementation`**:
	사용할 예측 감각의 구현체를 지정합니다. 보통 `AISense_Prediction`으로 설정됩니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  [[UAIPerceptionComponent]]의 'Senses Config' 배열에 항목을 추가합니다.
2.  해당 항목의 클래스를 `AISense_Prediction_Config`로 선택합니다.
3.  위에 설명된 핵심 속성들을 원하는 값으로 조절합니다.

### **4. 관련 클래스**
> **이 설정을 사용하여 실제로 예측 이벤트를 처리하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UAIPerceptionComponent]]**:
	이 설정을 사용하여 실제로 예측 이벤트를 처리하는 주체입니다.
* **[[UAISenseConfig]]**:
	모든 감각 설정 클래스의 부모 클래스입니다.
* **`AISense_Prediction`**:
	예측 이벤트를 감지하고 처리하는 실제 감각 클래스입니다.

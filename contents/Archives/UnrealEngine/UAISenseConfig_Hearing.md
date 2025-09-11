---
title: 'UAISenseConfig Hearing'
date: '2025-08-17T16:17:41+09:00'
---
> **AI의 '청각(Hearing)' 감각에 대한 세부 설정을 정의하는 데이터 클래스입니다.** [[UAIPerceptionComponent]]에 추가되어, AI가 어떤 소리를, 얼마나 멀리서, 어떤 소속의 대상으로부터 들을 수 있는지를 결정합니다.

### **1. 주요 역할 및 책임**
> **AI의 소리 감지 범위와 탐지할 대상의 소속(아군/적군/중립)을 설정합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **청각 능력 정의 (Defining Hearing Capabilities)**:
	AI의 소리 감지 범위와 탐지할 대상의 소속(아군/적군/중립)을 설정합니다.
* **데이터 기반 설정 (Data-Driven Configuration)**:
	이 설정 객체를 [[UAIPerceptionComponent]]의 'Senses Config' 배열에 추가하고 값을 조절하는 것만으로 AI의 청각 능력을 쉽게 변경할 수 있습니다.

### **2. 핵심 속성**
> **사용할 청각 감각의 구현체를 지정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Implementation`**:
	사용할 청각 감각의 구현체를 지정합니다. 보통 `AISense_Hearing`으로 설정됩니다.
* **`HearingRange`**:
	AI가 소리를 들을 수 있는 최대 거리입니다. 이 범위를 벗어난 곳에서 발생한 소리 이벤트는 감지되지 않습니다.
* **`DetectionByAffiliation`**:
	소리를 발생시킨 대상의 소속(아군, 적군, 중립)에 따라 감지 여부를 필터링합니다.
    *   `DetectEnemies`:
	적이 내는 소리를 탐지합니다.
    *   `DetectNeutrals`:
	중립 대상이 내는 소리를 탐지합니다.
    *   `DetectFriendlies`:
	아군이 내는 소리를 탐지합니다.
* **`bUseLoSHearing`**:
	Line of Sight(가시선) 검사를 사용할지 여부입니다. `true`이면 소리가 발생한 위치와 AI 사이에 장애물이 있을 경우 소리를 감지하지 못하게 할 수 있습니다 (구현에 따라 다름).

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  [[UAIPerceptionComponent]]의 'Senses Config' 배열에 항목을 추가합니다.
2.  해당 항목의 클래스를 `AISense_Hearing_Config`로 선택합니다.
3.  위에 설명된 핵심 속성들을 원하는 값으로 조절합니다.
4.  소리를 발생시키려면 다른 액터에서 `UAISense_Hearing::ReportNoiseEvent` 함수를 호출해야 합니다. 블루프린트에서는 `Make Noise` 노드를 사용하여 간편하게 소리를 발생시킬 수 있습니다.

### **4. 관련 클래스**
> **이 설정을 사용하여 실제로 소리 이벤트를 처리하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UAIPerceptionComponent]]**:
	이 설정을 사용하여 실제로 소리 이벤트를 처리하는 주체입니다.
* **[[UAISenseConfig]]**:
	모든 감각 설정 클래스의 부모 클래스입니다.
* **`UAISense_Hearing`**:
	`Make Noise`를 통해 발생한 소리 이벤트를 감지하고 처리하는 실제 감각 클래스입니다.

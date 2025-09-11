---
title: 'UAISenseConfig Sight'
date: '2025-08-17T16:17:41+09:00'
---
> **AI의 '시각(Sight)' 감각에 대한 세부 설정을 정의하는 데이터 클래스입니다.** [[UAIPerceptionComponent]]에 추가되어, AI가 무엇을, 얼마나 멀리, 어떤 각도에서 볼 수 있는지를 결정합니다.

### **1. 주요 역할 및 책임**
> **AI의 시야 범위, 시야각, 아군/적군/중립 대상의 식별 방법 등을 설정합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **시각 능력 정의 (Defining Vision Capabilities)**:
	AI의 시야 범위, 시야각, 아군/적군/중립 대상의 식별 방법 등을 설정합니다.
* **데이터 기반 설정 (Data-Driven Configuration)**:
	이 설정 객체를 [[UAIPerceptionComponent]]의 'Senses Config' 배열에 추가하고 값을 조절하는 것만으로 AI의 시각 능력을 쉽게 변경할 수 있습니다.

### **2. 핵심 속성**
> **사용할 시각 감각의 구현체를 지정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Implementation`**:
	사용할 시각 감각의 구현체를 지정합니다. 보통 `AISense_Sight`으로 설정됩니다.
* **`SightRadius`**:
	AI가 볼 수 있는 최대 거리입니다.
* **`LoseSightRadius`**:
	한 번 인지한 대상을 시야에서 놓치게 되는 거리입니다. `SightRadius`보다 약간 더 크게 설정하여 타깃이 시야 경계에서 깜빡이는 현상을 방지합니다.
* **`PeripheralVisionAngleDegrees`**:
	중심 시야로부터의 좌우 시야각입니다. 예를 들어, `90.0`으로 설정하면 전체 시야각(FOV)은 180도가 됩니다.
* **`DetectionByAffiliation`**:
	탐지할 대상을 소속(아군, 적군, 중립)에 따라 필터링합니다.
    *   `DetectEnemies`:
	적을 탐지합니다.
    *   `DetectNeutrals`:
	중립 대상을 탐지합니다.
    *   `DetectFriendlies`:
	아군을 탐지합니다.
* **`AutoSuccessRangeFromLastSeenLocation`**:
	대상을 마지막으로 본 위치로부터 이 거리 안에 들어가면, 시야에 방해물이 있어도 무조건 탐지에 성공하는 범위입니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  [[UAIPerceptionComponent]]의 'Senses Config' 배열에 항목을 추가합니다.
2.  해당 항목의 클래스를 `AISense_Sight_Config`로 선택합니다.
3.  위에 설명된 핵심 속성들을 원하는 값으로 조절합니다.

### **4. 관련 클래스**
> **이 설정을 사용하여 실제로 시각 정보를 처리하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UAIPerceptionComponent]]**:
	이 설정을 사용하여 실제로 시각 정보를 처리하는 주체입니다.
* **[[UAISenseConfig]]**:
	모든 감각 설정 클래스의 부모 클래스입니다.
* **[[AIPerceptionStimuliSourceComponent]]**:
	다른 AI에게 '보일 수 있는' 자극을 제공하는 컴포넌트입니다. 이 컴포넌트가 부착된 액터만이 시각 감각에 의해 감지될 수 있습니다.

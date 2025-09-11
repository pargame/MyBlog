---
title: 'AIPerceptionStimuliSourceComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **[[AActor]]가 다른 AI의 '인공지능 감각(AI Perception)'에 의해 감지될 수 있는 '자극(Stimulus)'을 발생시키는 원천이 되도록 만들어주는 컴포넌트입니다.** 이 컴포넌트가 부착된 액터만이 시각, 청각 등의 감각에 의해 인지될 수 있습니다.

## 주요 역할 및 책임
> **이 액터가 어떤 종류의 감각(예: 시각, 청각)에 의해 감지될 수 있는지를 AI 시스템에 등록합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **감각 자극 등록 (Registering for Senses)**:
	이 액터가 어떤 종류의 감각(예: 시각, 청각)에 의해 감지될 수 있는지를 AI 시스템에 등록합니다.
* **자극 발생 (Generating Stimuli)**:
	단순히 부착하는 것만으로도 시각(Sight) 감각의 대상이 되며, `Make Noise`와 같은 함수가 호출될 때 청각(Hearing) 자극을 발생시키는 등, 감각 이벤트를 생성하는 주체가 됩니다.
* **동적 제어 (Dynamic Control)**:
	런타임에 특정 감각에 대한 등록을 켜거나 끌 수 있어, 은신(Stealth)과 같이 특정 상황에서 AI에게 감지되지 않도록 만드는 기능을 구현할 수 있습니다.

## 핵심 함수
> **주어진 감각 클래스 배열에 대해 이 컴포넌트를 자극의 원천으로 등록합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`RegisterAsSourceForSenses(const TArray<TSubclassOf<UAISense>>& Senses)`**:
	주어진 감각 클래스 배열에 대해 이 컴포넌트를 자극의 원천으로 등록합니다.
* **`UnregisterFromSense(TSubclassOf<UAISense> SenseClass)`**:
	특정 감각에 대한 등록을 해제합니다.
* **`UnregisterFromAllSenses()`**:
	등록된 모든 감각으로부터 자극 원천 등록을 해제합니다.

## 사용 방법
> **1.**
1. AI에게 감지될 필요가 있는 모든 액터(예:
	플레이어 캐릭터, 소리를 내는 오브젝트)의 블루프린트에 `AIPerceptionStimuliSourceComponent`를 추가합니다.
2. 컴포넌트의 'Details' 패널에서 'AI Perception' > 'Register as source for senses' 항목을 설정합니다.
3. 'Auto Register as Source'를 `true`로 설정하고, 감지되기를 원하는 감각(예:
	`AISense_Sight`, `AISense_Hearing`)을 배열에 추가합니다.
4. 이제 이 액터는 [[UAIPerceptionComponent]]를 가진 다른 AI에 의해 감지될 수 있는 상태가 됩니다.

## 관련 클래스
> **이 컴포넌트가 발생시키는 자극을 감지하고 처리하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UAIPerceptionComponent]]**:
	이 컴포넌트가 발생시키는 자극을 감지하고 처리하는 주체입니다.
* **`UAISense`**:
	시각, 청각 등 개별 감각의 실제 로직을 처리하는 클래스입니다.
* **[[AActor]]**:
	이 컴포넌트가 부착되는 대상입니다.

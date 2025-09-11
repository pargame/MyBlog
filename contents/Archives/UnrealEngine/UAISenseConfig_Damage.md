---
title: 'UAISenseConfig Damage'
date: '2025-08-17T16:17:41+09:00'
---
> **AI의 '피해(Damage)' 감각에 대한 세부 설정을 정의하는 데이터 클래스입니다.** [[UAIPerceptionComponent]]에 추가되어, AI가 피해 이벤트를 감지하고 이에 반응할 수 있도록 설정합니다.

### **1. 주요 역할 및 책임**
> **AI가 피해를 입었을 때 이를 감지하고, 피해를 준 대상에 대한 정보를 수집합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **피해 감각 정의 (Defining Damage Sense)**:
	AI가 피해를 입었을 때 이를 감지하고, 피해를 준 대상에 대한 정보를 수집합니다.
* **데이터 기반 설정 (Data-Driven Configuration)**:
	이 설정 객체를 [[UAIPerceptionComponent]]의 'Senses Config' 배열에 추가하여 AI의 피해 감각을 쉽게 조정할 수 있습니다.

### **2. 핵심 속성**
> **사용할 피해 감각의 구현체를 지정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Implementation`**:
	사용할 피해 감각의 구현체를 지정합니다. 보통 `AISense_Damage`로 설정됩니다.
* **`DetectionByAffiliation`**:
	피해를 준 대상의 소속(아군, 적군, 중립)에 따라 감지 여부를 필터링합니다.
    *   `DetectEnemies`:
	적이 준 피해를 감지합니다.
    *   `DetectNeutrals`:
	중립 대상이 준 피해를 감지합니다.
    *   `DetectFriendlies`:
	아군이 준 피해를 감지합니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  [[UAIPerceptionComponent]]의 'Senses Config' 배열에 항목을 추가합니다.
2.  해당 항목의 클래스를 `AISense_Damage_Config`로 선택합니다.
3.  위에 설명된 핵심 속성들을 원하는 값으로 조절합니다.

### **4. 관련 클래스**
> **이 설정을 사용하여 실제로 피해 이벤트를 처리하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UAIPerceptionComponent]]**:
	이 설정을 사용하여 실제로 피해 이벤트를 처리하는 주체입니다.
* **[[UAISenseConfig]]**:
	모든 감각 설정 클래스의 부모 클래스입니다.
* **`AISense_Damage`**:
	피해 이벤트를 감지하고 처리하는 실제 감각 클래스입니다.

### **5. 예제: C++에서 설정 추가하기**
+다음은 `UAIPerceptionComponent`에 `UAISenseConfig_Damage`를 추가하는 간단한 예제입니다.
+
+```cpp
+// MyAIController.cpp (예시)
+#include "Perception/AIPerceptionComponent.h"
+#include "Perception/AISenseConfig_Damage.h"
+
+void AMyAIController::BeginPlay()
+{
+    Super::BeginPlay();
+
+    if (PerceptionComponent == nullptr) return;
+
+    UAISenseConfig_Damage* DamageConfig = NewObject<UAISenseConfig_Damage>(this);
+    DamageConfig->Implementation = UAISense_Damage::StaticClass();
+    DamageConfig->DetectionByAffiliation.bDetectEnemies = true;
+    DamageConfig->DetectionByAffiliation.bDetectNeutrals = false;
+    DamageConfig->DetectionByAffiliation.bDetectFriendlies = false;
+
+    PerceptionComponent->ConfigureSense(*DamageConfig);
+    PerceptionComponent->SetDominantSense(UAISense_Damage::StaticClass());
+}
+```
+
+### **6. 예제: 블루프린트 사용 팁**
+- `AI Perception` 컴포넌트를 가진 액터를 선택합니다.
+- `Senses Config` 배열에 `AISense_Damage_Config` 항목을 추가합니다.
+- 디테일 패널에서 `Detection By Affiliation` 옵션을 조정하세요.
+
+### **7. 실무 팁 및 주의사항**
+- 성능: 피해 이벤트는 빈번히 발생할 수 있으므로, 모든 AI에 대해 높은 빈도로 감지하도록 설정하면 성능에 영향이 옵니다. 필요한 대상에만 활성화하세요.
+- 이벤트 소스 검증: 피해 이벤트의 Instigator나 DamageCauser를 신뢰할 수 있는지 확인하세요. 네트워크 환경에서는 권한 검증이 필요합니다.
+- 디버깅: `DrawDebug`나 로그를 이용해 피해 감지 이벤트가 예상대로 발생하는지 확인하세요.
+- 소속 필터링: `DetectionByAffiliation`을 적절히 설정하면 불필요한 감지를 줄일 수 있습니다.
+
+### **8. 변경 이력**
+- 2025-08-15: 문서 보완 및 예제 추가 (작성자: 자동화 편집)
+
+### **9. 관련 문서**
+- `UAIPerceptionComponent`
+- `UAISense_Damage`
+- `UAISenseConfig`
+

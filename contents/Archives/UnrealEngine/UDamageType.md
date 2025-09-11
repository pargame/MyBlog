---
title: 'UDamageType'
date: '2025-08-17T16:17:41+09:00'
---
> **피해(Damage)의 '종류'를 정의하는 데이터 클래스입니다.** 단순히 피해량을 전달하는 것을 넘어, 피해가 화염, 냉기, 폭발, 관통 등 어떤 유형인지, 그리고 그에 따른 추가적인 효과(예: 밀쳐내기, 상태 이상)를 정의하는 데 사용됩니다.

### **1. 주요 역할 및 책임**
> **[[AActor]]가 피해를 입었을 때, `ApplyDamage` 함수를 통해 전달된 `UDamageType` 클래스를 확인하여 어떤 종류의 공격을 받았는지 식별할 수 있습니다.**
* **피해 유형 식별 (Damage Type Identification)**:
	[[AActor]]가 피해를 입었을 때, `ApplyDamage` 함수를 통해 전달된 `UDamageType` 클래스를 확인하여 어떤 종류의 공격을 받았는지 식별할 수 있습니다.
* **피해 반응 로직 분기 (Branching Damage Response Logic)**:
	피해를 입은 액터는 `UDamageType`에 따라 다른 반응을 보이도록 로직을 구성할 수 있습니다. 예를 들어, 화염 피해에는 불타는 이펙트를, 냉기 피해에는 이동 속도 감소 효과를 적용할 수 있습니다.
* **피해 관련 데이터 전달 (Carrying Damage-Related Data)**:
	`UDamageType` 클래스를 상속하여 커스텀 변수를 추가할 수 있습니다. 예를 들어, `MyPoisonDamageType` 클래스에 '초당 피해량'이나 '지속 시간' 같은 변수를 추가하여 피해 이벤트와 함께 전달할 수 있습니다.

### **2. 핵심 속성**
> **이 피해가 특정 [[AController]]에 의해 발생한 것이 아니라, 월드 자체(예: 낙하 피해, 용암)에 의해 발생했는지 여부를 나타냅니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`bCausedByWorld`**:
	이 피해가 특정 [[AController]]에 의해 발생한 것이 아니라, 월드 자체(예: 낙하 피해, 용암)에 의해 발생했는지 여부를 나타냅니다.
* **`DamageImpulse`**:
	피해를 입은 [[UPrimitiveComponent]]에 가해질 충격량의 배율입니다. 이를 통해 폭발 피해를 입었을 때 오브젝트가 더 강하게 밀려나도록 만들 수 있습니다.

### **3. 사용 예시**
> **화염방사기는 `FireDamageType`을, 저격 소총은 `ArmorPiercingDamageType`을 사용하도록 설정하여, 각 무기가 주는 피해의 성격을 다르게 만듭니다.**
* **다양한 무기 구현**:
	화염방사기는 `FireDamageType`을, 저격 소총은 `ArmorPiercingDamageType`을 사용하도록 설정하여, 각 무기가 주는 피해의 성격을 다르게 만듭니다.
* **환경 피해**:
	독늪에 들어간 캐릭터에게는 `PoisonDamageType`을 가진 피해를 주기적으로 입힙니다.
* **방어 타입 구현**:
	캐릭터가 '화염 저항' 능력을 가지고 있다면, 피해를 받을 때 `UDamageType`이 `FireDamageType`인지 확인하여 피해량을 감소시킵니다.

### **4. 관련 클래스**
> **`TakeDamage` 함수를 통해 피해를 처리하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[AActor]]**:
	`TakeDamage` 함수를 통해 피해를 처리하는 주체입니다.
* **[[UGameplayStatics]]**:
	`ApplyDamage`, `ApplyPointDamage`, `ApplyRadialDamage` 등 피해를 가하는 함수들을 제공합니다.
* **[[AController]]**:
	피해를 가한 주체(Instigator)로 자주 참조됩니다.

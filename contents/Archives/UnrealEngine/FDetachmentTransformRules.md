---
title: 'FDetachmentTransformRules'
date: '2025-08-17T16:17:41+09:00'
---
> **[[USceneComponent]]를 부모로부터 분리(Detach)할 때, 월드 공간에서의 위치, 회전, 크기를 어떻게 처리할지를 결정하는 규칙의 집합입니다.**

### **1. 주요 역할 및 책임**
> **자식 컴포넌트가 부모로부터 독립할 때, 기존의 월드 변환을 그대로 유지할지, 아니면 부모에 대한 상대적인 변환을 유지할지를 명확히 정의합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **변환(Transform) 유지 방식 결정**:
	자식 컴포넌트가 부모로부터 독립할 때, 기존의 월드 변환을 그대로 유지할지, 아니면 부모에 대한 상대적인 변환을 유지할지를 명확히 정의합니다. 이는 분리 후 컴포넌트가 예상치 못한 위치로 튀는 현상을 방지하는 데 매우 중요합니다.

### **2. 핵심 멤버 변수**
> **`FDetachmentTransformRules`는 3개의 열거형 변수로 구성되며, 각각 위치(Location), 회전(Rotation), 크기(Scale)에 대한 규칙을 따로 지정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
`FDetachmentTransformRules`는 3개의 열거형 변수로 구성되며, 각각 위치(Location), 회전(Rotation), 크기(Scale)에 대한 규칙을 따로 지정합니다.
* **`LocationRule`, `RotationRule`, `ScaleRule` (`EDetachmentRule`)**:
	* **`KeepRelative`:**
		부모에 대한 상대적인 위치, 회전, 크기를 유지합니다. 부모가 움직이면 자식도 따라 움직였던 것처럼, 분리 후에도 그 상대적인 관계를 기준으로 자신의 월드 변환을 새로 계산합니다.
    * **`KeepWorld`**:
    	현재의 월드 공간 위치, 회전, 크기를 그대로 유지합니다. 분리되는 순간의 월드 변환 값을 그대로 고정시키는 것과 같습니다. 가장 직관적이고 일반적으로 사용되는 옵션입니다.

### **3. 생성자 및 정적 변수**
> **편의를 위해 자주 사용하는 규칙 조합이 미리 정의되어 있습니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
편의를 위해 자주 사용하는 규칙 조합이 미리 정의되어 있습니다.
* **`FDetachmentTransformRules::KeepRelativeTransform`**:
	위치, 회전, 크기 모두 `KeepRelative` 규칙을 사용합니다.
* **`FDetachmentTransformRules::KeepWorldTransform`**:
	위치, 회전, 크기 모두 `KeepWorld` 규칙을 사용합니다.
* **`FDetachmentTransformRules(EDetachmentRule InRule, bool bCallModify)`**:
	모든 규칙을 동일한 값으로 설정하는 생성자입니다.

### **4. 사용 예시**
> **// MyComponent를 부모로부터 분리합니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
```cpp
// MyComponent를 부모로부터 분리합니다.
// 분리 후에도 현재의 월드 위치, 회전, 크기를 그대로 유지합니다.
MyComponent->DetachFromComponent(FDetachmentTransformRules::KeepWorldTransform);
```
캐릭터가 들고 있던 무기를 땅에 떨어뜨릴 때, `KeepWorldTransform` 규칙을 사용하여 무기가 떨어뜨린 그 자리에 그대로 남아있도록 할 수 있습니다.

### **5. 관련 클래스 및 구조체**
> **`DetachFromComponent` 함수를 통해 이 규칙을 사용하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[USceneComponent]]**:
	`DetachFromComponent` 함수를 통해 이 규칙을 사용하는 주체입니다.
* **[[FAttachmentTransformRules]]**:
	컴포넌트를 부착(Attach)할 때 사용되는 규칙으로, `FDetachmentTransformRules`와 쌍을 이룹니다.
* **[[FTransform]]**:
	위치, 회전, 크기 정보를 담고 있는 구조체로, 이 규칙들이 궁극적으로 제어하는 대상입니다.

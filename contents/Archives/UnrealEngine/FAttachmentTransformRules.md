---
title: 'FAttachmentTransformRules'
date: '2025-08-17T16:17:41+09:00'
---
> **[[USceneComponent]]를 다른 컴포넌트에 부착(Attach)할 때, 월드 공간에서의 위치, 회전, 크기를 어떻게 처리할지를 결정하는 규칙의 집합입니다.**

### **1. 주요 역할 및 책임**
> **자식 컴포넌트가 부모에 부착될 때, 자신의 기존 월드 변환을 기준으로 할지, 아니면 부모에 대한 상대적인 변환을 기준으로 할지를 명확히 정의합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **변환(Transform) 처리 방식 결정**:
	자식 컴포넌트가 부모에 부착될 때, 자신의 기존 월드 변환을 기준으로 할지, 아니면 부모에 대한 상대적인 변환을 기준으로 할지를 명확히 정의합니다. 이는 부착 후 컴포넌트가 예상치 못한 위치로 튀는 현상을 방지하는 데 매우 중요합니다.

### **2. 핵심 멤버 변수**
> **`FAttachmentTransformRules`는 3개의 열거형 변수로 구성되며, 각각 위치(Location), 회전(Rotation), 크기(Scale)에 대한 규칙을 따로 지정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
`FAttachmentTransformRules`는 3개의 열거형 변수로 구성되며, 각각 위치(Location), 회전(Rotation), 크기(Scale)에 대한 규칙을 따로 지정합니다.
* **`LocationRule`, `RotationRule`, `ScaleRule` (`EAttachmentRule`)**:
	* **`KeepRelative`:**
		부모에 대한 상대적인 위치, 회전, 크기를 유지합니다. 부착 후, 부모의 변환에 자신의 상대 변환을 더하여 새로운 월드 변환을 계산합니다.
    * **`KeepWorld`**:
    	현재의 월드 공간 위치, 회전, 크기를 유지합니다. 부착 후, 새로운 부모에 대한 상대 변환 값이 현재의 월드 변환을 유지하도록 역으로 계산됩니다.
    * **`SnapToTarget`**:
    	자신의 상대 변환을 0으로 만들고, 부모의 월드 변환을 그대로 따라갑니다. 즉, 부모와 정확히 같은 위치, 회전, 크기를 갖게 됩니다. 크기의 경우, `SnapToTargetNotIncludingScale`을 사용하여 크기는 제외하고 위치와 회전만 맞출 수도 있습니다.

### **3. 생성자 및 정적 변수**
> **편의를 위해 자주 사용하는 규칙 조합이 미리 정의되어 있습니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
편의를 위해 자주 사용하는 규칙 조합이 미리 정의되어 있습니다.
* **`FAttachmentTransformRules::KeepRelativeTransform`**:
	모든 규칙에 `KeepRelative`를 사용합니다.
* **`FAttachmentTransformRules::KeepWorldTransform`**:
	모든 규칙에 `KeepWorld`를 사용합니다.
* **`FAttachmentTransformRules::SnapToTargetNotIncludingScale`**:
	위치와 회전은 `SnapToTarget`, 크기는 `KeepWorld`를 사용합니다.
* **`FAttachmentTransformRules::SnapToTargetIncludingScale`**:
	모든 규칙에 `SnapToTarget`을 사용합니다.

### **4. 사용 예시**
> **// 캐릭터의 손(HandSocket)에 무기(WeaponComponent)를 부착합니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
```cpp
// 캐릭터의 손(HandSocket)에 무기(WeaponComponent)를 부착합니다.
// 무기의 월드 위치/회전은 유지하고, 크기만 캐릭터의 크기에 맞춥니다.
FAttachmentTransformRules Rules(EAttachmentRule::KeepWorld, EAttachmentRule::KeepWorld, EAttachmentRule::SnapToTarget, false);
WeaponComponent->AttachToComponent(Character->GetMesh(), Rules, FName("HandSocket"));
```

### **5. 관련 클래스 및 구조체**
> **`AttachToComponent` 함수를 통해 이 규칙을 사용하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[USceneComponent]]**:
	`AttachToComponent` 함수를 통해 이 규칙을 사용하는 주체입니다.
* **[[FDetachmentTransformRules]]**:
	컴포넌트를 분리(Detach)할 때 사용되는 규칙으로, `FAttachmentTransformRules`와 쌍을 이룹니다.
* **[[FTransform]]**:
	위치, 회전, 크기 정보를 담고 있는 구조체로, 이 규칙들이 궁극적으로 제어하는 대상입니다.

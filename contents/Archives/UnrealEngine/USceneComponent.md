---
title: 'USceneComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **[[AActor]]를 월드에 존재하게 하는 '공간적 앵커'이자, 모든 시각적/물리적 [[UActorComponent]]가 붙는 '뿌리'입니다.** [[UActorComponent]]가 가진 추상적인 '기능'에 '위치'라는 개념을 처음으로 부여하며, [[UActorComponent]] 간의 계층 구조를 만드는 기반이 됩니다.

### **1. 주요 역할 및 책임**
> **[[UActorComponent]]와 달리, [[FTransform]]을 가지고 있어 월드 내에서 특정한 위치, 회전, 크기를 가질 수 있습니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **공간적 존재의 시작 (The Beginning of Spatial Existence)**:
	[[UActorComponent]]와 달리, [[FTransform]]을 가지고 있어 월드 내에서 특정한 위치, 회전, 크기를 가질 수 있습니다. [[AActor]]의 `RootComponent`는 반드시 `USceneComponent` 또는 그 자식 클래스여야 합니다.
* **계층 구조의 기반 (Foundation of Hierarchy)**:
	다른 `USceneComponent`에 자식으로 붙을(Attach) 수 있습니다. 자식 `USceneComponent`의 `Transform`은 부모 `USceneComponent`에 상대적인 값으로 결정되므로, 복잡한 복합 오브젝트(예: 몸통에 팔 다리가 붙어있는 캐릭터)를 쉽게 만들 수 있습니다.
* **소켓 제공 (Providing Sockets)**:
	`USceneComponent`의 특정 위치에 '소켓(Socket)'이라는 이름 붙은 지점을 만들어, 다른 [[UActorComponent]]나 [[AActor]]를 정확한 위치에 쉽게 붙일 수 있도록 돕습니다. (예: 캐릭터의 손 소켓에 무기를 부착)

### **2. 핵심 함수 및 속성**
> **`USceneComponent`의 위치, 회전, 스케일 정보를 담고 있는 [[FTransform]] 구조체입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `Transform`:
	`USceneComponent`의 위치, 회전, 스케일 정보를 담고 있는 [[FTransform]] 구조체입니다. 월드 기준(`WorldTransform`)과 부모 기준(`RelativeTransform`)이 있습니다.
* `AttachToComponent(USceneComponent* Parent, const FAttachmentTransformRules& AttachmentRules, FName SocketName)`:
	이 `USceneComponent`를 다른 `USceneComponent`의 자식으로 붙입니다. [[FAttachmentTransformRules]]를 통해 위치를 어떻게 처리할지(예: 상대 위치 유지, 월드 위치 유지) 결정할 수 있습니다.
* `DetachFromComponent(const FDetachmentTransformRules& DetachmentRules)`:
	부모 `USceneComponent`로부터 이 `USceneComponent`를 분리합니다.
* `GetSocketTransform(FName InSocketName)`:
	지정한 이름의 소켓 위치에 해당하는 `WorldTransform`을 반환합니다.
* `GetChildrenComponents(bool bIncludeAllDescendants, TArray<USceneComponent*>& Children)`:
	이 `USceneComponent`에 직접 연결된 모든 자식 `USceneComponent`의 목록을 가져옵니다.

### **3. `USceneComponent`와 `UPrimitiveComponent`**
> **눈에 보이지 않는 순수한 좌표, 회전, 크기 정보입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`USceneComponent` (앵커)**:
	눈에 보이지 않는 순수한 좌표, 회전, 크기 정보입니다. 다른 `USceneComponent`가 붙을 수 있는 기준점, 즉 '앵커'의 역할을 합니다.
* **[[UPrimitiveComponent]] (실체)**:
	`USceneComponent`를 상속받아, 그 위치에 렌더링 가능한 메쉬나 충돌 가능한 물리적 형태를 추가한 것입니다. 화면에 보이거나 만져지는 모든 것은 [[UPrimitiveComponent]]입니다.

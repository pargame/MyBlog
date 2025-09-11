---
title: 'UActorComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **[[AActor]]에게 특정 '기능'이나 '행동'을 부여하는 재사용 가능한 부품입니다.** 인벤토리, 체력 시스템, 능력치 관리처럼 월드 내에서 특정 위치를 가질 필요가 없는 모든 논리적인 기능의 가장 기본적인 형태입니다.

### **1. 주요 역할 및 책임**
> **`UActorComponent`는 [[AActor]]의 기능을 독립적인 부품 단위로 캡슐화하여, 코드의 재사용성과 유지보수성을 극대화하는 역할을 합니다.**
`UActorComponent`는 [[AActor]]의 기능을 독립적인 부품 단위로 캡슐화하여, 코드의 재사용성과 유지보수성을 극대화하는 역할을 합니다.
* **기능의 재사용성 (Reusability of Functionality)**:
	한 번 만들어진 `UActorComponent`는 어떤 [[AActor]]에든 부착할 수 있습니다. 예를 들어, `UHealthComponent`를 하나 만들어두면 플레이어, 적, 파괴 가능한 상자 등 체력이 필요한 모든 [[AActor]]에 동일한 기능을 쉽게 추가할 수 있습니다.
* **기능의 캡슐화 (Encapsulation of Functionality)**:
	[[AActor]]는 `UActorComponent`가 내부적으로 어떻게 동작하는지 알 필요가 없습니다. 그저 `UActorComponent`가 제공하는 기능(예: `TakeDamage()`, `Heal()`)을 호출하기만 하면 됩니다. 이를 통해 [[AActor]]의 코드는 간결해지고, 각 기능은 독립적으로 관리될 수 있습니다.
* **비공간적 특성 (Non-Spatial Nature)**:
	`UActorComponent` 자체는 월드 내의 위치, 회전, 크기(`Transform`)를 가지지 않습니다. 공간적인 개념이 필요 없는 순수한 데이터나 로직을 담기 위해 설계되었습니다. 공간적인 위치가 필요한 `UActorComponent`는 자식 클래스인 [[USceneComponent]]를 사용해야 합니다.

### **2. 핵심 함수 (생명 주기)**
> **[[AActor]]의 생명 주기에 맞춰 자동으로 호출되는 핵심 [[Event|이벤트]] 함수들입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
[[AActor]]의 생명 주기에 맞춰 자동으로 호출되는 핵심 [[Event|이벤트]] 함수들입니다. 개발자는 이 함수들을 오버라이드하여 `UActorComponent`의 동작을 구현합니다.
* `InitializeComponent()`:
	`UActorComponent`가 생성되고 등록될 때 호출됩니다. `BeginPlay`보다 먼저 호출되며, 다른 `UActorComponent`에 대한 의존성 설정 등 기본적인 초기화에 사용됩니다.
* `BeginPlay()`:
	게임이 시작되거나, `UActorComponent`를 소유한 [[AActor]]가 스폰될 때 호출됩니다. 게임플레이와 관련된 대부분의 초기화 로직이 여기에 위치합니다.
* `TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)`:
	`UActorComponent`의 `bCanEverTick` 속성이 `true`일 경우, 매 프레임 호출됩니다. 지속적으로 상태를 업데이트하거나 검사해야 하는 로직을 여기에 작성합니다.
* `EndPlay(const EEndPlayReason::Type EndPlayReason)`:
	`UActorComponent`를 소유한 [[AActor]]가 파괴되거나 게임이 종료될 때 호출됩니다. 사용했던 리소스를 정리하거나, 마지막 상태를 저장하는 등의 마무리 작업을 수행합니다.

### **3. 주요 서브클래스**
> **모든 `UActorComponent`의 기본이지만, 실제로는 특정 목적에 맞게 확장된 자식 클래스들이 주로 사용됩니다.**
모든 `UActorComponent`의 기본이지만, 실제로는 특정 목적에 맞게 확장된 자식 클래스들이 주로 사용됩니다.
* **[[USceneComponent]]**:
	`UActorComponent`의 가장 중요한 자식 클래스입니다. `Transform`을 가지고 있어 월드 내에 위치, 회전, 크기를 가질 수 있습니다. 다른 [[USceneComponent]]에 계층적으로 붙을 수 있으며, 화면에 보이거나 물리적 충돌을 하는 모든 `UActorComponent`의 부모가 됩니다.
* **[[UPrimitiveComponent]]**:
	[[USceneComponent]]의 자식 클래스로, **화면에 렌더링되거나 물리적 충돌을 할 수 있는 모든 것의 기본 형태**입니다. 보이지 않는 순수한 위치 정보만 가진 [[USceneComponent]]와 달리, [[UPrimitiveComponent]]는 시각적 표현(메시)과 물리적 형태(충돌체)를 가질 수 있습니다. 씬에 존재하는 거의 모든 '물체'는 이 `UActorComponent`로부터 파생됩니다.
* **기본 도형 컴포넌트 (Basic Shape Components)**:
	[[UPrimitiveComponent]]를 상속받는 가장 기본적인 `UActorComponent`입니다. 복잡한 메시 없이 간단한 기하학적 형태로 충돌이나 영역 감지를 위해 주로 사용됩니다.
    * **[[UBoxComponent]]**:
    	사각 박스 형태의 충돌체를 가집니다.
    * **[[USphereComponent]]**:
    	구 형태의 충돌체를 가집니다.
    * **[[UCapsuleComponent]]**:
    	캡슐(알약) 형태의 충돌체를 가집니다. [[ACharacter]]의 기본 충돌체로 사용됩니다.
* **메시 컴포넌트 (Mesh Components)**:
	실제 3D 모델을 화면에 표시하기 위한 `UActorComponent`입니다.
    * **[[UStaticMeshComponent]]**:
    	움직이지 않는 정적인 3D 모델(예: 건물, 나무, 돌)을 렌더링합니다.
    * **[[USkeletalMeshComponent]]**:
    	뼈대(Skeleton)를 가지고 있어 애니메이션이 가능한 3D 모델(예: 캐릭터, 동물)을 렌더링합니다.
* **[[UMovementComponent]]**:
	소유자 [[AActor]]의 이동을 처리하는 `UActorComponent`의 부모 클래스입니다. [[UCharacterMovementComponent]]가 대표적인 예입니다.
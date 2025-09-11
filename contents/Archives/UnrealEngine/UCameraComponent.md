---
title: 'UCameraComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **월드에 '시점(Viewpoint)'을 제공하는 카메라의 핵심 기능 부품입니다.** 시야각(FOV), 종횡비(Aspect Ratio), 투영 방식(Projection Mode) 등 카메라의 모든 광학적 속성을 정의하며, [[AActor]]에 부착되어 그 액터를 카메라로 만들어주는 역할을 합니다.

### **1. 주요 역할 및 책임**
> **카메라의 가장 기본적인 속성들을 제공합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **뷰 프로젝션 설정 (View Projection Setup)**:
	카메라의 가장 기본적인 속성들을 제공합니다.
    * **`FieldOfView` (FOV)**:
    	카메라의 시야각을 조절합니다. 값이 클수록 더 넓은 영역을 볼 수 있습니다. (광각 렌즈 효과)
    * **`ProjectionMode`**:
    	투영 방식을 결정합니다. `Perspective`(원근) 또는 `Orthographic`(직교) 모드를 선택할 수 있습니다.
    * **`AspectRatio`**:
    	카메라 뷰의 종횡비를 설정합니다.
* **포스트 프로세싱 (Post Processing)**:
	이 카메라를 통해 보는 뷰에만 적용되는 포스트 프로세스 효과(블룸, 블렌스 오브 필드, 색 보정 등)를 개별적으로 적용할 수 있습니다.
* **뷰 타깃 제공 (Providing a View Target)**:
	[[APlayerController]]는 `SetViewTarget` 함수를 통해 이 컴포넌트를 가진 액터를 현재 플레이어의 시점으로 설정할 수 있습니다. 이를 통해 1인칭, 3인칭, 고정 카메라 등 다양한 카메라 뷰를 구현할 수 있습니다.

### **2. 주요 서브클래스**
> **`UCameraComponent`와 함께 사용되어 3인칭 카메라를 구현하는 데 필수적인 컴포넌트입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **[[USpringArmComponent]]**:
	`UCameraComponent`와 함께 사용되어 3인칭 카메라를 구현하는 데 필수적인 컴포넌트입니다. 스프링 암은 부모로부터 일정한 거리를 유지하려 하지만, 중간에 장애물이 있을 경우 카메라가 벽을 뚫지 않도록 부드럽게 길이를 조절하는 역할을 합니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  **컴포넌트 추가**:
	[[ACharacter]] 또는 [[APawn]] 블루프린트를 열고, 컴포넌트 패널에서 `Camera Component`를 추가합니다.
2.  **위치 및 설정**:
	추가된 `UCameraComponent`를 원하는 위치(예: 캐릭터의 머리)에 배치하고, 디테일 패널에서 `FieldOfView` 등 필요한 속성을 조절합니다.
3.  **활성화**:
	`bAutoActivate`가 `true`이거나, 코드에서 `Activate()`를 호출하면 컴포넌트가 활성화됩니다. 3인칭 캐릭터의 경우, 보통 [[USpringArmComponent]]의 자식으로 `UCameraComponent`를 배치하고, [[APlayerController]]가 해당 캐릭터를 `Possess`하면 자동으로 이 카메라가 주 시점으로 설정됩니다.

### **4. `UCameraComponent` vs. `ACameraActor`**
> **카메라의 '기능' 그 자체입니다.**
* **`UCameraComponent` (기능 부품)**:
	카메라의 '기능' 그 자체입니다. 어떤 [[AActor]]에든 부착하여 그 액터를 카메라로 만들 수 있습니다.
* **[[ACameraActor]] (단순한 구현)**:
	`UCameraComponent`를 담기 위한 가장 단순한 형태의 [[AActor]]입니다. 레벨에 고정된 카메라를 배치할 때 편리하게 사용됩니다.

### **5. 코드 예시**
> **// 캐릭터에 카메라 + 스프링암을 구성하고, 마우스 입력으로 회전하는 3인칭 카메라 예시 #include "GameFramework/SpringArmComponent.h" #include "Camera/CameraComponent.h" 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
```cpp
// 캐릭터에 카메라 + 스프링암을 구성하고, 마우스 입력으로 회전하는 3인칭 카메라 예시
#include "GameFramework/SpringArmComponent.h"
#include "Camera/CameraComponent.h"

AMyCharacter::AMyCharacter()
{
    SpringArm = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArm"));
    SpringArm->SetupAttachment(RootComponent);
    SpringArm->TargetArmLength = 300.0f;
    SpringArm->bUsePawnControlRotation = true; // 컨트롤러 회전 반영

    FollowCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FollowCamera"));
    FollowCamera->SetupAttachment(SpringArm, USpringArmComponent::SocketName);
    FollowCamera->bUsePawnControlRotation = false; // 카메라는 스프링암 회전을 그대로 사용
}

void AMyCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    check(PlayerInputComponent);
    PlayerInputComponent->BindAxis("Turn", this, &APawn::AddControllerYawInput);
    PlayerInputComponent->BindAxis("LookUp", this, &APawn::AddControllerPitchInput);
}
```

---
title: 'UInputAction'
date: '2025-08-17T16:17:41+09:00'
---
> **"점프", "발사", "상호작용"과 같이, 플레이어가 수행할 수 있는 추상적인 '행동' 그 자체를 정의하는 데이터 애셋입니다.** 이 행동이 구체적으로 어떤 키에 의해, 어떤 조건에서 발동될지는 [[UInputMappingContext]]에서 결정하므로, `UInputAction`은 순수한 '행동의 의미'에만 집중합니다.

### **1. 주요 역할 및 책임**
> **개발자는 코드에서 `W` 키가 눌렸는지를 확인하는 대신, `IA_MoveForward`라는 '행동'이 발생했는지를 확인하게 됩니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **입력의 추상화 (Abstraction of Input)**:
	개발자는 코드에서 `W` 키가 눌렸는지를 확인하는 대신, `IA_MoveForward`라는 '행동'이 발생했는지를 확인하게 됩니다. 이를 통해 키 바인딩이 변경되더라도 코드를 수정할 필요가 없어집니다.
* **값 타입 정의 (Value Type Definition)**:
	이 행동이 전달할 값의 종류를 결정합니다. 예를 들어, '이동' 액션은 `Axis2D` 값을, '점프' 액션은 `Digital` 값을, '줌인/줌아웃' 액션은 `Axis1D` 값을 가질 수 있습니다.
* **[[UInputTrigger]]와 [[UInputModifier]]의 컨테이너 (Container for Triggers and Modifiers)**:
	`UInputAction` 자체에도 기본적인 [[UInputTrigger]]와 [[UInputModifier]]를 추가할 수 있습니다. 여기에 추가된 규칙은 이 액션이 어떤 [[UInputMappingContext]]에서 사용되든 항상 적용됩니다. (보통은 컨텍스트 레벨에서 설정하는 것이 더 유연합니다.)
	  
### **2. 핵심 속성**
> **이 `UInputAction`이 생성하는 값의 데이터 타입을 결정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**

* **Value Type**:
	이 `UInputAction`이 생성하는 값의 데이터 타입을 결정합니다.
    * **`Digital (bool)`**:
    	눌렸는지 안 눌렸는지를 나타내는 `true`/`false` 값을 가집니다. (예: 점프, 발사)
    * **`Axis1D (float)`**:
    	`-1.0`에서 `1.0` 사이의 단일 축 값을 가집니다. (예: 마우스 휠을 이용한 줌, 전진/후진)
    * **`Axis2D (FVector2D)`**:
    	`X`, `Y` 두 축으로 구성된 2D 벡터 값을 가집니다. (예: WASD 이동, 마우스/조이스틱 조준)
    * **`Axis3D (FVector)`**:
    	`X`, `Y`, `Z` 세 축으로 구성된 3D 벡터 값을 가집니다. (6축 모션 컨트롤러 등에 사용)
* **`Triggers`**:
	이 `UInputAction`에 항상 적용될 기본 [[UInputTrigger]] 목록입니다.
* **`Modifiers`**:
	이 `UInputAction`에 항상 적용될 기본 [[UInputModifier]] 목록입니다.

### **3. 사용 흐름**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1. **생성 및 정의**:
	콘텐츠 브라우저에서 `UInputAction` 애셋을 생성하고, `Value Type` 등 주요 속성을 설정합니다.
2. **컨텍스트에 매핑**:
	[[UInputMappingContext]]를 열어, 방금 만든 `UInputAction`을 특정 키를 연결하고, [[UInputTrigger]]와 [[UInputModifier]]를 설정합니다.
3. **코드에 바인딩**:
	[[APlayerController]]나 [[APawn]]의 `SetupPlayerInputComponent` 함수 내에서, [[UEnhancedInputComponent]]의 `BindAction()` 함수를 사용하여 `UInputAction`과 실제 실행될 함수를 연결합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[UInputMappingContext]]
* [[UInputTrigger]]
* [[UInputModifier]]
* [[UEnhancedInputComponent]]
* [[ETriggerEvent]]

## 코드 예시
> **// UInputAction 값 읽어 이동/점프 처리하기 void AMyCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) { Super::SetupPlayerInputComponent(PlayerInputComponent); if (auto* EIC = Cast<UEnhancedInputComponent>(PlayerInputComponent)) { EIC->BindAction(IA_Move, ETriggerEvent::Triggered, this, &AMyCharacter::OnMove); EIC->BindAction(IA_Jump, ETriggerEvent::Started, this, &AMyCharacter::OnJumpStarted); EIC->BindAction(IA_Jump, ETriggerEvent::Completed, this, &AMyCharacter::OnJumpCompleted); } }**
```cpp
// UInputAction 값 읽어 이동/점프 처리하기
void AMyCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);
    if (auto* EIC = Cast<UEnhancedInputComponent>(PlayerInputComponent))
    {
        EIC->BindAction(IA_Move, ETriggerEvent::Triggered, this, &AMyCharacter::OnMove);
        EIC->BindAction(IA_Jump, ETriggerEvent::Started, this, &AMyCharacter::OnJumpStarted);
        EIC->BindAction(IA_Jump, ETriggerEvent::Completed, this, &AMyCharacter::OnJumpCompleted);
    }
}

void AMyCharacter::OnMove(const FInputActionInstance& Instance)
{
    const FVector2D Axis = Instance.GetValue().Get<FVector2D>();
    AddMovementInput(GetActorForwardVector(), Axis.Y);
    AddMovementInput(GetActorRightVector(), Axis.X);
}
```

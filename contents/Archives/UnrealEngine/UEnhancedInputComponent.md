---
title: 'UEnhancedInputComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UInputAction]]이라는 '추상적인 행동'과, 그 행동이 발동되었을 때 실제로 실행될 'C++ 함수'를 연결하는 '전기 배선반'입니다.** 플레이어의 입력이 최종적으로 어떤 코드를 실행할지를 결정하는 바인딩(Binding) 로직을 담당하는 핵심 [[UActorComponent]]입니다.

### **1. 주요 역할 및 책임**
> **`BindAction()` 함수를 통해, 특정 [[UInputAction]] 애셋이 특정 [[ETriggerEvent]](예: `Triggered`, `Started`, `Completed`) 상태가 되었을 때, 어떤 객체의 어떤 함수를 호출할지를 명확하게 지정합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **액션과 함수의 바인딩 (Binding Actions to Functions)**:
	`BindAction()` 함수를 통해, 특정 [[UInputAction]] 애셋이 특정 [[ETriggerEvent]](예: `Triggered`, `Started`, `Completed`) 상태가 되었을 때, 어떤 객체의 어떤 함수를 호출할지를 명확하게 지정합니다.
* **입력 처리의 종착점 (Destination of Input Processing)**:
	[[UEnhancedInputLocalPlayerSubsystem]]이 플레이어의 입력을 받아 [[UInputMappingContext]]와 [[UInputTrigger]]를 거쳐 최종적으로 [[UInputAction]]을 발동시키면, 그 결과가 이 컴포넌트에 도달하여 바인딩된 함수를 실행시킵니다.
* **입력 값 전달 (Passing Input Values)**:
	바인딩된 함수에 [[UInputAction]]이 생성한 값(예: `bool`, `float`, `FVector2D`)을 파라미터로 전달합니다. 이를 통해 개발자는 이동 방향, 마우스 움직임 등의 값을 함수 내에서 직접 사용할 수 있습니다.

### **2. 핵심 함수**
> **지정된 [[UInputAction]]과 C++ 함수를 바인딩하는 핵심 함수입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `BindAction(const UInputAction* Action, ETriggerEvent TriggerEvent, UObject* Object, FName FunctionName, ...)`:
	지정된 [[UInputAction]]과 C++ 함수를 바인딩하는 핵심 함수입니다.
	* `Action`:
	바인딩할 [[UInputAction]] 애셋을 지정합니다.
	* `TriggerEvent`:
	함수가 호출될 [[ETriggerEvent]]의 종류를 지정합니다. (`Triggered`가 가장 일반적으로 사용됩니다.)
	* `Object`:
	함수를 소유하고 있는 객체(`this`)를 지정합니다.
	* `FunctionName`:
	호출될 함수의 이름을 지정합니다.

### **3. 사용 예시**
> **3. 사용 예시 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[UInputAction]]
* [[ETriggerEvent]]
* [[UEnhancedInputLocalPlayerSubsystem]]
* [[UInputMappingContext]]
* [[UInputTrigger]]

## 코드 예시
> **// Enhanced Input: 액션을 함수에 바인딩하고 값 사용하기 void AMyCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) { Super::SetupPlayerInputComponent(PlayerInputComponent);**
```cpp
// Enhanced Input: 액션을 함수에 바인딩하고 값 사용하기
void AMyCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);

    if (auto* EIC = Cast<UEnhancedInputComponent>(PlayerInputComponent))
    {
        EIC->BindAction(IA_Move, ETriggerEvent::Triggered, this, &AMyCharacter::OnMove);
        EIC->BindAction(IA_Fire, ETriggerEvent::Started, this, &AMyCharacter::OnFireStarted);
        EIC->BindAction(IA_Fire, ETriggerEvent::Completed, this, &AMyCharacter::OnFireCompleted);
    }
}

void AMyCharacter::OnMove(const FInputActionInstance& Instance)
{
    const FVector2D Axis = Instance.GetValue().Get<FVector2D>();
    AddMovementInput(GetActorForwardVector(), Axis.Y);
    AddMovementInput(GetActorRightVector(), Axis.X);
}
```
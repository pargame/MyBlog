---
title: 'ETriggerEvent'
date: '2025-08-17T16:17:41+09:00'
---
> **[[Enhanced Input System]]에서 [[UInputAction]]이 어떤 상태에 도달했는지를 나타내는 '입력 상태의 종류'를 정의한 열거형(Enum)입니다.** `BindAction` 함수를 통해 특정 [[UInputAction]]과 C++ 함수를 연결할 때, 어떤 상태에서 함수를 호출할지를 결정하는 핵심적인 조건으로 사용됩니다.

### **1. 주요 역할 및 책임**
> **하나의 키 입력은 '눌리는 순간', '계속 눌리는 동안', '떼는 순간' 등 여러 단계로 나뉩니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **입력 생명 주기 정의 (Defining Input Lifecycle)**:
	하나의 키 입력은 '눌리는 순간', '계속 눌리는 동안', '떼는 순간' 등 여러 단계로 나뉩니다. `ETriggerEvent`는 이러한 각 단계를 고유한 값으로 정의합니다.
* **함수 호출 시점 결정 (Determining Function Call Timing)**:
	`BindAction` 함수에서 `ETriggerEvent`를 지정함으로써, 바인딩된 함수가 언제 호출될지를 명시적으로 선택할 수 있습니다. 예를 들어, `ETriggerEvent::Started`는 자동 연사의 시작 시점에, `ETriggerEvent::Triggered`는 매 발사 시점에, `ETriggerEvent::Completed`는 발사 종료 시점에 각각 다른 함수를 연결할 수 있습니다.

### **2. 열거형 값의 종류**
> **아무 [[Event]]도 아님을 의미합니다.**
* **`None`**:
	아무 [[Event]]도 아님을 의미합니다. (거의 사용되지 않음)
* **`Triggered`**:
	**가장 일반적으로 사용되는 [[Event]]입니다.** [[UInputTrigger]]의 조건이 완전히 충족되었을 때 발생합니다. 예를 들어, `Pressed` 트리거에서는 키가 눌린 순간, `Held` 트리거에서는 지정된 시간을 채운 순간, `Pulse` 트리거에서는 매 인터벌마다 발생합니다.
* **`Started`**:
	입력이 처음으로 활성화되어 트리거링 과정이 시작되었을 때 한 번 발생합니다. 예를 들어, `Hold` 트리거의 경우 키를 누르기 시작한 바로 그 순간에 발생합니다.
* **`Ongoing`**:
	트리거의 조건이 충족되는 과정 중에 계속해서 발생합니다. (현재는 거의 사용되지 않으며, `Triggered`가 이 역할을 대신하는 경우가 많습니다.)
* **`Canceled`**:
	트리거링 과정이 중간에 취소되었을 때 발생합니다. 예를 들어, `Hold` 트리거가 완료되기 전에 키에서 손을 떼는 경우입니다.
* **`Completed`**:
	입력 액션이 완전히 종료되었을 때 발생합니다. 예를 들어, `Hold` 트리거가 발동된 후 키에서 손을 떼는 순간에 발생합니다.

### **3. 사용 예시**
> **이처럼 `ETriggerEvent`를 활용하면, 하나의 [[UInputAction]]에 대해 여러 다른 상태에 각기 다른 함수를 바인딩하여 복잡한 입력 로직을 체계적으로 구현할 수 있습니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**

이처럼 `ETriggerEvent`를 활용하면, 하나의 [[UInputAction]]에 대해 여러 다른 상태에 각기 다른 함수를 바인딩하여 복잡한 입력 로직을 체계적으로 구현할 수 있습니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[Enhanced Input System]]:
	강화 입력 전체 파이프라인의 개념적 컨텍스트.
* [[UEnhancedInputComponent]]:
	입력 액션과 C++ 함수 바인딩 진입점.
* [[UInputAction]]:
	추상적 행동 단위 정의.
* [[UInputTrigger]]:
	행동 발동 조건 정의.

## 코드 예시
> **// 강화 입력: ETriggerEvent로 서로 다른 상태에 함수 바인딩 void AMyCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) { Super::SetupPlayerInputComponent(PlayerInputComponent);**
```cpp
// 강화 입력: ETriggerEvent로 서로 다른 상태에 함수 바인딩
void AMyCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);

    if (auto* EIC = Cast<UEnhancedInputComponent>(PlayerInputComponent))
    {
        // 점프 시작/완료를 분리 바인딩
        EIC->BindAction(IA_Jump, ETriggerEvent::Started, this, &AMyCharacter::OnJumpStarted);
        EIC->BindAction(IA_Jump, ETriggerEvent::Completed, this, &AMyCharacter::OnJumpCompleted);

        // 카메라 이동은 Triggered(매 틱 평가 충족 시)로 처리
        EIC->BindAction(IA_Look, ETriggerEvent::Triggered, this, &AMyCharacter::OnLook);
    }
}

void AMyCharacter::OnJumpStarted(const FInputActionInstance& Instance)
{
    // 점프 시작 처리
}

void AMyCharacter::OnJumpCompleted(const FInputActionInstance& Instance)
{
    // 점프 종료 처리
}

void AMyCharacter::OnLook(const FInputActionInstance& Instance)
{
    const FVector2D Axis = Instance.GetValue().Get<FVector2D>();
    AddControllerYawInput(Axis.X);
    AddControllerPitchInput(Axis.Y);
}
```

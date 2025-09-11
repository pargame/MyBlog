---
title: 'Enhanced Input System'
date: '2025-08-17T16:17:41+09:00'
---
> **데이터 기반의 유연하고 강력한 차세대 입력 시스템입니다.** 기존의 고정적인 축/액션 매핑 방식에서 벗어나, '입력 액션'([[UInputAction]])과 '매핑 컨텍스트'([[UInputMappingContext]])라는 개념을 도입하여, 게임의 상황에 따라 입력 방식을 동적으로 변경하고 복잡한 입력을 쉽게 처리할 수 있도록 설계되었습니다.

### **1. 핵심 철학: 관심사의 분리**
> **"무엇을" 할 것인가?** 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**

*   **1. 데이터 계층 (Data Layer):
	"무엇을" 할 것인가?**:
	* **[[UInputAction]] (IA):**:
		'점프', '이동'과 같이 추상화된 **행동** 그 자체를 정의합니다.
    * **[[UInputMappingContext]] (IMC)**:
    	특정 키(예: `Space Bar`)를 특정 행동([[UInputAction]])에 연결하는 **규칙의 집합**입니다.
    * **[[UInputModifier]]**:
    	입력의 원시 값을 가공하는 **필터**입니다. (예: 데드존, 축 반전)
    * **[[UInputTrigger]]**:
    	행동이 발동될 **조건**을 정의합니다. (예: 짧게 누르기, 길게 누르기)

*   **2. 처리 계층 (Processing Layer):
	"언제, 어떻게" 처리할 것인가?**:
	* **[[UEnhancedInputLocalPlayerSubsystem]]:**:
		플레이어의 현재 상황에 맞는 [[UInputMappingContext]]를 동적으로 추가하거나 제거하여, 활성화된 입력 규칙을 관리하는 **중앙 허브**입니다.

*   **3. 실행 계층 (Execution Layer):
	"누가" 실행할 것인가?**:
	* **[[UEnhancedInputComponent]]:**:
		[[UInputAction]]이 발동되었을 때, 실제로 어떤 C++ 함수나 블루프린트 [[Event]]를 실행할지 **바인딩(연결)**하는 역할을 합니다.

### **2. 기존 시스템과의 비교**
> **| 특징 | 기존 입력 시스템 (Legacy) | 강화된 입력 시스템 (Enhanced) | | :--- | :--- | :--- | | **설정 위치** | 프로젝트 설정 (고정) | 데이터 애셋 (유연, 동적) | | **컨텍스트** | 없음 (항상 전역 활성화) | [[UInputMappingContext]]를 통해 상황별 제어 가능 | | **입력 처리** | `Pressed`, `Released`만 지원 | `Tap`, `Hold`, `Chorded` 등 복잡한 트리거 지원 | | **값 처리** | 단순 축 값 | [[UInputModifier]]를 통해 데드존, 스위즐 등 고급 처리 가능 | | **확장성** | 제한적 | C++로 커스텀 트리거/모디파이어 제작 용이 |**
| 특징 | 기존 입력 시스템 (Legacy) | 강화된 입력 시스템 (Enhanced) |
| :--- | :--- | :--- |
| **설정 위치** | 프로젝트 설정 (고정) | 데이터 애셋 (유연, 동적) |
| **컨텍스트** | 없음 (항상 전역 활성화) | [[UInputMappingContext]]를 통해 상황별 제어 가능 |
| **입력 처리** | `Pressed`, `Released`만 지원 | `Tap`, `Hold`, `Chorded` 등 복잡한 트리거 지원 |
| **값 처리** | 단순 축 값 | [[UInputModifier]]를 통해 데드존, 스위즐 등 고급 처리 가능 |
| **확장성** | 제한적 | C++로 커스텀 트리거/모디파이어 제작 용이 |

### **3. 기본 구현 흐름**
> **1.**
1.  **[[UInputAction]] 애셋 생성**:
	'IA_Move', 'IA_Jump' 등 필요한 행동들을 정의합니다.
2.  **[[UInputMappingContext]] 애셋 생성**:
	'IMC_Default' 컨텍스트를 만들고, `W`키를 'IA_Move'에, `Space Bar`를 'IA_Jump'에 매핑하는 등 규칙을 설정합니다.
3.  **서브시스템에 컨텍스트 추가**:
	플레이어 컨트롤러의 `BeginPlay` 등에서 [[UEnhancedInputLocalPlayerSubsystem]]을 가져와 `AddMappingContext` 함수로 'IMC_Default'를 추가합니다.
4.  **입력 컴포넌트에 함수 바인딩**:
	캐릭터의 `SetupPlayerInputComponent` 함수에서 [[UEnhancedInputComponent]]를 통해 'IA_Move'가 발동되면 `Move()` 함수를, 'IA_Jump'가 발동되면 `Jump()` 함수를 호출하도록 바인딩합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[UInputAction]]
* [[UInputMappingContext]]
* [[UInputModifier]]
* [[UInputTrigger]]
* [[UEnhancedInputLocalPlayerSubsystem]]
* [[UEnhancedInputComponent]]
* [[ETriggerEvent]]

## 코드 예시
> **// 기본 매핑 컨텍스트 추가 (LocalPlayer Subsystem) void UMyHUDWidget::NativeConstruct() { Super::NativeConstruct();**
```cpp
// 기본 매핑 컨텍스트 추가 (LocalPlayer Subsystem)
void UMyHUDWidget::NativeConstruct()
{
    Super::NativeConstruct();

    if (APlayerController* PC = GetOwningPlayer())
    {
        if (ULocalPlayer* LP = PC->GetLocalPlayer())
        {
            if (auto* Subsys = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(LP))
            {
                Subsys->AddMappingContext(IMC_Default, 0);
            }
        }
    }
}

// 입력 바인딩 (EnhancedInputComponent)
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
```
---
title: 'UEnhancedInputLocalPlayerSubsystem'
date: '2025-08-17T16:17:41+09:00'
---
> **플레이어의 상황에 맞는 입력 체계를 동적으로 관리하고 적용하는 '입력 컨텍스트'의 지휘자입니다.** 메뉴를 보고 있을 때, 자동차를 운전할 때, 걸어 다닐 때 등 각기 다른 상황에 필요한 입력 매핑을 실시간으로 교체하여, 현대적이고 유연한 입력 시스템을 구현하는 핵심입니다.

### **1. 주요 역할 및 책임**
> **[[UInputMappingContext]]라는 [[Data Asset]]을 플레이어에게 추가하거나 제거하는 방식으로, 현재 상황에 유효한 [[UInputAction]]들을 제어합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **컨텍스트 기반 입력 관리 (Context-Based Input Management)**:
	[[UInputMappingContext]]라는 [[Data Asset]]을 플레이어에게 추가하거나 제거하는 방식으로, 현재 상황에 유효한 [[UInputAction]]들을 제어합니다. 예를 들어, UI가 열리면 '게임 플레이 컨텍스트'를 제거하고 'UI 컨텍스트'를 추가하여, 동일한 키가 다른 동작을 하도록 만들 수 있습니다.
* **입력 매핑의 적용 (Applying Input Mappings)**:
	[[UInputMappingContext]] 안에 정의된 규칙들, 즉 "`W` 키를 누르면 `IA_MoveForward` 액션을 실행하라"와 같은 매핑들을 실제로 플레이어의 입력에 적용하는 역할을 합니다.
* **우선순위 관리 (Priority Management)**:
	여러 개의 [[UInputMappingContext]]가 동시에 활성화되어 있을 때, `Priority` 값이 더 높은 컨텍스트의 매핑이 다른 컨텍스트의 매핑을 덮어쓰도록 하여 입력 충돌을 해결합니다.

### **2. 핵심 함수**
> **플레이어에게 새로운 [[UInputMappingContext]]를 추가하여, 해당 컨텍스트에 정의된 입력들을 활성화합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `AddMappingContext(const UInputMappingContext* MappingContext, int32 Priority)`:
	플레이어에게 새로운 [[UInputMappingContext]]를 추가하여, 해당 컨텍스트에 정의된 입력들을 활성화합니다.
* `RemoveMappingContext(const UInputMappingContext* MappingContext)`:
	플레이어에게서 특정 [[UInputMappingContext]]를 제거하여, 관련된 입력들을 비활성화합니다.
* `ClearAllMappings()`:
	플레이어에게 적용된 모든 [[UInputMappingContext]]를 제거합니다.
  
### **3. 주요 개념 (Key Concepts)**
> **입력 매핑의 '집합'입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **[[UInputMappingContext]]**:
	입력 매핑의 '집합'입니다. "이 컨텍스트가 활성화되면, 이 키는 이 [[UInputAction]]을 실행한다"는 규칙들의 목록을 담고 있는 [[Data Asset]]입니다.
* **[[UInputAction]]**:
	"점프", "발사", "이동"과 같이 추상화된 '행동' 그 자체를 의미하는 [[Data Asset]]입니다.
* **[[UInputTrigger]]**:
	해당 [[UInputAction]]이 '언제' 실행될지를 결정하는 규칙입니다. (예: `Pressed` - 눌렀을 때, `Held` - 누르고 있을 때, `Tapped` - 짧게 눌렀다 뗐을 때)
* **[[UInputModifier]]**:
	입력의 '원시 값(Raw Value)'을 어떻게 가공할지를 결정하는 규칙입니다. (예: `DeadZone` - 컨트롤러 스틱의 작은 움직임 무시, `Swizzle` - 입력 축 순서 변경)

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[ULocalPlayer]]
* [[UInputMappingContext]]
* [[UInputAction]]
* [[UEnhancedInputComponent]]

## 코드 예시
> **// UI 토글에 따라 컨텍스트 전환하기 void UMyHUDWidget::NativeConstruct() { Super::NativeConstruct();**
```cpp
// UI 토글에 따라 컨텍스트 전환하기
void UMyHUDWidget::NativeConstruct()
{
    Super::NativeConstruct();

    if (APlayerController* PC = GetOwningPlayer())
    {
        if (ULocalPlayer* LP = PC->GetLocalPlayer())
        {
            if (auto* Subsys = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(LP))
            {
                Subsys->AddMappingContext(IMC_Character, 0);
            }
        }
    }
}

void UMyHUDWidget::OnMenuOpened()
{
    if (APlayerController* PC = GetOwningPlayer())
    {
        if (ULocalPlayer* LP = PC->GetLocalPlayer())
        {
            if (auto* Subsys = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(LP))
            {
                Subsys->RemoveMappingContext(IMC_Character);
                Subsys->AddMappingContext(IMC_UI, 10); // 높은 우선순위로 UI 우선
            }
        }
    }
}
```

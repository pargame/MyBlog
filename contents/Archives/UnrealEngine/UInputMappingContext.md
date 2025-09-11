---
title: 'UInputMappingContext'
date: '2025-08-17T16:17:41+09:00'
---
> **"어떤 키가 어떤 행동을 하는가?"에 대한 규칙들을 모아놓은 '입력 규칙 사전'입니다.** 플레이어의 특정 상황(예: '걷는 중', '차량 운전 중', '메뉴 탐색 중')에 맞는 입력 체계를 정의하는 **[[Data Asset]]**으로, [[Enhanced Input System]]의 핵심적인 구성 요소입니다.

### **1. 주요 역할 및 책임**
> **하나 이상의 [[UInputAction]]을 실제 키보드, 마우스, 게임패드의 특정 키에 매핑하는 목록을 관리합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **입력 매핑의 집합 (A Set of Input Mappings)**:
	하나 이상의 [[UInputAction]]을 실제 키보드, 마우스, 게임패드의 특정 키에 매핑하는 목록을 관리합니다. 예를 들어, "`W` 키는 `IA_MoveForward`에 매핑된다" 와 "`스페이스 바`는 `IA_Jump`에 매핑된다" 와 같은 규칙들을 담고 있습니다.
* **컨텍스트 제공 (Providing Context)**:
	이름 그대로, 입력이 사용될 '상황' 또는 '맥락'을 제공합니다. `IMC_CharacterControls`에는 캐릭터 조작 관련 매핑을, `IMC_VehicleControls`에는 차량 조작 관련 매핑을, `IMC_UI_Menu`에는 UI 메뉴 조작 관련 매핑을 각각 나누어 정의할 수 있습니다.
* **[[UInputTrigger]]와 [[UInputModifier]] 설정 (Configuring Triggers and Modifiers)**:
	각각의 키 매핑에 대해, 액션이 언제 발동될지([[UInputTrigger]] 배열)와 입력 값을 어떻게 가공할지([[UInputModifier]] 배열)를 구체적으로 설정할 수 있습니다.

### **2. 주요 구성 요소**
> **이 컨텍스트의 핵심인 입력 매핑 목록입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**

* **Mappings 배열**:
	이 컨텍스트의 핵심인 입력 매핑 목록입니다. 각 항목은 하나의 [[UInputAction]]과 하나 이상의 키를 연결합니다.
    * **`Action`**:
    	매핑할 [[UInputAction]] 애셋을 지정합니다.
    * **`Key`**:
    	해당 액션을 발동시킬 물리적인 키(예: `W`, `Left Mouse Button`)를 지정합니다.
    * **`Triggers`**:
    	액션이 발동될 조건을 정의하는 배열입니다. (예: `Pressed`, `Held`, `Tapped`)
    * **`Modifiers`**:
    	입력의 원시 값을 가공하는 규칙의 배열입니다. (예: `Dead Zone`, `Negate`, `Swizzle`)

### **3. 사용 흐름**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1. **생성 및 정의**:
	콘텐츠 브라우저에서 `UInputMappingContext` 애셋을 생성하고, 그 안에 원하는 키 매핑 규칙들을 모두 정의합니다.
2. **서브시스템을 통한 적용**:
	[[UEnhancedInputLocalPlayerSubsystem]]의 `AddMappingContext()` 함수를 호출하여, 특정 플레이어에게 이 `UInputMappingContext`를 적용합니다.
3. **활성화**:
	`UInputMappingContext`가 플레이어에게 성공적으로 추가되면, 그 안에 정의된 모든 키 매핑이 활성화되어 플레이어가 해당 키를 눌렀을 때 지정된 [[UInputAction]]이 발동되기 시작합니다.
4. **제거**:
	상황이 바뀌면(예: 메뉴를 닫으면), `RemoveMappingContext()` 함수를 호출하여 해당 `UInputMappingContext`를 제거하고 관련 입력들을 비활성화합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[UEnhancedInputLocalPlayerSubsystem]]
* [[UInputAction]]
* [[UInputTrigger]]
* [[UInputModifier]]

## 코드 예시
> **// IMC를 통해 키-액션 매핑 추가 후 플레이어에 적용 void SetupMappings(APlayerController* PC) { if (!PC) return;**
```cpp
// IMC를 통해 키-액션 매핑 추가 후 플레이어에 적용
void SetupMappings(APlayerController* PC)
{
    if (!PC) return;

    if (ULocalPlayer* LP = PC->GetLocalPlayer())
    {
        if (auto* Subsys = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(LP))
        {
            // 에디터에서 만든 IMC 자산을 추가
            Subsys->AddMappingContext(IMC_Character, 0);

            // (선택) 코드에서 동적으로 키 매핑 추가
            if (IMC_Character && IA_Jump)
            {
                IMC_Character->MapKey(IA_Jump, EKeys::SpaceBar);
            }
        }
    }
}
```

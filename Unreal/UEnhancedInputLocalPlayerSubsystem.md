---
---

> **플레이어의 상황에 맞는 입력 체계를 동적으로 관리하고 적용하는 '입력 컨텍스트'의 지휘자입니다.** 메뉴를 보고 있을 때, 자동차를 운전할 때, 걸어 다닐 때 등 각기 다른 상황에 필요한 입력 매핑을 실시간으로 교체하여, 현대적이고 유연한 입력 시스템을 구현하는 핵심입니다.

### **1. 주요 역할 및 책임**
> `UEnhancedInputLocalPlayerSubsystem`은 기존의 프로젝트 설정에 고정된 입력을 넘어, 게임 플레이 중에 입력 방식을 자유롭게 추가, 제거, 우선순위를 정하는 동적인 관리를 책임집니다.
* **컨텍스트 기반 입력 관리 (Context-Based Input Management):**
      [[UInputMappingContext]]라는 [[Data Asset]]을 플레이어에게 추가하거나 제거하는 방식으로, 현재 상황에 유효한 [[UInputAction]]들을 제어합니다. 예를 들어, UI가 열리면 '게임 플레이 컨텍스트'를 제거하고 'UI 컨텍스트'를 추가하여, 동일한 키가 다른 동작을 하도록 만들 수 있습니다.
* **입력 매핑의 적용 (Applying Input Mappings):**
      [[UInputMappingContext]] 안에 정의된 규칙들, 즉 "`W` 키를 누르면 `IA_MoveForward` 액션을 실행하라"와 같은 매핑들을 실제로 플레이어의 입력에 적용하는 역할을 합니다.
* **우선순위 관리 (Priority Management):**
      여러 개의 [[UInputMappingContext]]가 동시에 활성화되어 있을 때, `Priority` 값이 더 높은 컨텍스트의 매핑이 다른 컨텍스트의 매핑을 덮어쓰도록 하여 입력 충돌을 해결합니다.

### **2. 핵심 함수**
> 플레이어의 입력 컨텍스트를 직접 제어하기 위해 사용하는 가장 중요한 함수들입니다.
* `AddMappingContext(const UInputMappingContext* MappingContext, int32 Priority)`:
	플레이어에게 새로운 [[UInputMappingContext]]를 추가하여, 해당 컨텍스트에 정의된 입력들을 활성화합니다.
* `RemoveMappingContext(const UInputMappingContext* MappingContext)`:
      플레이어에게서 특정 [[UInputMappingContext]]를 제거하여, 관련된 입력들을 비활성화합니다.
* `ClearAllMappings()`:
      플레이어에게 적용된 모든 [[UInputMappingContext]]를 제거합니다.
  
### **3. 주요 개념 (Key Concepts)**
> `Enhanced Input System`은 여러 [[Data Asset]]의 조합으로 이루어집니다. 이 `UEnhancedInputLocalPlayerSubsystem`은 이들을 지휘하는 역할을 합니다.
* **[[UInputMappingContext]]:**
      입력 매핑의 '집합'입니다. "이 컨텍스트가 활성화되면, 이 키는 이 [[UInputAction]]을 실행한다"는 규칙들의 목록을 담고 있는 [[Data Asset]]입니다.
* **[[UInputAction]]:**
      "점프", "발사", "이동"과 같이 추상화된 '행동' 그 자체를 의미하는 [[Data Asset]]입니다.
* **[[UInputTrigger]]:**
      해당 [[UInputAction]]이 '언제' 실행될지를 결정하는 규칙입니다. (예: `Pressed` - 눌렀을 때, `Held` - 누르고 있을 때, `Tapped` - 짧게 눌렀다 뗐을 때)
* **[[UInputModifier]]:**
      입력의 '원시 값(Raw Value)'을 어떻게 가공할지를 결정하는 규칙입니다. (예: `DeadZone` - 컨트롤러 스틱의 작은 움직임 무시, `Swizzle` - 입력 축 순서 변경)

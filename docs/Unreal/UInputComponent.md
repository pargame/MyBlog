---
---
> **플레이어의 입력(키보드, 마우스, 게임패드)을 받아, 이를 특정 게임플레이 행동(함수)에 연결하는 '입력 배선반'입니다.** [[APawn]] 또는 [[AController]]에 추가되어, 플레이어의 의지를 실제 액션으로 변환하는 핵심적인 역할을 합니다.

### **1. 주요 역할 및 책임**
> `UInputComponent`는 하드웨어로부터 들어온 입력을 게임 로직과 연결하는 다리 역할을 합니다.
* **입력 바인딩 (Input Binding):**
    `BindAction`과 `BindAxis` 함수를 통해, "`W`키를 누르면 `MoveForward` 함수를 호출하라" 또는 "마우스 `X`축의 움직임을 `LookRight` 함수에 전달하라"와 같은 규칙을 설정합니다.
* **입력 스택 관리 (Input Stack Management):**
    언리얼 엔진은 입력 컴포넌트들의 스택(Stack)을 유지합니다. 스택의 최상위에 있는 컴포넌트부터 입력을 처리할 기회를 가지며, 특정 컴포넌트가 입력을 '소비(Consume)'하면 그보다 아래에 있는 다른 컴포넌트들은 해당 입력을 받지 못합니다. 이를 통해 UI 입력이 게임플레이 입력을 가리는 등의 상황을 자연스럽게 처리할 수 있습니다.
* **동적 활성화/비활성화 (Dynamic Activation):**
    `Activate()`와 `Deactivate()` 함수를 통해 특정 입력 컴포넌트의 동작을 런타임에 켜거나 끌 수 있습니다. (예: 플레이어가 UI를 열었을 때 캐릭터의 움직임 입력을 비활성화)

### **2. 주요 서브클래스**
> `UInputComponent`는 그 자체로도 사용될 수 있지만, 특정 입력 시스템을 위해 확장된 자식 클래스들이 더 많이 사용됩니다.
* **[[UEnhancedInputComponent]]:**
    최신 [[Enhanced Input System]]을 위한 입력 컴포넌트입니다. [[UInputAction]] 애셋을 기반으로 바인딩하여, 기존 시스템보다 훨씬 더 유연하고 강력한 컨텍스트 기반의 입력 관리를 제공합니다.

### **3. 사용 흐름 (레거시 입력 시스템 기준)**
1.  **프로젝트 설정:** 프로젝트 설정의 '입력(Input)' 섹션에서 'Action Mappings'와 'Axis Mappings'를 정의합니다. (예: "Jump" 액션에 `Space Bar` 키 할당)
2.  **컴포넌트 활성화:** [[APawn]]의 생성자에서 `AutoPossessPlayer`를 설정하거나, `SetupPlayerInputComponent` 함수가 호출될 때 자동으로 활성화됩니다.
3.  **함수 바인딩:** [[APawn]] 또는 [[AController]]의 `SetupPlayerInputComponent` 함수 내에서, `BindAction` 또는 `BindAxis` 함수를 호출하여 위에서 정의한 매핑의 이름과 실제 실행될 C++ 함수를 연결합니다.

```cpp
// AMyPawn.cpp

void AMyPawn::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);

    // "Jump" 액션이 눌렸을 때(IE_Pressed), 이 객체의 Jump 함수를 호출하도록 바인딩합니다.
    PlayerInputComponent->BindAction("Jump", IE_Pressed, this, &AMyPawn::Jump);

    // "MoveForward" 축의 값이 변경될 때마다, 이 객체의 MoveForward 함수를 호출하도록 바인딩합니다.
    PlayerInputComponent->BindAxis("MoveForward", this, &AMyPawn::MoveForward);
}

void AMyPawn::Jump()
{
    // 점프 로직 구현
}

void AMyPawn::MoveForward(float Value)
{
    // 전후 이동 로직 구현
}
```
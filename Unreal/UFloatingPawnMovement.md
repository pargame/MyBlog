---
---
> **중력의 영향을 받지 않고 자유롭게 공간을 떠다니는 [[APawn]]을 위한 '이동 엔진'입니다.** 주로 비행기, 우주선, 유령, 관전 카메라(Spectator)처럼 땅에 발을 붙이지 않는 캐릭터를 구현하는 데 사용됩니다.

### **1. 주요 역할 및 책임**
> `UFloatingPawnMovement`는 지면과의 상호작용 없이, 입력을 받아 3D 공간을 자유롭게 이동시키는 로직을 전담합니다.
* **자유로운 이동 (Free Movement):**
    중력의 영향을 받지 않고 3D 공간의 모든 방향으로 이동할 수 있는 기능을 제공합니다.
* **입력 처리 (Input Handling):**
    [[APawn]]의 `AddMovementInput`이나 `AddInputVector`를 통해 받은 입력을 실제 이동으로 변환합니다.
* **감속 및 마찰 (Deceleration & Friction):**
    입력이 없을 때 부드럽게 멈추도록 속도를 점차 줄이는 감속 기능을 제공하여 움직임을 자연스럽게 만듭니다.

### **2. 핵심 함수 및 속성**
* **`MaxSpeed`:**
    이동할 수 있는 최대 속도를 제한합니다. (예: 2000.0)
* **`Acceleration`:**
    최대 속도에 도달하기까지의 가속도입니다. 값이 클수록 더 빨리 최고 속도에 도달합니다.
* **`Deceleration`:**
    입력이 없을 때 감속되는 정도입니다. 값이 클수록 더 빨리 멈춥니다.
* **`AddInputVector(FVector WorldDirection, float ScaleValue)`:
    월드 좌표계 기준으로 특정 방향으로 이동 입력을 추가합니다. 이 입력은 매 프레임마다 누적되어 최종 이동 방향을 결정합니다.
* **`UpdatedComponent`:**
    이 무브먼트 컴포넌트가 실제로 움직일 대상 컴포넌트입니다. 보통 [[APawn]]의 루트 컴포넌트(예: [[UCapsuleComponent]], [[UStaticMeshComponent]])가 됩니다.

### **3. 관련 클래스**
* **[[APawn]]:**
    [[AController]]에 의해 제어될 수 있는 액터의 기본 클래스입니다. `UFloatingPawnMovement`는 보통 [[APawn]] 또는 그 자식 클래스 안에서 사용됩니다.
* **`SpectatorPawn`:**
    플레이어가 월드를 자유롭게 돌아다니며 관전할 때 사용되는 기본 폰으로, `UFloatingPawnMovement`를 핵심 이동 컴포넌트로 사용합니다.
* **[[UCharacterMovementComponent]]:**
    중력, 점프, 걷기 등 복잡한 지면 이동을 처리하는 컴포넌트로, `UFloatingPawnMovement`와는 상반된 역할을 합니다.
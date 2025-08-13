---
---

> **입력 [[Event]]가 '언제' 액션으로 처리될지를 결정하는 '방아쇠'입니다.** 단순히 키를 누르는 것뿐만 아니라, 짧게 탭하기, 길게 누르기, 두 번 누르기 등 복잡한 입력 패턴을 감지하여, 같은 키라도 다른 방식으로 누르면 다른 행동이 일어나도록 만드는 핵심적인 규칙입니다.

### **1. 주요 역할 및 책임**
> `UInputTrigger`는 원시 입력(Raw Input)과 [[UInputAction]]의 발동 사이에서, 시간과 입력 상태를 분석하여 발동 시점을 결정하는 필터 역할을 합니다.
* **발동 조건 정의 (Defining Firing Conditions):** 입력이 어떤 상태에 도달했을 때 [[UInputAction]]의 `Triggered` [[Event]]를 발생시킬지 결정합니다. 예를 들어, `Pressed` 트리거는 키가 눌리는 바로 그 순간에, `Held` 트리거는 일정 시간 이상 키를 누르고 있을 때 발동합니다.
* **입력 상태 관리 (Managing Input States):** 트리거는 내부적으로 입력의 여러 상태(`Ongoing`, `Triggered`, `Completed`)를 관리합니다.
    * **`Ongoing`:** 트리거의 조건이 충족되는 과정에 있는 상태입니다. (예: `Hold` 트리거의 경우, 키를 누르고 있는 동안)
    * **`Triggered`:** 트리거의 조건이 완전히 충족되어 액션을 발동시키는 상태입니다. 이 상태에서 바인딩된 함수가 호출됩니다.
    * **`Completed`:** 액션이 완료된 상태입니다. (예: `Hold` 트리거의 경우, 키에서 손을 뗐을 때)
* **조합을 통한 복잡한 패턴 구현 (Implementing Complex Patterns through Combination):** 하나의 매핑에 여러 `UInputTrigger`를 조합하여 더 복잡한 입력 로직을 만들 수 있습니다. 예를 들어, `Tap`과 `Hold`를 함께 사용하여 짧게 누르면 '구르기', 길게 누르면 '달리기'가 되도록 구현할 수 있습니다.

### **2. 주요 기본 트리거 종류**
> [[Enhanced Input System]]은 자주 사용되는 여러 종류의 트리거를 기본으로 제공합니다.
* **[[UInputTrigger]] `Pressed`:**
	키가 눌리는 바로 그 프레임에 `Triggered` 상태가 됩니다. 가장 기본적인 트리거입니다.
* **[[UInputTrigger]] `Released`:**
      눌렀던 키에서 손을 떼는 바로 그 프레임에 `Triggered` 상태가 됩니다.
* **[[UInputTrigger]] `Held`:**
      지정된 시간(`Hold Time Threshold`) 이상으로 키를 계속 누르고 있으면 `Triggered` 상태가 됩니다.
* **[[UInputTrigger]] `Tap`:**
      키를 눌렀다가 지정된 시간(`Tap Speed Threshold`) 안에 떼면 `Triggered` 상태가 됩니다.
* **[[UInputTrigger]] `Pulse`:**
      키를 누르고 있는 동안, 지정된 시간 간격(`Interval`)마다 반복적으로 `Triggered` 상태가 됩니다. (예: 자동 연사)
* **[[UInputTrigger]] `Chorded Action`:**
      다른 [[UInputAction]]이 활성화되어 있는 상태에서 이 키를 눌러야만 `Triggered` 상태가 됩니다. (예: `Shift` 키를 누른 상태에서 클릭)

### **3. 사용 방법**
> `UInputTrigger`는 [[UInputMappingContext]] 애셋 안에서, 특정 키 매핑의 Triggers 배열에 추가하여 사용합니다. 개발자는 원하는 트리거를 선택하고, 필요에 따라 세부 속성(예: `Hold Time`)을 조정하기만 하면 됩니다. 별도의 코딩 없이도 복잡한 입력 패턴을 쉽게 구현할 수 있습니다.

---
title: 'FSlateColor'
date: '2025-08-17T16:17:41+09:00'
---
> **UMG/Slate UI에서 사용되는 '색상'을 나타내는 구조체입니다.** 단순한 색상 값을 넘어, 특정 상태(예: 비활성화, 마우스 오버)에 따라 다른 색상을 사용하거나, [[UObject]]의 속성에 색상을 바인딩하는 등 동적인 색상 표현을 지원합니다.

### **1. 주요 역할 및 책임**
> **위젯의 텍스트 색상, 배경색, 테두리 색 등 UI 요소의 색상을 정의합니다.**
* **UI 색상 지정**:
	위젯의 텍스트 색상, 배경색, 테두리 색 등 UI 요소의 색상을 정의합니다.
* **상태 기반 색상 변경**:
	위젯의 상태(예: Enabled, Disabled, Hovered)에 따라 다른 색상을 지정할 수 있는 기능을 제공합니다.
* **데이터 바인딩 지원**:
	색상 값을 다른 변수나 함수에 바인딩하여, 런타임에 동적으로 색상이 변경되도록 할 수 있습니다.

### **2. 핵심 속성**
> **지정된 색상 값입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`SpecifiedColor` (`FLinearColor`)**:
	지정된 색상 값입니다. RGBA(빨강, 초록, 파랑, 알파) 값을 가집니다.
* **`ColorUseRule` (`ESlateColorStylingMode::Type`)**:
	색상을 어떻게 사용할지를 결정하는 규칙입니다.
    * **`UseColor_Specified`**:
    	`SpecifiedColor`에 지정된 색상을 항상 사용합니다.
    * **`UseColor_Foreground`**:
    	위젯의 전경색(Foreground Color)을 상속받아 사용합니다.
    * **`UseColor_Hover`**:
    	마우스가 올라왔을 때의 색상을 사용합니다.
    * **`UseColor_Disabled`**:
    	비활성화 상태일 때의 색상을 사용합니다.

### **3. 사용 방법**
> **UMG 위젯의 'Details' 패널에 있는 색상 속성(예: [[UTextBlock]]의 `Color and Opacity`)에서 `FSlateColor` 값을 직접 설정할 수 있습니다.**
*   **에디터에서**:
	UMG 위젯의 'Details' 패널에 있는 색상 속성(예: [[UTextBlock]]의 `Color and Opacity`)에서 `FSlateColor` 값을 직접 설정할 수 있습니다. 색상 피커를 사용하거나, `ColorUseRule`을 변경하여 상속 규칙을 지정할 수 있습니다.
*   **C++에서**:
	`FSlateColor` 변수를 선언하고, 생성자에 `FLinearColor` 값을 전달하여 생성할 수 있습니다.
    ```cpp
    // 빨간색으로 FSlateColor 생성
    FSlateColor MyRedColor(FLinearColor::Red);
    ```

### **4. 관련 클래스 및 구조체**
> **RGBA 각 채널이 0.0에서 1.0 사이의 `float` 값으로 표현되는, 언리얼 엔진의 기본적인 색상 구조체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **`FLinearColor`**:
	RGBA 각 채널이 0.0에서 1.0 사이의 `float` 값으로 표현되는, 언리얼 엔진의 기본적인 색상 구조체입니다.
* **`FColor`**:
	RGBA 각 채널이 0에서 255 사이의 `uint8` 값으로 표현되는 색상 구조체입니다. `FLinearColor`와 상호 변환이 가능합니다.
* **[[UWidget]]**:
	대부분의 위젯은 외형을 결정하는 속성으로 `FSlateColor`를 사용합니다.

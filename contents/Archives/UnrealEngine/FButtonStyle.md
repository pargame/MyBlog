---
title: 'FButtonStyle'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UButton]] 위젯의 시각적 외형을 정의하는 스타일 구조체입니다.** 버튼이 평소(Normal), 마우스 오버(Hovered), 눌렸을 때(Pressed), 비활성화(Disabled) 상태일 때 각각 어떻게 보일지를 결정하는 이미지와 색상, 여백 등의 정보를 담고 있습니다.

### **1. 주요 역할 및 책임**
> **버튼의 각 상호작용 상태에 맞는 시각적 스타일을 지정하여 사용자에게 직관적인 피드백을 제공합니다.**
* **상태별 외형 정의 (State-Specific Appearance)**:
	버튼의 각 상호작용 상태에 맞는 시각적 스타일을 지정하여 사용자에게 직관적인 피드백을 제공합니다.
* **스타일 재사용 (Style Reusability)**:
	`FButtonStyle`을 [[USlateWidgetStyleAsset]]에 담아두면, 여러 버튼 위젯에서 동일한 스타일을 공유하여 일관된 UI 디자인을 유지할 수 있습니다.
* **데이터 기반 디자인 (Data-Driven Design)**:
	코드를 변경하지 않고 에디터에서 `FButtonStyle`의 속성을 수정하여 버튼의 외형을 쉽게 변경할 수 있습니다.

### **2. 핵심 속성**
> **버튼이 평상시 상태일 때의 이미지나 배경 스타일입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Normal` (`FSlateBrush`)**:
	버튼이 평상시 상태일 때의 이미지나 배경 스타일입니다.
* **`Hovered` (`FSlateBrush`)**:
	마우스 커서가 버튼 위에 올라왔을 때의 스타일입니다.
* **`Pressed` (`FSlateBrush`)**:
	사용자가 버튼을 클릭하고 있는 동안의 스타일입니다.
* **`Disabled` (`FSlateBrush`)**:
	버튼이 비활성화되었을 때의 스타일입니다.
* **`NormalPadding`, `PressedPadding`**:
	각 상태일 때 버튼 내부 콘텐츠의 여백을 설정합니다.
* **`PressedSound`, `HoveredSound`**:
	각 상호작용 시 재생할 [[USoundBase]] 에셋을 지정합니다.

### **3. 사용 방법**
> **1.**
1.  [[UButton]] 위젯의 'Details' 패널에서 'Style' 항목을 펼칩니다.
2.  `FButtonStyle`의 각 속성(`Normal`, `Hovered` 등)에 [[FSlateBrush]]를 설정합니다. `FSlateBrush`는 `Image`에 텍스처를 지정하고, `Draw As`를 통해 렌더링 방식을 결정하며, `TintColor`로 색상을 변경할 수 있습니다.
3.  또는, `USlateWidgetStyleAsset`을 생성하고 그 안에 `FButtonStyle`을 정의한 뒤, 버튼의 'Style' 속성에서 해당 에셋을 직접 참조할 수도 있습니다.

### **4. 관련 클래스 및 구조체**
> **이 스타일을 사용하는 UMG 위젯입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UButton]]**:
	이 스타일을 사용하는 UMG 위젯입니다.
* **[[FSlateBrush]]**:
	UI 요소의 이미지를 어떻게 그릴지 정의하는 핵심 구조체입니다.
* **[[USlateWidgetStyleAsset]]**:
	`FButtonStyle`과 같은 스타일 구조체를 에셋으로 만들어 재사용할 수 있게 해주는 컨테이너 클래스입니다.
* **[[USoundBase]]**:
	버튼 상호작용 시 재생할 사운드 에셋입니다.

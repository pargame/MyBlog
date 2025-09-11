---
title: 'FSlateBrush'
date: '2025-08-17T16:17:41+09:00'
---
> **UMG나 Slate UI에서 하나의 '이미지' 또는 '그리기 요소'를 어떻게 렌더링할지 정의하는 핵심 구조체입니다.** 단순히 텍스처를 표시하는 것을 넘어, 색상을 입히고, 9분할(Box), 테두리(Border) 등 다양한 방식으로 이미지를 변형하여 UI를 구성하는 데 사용됩니다.

### **1. 주요 역할 및 책임**
> **표시할 `UObject` (주로 [[UTexture2D]]나 `UMaterialInterface`)를 지정합니다.**
* **이미지 리소스 지정 (Specifying Image Resource)**:
	표시할 `UObject` (주로 [[UTexture2D]]나 `UMaterialInterface`)를 지정합니다.
* **렌더링 방식 결정 (Determining Draw Mode)**:
	`Draw As` 속성을 통해 이미지를 어떻게 그릴지 결정합니다. (예: 단순 이미지, 9분할 박스, 테두리 등)
* **외형 커스터마이징 (Customizing Appearance)**:
	`TintColor`로 색상을 변경하고, `Margin`으로 9분할 영역을 설정하며, `Tiling`으로 이미지를 반복 방식으로 배열하는 등 다양한 시각적 속성을 제공합니다.

### **2. 핵심 속성**
> **그릴 대상이 되는 에셋을 지정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Resource Object`**:
	그릴 대상이 되는 에셋을 지정합니다. 주로 [[UTexture2D]]가 사용됩니다.
* **`Image Size`**:
	리소스가 그려질 크기를 픽셀 단위로 지정합니다. `0, 0`이면 리소스의 원본 크기를 사용합니다.
* **`Draw As` (`ESlateBrushDrawType`)**:
	*   `Image`: 이미지를 지정된 크기로 그대로 그립니다.
    *   `Box`:
	`Margin` 속성으로 정의된 9분할 영역을 사용하여, 코너는 고정하고 엣지와 중앙은 늘려서 크기에 맞춰 그립니다. 버튼 배경에 주로 사용됩니다.
    *   `Border`:
	`Margin`으로 정의된 테두리만 그립니다.
    *   `NoDraw`:
	아무것도 그리지 않습니다.
* **`Margin` (`FMargin`)**:
	`Draw As`가 `Box`나 `Border`일 때, 9분할을 위한 경계선을 정의합니다. (0~1 사이의 비율 값)
* **`TintColor` (`FSlateColor`)**:
	이미지에 적용되는 색상입니다. 흰색 이미지에 `TintColor`를 사용하면 원하는 색상의 UI 요소를 쉽게 만들 수 있습니다.
* **`Tiling` (`ESlateBrushTileType`)**:
	이미지를 반복 방식으로 배열할지 여부와 방식을 결정합니다.

### **3. 사용 예시**
> **`Brush` 속성에 `FSlateBrush`를 설정하여 이미지를 표시합니다.**
* **[[UImage]] 위젯**:
	`Brush` 속성에 `FSlateBrush`를 설정하여 이미지를 표시합니다.
* **[[UButton]] 스타일**:
	`FButtonStyle` 내부의 `Normal`, `Hovered` 등의 상태에 각각 `FSlateBrush`를 설정하여 버튼의 외형을 만듭니다.
* **[[UProgressBar]] 스타일**:
	`FProgressBarStyle`의 `BackgroundImage`, `FillImage` 등에 `FSlateBrush`를 사용합니다.

### **4. 관련 클래스 및 구조체**
> **`FSlateBrush`가 주로 사용하는 이미지 리소스입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UTexture2D]]**:
	`FSlateBrush`가 주로 사용하는 이미지 리소스입니다.
* **`FButtonStyle`, `FProgressBarStyle` 등**:
	다양한 위젯의 스타일 구조체 내부에서 `FSlateBrush`를 멤버 변수로 가집니다.

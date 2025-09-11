---
title: 'FSliderStyle'
date: '2025-08-17T16:17:41+09:00'
---
> **[[USlider]] 위젯의 시각적 외형을 정의하는 스타일 구조체입니다.** 슬라이더의 배경 바(Bar), 손잡이(Thumb), 그리고 각 상태별 모양을 결정하는 이미지와 색상 정보를 담고 있습니다.

### **1. 주요 역할 및 책임**
> **슬라이더의 각 부분(바, 손잡이)이 평소 상태와 비활성화 상태일 때 어떻게 보일지를 지정합니다.**
* **슬라이더 외형 정의 (Slider Appearance Definition)**:
	슬라이더의 각 부분(바, 손잡이)이 평소 상태와 비활성화 상태일 때 어떻게 보일지를 지정합니다.
* **스타일 재사용 (Style Reusability)**:
	`FSliderStyle`을 [[USlateWidgetStyleAsset]]에 담아두면, 여러 슬라이더 위젯에서 동일한 스타일을 공유하여 일관된 UI 디자인을 유지할 수 있습니다.
* **데이터 기반 디자인 (Data-Driven Design)**:
	코드를 변경하지 않고 에디터에서 `FSliderStyle`의 속성을 수정하여 슬라이더의 외형을 쉽게 변경할 수 있습니다.

### **2. 핵심 속성**
> **슬라이더의 배경이 되는 바(Bar)의 평상시 스타일입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`NormalBarImage` (`FSlateBrush`)**:
	슬라이더의 배경이 되는 바(Bar)의 평상시 스타일입니다.
* **`DisabledBarImage` (`FSlateBrush`)**:
	슬라이더가 비활성화되었을 때의 바 스타일입니다.
* **`NormalThumbImage` (`FSlateBrush`)**:
	사용자가 드래그하는 손잡이(Thumb)의 평상시 스타일입니다.
* **`DisabledThumbImage` (`FSlateBrush`)**:
	슬라이더가 비활성화되었을 때의 손잡이 스타일입니다.
* **`BarThickness`**:
	슬라이더 바의 두께를 픽셀 단위로 지정합니다.
* **`StepSize`**:
	슬라이더 값을 불연속적으로(스냅되도록) 변경할 때의 단계 크기입니다. `0`이면 부드럽게 움직입니다.

### **3. 사용 방법**
> **1.**
1.  [[USlider]] 위젯의 'Details' 패널에서 'Style' 항목을 누릅니다.
2.  `FSliderStyle`의 각 속성(`NormalBarImage`, `NormalThumbImage` 등)에 [[FSlateBrush]]를 설정합니다.
3.  또는, `USlateWidgetStyleAsset`을 생성하고 그 안에 `FSliderStyle`을 정의한 뒤, 슬라이더의 'Style' 속성에서 해당 에셋을 직접 참조할 수도 있습니다.

### **4. 관련 클래스 및 구조체**
> **이 스타일을 사용하는 UMG 위젯입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[USlider]]**:
	이 스타일을 사용하는 UMG 위젯입니다.
* **[[FSlateBrush]]**:
	UI 요소의 이미지를 어떻게 그릴지 정의하는 핵심 구조체입니다.
* **[[USlateWidgetStyleAsset]]**:
	`FSliderStyle`과 같은 스타일 구조체를 에셋으로 만들어 재사용할 수 있게 해주는 컨테이너 클래스입니다.

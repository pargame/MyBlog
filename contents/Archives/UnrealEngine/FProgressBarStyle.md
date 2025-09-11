---
title: 'FProgressBarStyle'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UProgressBar]] 위젯의 시각적 외형을 정의하는 스타일 구조체입니다.** 프로그레스 바의 배경, 채워지는 부분(Fill), 테두리(Marquee) 이미지를 지정하고, 전체적인 스타일을 결정합니다.

### **1. 주요 역할 및 책임**
> **HP 바, 경험치 바, 로딩 바 등 다양한 프로그레스 바의 시각적 요소를 상태별로 정의합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **프로그레스 바 외형 정의 (ProgressBar Appearance Definition)**:
	HP 바, 경험치 바, 로딩 바 등 다양한 프로그레스 바의 시각적 요소를 상태별로 정의합니다.
* **스타일 재사용 (Style Reusability)**:
	`FProgressBarStyle`을 [[USlateWidgetStyleAsset]]에 담아두면, 여러 프로그레스 바 위젯에서 동일한 스타일을 공유하여 일관된 UI 디자인을 유지할 수 있습니다.
* **데이터 기반 디자인 (Data-Driven Design)**:
	코드를 변경하지 않고 에디터에서 `FProgressBarStyle`의 속성을 수정하여 프로그레스 바의 외형을 쉽게 변경할 수 있습니다.

### **2. 핵심 속성**
> **프로그레스 바의 배경이 되는 이미지 스타일입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`BackgroundImage` (`FSlateBrush`)**:
	프로그레스 바의 배경이 되는 이미지 스타일입니다. 바가 비어있을 때 보이는 부분입니다.
* **`FillImage` (`FSlateBrush`)**:
	진행률에 따라 채워지는 부분의 이미지 스타일입니다.
* **`MarqueeImage` (`FSlateBrush`)**:
	프로그레스 바가 '미정(Indeterminate)' 상태일 때(예: 로딩 상태를 알 수 없을 때) 표시되는, 좌우로 움직이는 테두리 이미지 스타일입니다.
* **`EnableFillAnimation`**:
	값이 변경될 때 부드러운 애니메이션을 사용할지 여부입니다.
* **`FillAnimationSpeed`**:
	채우기 애니메이션의 속도를 조절합니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  [[UProgressBar]] 위젯의 'Details' 패널에서 'Style' 항목을 펼칩니다.
2.  `FProgressBarStyle`의 각 속성(`BackgroundImage`, `FillImage` 등)에 [[FSlateBrush]]를 설정합니다. `FSlateBrush`는 `Image`에 텍스처를 지정하고, `Image Size`를 조절하며, `TintColor`로 색상을 변경할 수 있습니다.
3.  또는, `USlateWidgetStyleAsset`을 생성하고 그 안에 `FProgressBarStyle`을 정의한 뒤, 프로그레스 바의 'Style' 속성에서 해당 에셋을 직접 참조할 수도 있습니다.

### **4. 관련 클래스 및 구조체**
> **이 스타일을 사용하는 UMG 위젯입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UProgressBar]]**:
	이 스타일을 사용하는 UMG 위젯입니다.
* **[[FSlateBrush]]**:
	UI 요소의 이미지를 어떻게 그릴지 정의하는 핵심 구조체입니다.
* **[[USlateWidgetStyleAsset]]**:
	`FProgressBarStyle`과 같은 스타일 구조체를 에셋으로 만들어 재사용할 수 있게 해주는 컨테이너 클래스입니다.

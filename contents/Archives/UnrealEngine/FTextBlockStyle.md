---
title: 'FTextBlockStyle'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UTextBlock]] 위젯의 전체적인 시각적 외형을 정의하는 스타일 구조체입니다.** 폰트, 색상, 그림자 등 텍스트 블록의 모든 외형 관련 속성을 하나로 묶어 관리합니다.

### **1. 주요 역할 및 책임**
> **[[UTextBlock]]의 모든 시각적 요소를 한 곳에서 정의하여 일관된 스타일을 적용할 수 있습니다.**
* **텍스트 블록 외형 정의**:
	[[UTextBlock]]의 모든 시각적 요소를 한 곳에서 정의하여 일관된 스타일을 적용할 수 있습니다.
* **스타일 재사용 (Style Reusability)**:
	`FTextBlockStyle`을 [[USlateWidgetStyleAsset]]에 담아두면, 여러 [[UTextBlock]] 위젯에서 동일한 스타일을 공유하여 프로젝트 전체의 텍스트 스타일 통일성을 높일 수 있습니다.
* **데이터 기반 디자인 (Data-Driven Design)**:
	코드를 변경하지 않고 에디터에서 `FTextBlockStyle`의 속성을 수정하여 텍스트의 외형을 쉽게 변경할 수 있습니다.

### **2. 핵심 속성**
> **텍스트에 사용할 폰트 에셋, 크기, 외곽선 등을 정의합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Font` (`FSlateFontInfo`)**:
	텍스트에 사용할 폰트 에셋, 크기, 외곽선 등을 정의합니다.
* **`ColorAndOpacity` (`FSlateColor`)**:
	텍스트의 색상과 투명도를 지정합니다.
* **`ShadowOffset` (`FVector2D`)**:
	텍스트의 그림자가 텍스트로부터 얼마나 떨어져 있을지를 X, Y 오프셋으로 지정합니다.
* **`ShadowColorAndOpacity` (`FLinearColor`)**:
	그림자의 색상과 투명도를 지정합니다.
* **`HighlightColor` (`FSlateColor`)**:
	텍스트가 하이라이트될 때의 색상입니다.
* **`HighlightShape` (`FSlateBrush`)**:
	하이라이트될 때 텍스트 뒤에 그려질 배경 브러시입니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  [[UTextBlock]] 위젯의 'Details' 패널에서 'Appearance' > 'Style' 항목을 찾습니다.
2.  드롭다운 메뉴에서 [[USlateWidgetStyleAsset]]을 선택하거나, 구조체를 직접 눌러 `FTextBlockStyle`의 각 속성(`Font`, `ColorAndOpacity` 등)을 개별적으로 설정합니다.
3.  가장 일반적인 방법은 `USlateWidgetStyleAsset`을 생성하고 그 안에 `FTextBlockStyle`을 정의한 뒤, 여러 [[UTextBlock]]에서 해당 에셋을 공유하는 것입니다.

### **4. 관련 클래스 및 구조체**
> **이 스타일을 사용하는 UMG 위젯입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UTextBlock]]**:
	이 스타일을 사용하는 UMG 위젯입니다.
* **[[FSlateFontInfo]]**:
	폰트 관련 스타일을 정의하는 구조체입니다.
* **[[FSlateColor]]**:
	UI 색상을 정의하는 구조체입니다.
* **[[USlateWidgetStyleAsset]]**:
	`FTextBlockStyle`을 에셋으로 만들어 재사용할 수 있게 해주는 컨테이너 클래스입니다.

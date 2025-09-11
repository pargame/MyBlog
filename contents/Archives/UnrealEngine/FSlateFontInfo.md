---
title: 'FSlateFontInfo'
date: '2025-08-17T16:17:41+09:00'
---
> **UMG나 Slate UI에서 텍스트의 '글꼴(Font)'과 관련된 모든 시각적 속성을 정의하는 구조체입니다.** 사용할 폰트 에셋, 크기, 외곽선, 그림자 등 텍스트 렌더링에 필요한 정보를 담고 있습니다.

### **1. 주요 역할 및 책임**
> **텍스트를 렌더링하는 데 사용할 `UFont` 에셋을 지정합니다.**
* **폰트 에셋 지정 (Specifying Font Asset)**:
	텍스트를 렌더링하는 데 사용할 `UFont` 에셋을 지정합니다.
* **텍스트 외형 정의 (Defining Text Appearance)**:
	글자의 크기, 렌더링 재질, 외곽선, 그림자 등 텍스트의 상세한 시각적 스타일을 결정합니다.
* **스타일 재사용 (Style Reusability)**:
	`FSlateFontInfo`를 [[UTextBlock]]이나 다른 텍스트 기반 위젯에서 직접 설정하거나, 스타일 에셋에 포함시켜 여러 위젯에서 일관된 폰트 스타일을 유지할 수 있습니다.

### **2. 핵심 속성**
> **사용할 `UFont` 에셋을 지정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Font Object`**:
	사용할 `UFont` 에셋을 지정합니다. `UFont` 에셋은 TTF나 OTF 같은 폰트 파일을 임포트하여 만들 수 있습니다.
* **`Size`**:
	폰트의 크기를 포인트 단위로 지정합니다.
* **`Material`**:
	텍스트를 렌더링하는 데 사용할 `UMaterialInterface`를 지정할 수 있습니다. 이를 통해 텍스트에 특수한 시각 효과를 적용할 수 있습니다.
* **`OutlineSettings` (`FFontOutlineSettings`)**:
	텍스트 외곽선에 대한 설정을 담고 있습니다.
    *   `OutlineSize`:
	외곽선의 두께입니다.
    *   `OutlineColor`:
	외곽선의 색상입니다.
* **`TypefaceFontName`**:
	`UFont` 에셋이 여러 타입페이스(예: Regular, Bold, Italic)를 포함할 경우, 사용할 특정 타입페이스의 이름을 지정합니다.

### **3. 사용 예시**
> **'Details' 패널의 'Appearance' > 'Font' 항목에서 `FSlateFontInfo`의 속성들을 직접 설정하여 텍스트의 스타일을 변경합니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
* **[[UTextBlock]] 위젯**:
	'Details' 패널의 'Appearance' > 'Font' 항목에서 `FSlateFontInfo`의 속성들을 직접 설정하여 텍스트의 스타일을 변경합니다.
* **[[FTextBlockStyle]]**:
	텍스트 블록의 전체적인 스타일을 정의하는 구조체로, `FSlateFontInfo`를 멤버로 포함하여 폰트 스타일을 지정합니다.

### **4. 관련 클래스 및 구조체**
> **실제 폰트 파일 정보를 담고 있는 에셋입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **`UFont`**:
	실제 폰트 파일 정보를 담고 있는 에셋입니다.
* **[[UTextBlock]]**:
	화면에 텍스트를 표시하는 가장 기본적인 UMG 위젯입니다.
* **[[FTextBlockStyle]]**:
	[[UTextBlock]]의 색상, 그림자, 폰트 등 전체적인 스타일을 정의하는 구조체입니다.

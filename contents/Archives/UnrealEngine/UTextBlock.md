---
title: 'UTextBlock'
date: '2025-08-17T16:17:41+09:00'
---
> **화면에 텍스트를 표시하는 가장 기본적인 위젯입니다.** UI의 라벨, 설명, 대화 내용, 디버그 정보 등 게임에 등장하는 거의 모든 글자는 이 `UTextBlock`을 통해 렌더링됩니다.

### **1. 주요 역할 및 책임**
> **`Text` 속성에 할당된 문자열을 화면에 표시합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **텍스트 렌더링 (Text Rendering)**:
	`Text` 속성에 할당된 문자열을 화면에 표시합니다.
* **외형 서식 지정 (Appearance Formatting)**:
	폰트(Font), 색상(Color), 정렬(Justification), 여백(Margin) 등 텍스트의 외형과 관련된 다양한 서식을 지정할 수 있습니다.
* **데이터 바인딩 (Data Binding)**:
	가장 강력한 기능 중 하나로, `Text` 속성을 게임플레이 변수(예: 플레이어의 현재 체력, 점수)나 함수에 직접 바인딩할 수 있습니다. 이를 통해 코드에서 변수 값이 바뀔 때마다 UI 텍스트가 자동으로 업데이트되도록 만들 수 있습니다.

### **2. 핵심 속성**
> **화면에 표시할 실제 텍스트 내용입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Text`**:
	화면에 표시할 실제 텍스트 내용입니다. 직접 입력하거나, `Bind` 기능을 사용하여 함수에 연결할 수 있습니다.
* **`Color and Opacity`**:
	텍스트의 색상과 투명도를 설정합니다.
* **`Font` (`FSlateFontInfo`)**:
	사용할 폰트 애셋, 크기, 외곽선 등을 포함하는 폰트 정보를 설정합니다.
* **`Justification`**:
	여러 줄의 텍스트일 경우 정렬 방식을 결정합니다. (왼쪽, 가운데, 오른쪽)
* **`AutoWrapText`**:
	`true`로 설정하면, 텍스트가 위젯의 폭을 넘어갈 때 자동으로 줄바꿈을 합니다.

### **3. 사용 방법**
> **1.**
1.  **위젯 블루프린트 추가**:
	[[UUserWidget]]의 디자이너 탭에서, 팔레트의 `Text`를 캔버스나 다른 패널로 드래그 앤 드롭합니다.
2.  **내용 및 서식 설정**:
	디테일 패널의 `Content` > `Text` 필드에 원하는 문자열을 입력합니다. `Appearance` 섹션에서 폰트, 색상, 크기 등을 조절합니다.
3.  **데이터 바인딩 (선택 사항)**:
	`Text` 속성 옆의 `Bind` 드롭다운을 클릭하고 `Create Binding`을 선택하여, 텍스트를 동적으로 업데이트하는 함수를 그래프에 생성합니다. 이 함수는 매 프레임 호출되며, 여기서 반환하는 문자열이 화면에 표시됩니다.

```cpp
// C++ 코드에서 TextBlock의 텍스트를 변경하는 예시

// UPROPERTY로 위젯 블루프린트의 TextBlock에 대한 참조를 만듭니다. (Meta = (BindWidget))
UPROPERTY(meta = (BindWidget))
UTextBlock* ScoreText;

void UMyHUDWidget::UpdateScore(int32 NewScore)
{
    if (ScoreText)
    {
        FString ScoreString = FString::Printf(TEXT("Score: %d"), NewScore);
        ScoreText->SetText(FText::FromString(ScoreString));
    }
}
```

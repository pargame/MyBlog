---
title: 'UButton'
date: '2025-08-17T16:17:41+09:00'
---
> **플레이어가 클릭할 수 있는 가장 기본적인 상호작용 위젯입니다.** 메뉴 선택, 확인/취소, 액션 실행 등 UI에서 사용자의 클릭 [[Event]]에 반응하는 모든 곳에 사용되는 핵심적인 [[UWidget]]입니다.

### **1. 주요 역할 및 책임**
> **사용자가 버튼 영역을 마우스로 클릭하거나 터치했을 때, `OnClicked`, `OnPressed`, `OnReleased`와 같은 핵심적인 [[Event]]를 발생시킵니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **클릭 이벤트 처리 (Handling Click Events)**:
	사용자가 버튼 영역을 마우스로 클릭하거나 터치했을 때, `OnClicked`, `OnPressed`, `OnReleased`와 같은 핵심적인 [[Event]]를 발생시킵니다. 개발자는 이 [[Event]]에 자신의 로직을 바인딩하여 버튼의 동작을 구현합니다.
* **시각적 상태 표현 (Visual State Representation)**:
	버튼의 상태(`Normal`, `Hovered`, `Pressed`)에 따라 다른 외형(이미지, 색상)을 보여줄 수 있습니다. 이를 통해 사용자에게 버튼이 현재 어떤 상태인지 직관적으로 알려줍니다.
* **자식 위젯 포함 (Containing Child Widgets)**:
	`UButton`은 내부에 다른 위젯을 자식으로 가질 수 있습니다. 보통 [[UTextBlock]]을 넣어 버튼의 텍스트를 표시하거나, [[UImage]]를 넣어 아이콘을 표시하는 방식으로 사용됩니다.

### **2. 핵심 속성 및 이벤트**
> **버튼의 각 상태(`Normal`, `Hovered`, `Pressed`, `Disabled`)에 대한 외형을 정의하는 스타일 애셋입니다.**
* **`Style` ([[FButtonStyle]])**:
	버튼의 각 상태(`Normal`, `Hovered`, `Pressed`, `Disabled`)에 대한 외형을 정의하는 스타일 애셋입니다. 이미지, 틴트 색상, 패딩 등을 설정할 수 있습니다.
* **`OnClicked`**:
	사용자가 버튼을 눌렀다가 떼는 순간(클릭 완료)에 한 번 발생하는 가장 중요한 [[Event]]입니다.
* **`OnPressed`**:
	사용자가 버튼을 누르는 순간 발생하는 [[Event]]입니다.
* **`OnReleased`**:
	사용자가 눌렀던 버튼에서 손을 떼는 순간 발생하는 [[Event]]입니다.
* **`OnHovered` / `OnUnhovered`**:
	마우스 커서가 버튼 영역에 들어오거나 나갈 때 발생하는 [[Event]]입니다.

### **3. 사용 방법**
> **1.**
1.  **위젯 블루프린트 추가**:
	[[UUserWidget]]의 디자이너 탭에서, 팔레트의 `Button`을 캔버스나 다른 패널로 드래그 앤 드롭합니다.
2.  **자식 추가 (선택 사항)**:
	팔레트에서 [[UTextBlock]]이나 [[UImage]]를 방금 추가한 `UButton` 위로 드래그하여 자식으로 만듭니다.
3.  **외형 설정**:
	디테일 패널의 `Appearance` > `Style` 섹션에서 버튼의 상태별 이미지를 설정하거나, `Tint`로 색상을 변경합니다.
4.  **이벤트 바인딩**:
	디테일 패널의 `Events` 섹션에서 `OnClicked` 옆의 `+` 버튼을 눌러, 그래프에 해당 이벤트를 처리할 노드를 생성하고 원하는 로직을 연결합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[UUserWidget]] / [[UWidget]]:
	버튼을 배치·관리하는 컨테이너/기본 위젯.
* [[UTextBlock]] / [[UImage]]:
	버튼의 자식으로 자주 쓰이는 표시 위젯.
* [[FButtonStyle]]:
	버튼 외형을 정의하는 스타일 애셋.
* [[Event]] / [[Delegate]]:
	클릭 등 상호작용 신호 전달 메커니즘.

## 코드 예시
> **// 위젯 클래스에서 C++로 버튼 클릭 이벤트 바인딩 UPROPERTY(meta=(BindWidget)) UButton* StartButton;**
```cpp
// 위젯 클래스에서 C++로 버튼 클릭 이벤트 바인딩
UPROPERTY(meta=(BindWidget))
UButton* StartButton;

void UMyMenuWidget::NativeConstruct()
{
    Super::NativeConstruct();
    if (StartButton)
    {
        StartButton->OnClicked.AddDynamic(this, &UMyMenuWidget::HandleStartClicked);
    }
}

void UMyMenuWidget::HandleStartClicked()
{
    // 게임 시작 로직
}
```
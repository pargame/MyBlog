---
title: 'UGridPanel'
date: '2025-08-17T16:17:41+09:00'
---
> **자식 위젯들을 바둑판 같은 격자(Grid) 형태로 배치하는 강력한 컨테이너 위젯입니다.** 인벤토리, 스킬 창, 캐릭터 선택 화면 등 행(Row)과 열(Column)에 맞춰 아이템을 정렬해야 하는 복잡한 UI 레이아웃을 만드는 데 필수적입니다.

### **1. 주요 역할 및 책임**
> **자식 위젯들을 가상의 2D 그리드에 배치합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **격자 기반 레이아웃 (Grid-based Layout)**:
	자식 위젯들을 가상의 2D 그리드에 배치합니다. 각 자식은 자신이 속할 행과 열의 인덱스를 지정받습니다.
* **동적 행/열 추가 (Dynamic Row/Column Addition)**:
	런타임에 코드나 블루프린트를 통해 새로운 자식 위젯을 추가할 수 있으며, 필요에 따라 그리드의 행과 열도 동적으로 늘릴 수 있습니다.
* **크기 조절 (Sizing)**:
	각 행과 열의 크기를 `Fill`(채우기) 또는 `Auto` 모드로 설정하여, 내용물에 따라 크기가 자동으로 조절되거나 남은 공간을 균등하게 채우도록 만들 수 있습니다.

### **2. 핵심 개념**
> **`UGridPanel`에 추가되는 모든 자식 위젯은 `UGridSlot`이라는 특별한 슬롯 객체를 갖게 됩니다.**
* **`Grid Slot` ([[UGridSlot]])**:
	`UGridPanel`에 추가되는 모든 자식 위젯은 `UGridSlot`이라는 특별한 슬롯 객체를 갖게 됩니다. 이 슬롯에는 다음과 같은 중요한 정보가 포함됩니다.
    * **`Row` / `Column`**:
    	자식이 배치될 행과 열의 인덱스입니다.
    * **`Row Span` / `Column Span`**:
    	자식이 몇 개의 행이나 열을 차지할지(병합할지) 결정합니다.
    * **`HorizontalAlignment` / `VerticalAlignment`**:
    	할당된 셀 안에서 위젯을 어떻게 정렬할지 결정합니다.
    * **`Padding`**:
    	셀의 경계로부터 위젯까지의 여백을 설정합니다.

### **3. 사용 방법**
> **1.**
1.  **패널 추가**:
	[[UUserWidget]]의 디자이너 탭에서, 팔레트의 `Grid Panel`을 캔버스로 드래그 앤 드롭합니다.
2.  **자식 위젯 추가**:
	다른 위젯(예: [[UImage]], [[UButton]])을 `UGridPanel` 위로 드래그하여 자식으로 추가합니다.
3.  **슬롯 설정**:
	추가된 자식 위젯을 선택하고, 디테일 패널의 `Slot (Grid Slot)` 섹션에서 `Row`와 `Column` 값을 설정하여 원하는 위치에 배치합니다.
4.  **행/열 채우기 설정 (선택 사항)**:
	`UGridPanel` 자체를 선택하고, 디테일 패널의 `Fill Rules`에서 각 행과 열이 남은 공간을 어떻게 채울지에 대한 규칙을 설정할 수 있습니다.

```cpp
// C++ 코드에서 GridPanel에 동적으로 위젯을 추가하는 예시

UPROPERTY(meta = (BindWidget))
UGridPanel* MyGridPanel;

void UMyInventoryWidget::AddItem(UWidget* ItemWidget, int32 Row, int32 Column)
{
    if (MyGridPanel)
    {
        UGridSlot* GridSlot = MyGridPanel->AddChildToGrid(ItemWidget, Row, Column);
        if (GridSlot)
        {
            GridSlot->SetHorizontalAlignment(EHorizontalAlignment::HAlign_Center);
            GridSlot->SetVerticalAlignment(EVerticalAlignment::VAlign_Center);
        }
    }
}
```
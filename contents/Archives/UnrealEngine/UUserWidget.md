---
title: 'UUserWidget'
date: '2025-08-17T16:17:41+09:00'
---
> **화면에 표시되는 모든 UI의 기반이 되는 '위젯 블루프린트'의 실체입니다.** UMG(Unreal Motion Graphics)를 사용하여 만드는 모든 커스텀 UI는 이 `UUserWidget` 클래스를 상속받아 만들어지며, UI의 시각적 요소와 상호작용 로직을 모두 담는 컨테이너 역할을 합니다.

### **1. 주요 역할 및 책임**
> **버튼, 텍스트 블록, 이미지, 슬라이더 등 다양한 기본 위젯들을 담는 캔버스 역할을 합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **UI의 컨테이너 (Container for UI Elements)**:
	버튼, 텍스트 블록, 이미지, 슬라이더 등 다양한 기본 위젯들을 담는 캔버스 역할을 합니다. 디자이너 탭에서 이러한 위젯들을 시각적으로 배치하고 계층 구조를 만듭니다.
* **로직과 디자인의 결합 (Combining Logic and Design)**:
	위젯 블루프린트는 시각적인 디자인을 위한 '디자이너' 탭과, 상호작용 로직을 작성하기 위한 '그래프' 탭을 모두 가지고 있습니다. 이를 통해 UI의 모양과 동작을 한 곳에서 관리할 수 있습니다.
* **게임플레이 데이터 바인딩 (Binding to Gameplay Data)**:
	게임의 상태(예: 플레이어 체력, 남은 총알 수)를 UI에 표시하기 위해, 게임플레이 클래스의 변수나 함수에 위젯의 속성을 직접 바인딩하는 강력한 기능을 제공합니다.
* **이벤트 처리 (Handling Events)**:
	자신이 포함하는 위젯들로부터 발생하는 이벤트(예: 버튼의 `OnClicked`, 슬라이더의 `OnValueChanged`)를 받아서 처리하는 로직을 그래프에 작성할 수 있습니다.

### **2. 핵심 함수 (생명 주기)**
> **위젯이 처음 생성되고 월드에 추가될 때 한 번 호출됩니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`NativeConstruct`**:
	위젯이 처음 생성되고 월드에 추가될 때 한 번 호출됩니다. 액터의 `BeginPlay`와 유사한 역할을 하며, 필요한 변수를 초기화하거나 다른 객체의 델리게이트에 함수를 바인딩하는 등의 초기 설정 작업을 하기에 가장 좋은 장소입니다.
* **`NativeTick(const FGeometry& MyGeometry, float InDeltaTime)`**:
	위젯이 뷰포트에 표시되는 동안 매 프레임 호출됩니다. 액터의 `Tick`과 같으며, 시간에 따라 변하는 애니메이션이나 상태 업데이트 로직을 여기에 작성합니다.
* **`NativeDestruct`**:
	위젯이 뷰포트에서 제거되고 소멸될 때 호출됩니다. `Construct`에서 바인딩했던 델리게이트를 해제하는 등 정리 작업을 수행합니다.

### **3. 게임플레이와의 연동**
> **이 위젯을 생성한 [[APlayerController]]에 대한 참조를 가져옵니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`GetOwningPlayer()`**:
	이 위젯을 생성한 [[APlayerController]]에 대한 참조를 가져옵니다. 이를 통해 플레이어의 폰이나 다른 게임플레이 객체에 접근할 수 있습니다.
* **속성 바인딩 (Property Binding)**:
	디자이너 탭에서 위젯의 특정 속성(예: `TextBlock`의 `Text`, `ProgressBar`의 `Percent`) 옆에 있는 `Bind` 드롭다운 메뉴를 사용하여, C++ 또는 블루프린트 함수에 직접 연결할 수 있습니다. 이렇게 하면 함수가 반환하는 값으로 속성이 매 프레임 자동으로 업데이트됩니다.
* **이벤트 디스패처 (Event Dispatchers)**:
	위젯 내에서 특정 사건이 발생했을 때(예: '설정 적용' 버튼 클릭), 외부에 이를 알리는 자신만의 커스텀 이벤트를 만들고 호출할 수 있습니다.

### **4. 생성 및 표시**
> **1.**
1.  **생성 (Creation)**:
	[[APlayerController]]나 다른 UI 관련 클래스에서 `CreateWidget<T>(...)` 함수를 호출하여 위젯 블루프린트의 인스턴스를 생성합니다.
2.  **표시 (Display)**:
	생성된 위젯 인스턴스의 `AddToViewport(int32 ZOrder)` 함수를 호출하여 화면에 표시합니다. `ZOrder` 값이 높을수록 다른 위젯보다 위에 그려집니다.
3.  **제거 (Removal)**:
	`RemoveFromParent()` 함수를 호출하여 위젯을 화면에서 제거합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[APlayerController]]:
	위젯 생성/표시의 일반적 호출 지점.
* [[UWidget]] / [[UPanelWidget]]:
	모든 UI의 기본/컨테이너.
* [[UButton]] / [[UTextBlock]] / [[UImage]]:
	자주 사용하는 자식 위젯들.

## 코드 예시
> **// C++에서 위젯을 생성해 화면에 띄우고 제거하는 간단한 예시 #include "Blueprint/UserWidget.h"**
```cpp
// C++에서 위젯을 생성해 화면에 띄우고 제거하는 간단한 예시
#include "Blueprint/UserWidget.h"

UPROPERTY(EditAnywhere)
TSubclassOf<UUserWidget> StatusWidgetClass;

UUserWidget* Status = nullptr;

void AMyHUD::ShowStatusWidget()
{
    if (!StatusWidgetClass) return;

    Status = CreateWidget<UUserWidget>(GetWorld(), StatusWidgetClass);
    if (Status)
    {
        Status->AddToViewport(/*ZOrder=*/5);
    }
}

void AMyHUD::HideStatusWidget()
{
    if (Status && Status->IsInViewport())
    {
        Status->RemoveFromParent();
        Status = nullptr;
    }
}
```

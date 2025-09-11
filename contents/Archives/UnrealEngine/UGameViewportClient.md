---
title: 'UGameViewportClient'
date: '2025-08-17T16:17:41+09:00'
---
> **게임 세계와 플레이어의 화면을 연결하는 '창문'이자, 모든 렌더링과 입력이 최종적으로 거쳐가는 관문입니다.** 플레이어가 보는 최종 화면을 그리고, 마우스나 키보드 같은 하드웨어 입력을 게임 로직으로 전달하는 핵심적인 역할을 수행합니다.

### **1. 주요 역할 및 책임**
> **게임 월드를 플레이어의 화면에 실제로 렌더링하는 최종 책임을 가집니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **뷰포트 렌더링 (Viewport Rendering)**:
	게임 월드를 플레이어의 화면에 실제로 렌더링하는 최종 책임을 가집니다. 3D 월드, UI(Slate 또는 [[UnrealMotionGraphics]]), 디버그 텍스트 등 화면에 보이는 모든 것을 그려냅니다.
* **입력 처리의 시작점 (Origin of Input Processing)**:
	운영체제로부터 받은 하드웨어 입력(마우스, 키보드, 게임패드)을 언리얼 엔진의 입력 시스템으로 전달하는 첫 번째 관문입니다. 이 입력은 이후 [[APlayerController]] 등으로 전달되어 실제 게임 로직에 영향을 줍니다.
* **화면 관리 (Screen Management)**:
	화면 해상도, 전체 화면 모드 전환, 화면 분할(Split Screen)과 같은 뷰포트 관련 설정을 관리합니다.
* **콘솔 명령 처리 (Console Command Handling)**:
	플레이어가 입력하는 콘솔 명령어를 받아 처리하고 실행하는 역할을 담당합니다.

### **2. 핵심 함수 및 속성**
> **현재 뷰포트의 크기(해상도)를 가져옵니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `GetViewportSize(FVector2D& ViewportSize)`:
	현재 뷰포트의 크기(해상도)를 가져옵니다.
* `SetCaptureMouseOnClick(EMouseCaptureMode Mode)`:
	플레이어가 뷰포트를 클릭했을 때 마우스 커서를 어떻게 처리할지(예: 뷰포트 안에 가두기)를 결정합니다.
* `DrawTransition(UCanvas* Canvas)`:
	레벨이 전환될 때(예: 로딩 화면) 화면에 무언가를 그리기 위해 호출되는 함수입니다. 페이드 인/아웃 효과 등을 여기에 구현할 수 있습니다.
* `ProcessEvent(FEvent* Event)`:
	운영체제로부터 받은 로우 레벨(low-level) [[Event]]를 처리합니다.
* `ViewportConsole`:
	게임 내 콘솔에 대한 참조입니다. 콘솔 명령을 직접 실행하거나 출력 메시지를 추가할 때 사용할 수 있습니다.

### **3. 뷰포트와 플레이어**
> **실제 게임을 플레이하는 로컬 플레이어 한 명을 나타냅니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **[[ULocalPlayer]]**:
	실제 게임을 플레이하는 로컬 플레이어 한 명을 나타냅니다. 화면 분할 시에는 여러 개의 [[ULocalPlayer]]가 존재할 수 있으며, 각 [[ULocalPlayer]]는 자신만의 [[APlayerController]]를 가집니다. `UGameViewportClient`는 이 [[ULocalPlayer]]들의 시점을 종합하여 최종 화면을 구성합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[ULocalPlayer]]
* [[APlayerController]]
* [[UUserWidget]] / [[UnrealMotionGraphics]]

## 코드 예시
> **// Viewport에서 현재 해상도 가져오기 void GetCurrentViewportSize(UGameViewportClient* Viewport, FVector2D& OutSize) { OutSize = FVector2D::ZeroVector; if (Viewport) { Viewport->GetViewportSize(OutSize); } }**
```cpp
// Viewport에서 현재 해상도 가져오기
void GetCurrentViewportSize(UGameViewportClient* Viewport, FVector2D& OutSize)
{
    OutSize = FVector2D::ZeroVector;
    if (Viewport)
    {
        Viewport->GetViewportSize(OutSize);
    }
}
```

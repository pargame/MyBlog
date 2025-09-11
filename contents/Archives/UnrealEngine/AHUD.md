---
title: 'AHUD'
date: '2025-08-17T16:17:41+09:00'
---
> **플레이어의 화면에 정보를 그리는 '헤드업 디스플레이'를 담당하는 액터입니다.** 스코어, 체력 바, 미니맵 등 HUD 요소를 C++로 직접 그리거나, [[UUserWidget]] 기반 UI와 함께 사용합니다.

## 주요 역할 및 책임
> **`DrawHUD()`를 오버라이드하여 2D 요소를 그립니다.**
* **HUD 요소 렌더링**:
	`DrawHUD()`를 오버라이드하여 2D 요소를 그립니다.
* **UI 연동**:
	[[UUserWidget]]을 생성/표시하여 복잡한 UI를 화면에 띄웁니다.

## 관련 클래스
> **HUD를 소유하고 관리합니다.**
* **[[APlayerController]]**:
	HUD를 소유하고 관리합니다.
* **[[UUserWidget]]**:
	화면에 표시되는 위젯 기반 UI입니다.

## 코드 예시
> **// 가장 단순한 HUD 예시: 화면 중앙에 텍스트를 그립니다.**
```cpp
// 가장 단순한 HUD 예시: 화면 중앙에 텍스트를 그립니다.
#include "GameFramework/HUD.h"

class AMyHUD : public AHUD
{
    GENERATED_BODY()

    virtual void DrawHUD() override
    {
        Super::DrawHUD();
        const FString Text = TEXT("Hello HUD");
        DrawText(Text, FLinearColor::White, Canvas->ClipX * 0.5f, Canvas->ClipY * 0.5f);
    }
};
```

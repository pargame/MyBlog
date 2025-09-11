---
title: 'ALight'
date: '2025-08-17T16:17:41+09:00'
---
> **언리얼 엔진 월드를 밝히는 '빛' 그 자체입니다.** 레벨에 배치되어 장면의 분위기를 만들고, 그림자를 드리우며, 사물의 색상과 형태를 드러내는 필수적인 [[AActor]]입니다.

## 주요 역할 및 책임
> **`ALight`는 그 자체로는 위치와 방향만 가질 뿐, 실제 빛의 기능은 내부에 포함된 [[ULightComponent]]가 담당합니다.**
`ALight`는 그 자체로는 위치와 방향만 가질 뿐, 실제 빛의 기능은 내부에 포함된 [[ULightComponent]]가 담당합니다.
* **조명 (Illumination)**:
	월드에 빛을 비춰 사물을 보이게 합니다. 빛의 색상, 강도, 감쇠 반경 등을 조절할 수 있습니다.
* **그림자 생성 (Shadow Casting)**:
	빛을 가리는 오브젝트의 뒷면에 그림자를 만들어 장면에 깊이와 사실감을 더합니다.
* **분위기 연출 (Atmosphere Creation)**:
	빛의 색과 온도를 조절하여 따뜻하거나 차가운 느낌, 공포스러운 분위기 등 다양한 장면을 연출합니다.

## 핵심 컴포넌트
> **빛의 실제 기능(색상, 강도, 타입 등)을 정의하는 컴포넌트입니다.**
* **[[ULightComponent]]**:
	빛의 실제 기능(색상, 강도, 타입 등)을 정의하는 컴포넌트입니다. `ALight` 액터는 이 컴포넌트를 통해 빛의 속성을 제어합니다. `ALight`의 자식 클래스들은 각각 다른 종류의 `ULightComponent`를 기본으로 가지고 있습니다.

## 주요 서브클래스 (빛의 종류)
> **`ALight`는 빛의 형태와 특성에 따라 여러 자식 클래스로 나뉩니다.**
`ALight`는 빛의 형태와 특성에 따라 여러 자식 클래스로 나뉩니다.
* **[[ADirectionalLight]]**:
	태양처럼 무한히 먼 곳에서 한 방향으로 내리쬐는 빛입니다. 주로 야외 장면의 기본 조명으로 사용됩니다.
* **[[APointLight]]**:
	전구처럼 한 점에서 모든 방향으로 퍼져나가는 빛입니다. 램프, 촛불 등 특정 위치에 광원을 표현할 때 사용됩니다.
* **[[ASpotLight]]**:
	손전등이나 무대 조명처럼 원뿔 형태로 특정 영역만 비추는 빛입니다. 특정 대상을 강조할 때 효과적입니다.
* **[[ARectLight]]**:
	사각형 평면에서 빛을 방출합니다. 창문이나 형광등처럼 넓은 영역을 부드럽게 비출 때 사용됩니다. (주로 레이 트레이싱 환경에서 효과적)
* **[[ASkyLight]]**:
	하늘 전체에서 오는 빛(반사광)을 시뮬레이션하여, 그림자가 진 어두운 영역의 디테일을 살려주는 매우 중요한 빛입니다.

## 코드 예시
> **// ALight에서 공통적으로 가능한 동작: 켜고/끄고, 강도 조절 #include "Engine/Light.h" #include "Components/LightComponent.h"**
```cpp
// ALight에서 공통적으로 가능한 동작: 켜고/끄고, 강도 조절
#include "Engine/Light.h"
#include "Components/LightComponent.h"

void AMyActor::ToggleLight(ALight* Light, bool bEnable)
{
    if (!Light) return;
    if (ULightComponent* LC = Light->GetLightComponent())
    {
        LC->SetVisibility(bEnable);
        LC->SetIntensity(bEnable ? 4000.0f : 0.0f);
    }
}
```

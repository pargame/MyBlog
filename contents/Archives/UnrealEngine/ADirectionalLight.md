---
title: 'ADirectionalLight'
date: '2025-08-17T16:17:41+09:00'
---
> **태양이나 달과 같이 무한히 먼 곳에서 오는 것처럼, 모든 빛줄기가 평행하게 내리쬐는 '방향성 조명'입니다.** [[ALight]]를 상속하며, 레벨 전체의 주된 광원(Key Light)과 그림자를 만드는 데 사용됩니다.

## 주요 역할 및 책임
> **액터의 위치는 무시되고 오직 회전(Rotation) 값만이 빛의 방향을 결정합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **전역 조명 (Global Illumination Source)**:
	액터의 위치는 무시되고 오직 회전(Rotation) 값만이 빛의 방향을 결정합니다. 이를 통해 레벨 전체에 일관된 방향의 빛과 그림자를 드리웁니다.
* **주 광원 역할 (Primary Light Source)**:
	주로 씬의 가장 밝은 빛, 즉 태양광을 시뮬레이션하는 데 사용됩니다.
* **대기 효과 연동 (Atmosphere Integration)**:
	`SkyAtmosphere`나 `AtmosphericFog`와 같은 대기 컴포넌트와 연동하여, 빛의 방향에 따라 하늘의 색상이나 노을 효과를 동적으로 만들어냅니다.

## 핵심 속성
> **빛의 밝기를 결정합니다.**
* **`Intensity`**:
	빛의 밝기를 결정합니다. 보통 태양광의 경우 럭스(Lux) 단위를 사용합니다.
* **`LightColor`**:
	빛의 색상을 설정합니다.
* **`Mobility`**:
	조명의 이동성을 결정합니다.
  * `Static`:
	라이트맵에 완전히 구워지는 정적인 조명입니다.
  * `Stationary`:
	그림자와 일부 속성은 동적이지만, 주된 빛 정보는 라이트맵에 구워집니다.
  * `Movable`:
	모든 것을 실시간으로 계산하는 완전 동적 조명입니다. 동적인 낮/밤 사이클 구현에 필수적입니다.
* **`Atmosphere Sun Light`**:
	이 조명을 대기(Atmosphere) 계산에 사용할 주된 태양광으로 지정할지 여부입니다.
* **`Cast Shadows`**:
	그림자를 생성할지 여부를 결정합니다.

## 사용 패턴 및 워크플로우
> **`Movable`로 설정된 `ADirectionalLight`의 회전 값을 시간에 따라 변경하여, 동적인 낮과 밤, 그리고 그에 따른 그림자 변화를 구현합니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
* **낮/밤 사이클 (Day/Night Cycle)**:
	`Movable`로 설정된 `ADirectionalLight`의 회전 값을 시간에 따라 변경하여, 동적인 낮과 밤, 그리고 그에 따른 그림자 변화를 구현합니다.
* **기본 야외 조명**:
	레벨에 `ADirectionalLight` 하나와 [[ASkyLight]] 하나를 배치하는 것은 야외 씬을 구성하는 가장 기본적인 단계입니다.
* **특정 방향의 강한 빛**:
	우주에서 오는 레이저나, 특정 방향에서 강하게 쏟아지는 무대 조명 등을 연출하는 데 사용될 수도 있습니다.

## 관련 클래스
> **모든 조명 액터의 부모 클래스입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[ALight]]**:
	모든 조명 액터의 부모 클래스입니다.
* **[[ULightComponent]]**:
	실제 조명 계산을 처리하는 핵심 컴포넌트입니다. `ADirectionalLight`는 `UDirectionalLightComponent`를 내장하고 있습니다.
* **[[ASkyLight]]**:
	`ADirectionalLight`가 직접 비추지 못하는 그림자 영역을 채워주는 환경광 역할을 합니다.
* **`SkyAtmosphere`**:
	`ADirectionalLight`의 방향에 따라 사실적인 하늘과 대기 산란 효과를 시뮬레이션합니다.

## 코드 예시
> **// 태양광(방향성 라이트)을 스폰하고 방향/강도를 설정하는 예시 #include "Engine/DirectionalLight.h" #include "Components/DirectionalLightComponent.h"**
```cpp
// 태양광(방향성 라이트)을 스폰하고 방향/강도를 설정하는 예시
#include "Engine/DirectionalLight.h"
#include "Components/DirectionalLightComponent.h"

void AMyActor::CreateSunLight()
{
    if (UWorld* World = GetWorld())
    {
        ADirectionalLight* Sun = World->SpawnActor<ADirectionalLight>(FVector::ZeroVector, FRotator(-45.f, 45.f, 0.f));
        if (Sun)
        {
            UDirectionalLightComponent* DLC = Sun->GetDirectionalLightComponent();
            if (DLC)
            {
                DLC->SetIntensity(100000.0f); // 야외 장면에 적합한 강한 조도(Lux 단위)
                DLC->SetLightColor(FLinearColor::White);
                DLC->SetCastShadows(true);
            }
        }
    }
}
```

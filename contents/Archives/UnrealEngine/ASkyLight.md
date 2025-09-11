---
title: 'ASkyLight'
date: '2025-08-17T16:17:41+09:00'
---
> **레벨의 하늘, 즉 멀리 있는 배경(Skybox)이나 대기(Atmosphere)로부터 빛을 샘플링하여 월드 전체의 '간접광'과 '반사'를 시뮬레이션하는 특수한 조명입니다.** 그림자가 드리워진 어두운 영역을 미묘하게 밝혀주고, 환경의 색감을 전체 장면에 자연스럽게 녹여내는 역할을 합니다.

### **1. 주요 역할 및 책임**
> **월드의 하늘(Skybox) 텍스처나 대기 색상을 캡처하여, 그 빛이 월드 전체에 미치는 영향을 계산합니다.**
* **환경광 시뮬레이션 (Ambient Light Simulation)**:
	월드의 하늘(Skybox) 텍스처나 대기 색상을 캡처하여, 그 빛이 월드 전체에 미치는 영향을 계산합니다. 이를 통해 직사광선이 닿지 않는 곳이 완전히 검게 변하지 않고, 하늘의 푸른빛이나 노을의 붉은빛을 은은하게 머금도록 만듭니다.
* **이미지 기반 조명 (Image-Based Lighting, IBL)**:
	`Source Type`을 `SLS_SpecifiedCubemap`으로 설정하고 큐브맵 텍스처를 지정하면, 해당 큐브맵을 광원으로 사용하여 사실적인 조명과 반사를 만들어낼 수 있습니다.
* **반사 환경 제공 (Reflection Environment Provider)**:
	월드 내의 반사 표면(예: 금속, 물)이 주변 환경을 비추도록, 반사 데이터를 캡처하여 제공합니다.

### **2. 핵심 속성**
> **`Source Type`이 `SLS_SpecifiedCubemap`일 때 사용할 큐브맵 텍스처입니다.**
* **`Source Type`**:
	*   `SLS_CapturedScene`: 현재 레벨의 하늘, [[ADirectionalLight]], 대기 등을 실시간으로 캡처하여 광원으로 사용합니다. 동적으로 하늘이 변하는 환경에 적합합니다.
    *   `SLS_SpecifiedCubemap`:
	지정된 큐브맵(Cubemap) 텍스처를 광원으로 사용합니다. 정적인 조명 환경에서 더 높은 품질과 예측 가능한 결과를 제공합니다.
* **`Cubemap`**:
	`Source Type`이 `SLS_SpecifiedCubemap`일 때 사용할 큐브맵 텍스처입니다.
* **`IntensityScale`**:
	스카이라이트의 전체적인 밝기를 조절합니다.
* **`LightColor`**:
	캡처된 빛에 추가적으로 곱해지는 색상입니다.
* **`Mobility`**:
	*   `Static`: 에디터에서 라이트맵을 빌드할 때만 조명 정보를 계산하여 저장합니다. 성능이 가장 좋지만 동적인 변화는 불가능합니다.
    *   `Stationary`:
	`Static`과 유사하지만, 그림자와 직사광의 색상 등 일부 속성을 런타임에 변경할 수 있습니다.
    *   `Movable`:
	모든 것을 실시간으로 계산합니다. 가장 유연하지만 성능 비용이 가장 높습니다.

### **3. 사용 방법**
> **레벨에 `ASkyLight`를 하나 배치하기만 하면 기본적으로 작동합니다.**
레벨에 `ASkyLight`를 하나 배치하기만 하면 기본적으로 작동합니다. 이후 `Source Type`을 환경에 맞게 설정하고, `Recapture` 버튼을 누르거나 실시간 캡처를 활성화하여 조명을 업데이트합니다.

### **4. 관련 클래스**
> **모든 조명 액터의 부모 클래스입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[ALight]]**:
	모든 조명 액터의 부모 클래스입니다.
* **`USkyLightComponent`**:
	`ASkyLight`의 실제 로직을 처리하는 컴포넌트입니다.
* **[[ADirectionalLight]]**:
	태양광 역할을 하며, `ASkyLight`는 이 빛이 대기에 미치는 영향을 함께 캡처하여 전체적인 조화를 이룹니다.
* **`AtmosphericFog`, `SkyAtmosphere`**:
	`ASkyLight`가 빛을 샘플링하는 대상이 되는 대기 컴포넌트들입니다.

### **5. 코드 예시**
> **// 스카이라이트를 스폰하고 현재 장면을 캡처하여 환경광으로 사용하는 예시 #include "Engine/SkyLight.h" #include "Components/SkyLightComponent.h"**
```cpp
// 스카이라이트를 스폰하고 현재 장면을 캡처하여 환경광으로 사용하는 예시
#include "Engine/SkyLight.h"
#include "Components/SkyLightComponent.h"

void AMyActor::CreateSkyLight()
{
    if (UWorld* World = GetWorld())
    {
        ASkyLight* Sky = World->SpawnActor<ASkyLight>();
        if (Sky)
        {
            USkyLightComponent* SLC = Sky->GetLightComponent();
            if (SLC)
            {
                SLC->SetMobility(EComponentMobility::Movable);
                SLC->SetIntensity(1.0f);
                SLC->SetLightColor(FLinearColor::White);
                SLC->SetSourceType(SLS_CapturedScene);
                SLC->RecaptureSky();
            }
        }
    }
}
```

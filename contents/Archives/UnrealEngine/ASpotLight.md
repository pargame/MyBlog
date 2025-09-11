---
title: 'ASpotLight'
date: '2025-08-17T16:17:41+09:00'
---
> **한 지점에서 원뿔(Cone) 형태로 빛을 방출하는 '스포트라이트'입니다.** [[ALight]]를 상속하며, 손전등, 자동차 헤드라이트, 무대 조명 등 특정 방향과 영역을 집중적으로 비추는 데 사용됩니다.

### **1. 주요 역할 및 책임**
> **특정 방향으로 원뿔 모양의 빛을 방출하여, 조명의 영향을 받는 영역을 명확하게 제어할 수 있습니다.**
* **방향성 조명 (Directional Lighting)**:
	특정 방향으로 원뿔 모양의 빛을 방출하여, 조명의 영향을 받는 영역을 명확하게 제어할 수 있습니다.
* **효율적인 성능 (Efficient Performance)**:
	빛의 영향 범위가 원뿔로 제한되기 때문에, 모든 방향으로 빛을 방출하는 [[APointLight]]보다 계산 비용이 저렴하여 성능에 유리합니다.
* **집중 효과 연출 (Creating Focused Effects)**:
	플레이어의 시선을 특정 지점으로 유도하거나, 극적인 조명 효과를 연출하는 데 매우 효과적입니다.

### **2. 핵심 속성**
> **빛의 세기가 완전히 100%인 내부 원뿔의 각도입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`InnerConeAngle`**:
	빛의 세기가 완전히 100%인 내부 원뿔의 각도입니다.
* **`OuterConeAngle`**:
	빛이 완전히 사라지는 외부 원뿔의 각도입니다. `InnerConeAngle`과 `OuterConeAngle` 사이의 영역에서는 빛이 부드럽게 감쇠하여 가장자리가 자연스럽게 표현됩니다.
* **`Intensity`**:
	빛의 밝기를 결정합니다.
* **`LightColor`**:
	빛의 색상을 설정합니다.
* **`AttenuationRadius`**:
	빛이 도달하는 최대 거리를 제어합니다.

### **3. 사용 예시**
> **플레이어 캐릭터의 카메라나 손 위치에 부착하여 플레이어가 바라보는 방향을 비추도록 합니다.**
* **손전등**:
	플레이어 캐릭터의 카메라나 손 위치에 부착하여 플레이어가 바라보는 방향을 비추도록 합니다.
* **자동차 헤드라이트**:
	자동차의 전면에 두 개의 `ASpotLight`를 배치하여 전방을 비춥니다.
* **무대 및 건축 조명**:
	천장에 설치된 조명이 특정 인물이나 사물을 강조하여 비추는 효과를 연출합니다.

### **4. 관련 클래스**
> **모든 조명 액터의 부모 클래스입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[ALight]]**:
	모든 조명 액터의 부모 클래스입니다.
* **[[ULightComponent]]**:
	실제 조명 계산을 처리하는 핵심 컴포넌트입니다. `ASpotLight`는 `USpotLightComponent`를 내장하고 있습니다.
* **[[APointLight]]**:
	한 점에서 모든 방향으로 빛을 방출하는 조명입니다.
* **[[ADirectionalLight]]**:
	태양과 같이 무한히 먼 곳에서 오는 평행광을 시뮬레이션하는 조명입니다.

### **5. 코드 예시**
> **// 런타임에 스포트라이트를 생성하고 속성을 설정하는 예시 #include "Engine/SpotLight.h" #include "Components/SpotLightComponent.h"**
```cpp
// 런타임에 스포트라이트를 생성하고 속성을 설정하는 예시
#include "Engine/SpotLight.h"
#include "Components/SpotLightComponent.h"

void AMyActor::CreateSpotLight()
{
    // 스포트라이트 액터를 월드에 스폰합니다.
    ASpotLight* MySpotLight = GetWorld()->SpawnActor<ASpotLight>(GetActorLocation(), GetActorRotation());

    if (MySpotLight)
    {
        USpotLightComponent* SpotLightComponent = MySpotLight->GetSpotLightComponent();
        if (SpotLightComponent)
        {
            // 빛의 강도를 설정합니다 (단위: 루멘).
            SpotLightComponent->SetIntensity(5000.0f);

            // 빛의 색상을 노란색으로 설정합니다.
            SpotLightComponent->SetLightColor(FLinearColor::Yellow);

            // 내부 원뿔 각도를 10도로 설정합니다.
            SpotLightComponent->SetInnerConeAngle(10.0f);

            // 외부 원뿔 각도를 25도로 설정합니다.
            SpotLightComponent->SetOuterConeAngle(25.0f);

            // 빛의 감쇠 반경을 1000 유닛으로 설정합니다.
            SpotLightComponent->SetAttenuationRadius(1000.0f);
        }
    }
}
```

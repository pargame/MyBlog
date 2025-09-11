---
title: 'APointLight'
date: '2025-08-17T16:17:41+09:00'
---
> **한 점에서 모든 방향으로 빛을 방출하는 '전구'와 같은 조명입니다.** [[ALight]]를 상속하며, 특정 영역을 부드럽게 비추는 데 가장 일반적으로 사용되는 조명 유형 중 하나입니다.

### **1. 주요 역할 및 책임**
> **자신의 위치를 중심으로 구(Sphere) 형태로 빛을 방출하여 주변 환경을 비춥니다.**
* **전방향 조명 (Omnidirectional Lighting)**:
	자신의 위치를 중심으로 구(Sphere) 형태로 빛을 방출하여 주변 환경을 비춥니다.
* **감쇠 제어 (Attenuation Control)**:
	`AttenuationRadius`를 통해 빛이 도달하는 최대 거리를 제어할 수 있으며, 거리에 따라 빛의 세기가 어떻게 약해질지 결정합니다.
* **성능과 품질의 균형 (Balance of Performance and Quality)**:
	[[ASpotLight]]보다는 계산 비용이 높지만 [[ADirectionalLight]]보다는 낮으며, 실내나 특정 지역을 비추는 데 매우 효율적이고 효과적입니다.

### **2. 핵심 속성**
> **빛의 밝기를 결정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Intensity`**:
	빛의 밝기를 결정합니다. 단위는 루멘(Lumens) 또는 칸델라(Candelas) 등 다양하게 설정할 수 있습니다.
* **`LightColor`**:
	빛의 색상을 설정합니다.
* **`AttenuationRadius`**:
	빛이 영향을 미치는 최대 반경입니다. 이 거리를 벗어난 오브젝트는 이 조명에 의해 영향을 받지 않습니다. 성능 최적화에 매우 중요합니다.
* **`SourceRadius`**:
	광원의 물리적인 크기를 시뮬레이션합니다. 값이 클수록 그림자(Shadow)가 더 부드러워집니다.
* **`bUseInverseSquaredFalloff`**:
	물리적으로 정확한 빛의 감쇠 모델을 사용할지 여부입니다. `true`일 때 더 사실적인 결과를 보여줍니다.

### **3. 사용 예시**
> **방 안의 전구, 횃불, 램프 등을 표현하는 데 사용됩니다.**
* **실내 조명**:
	방 안의 전구, 횃불, 램프 등을 표현하는 데 사용됩니다.
* **특수 효과**:
	폭발이나 마법 주문의 섬광 효과를 만드는 데 사용될 수 있습니다.
* **캐릭터 주변 조명**:
	플레이어 캐릭터에 `APointLight`를 부착하여 어두운 환경에서 캐릭터 주변을 밝히는 효과를 줄 수 있습니다.

### **4. 관련 클래스**
> **모든 조명 액터의 부모 클래스입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[ALight]]**:
	모든 조명 액터의 부모 클래스입니다.
* **[[ULightComponent]]**:
	실제 조명 계산을 처리하는 핵심 컴포넌트입니다. `APointLight`는 `UPointLightComponent`를 내장하고 있습니다.
* **[[ASpotLight]]**:
	원뿔 형태로 빛을 방출하는 조명입니다.
* **[[ADirectionalLight]]**:
	태양과 같이 무한히 먼 곳에서 오는 평행광을 시뮬레이션하는 조명입니다.

### **5. 코드 예시**
> **// 월드에 포인트 라이트를 스폰하고 속성을 설정하는 예시 #include "Engine/PointLight.h" #include "Components/PointLightComponent.h"**
```cpp
// 월드에 포인트 라이트를 스폰하고 속성을 설정하는 예시
#include "Engine/PointLight.h"
#include "Components/PointLightComponent.h"

void AMyActor::SpawnPointLight()
{
    const FVector Location = GetActorLocation() + FVector(0, 0, 150);
    const FRotator Rotation = FRotator::ZeroRotator;

    if (UWorld* World = GetWorld())
    {
        APointLight* PL = World->SpawnActor<APointLight>(Location, Rotation);
        if (PL)
        {
            UPointLightComponent* PLC = PL->GetPointLightComponent();
            if (PLC)
            {
                PLC->SetIntensity(3000.0f);
                PLC->SetLightColor(FLinearColor(1.0f, 0.85f, 0.6f)); // 따뜻한 색감
                PLC->SetAttenuationRadius(1200.0f);
                PLC->SetSourceRadius(8.0f);
                PLC->bUseInverseSquaredFalloff = true; // 물리 기반 감쇠
            }
        }
    }
}
```

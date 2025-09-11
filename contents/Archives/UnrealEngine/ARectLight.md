---
title: 'ARectLight'
date: '2025-08-17T16:17:41+09:00'
---
> **사각형 평면에서 한 방향으로 빛을 방출하는 '평판 조명'입니다.** 스튜디오 조명이나 창문을 통해 들어오는 부드러운 빛을 시뮬레이션하는 데 사용되며, 사실적인 반사(Specular) 하이라이트를 만드는 데 특히 유용합니다.

### **1. 주요 역할 및 책임**
> **직사각형 형태의 광원에서 빛을 방출하여, 길고 부드러운 하이라이트와 그림자를 만듭니다.**
* **평면 광원 (Planar Light Source)**:
	직사각형 형태의 광원에서 빛을 방출하여, 길고 부드러운 하이라이트와 그림자를 만듭니다.
* **사실적인 반사 표현 (Realistic Reflections)**:
	눈이나 반짝이는 표면에 사각형 모양의 하이라이트를 정확하게 반사시켜, [[APointLight]]로는 불가능한 사실적인 장면을 연출합니다.
* **고품질 렌더링 (High-Quality Rendering)**:
	주로 높은 품질의 시네마틱이나 건축 시각화 렌더링에서 사용됩니다. 실시간 렌더링에서는 성능 비용이 높을 수 있습니다.

### **2. 핵심 속성**
> **빛을 방출하는 사각형 평면의 너비와 높이를 결정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`SourceWidth`, `SourceHeight`**:
	빛을 방출하는 사각형 평면의 너비와 높이를 결정합니다. 이 크기가 클수록 그림자가 더 부드러워집니다.
* **`BarnDoorAngle`, `BarnDoorLength`**:
	스튜디오 조명의 '반도어(Barn Door)'처럼, 빛의 확산을 제어하는 가림막의 각도와 길이를 조절합니다.
* **`Intensity`**:
	빛의 밝기를 결정합니다.
* **`LightColor`**:
	빛의 색상을 설정합니다.
* **`AttenuationRadius`**:
	빛이 도달하는 최대 거리를 제어합니다.

### **3. 사용 예시**
> **제품이나 캐릭터를 비추는 전문적인 스튜디오의 사각 소프트박스 조명을 시뮬레이션합니다.**
* **스튜디오 조명**:
	제품이나 캐릭터를 비추는 전문적인 스튜디오의 사각 소프트박스 조명을 시뮬레이션합니다.
* **창문 빛**:
	창문 밖에 `ARectLight`를 배치하여 실내로 들어오는 부드럽고 사실적인 빛을 표현합니다.
* **네온사인 및 평면 발광체**:
	길쭉한 형광등이나 빛나는 광고판 등을 표현하는 데 사용될 수 있습니다.

### **4. 관련 클래스**
> **모든 조명 액터의 부모 클래스입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[ALight]]**:
	모든 조명 액터의 부모 클래스입니다.
* **[[ULightComponent]]**:
	실제 조명 계산을 처리하는 핵심 컴포넌트입니다. `ARectLight`는 `URectLightComponent`를 내장하고 있습니다.
* **[[APointLight]]**:
	한 점에서 모든 방향으로 빛을 방출하는 조명입니다.
* **[[ASpotLight]]**:
	원뿔 형태로 빛을 방출하는 조명입니다.

### **5. 코드 예시**
> **// 직사각 라이트를 스폰하고 폭/높이 및 강도/반경을 설정하는 예시 #include "Engine/RectLight.h" #include "Components/RectLightComponent.h"**
```cpp
// 직사각 라이트를 스폰하고 폭/높이 및 강도/반경을 설정하는 예시
#include "Engine/RectLight.h"
#include "Components/RectLightComponent.h"

void AMyActor::SpawnRectLight()
{
    if (UWorld* World = GetWorld())
    {
        ARectLight* Rect = World->SpawnActor<ARectLight>(GetActorLocation() + FVector(0, 300, 200), FRotator(-20, 0, 0));
        if (Rect)
        {
            URectLightComponent* RLC = Rect->GetRectLightComponent();
            if (RLC)
            {
                RLC->SetIntensity(5000.0f);
                RLC->SetLightColor(FLinearColor::White);
                RLC->SourceWidth = 150.0f;
                RLC->SourceHeight = 50.0f;
                RLC->SetAttenuationRadius(2000.0f);
                RLC->BarnDoorAngle = 30.0f;
                RLC->BarnDoorLength = 20.0f;
            }
        }
    }
}
```

---
title: 'UDecalComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **월드의 표면에 텍스처를 투영하여 '데칼' 효과를 생성하는 컴포넌트입니다.** [[AActor]]에 부착되어, 벽, 바닥, 물체 등에 텍스처를 입히는 데 사용됩니다.

### **1. 주요 역할 및 책임**
> **지정된 텍스처를 표면에 투영하여, 총알 자국, 물 웅덩이, 그림자 등 다양한 효과를 생성합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **데칼 생성 (Decal Creation)**:
	지정된 텍스처를 표면에 투영하여, 총알 자국, 물 웅덩이, 그림자 등 다양한 효과를 생성합니다.
* **투영 속성 관리 (Projection Properties)**:
	데칼의 크기, 방향, 투명도 등을 조절하여 원하는 시각적 효과를 구현합니다.

### **2. 핵심 속성**
> **데칼에 사용될 머티리얼을 설정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`DecalMaterial`**:
	데칼에 사용될 머티리얼을 설정합니다.
* **`FadeScreenSize`**:
	데칼이 사라지기 시작하는 화면 크기를 설정합니다. 값이 작을수록 멀리서 보이지 않게 됩니다.
* **`SortOrder`**:
	데칼의 렌더링 순서를 설정합니다. 값이 높을수록 우선적으로 렌더링됩니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1. **컴포넌트 추가**:
	[[AActor]]의 블루프린트에서 `Decal Component`를 추가합니다.
2. **머티리얼 설정**:
	`DecalMaterial` 속성에 원하는 머티리얼을 설정합니다.
3. **위치 및 크기 조정**:
	데칼의 위치와 크기를 조정하여 원하는 표면에 정확히 투영되도록 설정합니다.

### **4. 관련 클래스**
> **데칼에 사용되는 머티리얼을 정의합니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UMaterial]]**:
	데칼에 사용되는 머티리얼을 정의합니다.
* **[[AActor]]**:
	`UDecalComponent`가 부착될 수 있는 액터입니다.

### **5. 코드 예시**
> **#include "Components/DecalComponent.h" #include "Materials/Material.h"**
```cpp
#include "Components/DecalComponent.h"
#include "Materials/Material.h"

void AMyActor::BeginPlay()
{
    Super::BeginPlay();

    UDecalComponent* Decal = NewObject<UDecalComponent>(this);
    Decal->SetupAttachment(RootComponent);
    Decal->SetDecalMaterial(MyDecalMaterial);
    Decal->DecalSize = FVector(128.0f, 256.0f, 256.0f);
    Decal->RegisterComponent();
}
```

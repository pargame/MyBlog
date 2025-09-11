---
title: 'UMaterialInstanceDynamic'
date: '2025-08-17T16:17:41+09:00'
---
> **머티리얼의 속성을 런타임에 동적으로 변경할 수 있는 인스턴스입니다.** [[UMaterial]] 또는 [[UMaterialInstance]]를 기반으로 생성되며, 게임 중에 머티리얼의 색상, 텍스처, 파라미터 등을 실시간으로 조정할 수 있습니다.

### **1. 주요 역할 및 책임**
> **머티리얼의 스칼라, 벡터, 텍스처 파라미터를 런타임에 변경할 수 있습니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **파라미터 변경 (Parameter Modification)**:
	머티리얼의 스칼라, 벡터, 텍스처 파라미터를 런타임에 변경할 수 있습니다.
* **효율적인 메모리 사용 (Efficient Memory Usage)**:
	기존 머티리얼을 복제하지 않고, 인스턴스를 생성하여 메모리를 절약합니다.

### **2. 핵심 함수**
> **스칼라 파라미터 값을 설정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`SetScalarParameterValue(FName ParameterName, float Value)`**:
	스칼라 파라미터 값을 설정합니다.
* **`SetVectorParameterValue(FName ParameterName, FLinearColor Value)`**:
	벡터 파라미터 값을 설정합니다.
* **`SetTextureParameterValue(FName ParameterName, UTexture* Value)`**:
	텍스처 파라미터 값을 설정합니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1. **인스턴스 생성**:
	`UMaterialInstanceDynamic::Create` 함수를 사용하여 동적 머티리얼 인스턴스를 생성합니다.
2. **파라미터 설정**:
	생성된 인스턴스의 `SetScalarParameterValue` 등 함수를 호출하여 파라미터 값을 설정합니다.
3. **적용**:
	생성된 인스턴스를 [[UMeshComponent]] 또는 다른 렌더링 컴포넌트에 적용합니다.

### **4. 관련 클래스**
> **동적 인스턴스의 기반이 되는 정적 머티리얼. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UMaterial]] / [[UMaterialInstance]]**:
	동적 인스턴스의 기반이 되는 정적 머티리얼.
* **[[UMeshComponent]]**:
	동적 머티리얼 인스턴스를 적용할 수 있는 렌더링 컴포넌트.

### **5. 코드 예시**
> **#include "Materials/MaterialInstanceDynamic.h" #include "Components/MeshComponent.h" 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
```cpp
#include "Materials/MaterialInstanceDynamic.h"
#include "Components/MeshComponent.h"

void AMyActor::BeginPlay()
{
    Super::BeginPlay();

    UMaterialInstanceDynamic* DynamicMaterial = UMaterialInstanceDynamic::Create(BaseMaterial, this);
    DynamicMaterial->SetScalarParameterValue("GlowIntensity", 5.0f);
    MeshComponent->SetMaterial(0, DynamicMaterial);
}
```

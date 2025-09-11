---
title: 'UTexture2D'
date: '2025-08-17T16:17:41+09:00'
---
> **2차원 이미지 데이터를 담고 있는 에셋입니다.** 언리얼 엔진에서 가장 일반적으로 사용되는 텍스처 형태로, 캐릭터의 피부, 무기의 표면, UI 아이콘, 파티클 스프라이트 등 시각적인 표현이 필요한 거의 모든 곳에 사용됩니다.

### **1. 주요 역할 및 책임**
> **JPG, PNG, TGA, BMP 등 다양한 이미지 파일로부터 픽셀 데이터를 임포트하여 압축된 형태로 저장합니다.**
* **이미지 데이터 저장**:
	JPG, PNG, TGA, BMP 등 다양한 이미지 파일로부터 픽셀 데이터를 임포트하여 압축된 형태로 저장합니다.
* **머티리얼 입력 제공**:
	[[UMaterial]]의 텍스처 샘플 노드에 연결되어, 셰이더가 오브젝트 표면의 색상(Base Color), 거칠기(Roughness), 노멀(Normal) 등 다양한 속성을 계산하는 데 필요한 데이터를 제공합니다.
* **UI 요소 표현**:
	[[FSlateBrush]]를 통해 UMG/Slate UI의 이미지, 아이콘, 배경 등으로 사용됩니다.
* **파티클 및 이펙트**:
	파티클 시스템에서 각 입자의 모양(스프라이트)을 정의하는 데 사용됩니다.

### **2. 핵심 속성 (에디터)**
> **텍스처의 용도에 맞는 압축 방식을 설정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Compression Settings`**:
	텍스처의 용도에 맞는 압축 방식을 설정합니다. (예: `Default` (BC1/3), `Normalmap` (BC5), `TC_Grayscale` 등) 올바른 압축 설정을 사용하는 것은 메모리 사용량과 렌더링 품질에 매우 중요합니다.
* **`sRGB`**:
	이 텍스처가 감마 보정이 적용된 색상 공간(sRGB)에 있는지 여부를 나타냅니다. Base Color와 같이 '색상' 정보를 담은 텍스처는 체크하고, Roughness, Metallic, Normal Map과 같이 '데이터' 정보를 담은 텍스처는 체크 해제해야 합니다.
* **`Mip Gen Settings`**:
	밉맵(Mipmap) 생성 방식을 설정합니다. 밉맵은 텍스처가 멀리 있어 작게 보일 때 사용할 저해상도 버전의 텍스처로, 앨리어싱(Aliasing)을 줄이고 렌더링 성능을 향상시킵니다.
* **`Filter`**:
	텍스처가 확대되거나 축소될 때 픽셀 색상을 어떻게 보간할지 결정합니다. (예: `Nearest`, `Bilinear`, `Trilinear`)

### **3. 사용 방법**
> **1.**
1.  콘텐츠 브라우저에 이미지 파일(예:
	`MyImage.png`)을 드래그 앤 드롭하거나 'Import' 버튼을 통해 임포트합니다.
2.  생성된 `UTexture2D` 에셋을 더블 클릭하여 텍스처 에디터를 열고, 압축 및 기타 설정을 용도에 맞게 조정합니다.
3.  머티리얼 에디터에서 'Texture Sample' 노드를 추가하고 이 텍스처 에셋을 지정하거나, UMG 위젯의 [[FSlateBrush]]에 이 텍스처를 할당하여 사용합니다.

### **4. 관련 클래스**
> **모든 텍스처 클래스(UTexture2D, UTextureCube 등)의 부모 클래스입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UTexture]]**:
	모든 텍스처 클래스(UTexture2D, UTextureCube 등)의 부모 클래스입니다.
* **[[UMaterial]]**:
	이 텍스처를 사용하여 오브젝트의 표면을 렌더링하는 셰이더 에셋입니다.
* **[[FSlateBrush]]**:
	UI에서 이 텍스처를 어떻게 그릴지 정의하는 구조체입니다.

### **5. 코드 예시**
> **// 런타임에 동적으로 UTexture2D를 생성하고 픽셀 데이터로 채우는 예시 #include "Engine/Texture2D.h"**
```cpp
// 런타임에 동적으로 UTexture2D를 생성하고 픽셀 데이터로 채우는 예시
#include "Engine/Texture2D.h"

UTexture2D* UMyBlueprintFunctionLibrary::CreateDynamicTexture(int32 Width, int32 Height)
{
    if (Width <= 0 || Height <= 0)
    {
        return nullptr;
    }

    // 새로운 UTexture2D 객체를 생성합니다.
    UTexture2D* DynamicTexture = UTexture2D::CreateTransient(Width, Height, PF_B8G8R8A8);

    if (DynamicTexture)
    {
        // 텍스처의 픽셀 데이터를 담을 배열을 생성합니다.
        TArray<FColor> PixelData;
        PixelData.Init(FColor::White, Width * Height);

        // 여기서 픽셀 데이터를 원하는 대로 수정할 수 있습니다.
        // 예를 들어, 텍스처의 절반을 빨간색으로 칠하는 코드
        for (int32 y = 0; y < Height / 2; ++y)
        {
            for (int32 x = 0; x < Width; ++x)
            {
                PixelData[y * Width + x] = FColor::Red;
            }
        }

        // 텍스처의 Mip 0에 접근하기 위해 메모리를 잠급니다.
        void* TextureData = DynamicTexture->GetPlatformData()->Mips[0].BulkData.Lock(LOCK_READ_WRITE);
        
        // 계산된 픽셀 데이터를 텍스처 메모리로 복사합니다.
        FMemory::Memcpy(TextureData, PixelData.GetData(), PixelData.Num() * sizeof(FColor));
        
        // 메모리 잠금을 해제하고 텍스처를 업데이트합니다.
        DynamicTexture->GetPlatformData()->Mips[0].BulkData.Unlock();
        DynamicTexture->UpdateResource();

        return DynamicTexture;
    }

    return nullptr;
}
```
```

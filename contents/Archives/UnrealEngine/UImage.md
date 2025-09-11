---
title: 'UImage'
date: '2025-08-17T16:17:41+09:00'
---
> **UI에 2D 이미지를 표시하는 가장 기본적인 위젯입니다.** 아이콘, 배경, 초상화, 아이템 그림 등 사용자 인터페이스를 구성하는 모든 종류의 정적 또는 동적 이미지를 렌더링하는 데 사용됩니다.

### **1. 주요 역할 및 책임**
> **`Brush` 속성에 설정된 텍스처, 스프라이트, 또는 머티리얼을 위젯의 크기에 맞춰 화면에 표시합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **이미지 렌더링 (Image Rendering)**:
	`Brush` 속성에 설정된 텍스처, 스프라이트, 또는 머티리얼을 위젯의 크기에 맞춰 화면에 표시합니다.
* **동적 이미지 변경 (Dynamic Image Change)**:
	런타임에 코드나 블루프린트를 통해 표시할 이미지를 동적으로 변경할 수 있습니다. (예: 플레이어의 상태에 따라 초상화 표정 변경, 선택된 아이템의 아이콘 표시)
* **색상 및 투명도 조절 (Color and Opacity Control)**:
	`Color and Opacity` 속성을 통해 이미지에 특정 색조를 입히거나 투명도를 조절하여 다양한 시각적 효과를 줄 수 있습니다.

### **2. 핵심 속성**
> **이미지의 핵심적인 외형 정보를 담고 있는 구조체입니다.**
* **`Brush` ([[FSlateBrush]])**:
	이미지의 핵심적인 외형 정보를 담고 있는 구조체입니다. 여기에 표시할 `Image` (Texture 2D, Material, Sprite 등), `Image Size`, `Draw As` (그려지는 방식), `Tiling` (타일링 여부), `Tint` (색조) 등을 설정합니다.
* **`Color and Opacity`**:
	`Brush`의 `Tint`와 곱해져 최종적으로 적용될 색상과 투명도를 결정합니다.

### **3. 사용 방법**
> **1.**
1.  **위젯 블루프린트 추가**:
	[[UUserWidget]]의 디자이너 탭에서, 팔레트의 `Image`를 캔버스나 다른 패널로 드래그 앤 드롭합니다.
2.  **이미지 할당**:
	디테일 패널의 `Appearance` > `Brush` 섹션을 확장하고, `Image` 속성에 원하는 텍스처나 머티리얼 애셋을 할당합니다.
3.  **색상 및 크기 조절**:
	필요에 따라 `Color and Opacity`를 변경하거나, `Brush`의 `Image Size`를 조절하여 원하는 크기로 표시되도록 합니다.
4.  **동적 변경 (선택 사항)**:
	그래프에서 `UImage` 위젯에 대한 참조를 가져와 `SetBrushFromTexture`나 `SetBrushFromMaterial`과 같은 함수를 호출하여 런타임에 이미지를 변경할 수 있습니다.

```cpp
// C++ 코드에서 Image 위젯의 텍스처를 변경하는 예시

// UPROPERTY로 위젯 블루프린트의 Image에 대한 참조를 만듭니다. (Meta = (BindWidget))
UPROPERTY(meta = (BindWidget))
UImage* PlayerAvatarImage;

void UMyHUDWidget::UpdateAvatar(UTexture2D* NewAvatarTexture)
{
    if (PlayerAvatarImage && NewAvatarTexture)
    {
        PlayerAvatarImage->SetBrushFromTexture(NewAvatarTexture);
    }
}
```
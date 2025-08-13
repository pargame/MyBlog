---
---
> **세로로 긴 알약 모양(캡슐)의 형태를 가진, 보이지 않는 충돌 및 영역 감지용 컴포넌트입니다.** [[UPrimitiveComponent]]를 상속받아 렌더링과 충돌이 가능하지만, 주로 [[ACharacter]]의 기본 충돌체로 사용되거나 간단한 트리거 볼륨을 만드는 데 특화되어 있습니다.

### **1. 주요 역할 및 책임**
> `UCapsuleComponent`는 수직으로 서 있는 오브젝트의 충돌을 효율적으로 처리하는 데 핵심적인 역할을 합니다.
* **캐릭터 충돌의 표준 (Standard for Character Collision):**
    [[ACharacter]]의 루트 컴포넌트로 기본 포함되어 있으며, 캐릭터의 물리적 경계를 정의합니다. 캡슐의 둥근 바닥은 계단이나 경사면을 부드럽게 오르내리는 데 매우 적합하며, 수직 형태는 서 있는 인간형 캐릭터를 표현하기에 이상적입니다.
* **간단한 트리거 볼륨 (Simple Trigger Volume):**
    `Collision Preset`을 `OverlapAll` 등으로 설정하여, 다른 액터가 이 캡슐 영역에 들어오거나 나가는 것을 감지하는 트리거로 사용할 수 있습니다.
* **효율적인 물리 계산 (Efficient Physics Calculation):**
    복잡한 폴리곤 메시 대신 단순한 수학적 형태(캡슐)를 사용하므로, 충돌 및 물리 계산이 매우 빠르고 성능에 미치는 영향이 적습니다.

### **2. 핵심 함수 및 속성**
> 캡슐의 크기를 조절하고 현재 상태를 가져오는 데 사용되는 주요 함수들입니다.
* **`SetCapsuleSize(float NewRadius, float NewHalfHeight, bool bUpdateOverlaps)`:**
    캡슐의 반지름(Radius)과 절반 높이(Half Height)를 런타임에 변경합니다.
* **`SetCapsuleRadius(float NewRadius, bool bUpdateOverlaps)`:**
    캡슐의 반지름만 변경합니다.
* **`SetCapsuleHalfHeight(float NewHalfHeight, bool bUpdateOverlaps)`:**
    캡슐의 절반 높이만 변경합니다.
* **`GetScaledCapsuleRadius()`:**
    컴포넌트의 스케일을 포함하여 계산된 최종 반지름을 반환합니다.
* **`GetScaledCapsuleHalfHeight()`:**
    컴포넌트의 스케일을 포함하여 계산된 최종 절반 높이를 반환합니다.

### **3. 주요 서브클래스**
> `UCapsuleComponent`는 `UShapeComponent`를 상속하며, `UShapeComponent`에는 다음과 같은 다른 기본 도형 컴포넌트들이 있습니다.
* **[[UBoxComponent]]:** 사각 박스 형태의 충돌 컴포넌트입니다.
* **[[USphereComponent]]:** 구 형태의 충돌 컴포넌트입니다.

이들은 모두 [[UPrimitiveComponent]]를 상속받으므로, `OnComponentBeginOverlap`, `OnComponentEndOverlap`, `OnComponentHit`과 같은 충돌 [[Event]]를 동일하게 사용할 수 있습니다.

### **4. 사용 예시**
* **캐릭터:** [[ACharacter]]의 루트 컴포넌트로 사용하여, 월드와의 주된 상호작용(걷기, 부딪히기)을 처리합니다.
* **아이템 픽업:** 아이템 액터에 `UCapsuleComponent`를 추가하고 오버랩 [[Event]]가 발생했을 때 플레이어가 아이템을 획득하도록 구현할 수 있습니다.
* **간단한 공격 판정:** 무기 액터의 끝에 작은 캡슐 컴포넌트를 붙여, 공격 애니메이션 중에 다른 캐릭터의 `UCapsuleComponent`와 겹쳤는지를 검사하여 피격 판정을 할 수 있습니다.
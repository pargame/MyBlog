---
---
> **직육면체(박스) 형태를 가진, 보이지 않는 충돌 및 영역 감지용 컴포넌트입니다.** [[UPrimitiveComponent]]를 상속받아 렌더링과 충돌이 가능하지만, 주로 간단한 트리거 볼륨을 만들거나, 사각형 형태의 오브젝트에 대한 충돌을 효율적으로 처리하는 데 사용됩니다.

### **1. 주요 역할 및 책임**
> `UBoxComponent`는 가장 단순하고 계산 비용이 저렴한 충돌 형태 중 하나로, 다양한 용도로 활용됩니다.
* **트리거 볼륨 (Trigger Volume):**
    가장 일반적인 용도입니다. `Collision Preset`을 `OverlapAllDynamic` 등으로 설정하여, 다른 액터가 이 박스 영역에 들어오거나 나가는 것을 감지하는 트리거로 사용됩니다. (예: 문 자동 열림, 특정 구역 진입 시 [[Event]] 발생)
* **간단한 충돌체 (Simple Collision):**
    복잡한 메시 충돌이 필요 없는 간단한 오브젝트(예: 스위치, 버튼)의 물리적 경계를 정의하는 데 사용됩니다.
* **효율적인 물리 계산 (Efficient Physics Calculation):**
    복잡한 폴리곤 메시 대신 단순한 수학적 형태(박스)를 사용하므로, 충돌 및 물리 계산이 매우 빠르고 성능에 미치는 영향이 적습니다.

### **2. 핵심 함수 및 속성**
> 박스의 크기를 조절하고 현재 상태를 가져오는 데 사용되는 주요 함수들입니다.
* **`SetBoxExtent(FVector InBoxExtent, bool bUpdateOverlaps)`:**
    박스의 '범위(Extent)'를 설정합니다. Extent는 박스의 중심에서 각 면까지의 거리를 나타내는 벡터이므로, 실제 박스의 전체 크기는 Extent의 2배가 됩니다.
* **`GetScaledBoxExtent()`:**
    컴포넌트의 스케일을 포함하여 계산된 최종 박스 범위를 반환합니다.
* **`GetUnscaledBoxExtent()`:**
    컴포넌트의 스케일을 고려하지 않은 원본 박스 범위를 반환합니다.

### **3. 주요 서브클래스**
> `UBoxComponent`는 `UShapeComponent`를 상속하며, `UShapeComponent`에는 다음과 같은 다른 기본 도형 컴포넌트들이 있습니다.
* **[[USphereComponent]]:** 구 형태의 충돌 컴포넌트입니다.
* **[[UCapsuleComponent]]:** 캡슐 형태의 충돌 컴포넌트입니다.

이들은 모두 [[UPrimitiveComponent]]를 상속받으므로, `OnComponentBeginOverlap`, `OnComponentEndOverlap`, `OnComponentHit`과 같은 충돌 [[Event]]를 동일하게 사용할 수 있습니다.

### **4. 사용 예시**
* **자동문:** 문 액터 앞에 `UBoxComponent`를 트리거로 배치하고, 플레이어가 오버랩되면 문을 여는 타임라인을 재생합니다.
* **피해 영역:** 특정 스킬이 발동될 때, 스킬의 효과 범위에 해당하는 `UBoxComponent`를 생성하여, 그 안에 오버랩된 모든 적에게 피해를 줍니다.
* **강이나 위험 구역:** 강이나 용암 지대에 걸쳐 넓은 `UBoxComponent`를 배치하고, 플레이어가 오버랩되면 지속적으로 피해를 입히거나 즉사시킵니다.
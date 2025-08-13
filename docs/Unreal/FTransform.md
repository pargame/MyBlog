---
---

> **월드 공간에 존재하는 모든 것의 '위치(Location)', '회전(Rotation)', '크기(Scale)'를 하나로 묶어 표현하는 가장 기본적인 공간 데이터 구조체입니다.** 언리얼 엔진에서 공간을 다루는 거의 모든 작업은 이 `FTransform`을 통해 이루어집니다. `F` 접두사는 이 것이 [[UObject]]를 상속받지 않는 일반적인 C++ 구조체(`struct`)임을 의미합니다.

### **1. 주요 역할 및 책임**
> `FTransform`은 3D 공간에서의 한 지점의 상태를 효율적으로 표현하고 계산하기 위한 수학적 도구입니다.
* **공간 데이터 캡슐화 (Encapsulation of Spatial Data):**
    3D 공간을 정의하는 세 가지 핵심 요소인 위치, 회전, 크기를 하나의 단위로 묶어 관리합니다. 이를 통해 데이터를 전달하고 함수를 호출하는 과정이 간결해집니다.
* **효율적인 행렬 연산 (Efficient Matrix Operations):**
    내부적으로는 복잡한 4x4 행렬 연산을 수행하지만, 개발자에게는 `Location`, `Rotation`, `Scale`이라는 직관적인 인터페이스를 제공합니다. `FTransform`을 사용하면 행렬에 대한 깊은 지식 없이도 공간 변환을 쉽게 처리할 수 있습니다.
* **계층 구조 계산 (Hierarchy Calculation):**
    부모-자식 관계에 있는 컴포넌트들의 최종 월드 트랜스폼을 계산하는 데 핵심적으로 사용됩니다. 자식의 상대(Relative) 트랜스폼과 부모의 월드 트랜스폼을 결합하여 자식의 최종 월드 트랜스폼을 구하는 연산이 매우 효율적입니다.

### **2. 주요 구성 요소**
> `FTransform` 구조체는 세 가지 주요 데이터 멤버로 구성됩니다.
* **`Location` ([[FVector]]):**
    공간에서의 위치(좌표)를 나타내는 3차원 벡터입니다. (X, Y, Z)
* **`Rotation` ([[FQuat]])::
    공간에서의 회전을 나타내는 쿼터니언(Quaternion)입니다. 짐벌락(Gimbal Lock) 현상이 없어 [[FRotator]]보다 안정적인 회전 계산이 가능하지만, 사람이 직접 다루기에는 [[FRotator]]가 더 직관적이라 종종 변환하여 사용합니다.
* **`Scale3D` ([[FVector]]):**
    각 축에 대한 크기(배율)를 나타내는 3차원 벡터입니다. (X, Y, Z)

### **3. `FTransform` vs. [[FRotator]]**
> 회전을 다룰 때 이 둘의 차이를 이해하는 것이 중요합니다.
* **`FTransform`:**
    위치, 회전, 크기를 모두 포함하는 완전한 공간 정보입니다. 회전 데이터는 내부적으로 [[FQuat]]으로 저장됩니다.
* **[[FRotator]]:**
    오직 회전 정보만을 `Pitch`(Y축), `Yaw`(Z축), `Roll`(X축)이라는 오일러 각(Euler Angle)으로 표현합니다. 사람이 이해하고 편집하기에는 편리하지만, 특정 각도에서 축이 겹쳐 회전의 자유도를 잃는 짐벌락 문제가 발생할 수 있습니다.

일반적으로 에디터의 디테일 패널에서는 [[FRotator]]로 회전 값을 보여주지만, 내부적인 계산이나 코드에서는 더 안정적인 `FTransform`과 [[FQuat]]을 사용하는 것이 권장됩니다.

### **4. 사용 예시**
```cpp
// 새로운 FTransform을 생성하고 초기화합니다.
FVector Location(100.f, 0.f, 50.f);
FRotator Rotation(0.f, 90.f, 0.f);
FVector Scale(1.f, 1.f, 1.f);
FTransform MyTransform(Rotation, Location, Scale);

// 액터의 트랜스폼을 설정합니다.
MyActor->SetActorTransform(MyTransform);

// 두 트랜스폼을 결합합니다. (부모 트랜스폼 * 자식의 상대 트랜스폼)
FTransform WorldTransform = ParentTransform * RelativeChildTransform;
```
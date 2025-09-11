---
title: 'FTimerDelegate'
date: '2025-08-17T16:17:41+09:00'
---
> **[[FTimerManager]]에 의해 호출될 함수를 '바인딩(Binding)'하는 데 사용되는 특별한 델리게이트입니다.** `SetTimer` 함수에 어떤 함수를, 어떤 인자와 함께 호출할지를 알려주는 역할을 합니다.

### **1. 주요 역할 및 책임**
> **타이머가 만료되었을 때 실행될 C++ 멤버 함수, 전역 함수, 또는 람다 함수를 지정합니다.**
* **함수 바인딩 (Function Binding)**:
	타이머가 만료되었을 때 실행될 C++ 멤버 함수, 전역 함수, 또는 람다 함수를 지정합니다.
* **인자 전달 (Argument Passing)**:
	바인딩 시점에 함수에 전달할 인자들을 함께 묶을 수 있습니다. 이를 통해 타이머가 실행될 때 특정 값을 함수에 넘겨줄 수 있습니다.

### **2. 사용 방법**
> **`FTimerDelegate`는 직접적으로 선언하기보다는, `FTimerDelegate::Create...` 계열의 함수나 `TBaseDelegate::Bind...` 함수를 통해 생성하고 `SetTimer`에 전달하는 방식으로 사용됩니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
`FTimerDelegate`는 직접적으로 선언하기보다는, `FTimerDelegate::Create...` 계열의 함수나 `TBaseDelegate::Bind...` 함수를 통해 생성하고 `SetTimer`에 전달하는 방식으로 사용됩니다.

**예시 1: 멤버 함수 바인딩**
```cpp
FTimerHandle Handle;
FTimerDelegate Delegate;
// MyFunction을 호출하도록 바인딩
Delegate.BindUFunction(this, FName("MyFunction")); 
GetWorld()->GetTimerManager().SetTimer(Handle, Delegate, 5.0f, false);
```

**예시 2: 인자가 있는 함수 바인딩 (람다 사용)**
```cpp
FTimerHandle Handle;
int32 MyValue = 10;
// 람다를 사용하여 인자를 캡처
GetWorld()->GetTimerManager().SetTimer(Handle, [this, MyValue]() 
{
    MyFunctionWithParam(MyValue); // 5초 후에 MyValue(10)를 인자로 함수 호출
}, 5.0f, false);
```

**예시 3: `CreateUObject` 사용**
```cpp
FTimerHandle Handle;
FTimerDelegate Delegate;
// MyFunctionWithParam을 호출하고, 인자로 123을 전달하도록 생성
Delegate.CreateUObject(this, &AMyActor::MyFunctionWithParam, 123);
GetWorld()->GetTimerManager().SetTimer(Handle, Delegate, 5.0f, false);
```

### **3. 블루프린트에서의 대응**
> **블루프린트에서는 `Set Timer by Event` 노드를 사용할 때, 노드의 빨간색 사각형 핀(델리게이트 핀)에서 선을 빼서 커스텀 이벤트를 만드는 방식으로 이와 유사한 기능을 구현합니다.**
블루프린트에서는 `Set Timer by Event` 노드를 사용할 때, 노드의 빨간색 사각형 핀(델리게이트 핀)에서 선을 빼서 커스텀 이벤트를 만드는 방식으로 이와 유사한 기능을 구현합니다. 이 커스텀 이벤트가 `FTimerDelegate`에 바인딩된 함수와 같은 역할을 합니다.

### **4. 관련 클래스**
> **이 델리게이트를 사용하여 타이머를 설정하고 관리합니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[FTimerManager]]**:
	이 델리게이트를 사용하여 타이머를 설정하고 관리합니다.
* **[[Delegate]]**:
	`FTimerDelegate`가 기반으로 하는 언리얼 엔진의 일반적인 델리게이트 시스템입니다.
* **`FTimerHandle`**:
	설정된 타이머를 제어하기 위한 핸들입니다.

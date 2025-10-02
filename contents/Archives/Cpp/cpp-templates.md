---
title: "C++ Templates: 기초와 활용"
summary: "제네릭 프로그래밍과 템플릿 메타프로그래밍 입문"
date: "2025-09-11T12:00:00+00:00"
---

C++ 템플릿은 제네릭 프로그래밍의 핵심입니다. 함수 템플릿과 클래스 템플릿을 통해 타입에 독립적인 코드를 작성할 수 있으며, 컴파일 타임에 타입이 결정되어 런타임 오버헤드가 없습니다.

## 함수 템플릿

함수 템플릿은 타입 파라미터를 받아 여러 타입에서 동작하는 함수를 생성합니다:

```cpp
template<typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}
```

## 클래스 템플릿

클래스 템플릿은 타입 파라미터를 받아 다양한 타입의 객체를 저장할 수 있는 컨테이너를 만듭니다:

```cpp
template<typename T>
class Vector {
    T* data;
    size_t size;
public:
    void push_back(const T& value);
    T& operator[](size_t index);
};
```

## 템플릿 특수화

특정 타입에 대해 다른 구현을 제공할 수 있습니다:

```cpp
template<>
class Vector<bool> {
    // bool에 최적화된 비트 벡터 구현
};
```

참고: [[cpp-smart-pointers]], [[cpp-move-semantics]]


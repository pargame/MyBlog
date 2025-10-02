---
title: "C++ Move Semantics"
summary: "rvalue, move, perfect forwarding의 개념과 구현 팁"
date: "2025-09-11T12:00:00+00:00"
---

C++11의 이동 시맨틱스는 불필요한 복사를 제거하여 성능을 크게 향상시킵니다. rvalue 참조를 통해 임시 객체의 리소스를 효율적으로 전달할 수 있습니다.

## Rvalue와 Lvalue

- **Lvalue**: 주소를 가진 지속적인 객체
- **Rvalue**: 임시 객체 또는 리터럴

```cpp
int x = 10;     // x는 lvalue
int&& r = 20;   // rvalue 참조
```

## Move Constructor와 Move Assignment

이동 생성자는 리소스의 소유권을 이전합니다:

```cpp
class MyString {
    char* data;
public:
    // Move constructor
    MyString(MyString&& other) noexcept 
        : data(other.data) {
        other.data = nullptr;
    }
    
    // Move assignment
    MyString& operator=(MyString&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            other.data = nullptr;
        }
        return *this;
    }
};
```

## std::move와 Perfect Forwarding

`std::move`는 lvalue를 rvalue로 캐스팅하며, `std::forward`는 완벽한 전달을 구현합니다:

```cpp
template<typename T>
void wrapper(T&& arg) {
    func(std::forward<T>(arg));  // 원래 타입 유지
}
```

참고: [[cpp-smart-pointers]], [[cpp-templates]]
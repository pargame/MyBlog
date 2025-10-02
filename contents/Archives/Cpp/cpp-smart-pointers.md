---
title: "C++ Smart Pointers"
summary: "unique_ptr, shared_ptr, weak_ptr 사용법과 주의점"
date: "2025-09-11T12:00:00+00:00"
---

C++11부터 도입된 스마트 포인터는 자동 메모리 관리를 제공하여 메모리 누수와 댕글링 포인터 문제를 방지합니다.

## unique_ptr

독점 소유권을 가진 스마트 포인터입니다. 복사가 불가능하며, 이동만 가능합니다:

```cpp
auto ptr = std::make_unique<MyClass>(args);
// ptr이 스코프를 벗어나면 자동으로 delete됨
```

## shared_ptr

참조 카운팅을 통해 공유 소유권을 구현합니다:

```cpp
auto ptr1 = std::make_shared<MyClass>(args);
auto ptr2 = ptr1; // 참조 카운트 증가
// 마지막 shared_ptr이 소멸될 때 객체 삭제
```

## weak_ptr

`shared_ptr`의 순환 참조 문제를 해결하기 위한 약한 참조입니다:

```cpp
std::weak_ptr<MyClass> weak = shared;
if (auto locked = weak.lock()) {
    // 객체가 아직 존재하면 사용
}
```

참고: [[cpp-move-semantics]], [[cpp-templates]]
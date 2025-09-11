---
title: 'UEngineSubsystem'
date: '2025-08-17T16:17:41+09:00'
---
> **언리얼 엔진이 켜지고 꺼질 때까지, 가장 긴 생명 주기를 가지는 '최상위 전역 서비스'입니다.** 게임 월드나 게임 세션의 존재와 무관하게, 엔진 프로세스 자체에 종속되어 에디터와 런타임을 아우르는 가장 근본적인 기능을 제공합니다.

### **1. 주요 역할 및 책임**
> **이 [[Subsystem]]은 게임플레이와 직접적인 관련이 없을 수 있는 저수준(low-level) 시스템이나, 에디터에서도 동작해야 하는 기능을 구현하는 데 사용됩니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **엔진 수준의 기능 제공 (Engine-Level Functionality)**:
	이 [[Subsystem]]은 게임플레이와 직접적인 관련이 없을 수 있는 저수준(low-level) 시스템이나, 에디터에서도 동작해야 하는 기능을 구현하는 데 사용됩니다.
* **가장 긴 생명 주기 (The Longest Lifecycle)**:
	엔진이 시작될 때 다른 어떤 [[Subsystem]]보다 먼저 `Initialize()`가 호출되고, 엔진이 종료될 때 가장 나중에 `Deinitialize()`가 호출됩니다. 진정한 의미의 전역 상태를 관리할 수 있습니다.
* **플러그인의 핵심 진입점 (Core Entry Point for Plugins)**:
	많은 플러그인들이 자신의 기능을 외부에 노출하고 관리하기 위한 핵심 진입점으로 `UEngineSubsystem`을 사용합니다. 플러그인은 엔진과 함께 로드되므로, 엔진 [[Subsystem]]은 플러그인의 생명 주기를 관리하기에 완벽한 장소입니다.

### **2. 핵심 함수 (생명 주기)**
> **엔진이 초기화될 때 호출됩니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `Initialize(FSubsystemCollectionBase& Collection)`:
	엔진이 초기화될 때 호출됩니다. 이 [[Subsystem]]이 필요로 하는 다른 모듈을 로드하거나, 외부 라이브러리를 초기화하는 등의 작업을 수행합니다.
* `Deinitialize()`:
	엔진이 종료되기 직전에 호출됩니다. `Initialize`에서 수행했던 모든 작업을 안전하게 정리합니다.

### **3. 사용 예시**
> **커스텀 에디터 툴, 애셋 검증 시스템, 자동화 스크립트 관리자 등 에디터의 기능을 확장하는 데 사용됩니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
* **에디터 전용 [[Subsystem]]**:
	커스텀 에디터 툴, 애셋 검증 시스템, 자동화 스크립트 관리자 등 에디터의 기능을 확장하는 데 사용됩니다.
* **온라인 플랫폼 연동**:
	Steam, Epic Online Services(EOS) 등 플랫폼 서비스를 엔진 시작과 동시에 초기화하고 관리하는 데 사용될 수 있습니다.
* **저수준 렌더링 연동**:
	커스텀 렌더링 파이프라인이나 외부 렌더링 라이브러리와의 연동을 관리합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[Subsystem]]
* [[UGameInstanceSubsystem]]
* [[UWorldSubsystem]]

## 코드 예시
> **// 간단한 엔진 서브시스템 구현 예시 #include "EngineSubsystem.h"**
```cpp
// 간단한 엔진 서브시스템 구현 예시
#include "EngineSubsystem.h"

UCLASS()
class UMyEngineSubsystem : public UEngineSubsystem
{
    GENERATED_BODY()
public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override
    {
        // 에디터/런타임 전역 초기화
    }

    virtual void Deinitialize() override
    {
        // 자원 정리
    }
};
```

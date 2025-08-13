---
---

> **인공지능(AI) 캐릭터의 '뇌'가 되어, 스스로 판단하고 행동하며 [[APawn]]을 제어하는 특수한 [[AController]]입니다.** 인간 플레이어의 입력을 받는 [[APlayerController]]와 달리, `AAIController`는 [[UBehaviorTree]], 센서, 내비게이션 시스템 등을 사용하여 자율적으로 의사 결정을 내립니다.

### **1. 주요 역할 및 책임**
> `AAIController`는 AI가 월드를 인식하고, 목표를 설정하며, 목표를 달성하기 위한 행동을 실행하는 모든 과정을 총괄합니다.
* **의사 결정 (Decision Making):**
    [[UBehaviorTree]]를 실행하여, 현재 상황에 가장 적합한 행동(예: '순찰', '플레이어 추격', '엄폐')을 선택합니다.
* **월드 인식 (World Perception):**
    [[UAIPerceptionComponent]] 시스템을 사용하여 시각, 청각, 촉각 등 다양한 감각으로 주변 환경을 인지합니다. 플레이어를 보거나, 총소리를 듣거나, 피해를 입었을 때 이를 감지하고 의사 결정에 반영합니다.
* **내비게이션 (Navigation):**
    [[UNavigationSystemV1]]과 연동하여, 월드에 자동으로 생성된 내비메시(NavMesh)를 따라 목표 지점까지 최적의 경로를 계산하고 [[APawn]]을 이동시킵니다.
* **[[APawn]] 제어 (Pawn Control):**
    [[AController]]의 기본 기능인 `Possess`를 통해 특정 [[APawn]]에 빙의하고, 결정된 행동에 따라 `MoveTo`와 같은 함수를 호출하여 [[APawn]]을 직접 움직이게 합니다.

### **2. 핵심 함수 및 속성**
> AI의 행동을 제어하고 상태를 관리하는 데 사용되는 핵심적인 함수와 변수들입니다.
* `RunBehaviorTree(UBehaviorTree* BTAsset)`:
    지정된 [[UBehaviorTree]] 애셋을 실행하여 AI의 의사 결정 로직을 시작합니다.
* `MoveToActor(AActor* Goal, ...)` / `MoveToLocation(const FVector& Dest, ...)`:
    내비게이션 시스템을 사용하여 목표 [[AActor]]나 위치로 [[APawn]]을 이동시키도록 명령합니다.
* `GetBlackboardComponent()`:
    이 AI 컨트롤러가 사용하는 [[UBlackboardComponent]]에 대한 참조를 가져옵니다. 블랙보드는 비헤이비어 트리에서 공유되는 데이터(예: 'TargetPlayer', 'LastKnownLocation')를 저장하는 AI의 '기억 저장소'입니다.
* `SetFocus(AActor* NewFocus)`:
    AI가 특정 [[AActor]]를 계속 주시하도록 설정합니다.
* `BrainComponent`:
    현재 AI의 '뇌' 역할을 하는 컴포넌트(주로 `UBehaviorTreeComponent`)에 대한 포인터입니다.

### **3. 주요 관련 시스템**
> `AAIController`는 단독으로 동작하기보다는, 여러 시스템과 유기적으로 연동하여 복잡한 AI를 구현합니다.
* **[[UBehaviorTree]]:**
    AI의 행동 로직을 트리 구조로 시각적으로 설계하는 툴입니다.
* **[[UBlackboardComponent]]:**
    비헤이비어 트리 내의 여러 노드들이 공유하는 데이터를 저장하는 변수 집합입니다.
* **[[UAIPerceptionComponent]]:**
    AI의 '감각'을 담당하는 시스템입니다.
* **[[UNavigationSystemV1]]:**
    AI가 길을 찾을 수 있도록 돕는 시스템입니다.

이 모든 요소들이 결합되어, `AAIController`는 복잡하고 지능적인 AI 캐릭터를 만들어내는 강력한 기반이 됩니다.

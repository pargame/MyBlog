---
title: "Spanning trees: MST와 Kruskal/Prim"
summary: "최소 신장 트리(MST)의 개념과 Kruskal, Prim 알고리즘의 차이 및 구현 포인트"
date: "2025-09-11T11:00:00+00:00"
---

최소 신장 트리(MST)는 연결 그래프에서 모든 정점을 포함하면서 간선의 가중치 합이 최소가 되는 트리입니다. 대표 알고리즘으로 Kruskal과 Prim이 있습니다.

Kruskal은 간선을 가중치 오름차순으로 정렬한 뒤 Union-Find(Disjoint Set)를 사용해 사이클을 피하며 간선을 선택합니다. Prim은 시작 정점에서 출발해 우선순위 큐로 가장 낮은 가중치의 경계 간선을 확장합니다.

구현 팁: Kruskal은 간선 개수가 적을 때, Prim은 정점 중심의 확장에 유리합니다. Union-Find의 경로 압축과 랭크 기법을 활용하면 성능이 좋아집니다.

[[shortest-paths]]
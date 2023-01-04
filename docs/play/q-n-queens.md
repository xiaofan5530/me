---
title: 八皇后
date: 2022/12/11
aside: false
---

# 八皇后

::: info 问题描述

如何能够在 8×8 的国际象棋棋盘上放置八个皇后，使得任何一个皇后都无法直接吃掉其他的皇后？  
即要求任两个皇后都不能处于同一条横行、纵行或对角线上

:::

## 摆法展示

<script setup>
import NQueen from "../../module/n-queens/index.vue"
</script>

<NQueen />

## 解法示例

<TB title="基于回溯思路的解法">

<<< @/../module/n-queens/solutions.ts

</TB>

## 参考链接

- [力扣](https://leetcode.cn/problems/n-queens/)
- [wiki](https://zh.wikipedia.org/wiki/%E5%85%AB%E7%9A%87%E5%90%8E%E9%97%AE%E9%A2%98)

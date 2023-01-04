---
date: 2022/12/12
---

# 数组

## First of Array

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00014-easy-first/README.md) | [playground](https://tsch.js.org/14/play)

- 示例

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]
type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

<TB>

```ts
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never
```

</TB>

## Concat

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00533-easy-concat/README.md) | [playground](https://tsch.js.org/533/play)

- 示例

```ts
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

<TB>

```ts
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]
```

</TB>

## Includes

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00898-easy-includes/README.md) | [playground](https://tsch.js.org/898/play)

- 示例

```ts
// expected to be `false`
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'>
```

> [isEqual](https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650)

<TB>

```ts
type isEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false

type Includes<T extends readonly any[], U> = T extends [infer F, ...infer R]
  ? isEqual<F, U> extends true
    ? true
    : Includes<R, U>
  : false
```

</TB>

## Push

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/03057-easy-push/README.md) | [playground](https://tsch.js.org/3057/play)

- 示例

```ts
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

<TB>

```ts
type Push<T, U> = T extends unknown[] ? [...T, U] : never
```

</TB>

## AnyOf

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00949-medium-anyof/README.md) | [playground](https://tsch.js.org/949/play)

- 类型接收一个数组，如果数组中任一个元素为真，则返回 `true`，否则返回 `false`  
  如果数组为空，返回 `false`

```ts
type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.
```

<TB>

```ts
type False = null | undefined | 0 | '' | false | [] | Record<PropertyKey, never>
type AnyOf<T extends readonly any[]> = T[number] extends False ? false : true
```

</TB>

## IndexOf

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/05153-medium-indexof/README.md) | [playground](https://tsch.js.org/5153/play)

- 示例

```ts
type Res = IndexOf<[1, 2, 3], 2> // expected to be 1
type Res1 = IndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3> // expected to be 2
type Res2 = IndexOf<[0, 0, 0], 2> // expected to be -1
```

<TB>

```ts
type IndexOf<T extends any[], U, LEN extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? isEqual<F, U> extends true
    ? LEN['length']
    : IndexOf<R, U, [1, ...H]>
  : -1
```

</TB>

## LastIndexOf

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/05317-medium-lastindexof/README.md) | [playground](https://tsch.js.org/5317/play)

- 示例

```ts
type Res1 = LastIndexOf<[1, 2, 3, 2, 1], 2> // 3
type Res2 = LastIndexOf<[0, 0, 0], 2> // -1
```

<TB>

```ts
type LastIndexOf<
  T extends any[],
  U,
  RES extends number = -1,
  LEN extends any[] = []
> = T extends [infer F, ...infer R]
  ? isEqual<F, U> extends true
    ? LastIndexOf<R, U, LEN['length'], [...LEN, 1]>
    : LastIndexOf<R, U, RES, [...LEN, 1]>
  : RES
```

</TB>

## Without

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/05117-medium-without/README.md) | [playground](https://tsch.js.org/5117/play)

- 示例

```ts
type Res = Without<[1, 2], 1> // expected to be [2]
type Res1 = Without<[1, 2, 4, 1, 5], [1, 2]> // expected to be [4, 5]
type Res2 = Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]> // expected to be []
```

<TB>

```ts
// resolve$1
type Tounion<T> = T extends any[] ? T[number] : T

type Without<T extends any[], U, RES extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? F extends Tounion<U>
    ? Without<R, U, RES>
    : Without<R, U, [...RES, F]>
  : RES

// resolve$2
type Arrayable<T> = T extends any[] ? T : [T]

type Without$1<T extends any[], U, RES extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? Includes<Arrayable<U>, F> extends true
    ? Without$1<R, U, RES>
    : Without$1<R, U, [...RES, F]>
  : RES
```

</TB>

## Flatten

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00459-medium-flatten/README.md) | [playground](https://tsch.js.org/459/play)

- 示例

```ts
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

<TB>

```ts
type Flatten<T extends any[]> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : T
```

</TB>

## FlattenDepth

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/03243-medium-flattendepth/README.md) | [playground](https://tsch.js.org/3243/play)

- 示例

```ts
type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>
// [1, 2, 3, 4, [5]]. flatten 2 times

type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]>
// [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
```

<TB>

```ts
type FlattenDepth<
  T extends any[],
  K = 1,
  LEN extends any[] = []
> = K extends LEN['length']
  ? T
  : T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...FlattenDepth<F, K, [...LEN, 1]>, ...FlattenDepth<R, K, LEN>]
    : [F, ...FlattenDepth<R, K, LEN>]
  : T
```

</TB>

## Greater Than

- [GitHub](https://github.com/type-challenges/type-challenges/blob/main/questions/04425-medium-greater-than/README.md) | [playground](https://tsch.js.org/4425/play)

- 示例

```ts
GreaterThan<2, 1> // true
GreaterThan<1, 1> // false
GreaterThan<10, 100> // false
GreaterThan<111, 11> // true
```

<TB>

```ts
type GreaterThan<
  T extends number,
  U extends number,
  LEN extends any[] = []
> = T extends LEN['length']
  ? false
  : U extends LEN['length']
  ? true
  : GreaterThan<T, U, [...LEN, 1]>
```

</TB>

## Unique

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/05360-medium-unique/README.md) | [playground](https://tsch.js.org/5360/play)

- 示例

```ts
type Res = Unique<[1, 1, 2, 2, 3, 3]>
// expected to be [1, 2, 3]

type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>
// expected to be [1, 2, 3, 4, 5, 6, 7]

type Res2 = Unique<[1, 'a', 2, 'b', 2, 'a']>
// expected to be [1, "a", 2, "b"]

type Res3 = Unique<[string, number, 1, 'a', 1, string, 2, 'b', 2, number]>
// expected to be [string, number, 1, "a", 2, "b"]

type Res4 = Unique<[unknown, unknown, any, any, never, never]>
// expected to be [unknown, any, never]
```

<TB>

```ts
// see ##Includes
type Unique<T extends any[], RES extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? Includes<RES, F> extends true
    ? Unique<R, RES>
    : Unique<R, [...RES, F]>
  : RES
```

</TB>

## Join

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/05310-medium-join/README.md) | [playground](https://tsch.js.org/5310/play)

- 示例

```ts
type Res = Join<['a', 'p', 'p', 'l', 'e'], '-'> // expected to be 'a-p-p-l-e'
type Res1 = Join<['Hello', 'World'], ' '> // expected to be 'Hello World'
type Res2 = Join<['2', '2', '2'], 1> // expected to be '21212'
type Res3 = Join<['o'], 'u'> // expected to be 'o'
```

<TB label="解">

```ts

```

</TB>

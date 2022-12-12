---
date： 2022/12/12
---

# 内置类型

## Pick

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.md) | [playground](https://tsch.js.org/4/play)

- 示例

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}
type TodoPreview = MyPick<Todo, 'title' | 'completed'>
// { title: string, completed: string }
```

<TB>

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

</TB>

## Exclude

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.md) | [playground](https://tsch.js.org/43/play)

- 示例

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

<TB>

```ts
type MyExclude<T, U> = T extends U ? never : T
```

</TB>

## Parameters

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/03312-easy-parameters/README.md) | [playground](https://tsch.js.org/3312/play)

- 示例

```ts
const foo = (arg1: string, arg2: number): void => {}
type FunctionParamsType = MyParameters<typeof foo>
// [arg1: string, arg2: number]
```

<TB>

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never
```

</TB>

## Get Return type

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00002-medium-return-type/README.md) | [playground](https://tsch.js.org/2/play)

- 示例

```ts
const fn = (v: boolean) => {
  if (v) return 1
  else return 2
}
type a = MyReturnType<typeof fn> // should be "1 | 2"
```

<TB>

```ts
type MyReturnType<T extends (...args: any) => unknown> = T extends (
  ...args: any
) => infer R
  ? R
  : any
```

</TB>

## Omit

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00003-medium-omit/README.md) | [playground](https://tsch.js.org/3/play)

- 示例

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}
type TodoPreview = MyOmit<Todo, 'description' | 'title'>
// should be { completed: boolean }
```

<TB>

```ts
// resolve$1
type MyOmit<T, K extends string | number | symbol> = {
  [P in Exclude<keyof T, K>]: T[P]
}

// resolve$2
type MyOmit$2<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

</TB>

## Awaited

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00189-easy-awaited/README.md) | [playground](https://tsch.js.org/189/play)

- 示例

```ts
type ExampleType = Promise<string>
type Result = MyAwaited<ExampleType> // string
```

<TB>

```ts

```

</TB>

## Promise.all

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00020-medium-promise-all/README.md) | [playground](https://tsch.js.org/20/play)

- 示例

```typescript
const promise1 = Promise.resolve(3)
const promise2 = 42
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo')
})

const p = PromiseAll([promise1, promise2, promise3] as const)
// expected to be `Promise<[number, 42, string]>`
```

<TB>

```ts

```

</TB>

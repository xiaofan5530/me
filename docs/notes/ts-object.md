---
date： 2022/12/12
---

# 对象

## Merge

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00599-medium-merge/README.md) | [playground](https://tsch.js.org/599/play)

- 示例

```ts
type foo = {
  name: string
  age: string
}
type coo = {
  age: number
  sex: string
}

type Result = Merge<foo, coo>
// expected to be { name: string, age: number, sex: string }
```

<TB>

```ts
type Merge<F, S> = {
  [P in keyof F | keyof S]: P extends keyof S
    ? S[P]
    : P extends keyof F
    ? F[P]
    : never
}
```

</TB>

## Diff

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/00645-medium-diff/README.md) | [playground](https://tsch.js.org/645/play)

- 示例

```ts
type Foo = {
  name: string
  age: string
}
type Bar = {
  name: string
  age: string
  gender: number
}

type Result = Diff<Foo, Bar>
// expected to be { gender: number }
```

<TB>

```ts
type RemoveNever<O> = {
  [P in keyof O as O[P] extends never ? never : P]: O[P]
}

type Diff<O, O1> = RemoveNever<{
  [P in keyof O | keyof O1]: P extends keyof O
    ? P extends keyof O1
      ? never
      : P extends keyof O
      ? O[P]
      : never
    : P extends keyof O1
    ? O1[P]
    : never
}>
```

</TB>

## PickByType

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/02595-medium-pickbytype/README.md) | [playground](https://tsch.js.org/2595/play)

- 示例

```ts
type OnlyBoolean = PickByType<
  {
    name: string
    count: number
    isReadonly: boolean
    isEnable: boolean
  },
  boolean
> // { isReadonly: boolean, isEnable: boolean }
```

<TB>

```ts
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P]
}
```

</TB>

## PartialByKeys

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/02757-medium-partialbykeys/README.md) | [playground](https://tsch.js.org/2757/play)

- 示例

```ts
interface User {
  name: string
  age: number
  address: string
}

type UserPartialName = PartialByKeys<User, 'name'>
// { name?:string; age:number; address:string }
```

<TB>

```ts
type Join<T> = {
  [P in keyof T]: T[P]
}

type PartialByKeys<T, K> = Join<
  {
    [P in keyof T as P extends K ? P : never]?: T[P]
  } & {
    [P in keyof T as P extends K ? never : P]: T[P]
  }
>
```

</TB>

## OmitByType

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/02852-medium-omitbytype/README.md) | [playground](https://tsch.js.org/2852/play)

- 示例

```ts
type OmitBoolean = OmitByType<
  {
    name: string
    count: number
    isReadonly: boolean
    isEnable: boolean
  },
  boolean
> // { name: string; count: number }
```

<TB>

```ts
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P]
}
```

</TB>

## RequiredByKeys

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/02759-medium-requiredbykeys/README.md) | [playground](https://tsch.js.org/2759/play)

- 示例

```ts
interface User {
  name?: string
  age?: number
  address?: string
}

type UserRequiredName = RequiredByKeys<User, 'name'>
// { name: string; age?: number; address?: string }
```

<TB>

```ts
type Join<T> = {
  [P in keyof T]: T[P]
}
type RequiredByKeys<T, K = keyof T> = Join<
  {
    [P in keyof T as P extends K ? P : never]-?: T[P]
  } & {
    [P in keyof T as P extends K ? never : P]?: T[P]
  }
>

// resolve2
type Copy<T> = Pick<T, keyof T>

type RequiredByKeys$1<T, K = keyof T> = Copy<
  Omit<T, K & keyof T> & Required<Pick<T, K & keyof T>>
>
```

</TB>

## ObjectEntries

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/02946-medium-objectentries/README.md) | [playground](https://tsch.js.org/2946/play)

- 示例

```ts
interface Model {
  name: string
  age: number
  locations: string[] | null
}

type modelEntries = ObjectEntries<Model>
// ['name', string] | ['age', number] | ['locations', string[] | null]
```

<TB>

```ts

```

</TB>

## Tuple to Nested Object

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/03188-medium-tuple-to-nested-object/README.md) | [playground](https://tsch.js.org/3188/play)

- 示例

```ts
type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean>
// boolean. if the tuple is empty, just return the U type
```

<TB>

```ts

```

</TB>

## Flip

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/04179-medium-flip/README.md) | [playground](https://tsch.js.org/4179/play)

- 示例

```ts
Flip<{ a: 'x'; b: 'y'; c: 'z' }> // {x: 'a', y: 'b', z: 'c'}
Flip<{ a: 1; b: 2; c: 3 }> // {1: 'a', 2: 'b', 3: 'c'}
Flip<{ a: false; b: true }> // {false: 'a', true: 'b'}
```

<TB>

```ts
type Flip<T extends Record<PropertyKey, any>> = {
  [P in keyof T as T[P] extends PropertyKey ? T[P] : `${T[P]}`]: P
}
```

</TB>

## InorderTraversal

- [github](https://github.com/type-challenges/type-challenges/blob/main/questions/03376-medium-inordertraversal/README.md) | [playground](https://tsch.js.org/3376/play)

- 示例

```ts
const tree1 = {
  val: 1,
  left: null,
  right: {
    val: 2,
    left: {
      val: 3,
      left: null,
      right: null
    },
    right: null
  }
} as const

type A = InorderTraversal<typeof tree1> // [1, 3, 2]
```

<TB>

```ts

```

</TB>

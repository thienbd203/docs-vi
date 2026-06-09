# Reactivity API: Utilities {#reactivity-api-utilities}

## isRef() {#isref}

Kiểm tra xem một giá trị có phải là một ref object hay không.

- **Type**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  Lưu ý kiểu trả về là một [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), có nghĩa là `isRef` có thể được sử dụng như một type guard:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // kiểu của foo được thu hẹp thành Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

Trả về giá trị bên trong nếu tham số là một ref, ngược lại trả về chính tham số đó. Đây là một hàm viết tắt cho `val = isRef(val) ? val.value : val`.

- **Type**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Ví dụ**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped được đảm bảo là number bây giờ
  }
  ```

## toRef() {#toref}

Có thể được sử dụng để chuẩn hóa values / refs / getters thành refs (3.3+).

Cũng có thể được sử dụng để tạo một ref cho một thuộc tính trên một reactive object nguồn. Ref được tạo sẽ được đồng bộ với thuộc tính nguồn của nó: thay đổi thuộc tính nguồn sẽ cập nhật ref, và ngược lại.

- **Type**

  ```ts
  // normalization signature (3.3+)
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // object property signature
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Ví dụ**

  Normalization signature (3.3+):

  ```js
  // trả về refs hiện có như nguyên bản
  toRef(existingRef)

  // tạo một readonly ref gọi getter khi truy cập .value
  toRef(() => props.foo)

  // tạo refs bình thường từ các giá trị không phải hàm
  // tương đương với ref(1)
  toRef(1)
  ```

  Object property signature:

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // một ref hai chiều đồng bộ với thuộc tính gốc
  const fooRef = toRef(state, 'foo')

  // thay đổi ref sẽ cập nhật giá trị gốc
  fooRef.value++
  console.log(state.foo) // 2

  // thay đổi giá trị gốc cũng cập nhật ref
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Lưu ý điều này khác với:

  ```js
  const fooRef = ref(state.foo)
  ```

  Ref ở trên **không** đồng bộ với `state.foo`, vì `ref()` nhận một giá trị số thuần túy.

  `toRef()` hữu ích khi bạn muốn truyền ref của một prop vào một composable function:

  ```vue
  <script setup>
  import { toRef } from 'vue'

  const props = defineProps(/* ... */)

  // chuyển đổi `props.foo` thành một ref, sau đó truyền vào
  // một composable
  useSomeFeature(toRef(props, 'foo'))

  // cú pháp getter - được khuyến nghị trong 3.3+
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```

  Khi `toRef` được sử dụng với component props, các hạn chế thông thường về việc thay đổi props vẫn áp dụng. Việc cố gắng gán một giá trị mới cho ref tương đương với việc cố gắng sửa đổi prop trực tiếp và không được phép. Trong trường hợp đó, bạn có thể muốn cân nhắc sử dụng [`computed`](./reactivity-core#computed) với `get` và `set` thay thế. Xem hướng dẫn về [sử dụng `v-model` với components](/guide/components/v-model) để biết thêm thông tin.

  Khi sử dụng object property signature, `toRef()` sẽ trả về một ref có thể sử dụng ngay cả khi thuộc tính nguồn hiện không tồn tại. Điều này cho phép làm việc với các thuộc tính tùy chọn, vốn sẽ không được [`toRefs`](#torefs) nhận diện.

## toValue() {#tovalue}

- Chỉ được hỗ trợ trong 3.3+

Chuẩn hóa values / refs / getters thành values. Tương tự như [unref()](#unref), ngoại trừ việc nó cũng chuẩn hóa getters. Nếu tham số là một getter, nó sẽ được gọi và giá trị trả về sẽ được trả về.

Có thể được sử dụng trong [Composables](/guide/reusability/composables.html) để chuẩn hóa một tham số có thể là value, ref, hoặc getter.

- **Type**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **Ví dụ**

  ```js
  toValue(1) //       --> 1
  toValue(ref(1)) //  --> 1
  toValue(() => 1) // --> 1
  ```

  Chuẩn hóa tham số trong composables:

  ```ts
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(() => toValue(id), id => {
      // phản ứng với sự thay đổi của id
    })
  }

  // composable này hỗ trợ bất kỳ cái nào sau đây:
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

## toRefs() {#torefs}

Chuyển đổi một reactive object thành một plain object trong đó mỗi thuộc tính của object kết quả là một ref trỏ đến thuộc tính tương ứng của object gốc. Mỗi ref riêng lẻ được tạo bằng cách sử dụng [`toRef()`](#toref).

- **Type**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Ví dụ**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  Type of stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // ref và thuộc tính gốc được "liên kết"
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` hữu ích khi trả về một reactive object từ một composable function để component sử dụng có thể destructure/spread object được trả về mà không mất reactivity:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...logic hoạt động trên state

    // chuyển đổi thành refs khi trả về
    return toRefs(state)
  }

  // có thể destructure mà không mất reactivity
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` chỉ sẽ tạo refs cho các thuộc tính có thể liệt kê trên object nguồn tại thời điểm gọi. Để tạo một ref cho một thuộc tính có thể chưa tồn tại, hãy sử dụng [`toRef`](#toref) thay thế.

## isProxy() {#isproxy}

Kiểm tra xem một object có phải là proxy được tạo bởi [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](./reactivity-advanced#shallowreactive) hoặc [`shallowReadonly()`](./reactivity-advanced#shallowreadonly) hay không.

- **Type**

  ```ts
  function isProxy(value: any): boolean
  ```

## isReactive() {#isreactive}

Kiểm tra xem một object có phải là proxy được tạo bởi [`reactive()`](./reactivity-core#reactive) hoặc [`shallowReactive()`](./reactivity-advanced#shallowreactive) hay không.

- **Type**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Kiểm tra xem giá trị được truyền có phải là một readonly object hay không. Các thuộc tính của readonly object có thể thay đổi, nhưng không thể được gán trực tiếp thông qua object được truyền.

Các proxy được tạo bởi [`readonly()`](./reactivity-core#readonly) và [`shallowReadonly()`](./reactivity-advanced#shallowreadonly) đều được coi là readonly, cũng như một [`computed()`](./reactivity-core#computed) ref không có hàm `set`.

- **Type**

  ```ts
  function isReadonly(value: unknown): boolean
  ```

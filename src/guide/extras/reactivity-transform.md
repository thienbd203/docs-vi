# Reactivity Transform {#reactivity-transform}

:::danger Tính năng Thử nghiệm Đã Xóa
Reactivity Transform là một tính năng thử nghiệm và đã bị xóa trong bản phát hành 3.4 mới nhất. Vui lòng đọc về [lý do tại đây](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

Nếu bạn vẫn định sử dụng nó, nó hiện có sẵn thông qua plugin [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html).
:::

:::tip Riêng cho Composition-API
Reactivity Transform là một tính năng riêng cho Composition-API và yêu cầu một bước build.
:::

## Refs vs. Biến Phản Ứng {#refs-vs-reactive-variables}

Kể từ khi giới thiệu Composition API, một trong những câu hỏi chưa được giải quyết chính là việc sử dụng refs so với các đối tượng phản ứng. Dễ mất phản ứng khi destructuring các đối tượng phản ứng, trong khi có thể khó chịu khi sử dụng `.value` ở mọi nơi khi sử dụng refs. Ngoài ra, `.value` dễ bị bỏ sót nếu không sử dụng hệ thống kiểu.

[Vue Reactivity Transform](https://github.com/vuejs/core/tree/main/packages/reactivity-transform) là một transform tại thời điểm biên dịch cho phép chúng ta viết mã như thế này:

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

Phương thức `$ref()` ở đây là một **compile-time macro**: nó không phải là một phương thức thực tế sẽ được gọi tại runtime. Thay vào đó, trình biên dịch Vue sử dụng nó như một gợi ý để xử lý biến `count` kết quả như một **biến phản ứng**.

Các biến phản ứng có thể được truy cập và gán lại giống như các biến bình thường, nhưng các hoạt động này được biên dịch thành refs với `.value`. Ví dụ, phần `<script>` của component ở trên được biên dịch thành:

```js{5,8}
import { ref } from 'vue'

let count = ref(0)

console.log(count.value)

function increment() {
  count.value++
}
```

Every reactivity API that returns refs will have a `$`-prefixed macro equivalent. These APIs include:

- [`ref`](/api/reactivity-core#ref) -> `$ref`
- [`computed`](/api/reactivity-core#computed) -> `$computed`
- [`shallowRef`](/api/reactivity-advanced#shallowref) -> `$shallowRef`
- [`customRef`](/api/reactivity-advanced#customref) -> `$customRef`
- [`toRef`](/api/reactivity-utilities#toref) -> `$toRef`

Các macro này có sẵn toàn cầu và không cần được import khi Reactivity Transform được bật, nhưng bạn có thể tùy chọn import chúng từ `vue/macros` nếu bạn muốn rõ ràng hơn:

```js
import { $ref } from 'vue/macros'

let count = $ref(0)
```

## Destructuring with `$()` {#destructuring-with}

It is common for a composition function to return an object of refs, and use destructuring to retrieve these refs. For this purpose, reactivity transform provides the **`$()`** macro:

```js
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

Compiled output:

```js
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

Note that if `x` is already a ref, `toRef(__temp, 'x')` will simply return it as-is and no additional ref will be created. If a destructured value is not a ref (e.g. a function), it will still work - the value will be wrapped in a ref so the rest of the code works as expected.

`$()` destructure works on both reactive objects **and** plain objects containing refs.

## Chuyển đổi Refs Hiện có thành Biến Phản Ứng với `$()` {#convert-existing-refs-to-reactive-variables-with}

Trong một số trường hợp chúng ta có thể có các hàm được bao bọc cũng trả về refs. Tuy nhiên, trình biên dịch Vue sẽ không thể biết trước rằng một hàm sẽ trả về một ref. Trong những trường hợp như vậy, macro `$()` cũng có thể được sử dụng để chuyển đổi bất kỳ refs hiện có nào thành biến phản ứng:

```js
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

## Destructure Props Phản Ứng {#reactive-props-destructure}

Có hai điểm khó khăn với việc sử dụng `defineProps()` hiện tại trong `<script setup>`:

1. Tương tự như `.value`, bạn cần luôn truy cập props như `props.x` để giữ phản ứng. Điều này có nghĩa là bạn không thể destructure `defineProps` vì các biến destructured kết quả không phản ứng và sẽ không cập nhật.

2. Khi sử dụng [khai báo props chỉ type](/api/sfc-script-setup#type-only-props-emit-declarations), không có cách dễ dàng để khai báo giá trị mặc định cho các props. Chúng tôi đã giới thiệu API `withDefaults()` cho mục đích chính xác này, nhưng vẫn khó sử dụng.

Chúng ta có thể giải quyết các vấn đề này bằng cách áp dụng một transform tại thời điểm biên dịch khi `defineProps` được sử dụng với destructuring, tương tự như chúng ta đã thấy trước đó với `$()`:

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // default value just works
    count = 1,
    // local aliasing also just works
    // here we are aliasing `props.foo` to `bar`
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // will log whenever the props change
    console.log(msg, count, bar)
  })
</script>
```

Cái trên sẽ được biên dịch thành khai báo runtime tương đương sau:

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

## Retaining Reactivity Across Function Boundaries {#retaining-reactivity-across-function-boundaries}

While reactive variables relieve us from having to use `.value` everywhere, it creates an issue of "reactivity loss" when we pass reactive variables across function boundaries. This can happen in two cases:

### Passing into function as argument {#passing-into-function-as-argument}

Given a function that expects a ref as an argument, e.g.:

```ts
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x changed!')
  })
}

let count = $ref(0)
trackChange(count) // doesn't work!
```

Trường hợp trên sẽ không hoạt động như mong đợi vì nó biên dịch thành:

```ts
let count = ref(0)
trackChange(count.value)
```

Here `count.value` is passed as a number, whereas `trackChange` expects an actual ref. This can be fixed by wrapping `count` with `$$()` before passing it:

```diff
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))
```

Cái trên biên dịch thành:

```js
import { ref } from 'vue'

let count = ref(0)
trackChange(count)
```

Như chúng ta có thể thấy, `$$()` là một macro đóng vai trò là một **escape hint**: các biến phản ứng bên trong `$$()` sẽ không được thêm `.value`.

### Trả về trong phạm vi hàm {#returning-inside-function-scope}

Phản ứng cũng có thể bị mất nếu các biến phản ứng được sử dụng trực tiếp trong một biểu thức được trả về:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // listen to mousemove...

  // doesn't work!
  return {
    x,
    y
  }
}
```

Câu lệnh return trên biên dịch thành:

```ts
return {
  x: x.value,
  y: y.value
}
```

Để giữ phản ứng, chúng ta nên trả về các refs thực tế, không phải giá trị hiện tại tại thời điểm trả về.

Một lần nữa, chúng ta có thể sử dụng `$$()` để sửa điều này. Trong trường hợp này, `$$()` có thể được sử dụng trực tiếp trên đối tượng được trả về - bất kỳ tham chiếu nào đến các biến phản ứng bên trong cuộc gọi `$$()` sẽ giữ tham chiếu đến các refs cơ bản của chúng:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // listen to mousemove...

  // fixed
  return $$({
    x,
    y
  })
}
```

### Using `$$()` on destructured props {#using-on-destructured-props}

`$$()` works on destructured props since they are reactive variables as well. The compiler will convert it with `toRef` for efficiency:

```ts
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))
```

compiles to:

```js
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```

## Tích hợp TypeScript <sup class="vt-badge ts" /> {#typescript-integration}

Vue cung cấp typings cho các macro này (có sẵn toàn cầu) và tất cả các loại sẽ hoạt động như mong đợi. Không có sự không tương thích với ngữ nghĩa TypeScript tiêu chuẩn, vì vậy cú pháp sẽ hoạt động với tất cả các công cụ hiện có.

Điều này cũng có nghĩa là các macro có thể hoạt động trong bất kỳ file nào nơi JS / TS hợp lệ được cho phép - không chỉ bên trong Vue SFCs.

Vì các macro có sẵn toàn cầu, các loại của chúng cần được tham chiếu rõ ràng (ví dụ: trong một file `env.d.ts`):

```ts
/// <reference types="vue/macros-global" />
```

Khi import rõ ràng các macro từ `vue/macros`, loại sẽ hoạt động mà không cần khai báo các toàn cầu.

## Opt-in Rõ ràng {#explicit-opt-in}

:::danger Không còn được hỗ trợ trong core
Dưới đây chỉ áp dụng đến phiên bản Vue 3.3 và dưới. Hỗ trợ đã bị xóa trong Vue core 3.4 và cao hơn, và `@vitejs/plugin-vue` 5.0 và cao hơn. Nếu bạn định tiếp tục sử dụng transform, vui lòng chuyển sang [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html) thay thế.
:::

### Vite {#vite}

- Requires `@vitejs/plugin-vue@>=2.0.0`
- Applies to SFCs and js(x)/ts(x) files. A fast usage check is performed on files before applying the transform so there should be no performance cost for files not using the macros.
- Note `reactivityTransform` is now a plugin root-level option instead of nested as `script.refSugar`, since it affects not just SFCs.

```js [vite.config.js]
export default {
  plugins: [
    vue({
      reactivityTransform: true
    })
  ]
}
```

### `vue-cli` {#vue-cli}

- Currently only affects SFCs
- Requires `vue-loader@>=17.0.0`

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          reactivityTransform: true
        }
      })
  }
}
```

### Plain `webpack` + `vue-loader` {#plain-webpack-vue-loader}

- Currently only affects SFCs
- Requires `vue-loader@>=17.0.0`

```js [webpack.config.js]
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}
```

# \<script setup> {#script-setup}

`<script setup>` là một cú pháp rút gọn tại thời điểm biên dịch để sử dụng Composition API bên trong Single-File Components (SFCs). Đây là cú pháp được khuyến nghị nếu bạn đang sử dụng cả SFCs và Composition API. Nó cung cấp một số lợi thế so với cú pháp `<script>` bình thường:

- Code ngắn gọn hơn với ít boilerplate hơn
- Khả năng khai báo props và emitted events sử dụng TypeScript thuần túy
- Hiệu suất runtime tốt hơn (template được biên dịch thành một render function trong cùng scope, không có proxy trung gian)
- Hiệu suất suy luận type của IDE tốt hơn (ít công việc hơn cho language server để trích xuất types từ code)

## Cú pháp cơ bản {#basic-syntax}

Để sử dụng cú pháp này, thêm thuộc tính `setup` vào block `<script>`:

```vue
<script setup>
console.log('hello script setup')
</script>
```

Code bên trong được biên dịch như nội dung của hàm `setup()` của component. Điều này có nghĩa là không giống như `<script>` bình thường, chỉ thực thi một lần khi component được import lần đầu tiên, code bên trong `<script setup>` sẽ **thực thi mỗi khi một instance của component được tạo**.

### Các binding cấp cao nhất được expose ra template {#top-level-bindings-are-exposed-to-template}

Khi sử dụng `<script setup>`, bất kỳ binding cấp cao nhất nào (bao gồm biến, khai báo hàm, và imports) được khai báo bên trong `<script setup>` đều có thể sử dụng trực tiếp trong template:

```vue
<script setup>
// biến
const msg = 'Hello!'

// hàm
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

Imports cũng được expose theo cách tương tự. Điều này có nghĩa là bạn có thể sử dụng trực tiếp một hàm helper được import trong các biểu thức template mà không cần phải expose nó qua option `methods`:

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## Tính phản ứng (Reactivity) {#reactivity}

Trạng thái phản ứng cần được tạo rõ ràng sử dụng [Reactivity APIs](./reactivity-core). Tương tự như các giá trị được trả về từ hàm `setup()`, refs được tự động unwrap khi được tham chiếu trong template:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Sử dụng Components {#using-components}

Các giá trị trong scope của `<script setup>` cũng có thể được sử dụng trực tiếp như tên thẻ component tùy chỉnh:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Hãy coi `MyComponent` như một biến được tham chiếu. Nếu bạn đã sử dụng JSX, mô hình tư duy ở đây tương tự. Phiên bản kebab-case tương đương `<my-component>` cũng hoạt động trong template - tuy nhiên thẻ component PascalCase được khuyến nghị mạnh mẽ để đảm bảo tính nhất quán. Nó cũng giúp phân biệt với các custom elements gốc.

### Components động {#dynamic-components}

Vì các component được tham chiếu như các biến thay vì được đăng ký dưới các key chuỗi, chúng ta nên sử dụng binding động `:is` khi sử dụng các component động bên trong `<script setup>`:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

Lưu ý cách các component có thể được sử dụng như các biến trong một biểu thức ternary.

### Components đệ quy {#recursive-components}

Một SFC có thể tham chiếu ngầm định đến chính nó thông qua tên file của nó. Ví dụ: một file tên là `FooBar.vue` có thể tham chiếu đến chính nó như `<FooBar/>` trong template của nó.

Lưu ý điều này có ưu tiên thấp hơn các component được import. Nếu bạn có một named import xung đột với tên được suy ra của component, bạn có thể đặt alias cho import:

```js
import { FooBar as FooBarChild } from './components'
```

### Components có namespace {#namespaced-components}

Bạn có thể sử dụng thẻ component với dấu chấm như `<Foo.Bar>` để tham chiếu đến các component lồng nhau dưới các thuộc tính object. Điều này hữu ích khi bạn import nhiều component từ một file duy nhất:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## Sử dụng Custom Directives {#using-custom-directives}

Các custom directives được đăng ký toàn cục hoạt động bình thường. Các custom directives cục bộ không cần được đăng ký rõ ràng với `<script setup>`, nhưng chúng phải tuân theo quy tắc đặt tên `vNameOfDirective`:

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // làm gì đó với element
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

Nếu bạn đang import một directive từ nơi khác, nó có thể được đổi tên để phù hợp với quy tắc đặt tên yêu cầu:

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## defineProps() & defineEmits() {#defineprops-defineemits}

Để khai báo các option như `props` và `emits` với hỗ trợ suy luận type đầy đủ, chúng ta có thể sử dụng các API `defineProps` và `defineEmits`, được tự động có sẵn bên trong `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// code setup
</script>
```

- `defineProps` và `defineEmits` là **compiler macros** chỉ có thể sử dụng bên trong `<script setup>`. Chúng không cần được import, và được biên dịch bỏ đi khi `<script setup>` được xử lý.

- `defineProps` chấp nhận cùng giá trị với option `props`, trong khi `defineEmits` chấp nhận cùng giá trị với option `emits`.

- `defineProps` và `defineEmits` cung cấp suy luận type phù hợp dựa trên các option được truyền.

- Các option được truyền cho `defineProps` và `defineEmits` sẽ được hoist ra khỏi setup vào module scope. Do đó, các option không thể tham chiếu các biến cục bộ được khai báo trong setup scope. Việc làm như vậy sẽ dẫn đến lỗi biên dịch. Tuy nhiên, nó _có thể_ tham chiếu các bindings được import vì chúng cũng nằm trong module scope.

### Khai báo props/emit chỉ với type<sup class="vt-badge ts" /> {#type-only-props-emit-declarations}

Props và emits cũng có thể được khai báo sử dụng cú pháp type-only bằng cách truyền một type argument literal cho `defineProps` hoặc `defineEmits`:

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: cú pháp thay thế, ngắn gọn hơn
const emit = defineEmits<{
  change: [id: number] // cú pháp named tuple
  update: [value: string]
}>()
```

- `defineProps` hoặc `defineEmits` chỉ có thể sử dụng khai báo runtime HOẶC khai báo type. Sử dụng cả hai cùng lúc sẽ dẫn đến lỗi biên dịch.

- Khi sử dụng khai báo type, khai báo runtime tương đương được tự động tạo ra từ phân tích tĩnh để loại bỏ nhu cầu khai báo kép và vẫn đảm bảo hành vi runtime đúng.

  - Trong chế độ dev, compiler sẽ cố gắng suy luận validation runtime tương ứng từ các types. Ví dụ ở đây `foo: String` được suy luận từ type `foo: string`. Các types được import cũng được giải quyết, miễn là TypeScript được cài đặt như một peer dependency.

  - Trong chế độ prod, compiler sẽ tạo ra khai báo định dạng mảng để giảm kích thước bundle (props ở đây sẽ được biên dịch thành `['foo', 'bar']`)

- Trong phiên bản 3.2 và dưới, tham số type generic cho `defineProps()` bị giới hạn ở một type literal hoặc một tham chiếu đến một interface cục bộ.

  Giới hạn này đã được giải quyết trong 3.3. Phiên bản mới nhất của Vue hỗ trợ tham chiếu các types được import và một tập hợp giới hạn các types phức tạp ở vị trí tham số type. Tuy nhiên, vì chuyển đổi type sang runtime vẫn dựa trên AST, một số types phức tạp yêu cầu phân tích type thực tế, ví dụ conditional types, không được hỗ trợ. Bạn có thể sử dụng conditional types cho type của một prop đơn lẻ, nhưng không phải cho toàn bộ object props.

### Destructure Props phản ứng <sup class="vt-badge" data-text="3.5+" /> {#reactive-props-destructure}

Trong Vue 3.5 và cao hơn, các biến được destructure từ giá trị trả về của `defineProps` là phản ứng. Compiler của Vue tự động thêm tiền tố `props.` khi code trong cùng block `<script setup>` truy cập các biến được destructure từ `defineProps`:

```ts
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // chỉ chạy một lần trước 3.5
  // chạy lại khi prop "foo" thay đổi trong 3.5+
  console.log(foo)
})
```

Đoạn trên được biên dịch thành tương đương sau:

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` được chuyển thành `props.foo` bởi compiler
  console.log(props.foo)
})
```

Ngoài ra, bạn có thể sử dụng cú pháp giá trị mặc định gốc của JavaScript để khai báo các giá trị mặc định cho props. Điều này đặc biệt hữu ích khi sử dụng khai báo props dựa trên type:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

### Giá trị props mặc định khi sử dụng khai báo type <sup class="vt-badge ts" /> {#default-props-values-when-using-type-declaration}

Trong 3.5 và cao hơn, các giá trị mặc định có thể được khai báo một cách tự nhiên khi sử dụng Reactive Props Destructure. Nhưng trong 3.4 và dưới, Reactive Props Destructure không được bật theo mặc định. Để khai báo các giá trị mặc định props với khai báo dựa trên type, compiler macro `withDefaults` là cần thiết:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

Điều này sẽ được biên dịch thành các option props `default` runtime tương đương. Ngoài ra, helper `withDefaults` cung cấp kiểm tra type cho các giá trị mặc định, và đảm bảo type `props` được trả về có các cờ optional được loại bỏ cho các thuộc tính có khai báo giá trị mặc định.

:::info
Lưu ý rằng các giá trị mặc định cho các types tham chiếu có thể thay đổi (như mảng hoặc object) nên được bọc trong hàm khi sử dụng `withDefaults` để tránh sửa đổi vô tình và các tác động phụ bên ngoài. Điều này đảm bảo mỗi instance component nhận được bản sao riêng của giá trị mặc định. Điều này **không** cần thiết khi sử dụng các giá trị mặc định với destructure.
:::

## defineModel() {#definemodel}

- Chỉ có sẵn trong 3.4+

Macro này có thể được sử dụng để khai báo một prop two-way binding có thể được tiêu thụ qua `v-model` từ component cha. Ví dụ sử dụng cũng được thảo luận trong hướng dẫn [Component `v-model`](/guide/components/v-model).

Dưới lớp vỏ, macro này khai báo một model prop và một sự kiện cập nhật giá trị tương ứng. Nếu đối số đầu tiên là một chuỗi literal, nó sẽ được sử dụng như tên prop; Nếu không, tên prop sẽ mặc định là `"modelValue"`. Trong cả hai trường hợp, bạn cũng có thể truyền một object bổ sung có thể bao gồm các option của prop và các option chuyển đổi giá trị của model ref.

```js
// khai báo prop "modelValue", được tiêu thụ bởi cha qua v-model
const model = defineModel()
// HOẶC: khai báo prop "modelValue" với các option
const model = defineModel({ type: String })

// emit "update:modelValue" khi bị thay đổi
model.value = 'hello'

// khai báo prop "count", được tiêu thụ bởi cha qua v-model:count
const count = defineModel('count')
// HOẶC: khai báo prop "count" với các option
const count = defineModel('count', { type: Number, default: 0 })

function inc() {
  // emit "update:count" khi bị thay đổi
  count.value++
}
```

:::warning
Nếu bạn có một giá trị `default` cho prop `defineModel` và bạn không cung cấp bất kỳ giá trị nào cho prop này từ component cha, nó có thể gây ra mất đồng bộ hóa giữa component cha và con. Trong ví dụ dưới đây, `myRef` của cha là undefined, nhưng `model` của con là 1:

```vue [Child.vue]
<script setup>
const model = defineModel({ default: 1 })
</script>
```

```vue [Parent.vue]
<script setup>
const myRef = ref()
</script>

<template>
  <Child v-model="myRef"></Child>
</template>
```

:::

### Modifiers và Transformers {#modifiers-and-transformers}

Để truy cập các modifiers được sử dụng với directive `v-model`, chúng ta có thể destructure giá trị trả về của `defineModel()` như sau:

```js
const [modelValue, modelModifiers] = defineModel()

// tương ứng với v-model.trim
if (modelModifiers.trim) {
  // ...
}
```

Khi một modifier có mặt, chúng ta có thể cần chuyển đổi giá trị khi đọc hoặc đồng bộ hóa nó trở lại component cha. Chúng ta có thể đạt được điều này bằng cách sử dụng các option transformer `get` và `set`:

```js
const [modelValue, modelModifiers] = defineModel({
  // get() được bỏ qua vì không cần thiết ở đây
  set(value) {
    // nếu modifier .trim được sử dụng, trả về giá trị đã trim
    if (modelModifiers.trim) {
      return value.trim()
    }
    // nếu không, trả về giá trị nguyên vẹn
    return value
  }
})
```

### Sử dụng với TypeScript <sup class="vt-badge ts" /> {#usage-with-typescript}

Giống như `defineProps` và `defineEmits`, `defineModel` cũng có thể nhận các type arguments để chỉ định các types của giá trị model và các modifiers:

```ts
const modelValue = defineModel<string>()
//    ^? Ref<string | undefined>

// model mặc định với các option, required loại bỏ các giá trị undefined có thể
const modelValue = defineModel<string>({ required: true })
//    ^? Ref<string>

const [modelValue, modifiers] = defineModel<string, 'trim' | 'uppercase'>()
//                 ^? Record<'trim' | 'uppercase', true | undefined>
```

## defineExpose() {#defineexpose}

Các component sử dụng `<script setup>` là **đóng theo mặc định** - tức là instance công khai của component, được truy xuất qua template refs hoặc chuỗi `$parent`, sẽ **không** expose bất kỳ binding nào được khai báo bên trong `<script setup>`.

Để expose rõ ràng các thuộc tính trong một component `<script setup>`, sử dụng compiler macro `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

Khi một component cha nhận được instance của component này qua template refs, instance được truy xuất sẽ có dạng `{ a: number, b: number }` (refs được tự động unwrap giống như trên các instance bình thường).

## defineOptions() {#defineoptions}

- Chỉ được hỗ trợ trong 3.3+

Macro này có thể được sử dụng để khai báo các option component trực tiếp bên trong `<script setup>` mà không cần sử dụng một block `<script>` riêng biệt:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
  customOptions: {
    /* ... */
  }
})
</script>
```

- Đây là một macro. Các option sẽ được hoist lên module scope và không thể truy cập các biến cục bộ trong `<script setup>` không phải là hằng số literal.

## defineSlots()<sup class="vt-badge ts"/> {#defineslots}

- Chỉ được hỗ trợ trong 3.3+

Macro này có thể được sử dụng để cung cấp type hints cho IDEs để kiểm tra type tên slot và props.

`defineSlots()` chỉ chấp nhận một tham số type và không có đối số runtime. Tham số type nên là một type literal trong đó key thuộc tính là tên slot, và type giá trị là hàm slot. Đối số đầu tiên của hàm là props mà slot mong đợi nhận, và type của nó sẽ được sử dụng cho slot props trong template. Type trả về hiện tại bị bỏ qua và có thể là `any`, nhưng chúng ta có thể tận dụng nó để kiểm tra nội dung slot trong tương lai.

Nó cũng trả về object `slots`, tương đương với object `slots` được expose trên setup context hoặc được trả về bởi `useSlots()`.

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

## `useSlots()` & `useAttrs()` {#useslots-useattrs}

Việc sử dụng `slots` và `attrs` bên trong `<script setup>` nên tương đối hiếm, vì bạn có thể truy cập chúng trực tiếp như `$slots` và `$attrs` trong template. Trong trường hợp hiếm khi bạn thực sự cần chúng, sử dụng các helper `useSlots` và `useAttrs` tương ứng:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` và `useAttrs` là các hàm runtime thực tế trả về tương đương với `setupContext.slots` và `setupContext.attrs`. Chúng cũng có thể được sử dụng trong các hàm composition API bình thường.

## Sử dụng cùng với `<script>` bình thường {#usage-alongside-normal-script}

`<script setup>` có thể được sử dụng cùng với `<script>` bình thường. Một `<script>` bình thường có thể cần thiết trong các trường hợp chúng ta cần:

- Khai báo các option không thể biểu diễn trong `<script setup>`, ví dụ `inheritAttrs` hoặc các option tùy chỉnh được bật qua plugins (Có thể được thay thế bằng [`defineOptions`](/api/sfc-script-setup#defineoptions) trong 3.3+).
- Khai báo các named exports.
- Chạy các tác động phụ hoặc tạo các object chỉ nên thực thi một lần.

```vue
<script>
// <script> bình thường, thực thi trong module scope (chỉ một lần)
runSideEffectOnce()

// khai báo các option bổ sung
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// thực thi trong setup() scope (cho mỗi instance)
</script>
```

Hỗ trợ kết hợp `<script setup>` và `<script>` trong cùng một component bị giới hạn ở các tình huống được mô tả ở trên. Cụ thể:

- **KHÔNG** sử dụng một phần `<script>` riêng biệt cho các option đã có thể được định nghĩa sử dụng `<script setup>`, như `props` và `emits`.
- Các biến được tạo bên trong `<script setup>` không được thêm như các thuộc tính vào instance component, làm cho chúng không thể truy cập từ Options API. Việc trộn các API theo cách này bị khuyến nghị mạnh mẽ chống lại.

Nếu bạn thấy mình trong một trong các tình huống không được hỗ trợ thì bạn nên cân nhắc chuyển sang một hàm [`setup()`](/api/composition-api-setup) rõ ràng, thay vì sử dụng `<script setup>`.

## `await` cấp cao nhất {#top-level-await}

`await` cấp cao nhất có thể được sử dụng bên trong `<script setup>`. Code kết quả sẽ được biên dịch như `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

Ngoài ra, biểu thức awaited sẽ được tự động biên dịch trong một định dạng bảo toàn context instance component hiện tại sau `await`.

:::warning Lưu ý
`async setup()` phải được sử dụng kết hợp với [`Suspense`](/guide/built-ins/suspense.html), hiện tại vẫn là một tính năng thử nghiệm. Chúng tôi dự định hoàn thiện và tài liệu hóa nó trong một bản phát hành trong tương lai - nhưng nếu bạn tò mò ngay bây giờ, bạn có thể tham khảo [tests](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts) của nó để xem cách nó hoạt động.
:::

## Câu lệnh Import {#imports-statements}

Các câu lệnh import trong vue tuân theo [ECMAScript module specification](https://nodejs.org/api/esm.html).
Ngoài ra, bạn có thể sử dụng các alias được định nghĩa trong cấu hình công cụ build của bạn:

```vue
<script setup>
import { ref } from 'vue'
import { componentA } from './Components'
import { componentB } from '@/Components'
import { componentC } from '~/Components'
</script>
```

## Generics <sup class="vt-badge ts" /> {#generics}

Các tham số type generic có thể được khai báo sử dụng thuộc tính `generic` trên thẻ `<script>`:

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

Giá trị của `generic` hoạt động chính xác như danh sách tham số giữa `<...>` trong TypeScript. Ví dụ, bạn có thể sử dụng nhiều tham số, các ràng buộc `extends`, types mặc định, và tham chiếu các types được import:

```vue
<script
  setup
  lang="ts"
  generic="T extends string | number, U extends Item"
>
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

Bạn có thể sử dụng directive `@vue-generic` để truyền vào các types rõ ràng, cho khi type không thể được suy luận:

```vue
<template>
  <!-- @vue-generic {import('@/api').Actor} -->
  <ApiSelect v-model="peopleIds" endpoint="/api/actors" id-prop="actorId" />

  <!-- @vue-generic {import('@/api').Genre} -->
  <ApiSelect v-model="genreIds" endpoint="/api/genres" id-prop="genreId" />
</template>
```

Để sử dụng một tham chiếu đến một component generic trong một `ref` bạn cần sử dụng thư viện [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) vì `InstanceType` sẽ không hoạt động.

```vue
<script
  setup
  lang="ts"
>
import componentWithoutGenerics from '../component-without-generics.vue';
import genericComponent from '../generic-component.vue';

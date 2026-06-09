# TypeScript với Composition API {#typescript-with-composition-api}

<ScrimbaLink href="https://scrimba.com/links/vue-ts-composition-api" title="Free Vue.js TypeScript with Composition API Lesson" type="scrimba">
  Xem bài học video tương tác trên Scrimba
</ScrimbaLink>

> Trang này giả định rằng bạn đã đọc tổng quan về [Sử dụng Vue với TypeScript](./overview).

## Khai báo kiểu cho Component Props {#typing-component-props}

### Sử dụng `<script setup>` {#using-script-setup}

Khi sử dụng `<script setup>`, macro `defineProps()` hỗ trợ suy luận kiểu props dựa trên đối số của nó:

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

Đây được gọi là "khai báo runtime" (runtime declaration), vì đối số được truyền vào `defineProps()` sẽ được sử dụng như tùy chọn `props` runtime.

Tuy nhiên, thường sẽ trực tiếp hơn khi định nghĩa props với kiểu thuần túy thông qua đối số kiểu generic:

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

Đây được gọi là "khai báo dựa trên kiểu" (type-based declaration). Trình biên dịch sẽ cố gắng hết sức để suy luận các tùy chọn runtime tương đương dựa trên đối số kiểu. Trong trường hợp này, ví dụ thứ hai của chúng ta được biên dịch thành các tùy chọn runtime giống hệt ví dụ đầu tiên.

Bạn có thể sử dụng khai báo dựa trên kiểu HOẶC khai báo runtime, nhưng bạn không thể sử dụng cả hai cùng lúc.

Chúng ta cũng có thể chuyển các kiểu props vào một interface riêng:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

Điều này cũng hoạt động nếu `Props` được import từ một file khác như import tương đối, alias đường dẫn (ví dụ: `@/types`), hoặc một dependency bên ngoài (ví dụ: `node_modules`). Tính năng này yêu cầu TypeScript phải là peer dependency của Vue.

```vue
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

#### Giới hạn cú pháp {#syntax-limitations}

Trong phiên bản 3.2 và thấp hơn, tham số kiểu generic cho `defineProps()` bị giới hạn ở một kiểu literal hoặc tham chiếu đến một interface cục bộ.

Giới hạn này đã được giải quyết trong 3.3. Phiên bản mới nhất của Vue hỗ trợ tham chiếu đến các kiểu đã import và một tập hợp giới hạn các kiểu phức tạp ở vị trí tham số kiểu. Tuy nhiên, vì chuyển đổi từ kiểu sang runtime vẫn dựa trên AST, một số kiểu phức tạp yêu cầu phân tích kiểu thực tế, ví dụ như kiểu điều kiện, không được hỗ trợ. Bạn có thể sử dụng kiểu điều kiện cho kiểu của một prop đơn lẻ, nhưng không cho toàn bộ đối tượng props.

### Giá trị mặc định của Props {#props-default-values}

Khi sử dụng khai báo dựa trên kiểu, chúng ta mất khả năng khai báo giá trị mặc định cho props. Điều này có thể được giải quyết bằng cách sử dụng [Reactive Props Destructure](/guide/components/props#reactive-props-destructure) <sup class="vt-badge" data-text="3.5+" />:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

Trong 3.4 và thấp hơn, Reactive Props Destructure không được bật theo mặc định. Một giải pháp thay thế là sử dụng macro trình biên dịch `withDefaults`:

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

Điều này sẽ được biên dịch thành các tùy chọn `default` của props runtime tương đương. Ngoài ra, helper `withDefaults` cung cấp kiểm tra kiểu cho các giá trị mặc định, và đảm bảo kiểu `props` được trả về có các cờ tùy chọn được loại bỏ cho các thuộc tính có khai báo giá trị mặc định.

:::info
Lưu ý rằng giá trị mặc định cho các kiểu tham chiếu có thể thay đổi (mutable) (như mảng hoặc đối tượng) nên được bọc trong hàm khi sử dụng `withDefaults` để tránh sửa đổi ngẫu nhiên và các tác động phụ bên ngoài. Điều này đảm bảo mỗi instance component nhận được bản sao riêng của giá trị mặc định. Điều này **không** cần thiết khi sử dụng giá trị mặc định với destructure.
:::

### Không sử dụng `<script setup>` {#without-script-setup}

Nếu không sử dụng `<script setup>`, cần phải sử dụng `defineComponent()` để bật suy luận kiểu props. Kiểu của đối tượng props được truyền vào `setup()` được suy luận từ tùy chọn `props`.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- type: string
  }
})
```

### Kiểu prop phức tạp {#complex-prop-types}

Với khai báo dựa trên kiểu, một prop có thể sử dụng kiểu phức tạp giống như bất kỳ kiểu nào khác:

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

Đối với khai báo runtime, chúng ta có thể sử dụng kiểu tiện ích `PropType`:

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

Điều này hoạt động theo cách tương tự nếu chúng ta chỉ định tùy chọn `props` trực tiếp:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

Tùy chọn `props` thường được sử dụng với Options API, vì vậy bạn sẽ tìm thấy các ví dụ chi tiết hơn trong hướng dẫn về [TypeScript với Options API](/guide/typescript/options-api#typing-component-props). Các kỹ thuật được hiển thị trong các ví dụ đó cũng áp dụng cho các khai báo runtime sử dụng `defineProps()`.

## Khai báo kiểu cho Component Emits {#typing-component-emits}

Trong `<script setup>`, hàm `emit` cũng có thể được khai báo kiểu bằng cách sử dụng khai báo runtime HOẶC khai báo kiểu:

```vue
<script setup lang="ts">
// runtime
const emit = defineEmits(['change', 'update'])

// dựa trên tùy chọn
const emit = defineEmits({
  change: (id: number) => {
    // trả về `true` hoặc `false` để chỉ định
    // xác thực qua / không qua
  },
  update: (value: string) => {
    // trả về `true` hoặc `false` để chỉ định
    // xác thực qua / không qua
  }
})

// dựa trên kiểu
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: cú pháp thay thế, ngắn gọn hơn
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

Đối số kiểu có thể là một trong các sau:

1. Một kiểu hàm có thể gọi, nhưng được viết dưới dạng kiểu literal với [Call Signatures](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). Nó sẽ được sử dụng như kiểu của hàm `emit` được trả về.
2. Một kiểu literal trong đó các key là tên sự kiện, và các giá trị là kiểu mảng / tuple đại diện cho các tham số được chấp nhận thêm cho sự kiện. Ví dụ trên đang sử dụng named tuples để mỗi tham số có thể có tên rõ ràng.

Như chúng ta có thể thấy, khai báo kiểu cho chúng ta kiểm soát chi tiết hơn nhiều về các ràng buộc kiểu của các sự kiện được emit.

Khi không sử dụng `<script setup>`, `defineComponent()` có thể suy luận các sự kiện được phép cho hàm `emit` được expose trên ngữ cảnh setup:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- type check / auto-completion
  }
})
```

## Khai báo kiểu cho `ref()` {#typing-ref}

Refs suy luận kiểu từ giá trị ban đầu:

```ts
import { ref } from 'vue'

// inferred type: Ref<number>
const year = ref(2020)

// => TS Error: Type 'string' is not assignable to type 'number'.
year.value = '2020'
```

Đôi khi chúng ta có thể cần chỉ định kiểu phức tạp cho giá trị bên trong của một ref. Chúng ta có thể làm điều đó bằng cách sử dụng kiểu `Ref`:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

Hoặc, bằng cách truyền một đối số generic khi gọi `ref()` để ghi đè suy luận mặc định:

```ts
// resulting type: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```

Nếu bạn chỉ định một đối số kiểu generic nhưng bỏ qua giá trị ban đầu, kiểu kết quả sẽ là một kiểu union bao gồm `undefined`:

```ts
// inferred type: Ref<number | undefined>
const n = ref<number>()
```

## Khai báo kiểu cho `reactive()` {#typing-reactive}

`reactive()` cũng suy luận ngầm định kiểu từ đối số của nó:

```ts
import { reactive } from 'vue'

// inferred type: { title: string }
const book = reactive({ title: 'Vue 3 Guide' })
```

Để khai báo kiểu rõ ràng cho một thuộc tính `reactive`, chúng ta có thể sử dụng interfaces:

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 Guide' })
```

:::tip
Không nên sử dụng đối số generic của `reactive()` vì kiểu được trả về, xử lý việc unwrap ref lồng nhau, khác với kiểu đối số generic.
:::

## Khai báo kiểu cho `computed()` {#typing-computed}

`computed()` suy luận kiểu dựa trên giá trị trả về của getter:

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// inferred type: ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Error: Property 'split' does not exist on type 'number'
const result = double.value.split('')
```

Bạn cũng có thể chỉ định một kiểu rõ ràng thông qua đối số generic:

```ts
const double = computed<number>(() => {
  // lỗi kiểu nếu điều này không trả về một số
})
```

## Khai báo kiểu cho Event Handlers {#typing-event-handlers}

Khi xử lý các sự kiện DOM gốc, có thể hữu ích khi khai báo kiểu đúng cho đối số chúng ta truyền vào handler. Hãy xem ví dụ này:

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` ngầm định có kiểu `any`
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Không có chú thích kiểu, đối số `event` sẽ ngầm định có kiểu `any`. Điều này cũng sẽ dẫn đến lỗi TS nếu `"strict": true` hoặc `"noImplicitAny": true` được sử dụng trong `tsconfig.json`. Do đó, được khuyến nghị chú thích rõ ràng đối số của các event handler. Ngoài ra, bạn có thể cần sử dụng type assertions khi truy cập các thuộc tính của `event`:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Khai báo kiểu cho Provide / Inject {#typing-provide-inject}

Provide và inject thường được thực hiện trong các component riêng biệt. Để khai báo kiểu đúng cho các giá trị được inject, Vue cung cấp một interface `InjectionKey`, là một kiểu generic mở rộng `Symbol`. Nó có thể được sử dụng để đồng bộ hóa kiểu của giá trị được inject giữa provider và consumer:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // cung cấp giá trị không phải chuỗi sẽ dẫn đến lỗi

const foo = inject(key) // kiểu của foo: string | undefined
```

Được khuyến nghị đặt injection key trong một file riêng để nó có thể được import trong nhiều component.

Khi sử dụng các key injection dạng chuỗi, kiểu của giá trị được inject sẽ là `unknown`, và cần được khai báo rõ ràng thông qua đối số kiểu generic:

```ts
const foo = inject<string>('foo') // type: string | undefined
```

Lưu ý rằng giá trị được inject vẫn có thể là `undefined`, vì không có đảm bảo rằng một provider sẽ cung cấp giá trị này tại runtime.

Kiểu `undefined` có thể được loại bỏ bằng cách cung cấp một giá trị mặc định:

```ts
const foo = inject<string>('foo', 'bar') // type: string
```

Nếu bạn chắc chắn rằng giá trị luôn được cung cấp, bạn cũng có thể ép kiểu giá trị:

```ts
const foo = inject('foo') as string
```

## Khai báo kiểu cho Template Refs {#typing-template-refs}

Với Vue 3.5 và `@vue/language-tools` 2.1 (cung cấp năng lực cho cả dịch vụ ngôn ngữ IDE và `vue-tsc`), kiểu của refs được tạo bởi `useTemplateRef()` trong SFC có thể được **suy luận tự động** cho các ref tĩnh dựa trên phần tử mà thuộc tính `ref` khớp được sử dụng.

Trong các trường hợp suy luận tự động không khả thi, bạn vẫn có thể ép kiểu template ref thành một kiểu rõ ràng thông qua đối số generic:

```ts
const el = useTemplateRef<HTMLInputElement>('el')
```

<details>
<summary>Sử dụng trước 3.5</summary>

Template refs nên được tạo với một đối số kiểu generic rõ ràng và giá trị ban đầu là `null`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

</details>

Để lấy interface DOM đúng, bạn có thể kiểm tra các trang như [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#technical_summary).

Lưu ý rằng để an toàn kiểu nghiêm ngặt, cần phải sử dụng optional chaining hoặc type guards khi truy cập `el.value`. Điều này là do giá trị ref ban đầu là `null` cho đến khi component được mount, và nó cũng có thể được đặt thành `null` nếu phần tử được tham chiếu bị unmount bởi `v-if`.

## Khai báo kiểu cho Component Template Refs {#typing-component-template-refs}

Với Vue 3.5 và `@vue/language-tools` 2.1 (cung cấp năng lực cho cả dịch vụ ngôn ngữ IDE và `vue-tsc`), kiểu của refs được tạo bởi `useTemplateRef()` trong SFC có thể được **suy luận tự động** cho các ref tĩnh dựa trên phần tử hoặc component mà thuộc tính `ref` khớp được sử dụng.

Trong các trường hợp suy luận tự động không khả thi (ví dụ: sử dụng non-SFC hoặc component động), bạn vẫn có thể ép kiểu template ref thành một kiểu rõ ràng thông qua đối số generic.

Để lấy kiểu instance của một component được import, chúng ta cần trước tiên lấy kiểu của nó thông qua `typeof`, sau đó sử dụng tiện ích tích hợp sẵn `InstanceType` của TypeScript để trích xuất kiểu instance của nó:

```vue{6,7} [App.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp')
</script>

<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```

Trong các trường hợp kiểu chính xác của component không có sẵn hoặc không quan trọng, `ComponentPublicInstance` có thể được sử dụng thay thế. Điều này sẽ chỉ bao gồm các thuộc tính được chia sẻ bởi tất cả các component, chẳng hạn như `$el`:

```ts
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = useTemplateRef<ComponentPublicInstance>('child')
```

Trong các trường hợp component được tham chiếu là một [generic component](/guide/typescript/overview.html#generic-components), ví dụ `MyGenericModal`:

```vue [MyGenericModal.vue]
<script setup lang="ts" generic="ContentType extends string | number">
import { ref } from 'vue'

const content = ref<ContentType | null>(null)

const open = (newContent: ContentType) => (content.value = newContent)

defineExpose({
  open
})
</script>
```

Nó cần được tham chiếu bằng cách sử dụng `ComponentExposed` từ thư viện [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) vì `InstanceType` sẽ không hoạt động.

```vue [App.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import MyGenericModal from './MyGenericModal.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

const modal =
  useTemplateRef<ComponentExposed<typeof MyGenericModal>>('modal')

const openModal = () => {
  modal.value?.open('newValue')
}
</script>
```

Lưu ý rằng với `@vue/language-tools` 2.1+, kiểu của các template ref tĩnh có thể được suy luận tự động và những điều trên chỉ cần thiết trong các trường hợp đặc biệt.

## Khai báo kiểu cho Global Custom Directives {#typing-global-custom-directives}

Để lấy gợi ý kiểu và kiểm tra kiểu cho các custom directive toàn cục được khai báo với `app.directive()`, bạn có thể mở rộng `GlobalDirectives`

```ts [src/directives/highlight.ts]
import type { Directive } from 'vue'

export type HighlightDirective = Directive<HTMLElement, string>

declare module 'vue' {
  export interface GlobalDirectives {
    // tiền tố với v (v-highlight)
    vHighlight: HighlightDirective
  }
}

export default {
  mounted: (el, binding) => {
    el.style.backgroundColor = binding.value
  }
} satisfies HighlightDirective
```

```ts [main.ts]
import highlight from './directives/highlight'
// ...code khác
const app = createApp(App)
app.directive('highlight', highlight)
```

Sử dụng trong component

```vue [App.vue]
<template>
  <p v-highlight="'blue'">Câu này quan trọng!</p>
</template>
```

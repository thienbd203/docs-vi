<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // Tài liệu về v-model từng là một phần của trang này. Cố gắng chuyển hướng các liên kết đã lỗi thời.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>

# Component Events {#component-events}

> Trang này giả định rằng bạn đã đọc [Kiến thức cơ bản về Component](/guide/essentials/component-basics). Hãy đọc nó trước nếu bạn mới làm quen với component.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Free Vue.js Lesson on Defining Custom Events"/>
</div>

## Emitting và Listening to Events {#emitting-and-listening-to-events}

Một component có thể emit các event tùy chỉnh trực tiếp trong biểu thức template (ví dụ: trong một handler `v-on`) bằng phương thức tích hợp `$emit`:

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">Click Me</button>
```

<div class="options-api">

Phương thức `$emit()` cũng có sẵn trên instance của component dưới dạng `this.$emit()`:

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

Component cha có thể listen event đó bằng `v-on`:

```vue-html
<MyComponent @some-event="callback" />
```

Modifier `.once` cũng được hỗ trợ trên các component event listener:

```vue-html
<MyComponent @some-event.once="callback" />
```

Giống như component và props, tên event cung cấp chuyển đổi chữ hoa/thường tự động. Lưu ý rằng chúng ta emit một event camelCase, nhưng có thể listen nó bằng một listener kebab-cased trong component cha. Giống như [viết hoa props](/guide/components/props#prop-name-casing), chúng tôi khuyên dùng event listener kebab-cased trong template.

:::tip
Khác với event DOM gốc, các event được emit từ component **không** bubble. Bạn chỉ có thể listen các event được emit bởi một component con trực tiếp. Nếu cần giao tiếp giữa các component anh chị hoặc được lồng sâu, hãy sử dụng một event bus bên ngoài hoặc một [giải pháp quản lý state toàn cục](/guide/scaling-up/state-management).
:::

## Event Arguments {#event-arguments}

Đôi khi việc emit một giá trị cụ thể cùng với event là hữu ích. Ví dụ, chúng ta có thể muốn component `<BlogPost>` chịu trách nhiệm về việc phóng to văn bản bao nhiêu. Trong những trường hợp đó, chúng ta có thể truyền các đối số bổ sung cho `$emit` để cung cấp giá trị này:

```vue-html
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
```

Sau đó, khi chúng ta listen event trong component cha, chúng ta có thể sử dụng một arrow function inline làm listener, cho phép chúng ta truy cập đối số event:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

Hoặc, nếu event handler là một method:

```vue-html
<MyButton @increase-by="increaseCount" />
```

Sau đó giá trị sẽ được truyền làm tham số đầu tiên của method đó:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
Tất cả các đối số bổ sung được truyền cho `$emit()` sau tên event sẽ được chuyển tiếp đến listener. Ví dụ, với `$emit('foo', 1, 2, 3)`, hàm listener sẽ nhận được ba đối số.
:::

## Khai báo Emitted Events {#declaring-emitted-events}

Một component có thể khai báo rõ ràng các event mà nó sẽ emit bằng <span class="composition-api">macro [`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits)</span><span class="options-api">tùy chọn [`emits`](/api/options-state#emits)</span>:

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

Phương thức `$emit` mà chúng ta sử dụng trong `<template>` không thể truy cập được trong phần `<script setup>` của một component, nhưng `defineEmits()` trả về một hàm tương đương mà chúng ta có thể sử dụng thay thế:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

Macro `defineEmits()` **không thể** được sử dụng bên trong một hàm, nó phải được đặt trực tiếp trong `<script setup>`, như trong ví dụ trên.

Nếu bạn sử dụng một hàm `setup` rõ ràng thay vì `<script setup>`, các event nên được khai báo bằng tùy chọn [`emits`](/api/options-state#emits), và hàm `emit` được expose trên context của `setup()`:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

Giống như các thuộc tính khác của context `setup()`, `emit` có thể được destructuring một cách an toàn:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

Tùy chọn `emits` và macro `defineEmits()` cũng hỗ trợ cú pháp object. Nếu sử dụng TypeScript, bạn có thể type các đối số, cho phép chúng ta thực hiện xác thực runtime của payload của các event được emit:

<div class="composition-api">

```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // return `true` hoặc `false` để chỉ định
    // xác thực thành công / thất bại
  }
})
</script>
```

Nếu bạn sử dụng TypeScript với `<script setup>`, cũng có thể khai báo các event được emit bằng các annotation type thuần túy:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

Chi tiết thêm: [Typing Component Emits](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
      // return `true` hoặc `false` để chỉ định
      // xác thực thành công / thất bại
    }
  }
}
```

Xem thêm: [Typing Component Emits](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

Mặc dù là tùy chọn, nhưng khuyến nghị định nghĩa tất cả các event được emit để tài liệu hóa rõ hơn cách component nên hoạt động. Điều này cũng cho phép Vue loại bỏ các listener đã biết khỏi [thuộc tính kế thừa (fallthrough attributes)](/guide/components/attrs#v-on-listener-inheritance), tránh các trường hợp ngoại lệ do sự kiện DOM được dispatch thủ công bởi code bên thứ ba.

:::tip
Nếu một sự kiện gốc (ví dụ: `click`) được định nghĩa trong tùy chọn `emits`, listener sẽ chỉ lắng nghe các sự kiện `click` được emit bởi component và không còn phản hồi với các sự kiện `click` gốc.
:::

## Xác thực Sự kiện {#events-validation}

Tương tự như xác thực kiểu prop, một sự kiện được emit có thể được xác thực nếu nó được định nghĩa với cú pháp object thay vì cú pháp array.

Để thêm xác thực, sự kiện được gán một hàm nhận các đối số được truyền cho lời gọi <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> và trả về một boolean để chỉ định xem sự kiện có hợp lệ hay không.

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // Không có xác thực
  click: null,

  // Xác thực sự kiện submit
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // Không có xác thực
    click: null,

    // Xác thực sự kiện submit
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>

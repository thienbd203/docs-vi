# Template Refs {#template-refs}

Mặc dù mô hình render khai báo của Vue đã trừu tượng hóa hầu hết các thao tác DOM trực tiếp cho bạn, có thể vẫn có những trường hợp chúng ta cần truy cập trực tiếp đến các phần tử DOM bên dưới. Để đạt được điều này, chúng ta có thể sử dụng thuộc tính đặc biệt `ref`:

```vue-html
<input ref="input">
```

`ref` là một thuộc tính đặc biệt, tương tự như thuộc tính `key` được thảo luận trong chương `v-for`. Nó cho phép chúng ta lấy được tham chiếu trực tiếp đến một phần tử DOM cụ thể hoặc instance của component con sau khi nó được mount. Điều này có thể hữu ích khi bạn muốn, ví dụ, focus một input theo lập trình khi component được mount, hoặc khởi tạo một thư viện bên thứ 3 trên một phần tử.

## Truy cập Refs {#accessing-the-refs}

<div class="composition-api">

Để lấy tham chiếu với Composition API, chúng ta có thể sử dụng helper [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" />:

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// đối số đầu tiên phải khớp với giá trị ref trong template
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

Khi sử dụng TypeScript, hỗ trợ IDE của Vue và `vue-tsc` sẽ tự động suy luận kiểu của `input.value` dựa trên phần tử hoặc component mà thuộc tính `ref` tương ứng được sử dụng.

<details>
<summary>Sử dụng trước 3.5</summary>

Trong các phiên bản trước 3.5 nơi `useTemplateRef()` chưa được giới thiệu, chúng ta cần khai báo một ref với tên khớp với giá trị của thuộc tính template ref:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// khai báo một ref để giữ tham chiếu phần tử
// tên phải khớp với giá trị template ref
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

Nếu không sử dụng `<script setup>`, hãy đảm bảo cũng trả về ref từ `setup()`:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</details>

</div>
<div class="options-api">

Ref kết quả được expose trên `this.$refs`:

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

Lưu ý rằng bạn chỉ có thể truy cập ref **sau khi component được mount.** Nếu bạn cố gắng truy cập <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span> trong một biểu thức template, nó sẽ là <span class="options-api">`undefined`</span><span class="composition-api">`null`</span> ở lần render đầu tiên. Điều này là do phần tử không tồn tại cho đến sau lần render đầu tiên!

<div class="composition-api">

Nếu bạn đang cố gắng watch các thay đổi của một template ref, hãy đảm bảo xử lý trường hợp ref có giá trị `null`:

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // chưa được mount, hoặc phần tử đã bị unmount (ví dụ: bởi v-if)
  }
})
```

Xem thêm: [Typing Template Refs](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## Ref trên Component {#ref-on-component}

> Phần này giả định bạn đã có kiến thức về [Components](/guide/essentials/component-basics). Hãy thoải mái bỏ qua và quay lại sau.

`ref` cũng có thể được sử dụng trên một component con. Trong trường hợp này, tham chiếu sẽ là instance của component:

<div class="composition-api">

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = useTemplateRef('child')

onMounted(() => {
  // childRef.value sẽ giữ instance của <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

<details>
<summary>Sử dụng trước 3.5</summary>

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value sẽ giữ instance của <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

</details>

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child sẽ giữ instance của <Child />
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">Nếu component con đang sử dụng Options API hoặc không sử dụng `<script setup>`,</span><span class="options-api">Instance được tham chiếu</span> sẽ giống hệt với `this` của component con, điều này có nghĩa là component cha sẽ có quyền truy cập đầy đủ đến mọi thuộc tính và phương thức của component con. Điều này làm cho việc tạo ra các chi tiết triển khai được kết nối chặt chẽ giữa cha và con trở nên dễ dàng, vì vậy component refs chỉ nên được sử dụng khi thực sự cần thiết - trong hầu hết các trường hợp, bạn nên cố gắng triển khai tương tác cha/con bằng các giao diện props và emit tiêu chuẩn trước.

<div class="composition-api">

Một ngoại lệ ở đây là các component sử dụng `<script setup>` là **riêng tư theo mặc định**: một component cha tham chiếu đến một component con sử dụng `<script setup>` sẽ không thể truy cập bất cứ thứ gì trừ khi component con chọn để expose một giao diện công khai bằng macro `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// Compiler macros, như defineExpose, không cần được import
defineExpose({
  a,
  b
})
</script>
```

Khi một component cha lấy instance của component này thông qua template refs, instance được lấy sẽ có dạng `{ a: number, b: number }` (refs được tự động unwrap giống như trên các instance bình thường).

Lưu ý rằng defineExpose phải được gọi trước bất kỳ thao tác await nào. Nếu không, các thuộc tính và phương thức được expose sau thao tác await sẽ không thể truy cập được.

Xem thêm: [Typing Component Template Refs](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Tùy chọn `expose` có thể được sử dụng để giới hạn truy cập đến một instance con:

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

Trong ví dụ trên, một component cha tham chiếu đến component này thông qua template ref sẽ chỉ có thể truy cập `publicData` và `publicMethod`.

</div>

## Refs bên trong `v-for` {#refs-inside-v-for}

> Yêu cầu v3.5 trở lên

<div class="composition-api">

Khi `ref` được sử dụng bên trong `v-for`, ref tương ứng nên chứa một giá trị Array, sẽ được điền với các phần tử sau khi mount:

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = useTemplateRef('items')

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Thử trong Playground](https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh7s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE)

<details>
<summary>Sử dụng trước 3.5</summary>

Trong các phiên bản trước 3.5 nơi `useTemplateRef()` chưa được giới thiệu, chúng ta cần khai báo một ref với tên khớp với giá trị của thuộc tính template ref. Ref cũng nên chứa một giá trị array:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

</details>

</div>
<div class="options-api">

Khi `ref` được sử dụng bên trong `v-for`, giá trị ref kết quả sẽ là một array chứa các phần tử tương ứng:

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Thử trong Playground](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)

</div>

Cần lưu ý rằng array ref **không** đảm bảo cùng thứ tự với array nguồn.

## Function Refs {#function-refs}

Thay vì một key dạng chuỗi, thuộc tính `ref` cũng có thể được bind đến một function, function này sẽ được gọi trên mỗi lần cập nhật component và cho bạn sự linh hoạt hoàn toàn về nơi lưu trữ tham chiếu phần tử. Function nhận tham chiếu phần tử làm đối số đầu tiên:

```vue-html
<input :ref="(el) => { /* gán el cho một property hoặc ref */ }">
```

Lưu ý rằng chúng ta đang sử dụng binding động `:ref` để có thể truyền cho nó một function thay vì chuỗi tên ref. Khi phần tử bị unmount, đối số sẽ là `null`. Tất nhiên, bạn có thể sử dụng một method thay vì một function inline.

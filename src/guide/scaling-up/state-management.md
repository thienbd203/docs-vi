# Quản Lý Trạng Thái {#state-management}

## Quản Lý Trạng Thái là gì? {#what-is-state-management}

Về mặt kỹ thuật, mỗi instance component Vue đã "quản lý" trạng thái phản ứng của chính nó. Hãy lấy một component đếm đơn giản làm ví dụ:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// trạng thái
const count = ref(0)

// hành động
function increment() {
  count.value++
}
</script>

<!-- giao diện -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // trạng thái
  data() {
    return {
      count: 0
    }
  },
  // hành động
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- giao diện -->
<template>{{ count }}</template>
```

</div>

Đây là một đơn vị độc lập với các phần sau:

- **Trạng thái**, nguồn sự thật thúc đẩy ứng dụng của chúng ta;
- **Giao diện**, ánh xạ khai báo của **trạng thái**;
- **Hành động**, các cách có thể mà trạng thái có thể thay đổi để phản hồi đầu vào của người dùng từ **giao diện**.

Đây là một biểu diễn đơn giản của khái niệm "luồng dữ liệu một chiều":

<p style="text-align: center">
  <img alt="state flow diagram" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

Tuy nhiên, sự đơn giản bắt đầu bị phá vỡ khi chúng ta có **nhiều component chia sẻ một trạng thái chung**:

1. Nhiều giao diện có thể phụ thuộc vào cùng một phần trạng thái.
2. Hành động từ các giao diện khác nhau có thể cần thay đổi cùng một phần trạng thái.

Đối với trường hợp một, một giải pháp thay thế có thể là "nâng" trạng thái chia sẻ lên một component tổ tiên chung, sau đó truyền nó xuống dưới dạng props. Tuy nhiên, điều này nhanh chóng trở nên tẻ nhạt trong các cây component có phân cấp sâu, dẫn đến một vấn đề khác được gọi là [Prop Drilling](/guide/components/provide-inject#prop-drilling).

Đối với trường hợp hai, chúng ta thường thấy mình phải tìm đến các giải pháp như tiếp cận trực tiếp các instance cha/con thông qua template refs, hoặc cố gắng thay đổi và đồng bộ hóa nhiều bản sao của trạng thái thông qua các sự kiện được emit. Cả hai pattern này đều mong manh và nhanh chóng dẫn đến code khó bảo trì.

Một giải pháp đơn giản và trực tiếp hơn là trích xuất trạng thái chia sẻ ra khỏi các component, và quản lý nó trong một singleton toàn cục. Với điều này, cây component của chúng ta trở thành một "giao diện" lớn, và bất kỳ component nào cũng có thể truy cập trạng thái hoặc kích hoạt hành động, bất kể chúng ở đâu trong cây!

## Quản Lý Trạng Thái Đơn Giản với Reactivity API {#simple-state-management-with-reactivity-api}

<div class="options-api">

Trong Options API, dữ liệu phản ứng được khai báo bằng tùy chọn `data()`. Nội bộ, object được trả về bởi `data()` được tạo phản ứng thông qua hàm [`reactive()`](/api/reactivity-core#reactive), cũng có sẵn dưới dạng API công khai.

</div>

Nếu bạn có một phần trạng thái nên được chia sẻ bởi nhiều instance, bạn có thể sử dụng [`reactive()`](/api/reactivity-core#reactive) để tạo một object phản ứng, sau đó import nó vào nhiều component:

```js [store.js]
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```vue [ComponentA.vue]
<script setup>
import { store } from './store.js'
</script>

<template>From A: {{ store.count }}</template>
```

```vue [ComponentB.vue]
<script setup>
import { store } from './store.js'
</script>

<template>From B: {{ store.count }}</template>
```

</div>
<div class="options-api">

```vue [ComponentA.vue]
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
```

```vue [ComponentB.vue]
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```

</div>

Bây giờ bất cứ khi nào object `store` được thay đổi, cả `<ComponentA>` và `<ComponentB>` sẽ tự động cập nhật giao diện của chúng - chúng ta có một nguồn sự thật duy nhất bây giờ.

Tuy nhiên, điều này cũng có nghĩa là bất kỳ component nào import `store` đều có thể thay đổi nó theo bất kỳ cách nào họ muốn:

```vue-html{2}
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```

Mặc dù điều này hoạt động trong các trường hợp đơn giản, trạng thái toàn cục có thể được thay đổi tùy ý bởi bất kỳ component nào sẽ không dễ bảo trì trong dài hạn. Để đảm bảo logic thay đổi trạng thái được tập trung như chính trạng thái, được khuyến nghị định nghĩa các phương thức trên store với tên thể hiện ý định của các hành động:

```js{5-7} [store.js]
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNrNkk1uwyAQha8yYpNEiUzXllPVrtRTeJNSqtLGgGBsVbK4ewdwnT9FWWSTFczwmPc+xMhqa4uhl6xklRdOWQQvsbfPrVadNQ7h1dCqpcYaPp3pYFHwQyteXVxKm0tpM0krnm3IgAqUnd3vUFIFUB1Z8bNOkzoVny+wDTuNcZ1gBI/GSQhzqlQX3/5Gng81pA1t33tEo+FF7JX42bYsT1BaONlRguWqZZMU4C261CWMk3EhTK8RQphm8Twse/BscoUsvdqDkTX3kP3nI6aZwcmdQDUcMPJPabX8TQphtCf0RLqd1csxuqQAJTxtYnEUGtIpAH4pn1Ou17FDScOKhT+QNAVM)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNrdU8FqhDAU/JVHLruyi+lZ3FIt9Cu82JilaTWR5CkF8d8bE5O1u1so9FYQzAyTvJnRTKTo+3QcOMlIbpgWPT5WUnS90gjPyr4ll1jAWasOdim9UMum3a20vJWWqxSgkvzTyRt+rocWYVpYFoQm8wRsJh+viHLBcyXtk9No2ALkXd/WyC0CyDfW6RVTOiancQM5ku+x7nUxgUGlOcwxn8Ppu7HJ7udqaqz3SYikOQ5aBgT+OA9slt9kasToFnb5OiAqCU+sFezjVBHvRUimeWdT7JOKrFKAl8VvYatdI6RMDRJhdlPtWdQf5mdQP+SHdtyX/IftlH9pJyS1vcQ2NK8ZivFSiL8BsQmmpMG1s1NU79frYA1k8OD+/I3pUA6+CeNdHg6hmoTMX9pPSnk=)

</div>

:::tip
Lưu ý rằng trình xử lý click sử dụng `store.increment()` với dấu ngoặc đơn - điều này là cần thiết để gọi phương thức với ngữ cảnh `this` thích hợp vì nó không phải là một phương thức component.
:::

Mặc dù ở đây chúng ta đang sử dụng một object phản ứng đơn làm store, bạn cũng có thể chia sẻ trạng thái phản ứng được tạo bằng [Reactivity APIs](/api/reactivity-core) khác như `ref()` hoặc `computed()`, hoặc thậm chí trả về trạng thái toàn cục từ một [Composable](/guide/reusability/composables):

```js
import { ref } from 'vue'

// trạng thái toàn cục, được tạo trong phạm vi module
const globalCount = ref(1)

export function useCount() {
  // trạng thái cục bộ, được tạo cho mỗi component
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

Việc hệ thống phản ứng của Vue được tách rời khỏi model component làm cho nó cực kỳ linh hoạt.

## Xem xét SSR {#ssr-considerations}

Nếu bạn đang xây dựng một ứng dụng sử dụng [Server-Side Rendering (SSR)](./ssr), pattern trên có thể dẫn đến các vấn đề do store là một singleton được chia sẻ qua nhiều request. Điều này được thảo luận [chi tiết hơn](./ssr#cross-request-state-pollution) trong hướng dẫn SSR.

## Pinia {#pinia}

Mặc dù giải pháp quản lý trạng thái tự làm của chúng ta sẽ đủ trong các tình huống đơn giản, có nhiều điều cần xem xét hơn trong các ứng dụng sản xuất quy mô lớn:

- Quy ước mạnh hơn cho sự hợp tác nhóm
- Tích hợp với Vue DevTools, bao gồm timeline, kiểm tra trong component, và debugging time-travel
- Hot Module Replacement
- Hỗ trợ Server-Side Rendering

[Pinia](https://pinia.vuejs.org) là một thư viện quản lý trạng thái thực hiện tất cả các điều trên. Nó được duy trì bởi nhóm chính của Vue, và hoạt động với cả Vue 2 và Vue 3.

Người dùng hiện tại có thể quen thuộc với [Vuex](https://vuex.vuejs.org/), thư viện quản lý trạng thái chính thức trước đây của Vue. Với Pinia phục vụ cùng vai trò trong hệ sinh thái, Vuex hiện ở chế độ bảo trì. Nó vẫn hoạt động, nhưng sẽ không còn nhận các tính năng mới. Được khuyến nghị sử dụng Pinia cho các ứng dụng mới.

Pinia bắt đầu như một khám phá về việc phiên bản tiếp theo của Vuex có thể trông như thế nào, kết hợp nhiều ý tưởng từ các thảo luận của nhóm chính cho Vuex 5. Cuối cùng, chúng tôi nhận ra rằng Pinia đã thực hiện hầu hết những gì chúng tôi muốn trong Vuex 5, và quyết định làm cho nó trở thành khuyến nghị mới.

So với Vuex, Pinia cung cấp một API đơn giản hơn với ít nghi thức hơn, cung cấp các API theo phong cách Composition-API, và quan trọng nhất, có hỗ trợ suy luận kiểu vững chắc khi sử dụng với TypeScript.

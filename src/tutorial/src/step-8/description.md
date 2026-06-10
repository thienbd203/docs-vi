# Computed Property {#computed-property}

Hãy tiếp tục xây dựng dựa trên danh sách todo từ bước cuối cùng. Ở đây, chúng ta đã thêm chức năng toggle cho mỗi todo. Điều này được thực hiện bằng cách thêm thuộc tính `done` vào mỗi đối tượng todo, và sử dụng `v-model` để liên kết nó với một checkbox:

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

Cải tiến tiếp theo chúng ta có thể thêm là có thể ẩn các todo đã hoàn thành. Chúng ta đã có một nút để toggle trạng thái `hideCompleted`. Nhưng làm thế nào để render các mục danh sách khác nhau dựa trên trạng thái đó?

<div class="options-api">

Giới thiệu <a target="_blank" href="/guide/essentials/computed.html">computed property</a>. Chúng ta có thể khai báo một thuộc tính được tính toán phản ứng từ các thuộc tính khác sử dụng tùy chọn `computed`:

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // return filtered todos based on `this.hideCompleted`
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // return filtered todos based on `this.hideCompleted`
    }
  }
})
```

</div>

</div>
<div class="composition-api">

Introducing <a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>. We can create a computed ref that computes its `.value` based on other reactive data sources:

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // return filtered todos based on
  // `todos.value` & `hideCompleted.value`
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // return filtered todos based on
      // `todos.value` & `hideCompleted.value`
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

A computed property tracks other reactive state used in its computation as dependencies. It caches the result and automatically updates it when its dependencies change.

Now, try to add the `filteredTodos` computed property and implement its computation logic! If implemented correctly, checking off a todo when hiding completed items should instantly hide it as well.

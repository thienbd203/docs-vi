# Quy tắc Ưu tiên D: Sử dụng một cách thận trọng {#priority-d-rules-use-with-caution}

::: warning Lưu ý
Vue.js Style Guide này đã lỗi thời và cần được xem xét lại. Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng [mở một issue](https://github.com/vuejs/docs/issues/new).
:::

Một số tính năng của Vue tồn tại để xử lý các trường hợp hiếm gặp hoặc giúp việc di chuyển từ codebase cũ diễn ra mượt mà hơn. Tuy nhiên, khi bị lạm dụng, chúng có thể làm cho code của bạn khó bảo trì hơn hoặc thậm chí trở thành nguồn gốc của các lỗi. Các quy tắc này làm sáng tỏ các tính năng có khả năng rủi ro, mô tả khi nào và tại sao chúng nên được tránh.

## Element selectors với `scoped` {#element-selectors-with-scoped}

**Element selectors nên được tránh khi sử dụng với `scoped`.**

Ưu tiên sử dụng class selectors hơn element selectors trong các style `scoped`, vì số lượng lớn element selectors sẽ chậm.

::: details Giải thích chi tiết
Để giới hạn phạm vi styles, Vue thêm một attribute duy nhất vào các phần tử của component, chẳng hạn như `data-v-f3f3eg9`. Sau đó các selectors được sửa đổi để chỉ chọn các phần tử khớp có attribute này (ví dụ: `button[data-v-f3f3eg9]`).

Vấn đề là số lượng lớn element-attribute selectors (ví dụ: `button[data-v-f3f3eg9]`) sẽ chậm hơn đáng kể so với class-attribute selectors (ví dụ: `.btn-close[data-v-f3f3eg9]`), vì vậy class selectors nên được ưu tiên khi có thể.
:::

<div class="style-example style-example-bad">
<h3>Tệ</h3>

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

</div>

## Giao tiếp parent-child ngầm định {#implicit-parent-child-communication}

**Props và events nên được ưu tiên cho giao tiếp giữa component parent-child, thay vì sử dụng `this.$parent` hoặc thay đổi props.**

Một ứng dụng Vue lý tưởng là props đi xuống, events đi lên. Tuân theo quy ước này làm cho các component của bạn dễ hiểu hơn nhiều. Tuy nhiên, có những trường hợp ngoại lệ nơi việc thay đổi prop hoặc sử dụng `this.$parent` có thể đơn giản hóa hai component đã được liên kết chặt chẽ.

Vấn đề là, cũng có nhiều trường hợp _đơn giản_ nơi các pattern này có thể mang lại sự tiện lợi. Hãy cảnh giác: đừng để bị lôi cuốn đánh đổi sự đơn giản (khả năng hiểu được luồng trạng thái của bạn) lấy sự tiện lợi ngắn hạn (viết ít code hơn).

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Tệ</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Tệ</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <input v-model="todo.text" />
</template>
```

```vue
<script setup>
import { getCurrentInstance } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const instance = getCurrentInstance()

function removeTodo() {
  const parent = instance.parent
  if (!parent) return

  parent.props.todos = parent.props.todos.filter((todo) => {
    return todo.id !== props.todo.id
  })
}
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo">×</button>
  </span>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['input'])
</script>

<template>
  <input :value="todo.text" @input="emit('input', $event.target.value)" />
</template>
```

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="emit('delete')">×</button>
  </span>
</template>
```

</div>

</div>

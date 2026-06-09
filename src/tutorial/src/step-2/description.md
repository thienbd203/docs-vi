# Render Khai Báo {#declarative-rendering}

<div class="sfc">

Những gì bạn thấy trong trình soạn thảo là một Vue Single-File Component (SFC). SFC là một khối mã có thể tái sử dụng tự chứa đóng gói HTML, CSS và JavaScript thuộc về nhau, được viết trong một file `.vue`.

</div>

Tính năng cốt lõi của Vue là **render khai báo**: sử dụng cú pháp template mở rộng HTML, chúng ta có thể mô tả cách HTML nên trông dựa trên trạng thái JavaScript. Khi trạng thái thay đổi, HTML cập nhật tự động.

<div class="composition-api">

Trạng thái có thể kích hoạt cập nhật khi thay đổi được coi là **phản ứng**. Chúng ta có thể khai báo trạng thái phản ứng sử dụng API `reactive()` của Vue. Các đối tượng được tạo từ `reactive()` là [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) JavaScript hoạt động giống như các đối tượng bình thường:

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```

`reactive()` only works on objects (including arrays and built-in types like `Map` and `Set`). `ref()`, on the other hand, can take any value type and create an object that exposes the inner value under a `.value` property:

```js
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Changed'
```

Details on `reactive()` and `ref()` are discussed in <a target="_blank" href="/guide/essentials/reactivity-fundamentals.html">Guide - Reactivity Fundamentals</a>.

<div class="sfc">

Reactive state declared in the component's `<script setup>` block can be used directly in the template. This is how we can render dynamic text based on the value of the `counter` object and `message` ref, using mustaches syntax:

</div>

<div class="html">

The object being passed to `createApp()` is a Vue component. A component's state should be declared inside its `setup()` function, and returned using an object:

```js{2,5}
setup() {
  const counter = reactive({ count: 0 })
  const message = ref('Hello World!')
  return {
    counter,
    message
  }
}
```

Properties in the returned object will be made available in the template. This is how we can render dynamic text based on the value of `message`, using mustaches syntax:

</div>

```vue-html
<h1>{{ message }}</h1>
<p>Count is: {{ counter.count }}</p>
```

Notice how we did not need to use `.value` when accessing the `message` ref in templates: it is automatically unwrapped for more succinct usage.

</div>

<div class="options-api">

State that can trigger updates when changed are considered **reactive**. In Vue, reactive state is held in components. <span class="html">In the example code, the object being passed to `createApp()` is a component.</span>

We can declare reactive state using the `data` component option, which should be a function that returns an object:

<div class="sfc">

```js{3-5}
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```

</div>
<div class="html">

```js{3-5}
createApp({
  data() {
    return {
      message: 'Hello World!'
    }
  }
})
```

</div>

The `message` property will be made available in the template. This is how we can render dynamic text based on the value of `message`, using mustaches syntax:

```vue-html
<h1>{{ message }}</h1>
```

</div>

The content inside the mustaches is not limited to just identifiers or paths - we can use any valid JavaScript expression:

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

<div class="composition-api">

Now, try to create some reactive state yourself, and use it to render dynamic text content for the `<h1>` in the template.

</div>

<div class="options-api">

Now, try to create a data property yourself, and use it as the text content for the `<h1>` in the template.

</div>

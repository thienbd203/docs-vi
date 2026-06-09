# Composition API: setup() {#composition-api-setup}

## Cách sử dụng cơ bản {#basic-usage}

Hook `setup()` đóng vai trò là điểm nhập (entry point) cho việc sử dụng Composition API trong các component trong các trường hợp sau:

1. Sử dụng Composition API mà không có bước build;
2. Tích hợp với code dựa trên Composition API trong một component Options API.

:::info Lưu ý
Nếu bạn đang sử dụng Composition API với Single-File Components, [`<script setup>`](/api/sfc-script-setup) được khuyến nghị mạnh mẽ để có cú pháp ngắn gọn và thuận tiện hơn.
:::

Chúng ta có thể khai báo state phản ứng (reactive state) bằng cách sử dụng [Reactivity APIs](./reactivity-core) và expose chúng cho template bằng cách trả về một object từ `setup()`. Các thuộc tính trên object được trả về cũng sẽ được cung cấp trên component instance (nếu các options khác được sử dụng):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // expose cho template và các hook Options API khác
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

[refs](/api/reactivity-core#ref) được trả về từ `setup` sẽ được [tự động shallow unwrapped](/guide/essentials/reactivity-fundamentals#deep-reactivity) khi được truy cập trong template nên bạn không cần sử dụng `.value` khi truy cập chúng. Chúng cũng được unwrapped theo cùng cách khi được truy cập trên `this`.

`setup()` bản thân không có quyền truy cập vào component instance - `this` sẽ có giá trị là `undefined` bên trong `setup()`. Bạn có thể truy cập các giá trị được expose bởi Composition API từ Options API, nhưng không thể làm ngược lại.

`setup()` nên trả về một object một cách _đồng bộ_ (synchronously). Trường hợp duy nhất khi có thể sử dụng `async setup()` là khi component là con cháu của một component [Suspense](../guide/built-ins/suspense).

## Truy cập Props {#accessing-props}

Đối số đầu tiên trong hàm `setup` là đối số `props`. Giống như bạn mong đợi trong một component tiêu chuẩn, `props` bên trong hàm `setup` là phản ứng (reactive) và sẽ được cập nhật khi các props mới được truyền vào.

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

Lưu ý rằng nếu bạn destructuring object `props`, các biến được destructuring sẽ mất tính phản ứng (reactivity). Do đó, nên luôn truy cập props dưới dạng `props.xxx`.

Nếu bạn thực sự cần destructuring props, hoặc cần truyền một prop vào một hàm bên ngoài trong khi vẫn giữ tính phản ứng, bạn có thể làm điều đó với các API tiện ích [toRefs()](./reactivity-utilities#torefs) và [toRef()](/api/reactivity-utilities#toref):

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // chuyển `props` thành một object của refs, sau đó destructure
    const { title } = toRefs(props)
    // `title` là một ref theo dõi `props.title`
    console.log(title.value)

    // HOẶC, chuyển một thuộc tính đơn trên `props` thành một ref
    const title = toRef(props, 'title')
  }
}
```

## Setup Context {#setup-context}

Đối số thứ hai được truyền vào hàm `setup` là một đối tượng **Setup Context**. Đối tượng context này expose các giá trị khác có thể hữu ích bên trong `setup`:

```js
export default {
  setup(props, context) {
    // Attributes (Đối tượng không phản ứng, tương đương với $attrs)
    console.log(context.attrs)

    // Slots (Đối tượng không phản ứng, tương đương với $slots)
    console.log(context.slots)

    // Emit events (Hàm, tương đương với $emit)
    console.log(context.emit)

    // Expose public properties (Hàm)
    console.log(context.expose)
  }
}
```

Đối tượng context không phản ứng và có thể được destructuring một cách an toàn:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` và `slots` là các đối tượng có trạng thái (stateful) luôn được cập nhật khi chính component đó được cập nhật. Điều này có nghĩa là bạn nên tránh destructuring chúng và luôn tham chiếu thuộc tính dưới dạng `attrs.x` hoặc `slots.x`. Ngoài ra, hãy lưu ý rằng, không giống như `props`, các thuộc tính của `attrs` và `slots` **không** phản ứng. Nếu bạn có ý định áp dụng các tác động phụ (side effects) dựa trên các thay đổi của `attrs` hoặc `slots`, bạn nên thực hiện điều đó bên trong hook lifecycle `onBeforeUpdate`.

### Exposing Public Properties {#exposing-public-properties}

`expose` là một hàm có thể được sử dụng để giới hạn rõ ràng các thuộc tính được expose khi instance của component được truy cập bởi một component cha thông qua [template refs](/guide/essentials/template-refs#ref-on-component):

```js{5,10}
export default {
  setup(props, { expose }) {
    // làm cho instance "đóng" -
    // tức là không expose bất cứ thứ gì cho component cha
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // chọn lọc để expose local state
    expose({ count: publicCount })
  }
}
```

## Usage with Render Functions {#usage-with-render-functions}

`setup` cũng có thể trả về một [render function](/guide/extras/render-function) có thể trực tiếp sử dụng trạng thái phản ứng được khai báo trong cùng phạm vi:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

Trả về một render function ngăn chúng ta trả về bất cứ thứ gì khác. Về mặt nội bộ, điều đó không nên là vấn đề, nhưng nó có thể gây khó khăn nếu chúng ta muốn expose các phương thức của component này cho component cha thông qua template refs.

Chúng ta có thể giải quyết vấn đề này bằng cách gọi [`expose()`](#exposing-public-properties):

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

Phương thức `increment` sau đó sẽ có sẵn trong component cha thông qua một template ref.

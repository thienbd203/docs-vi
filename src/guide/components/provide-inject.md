# Provide / Inject {#provide-inject}

> Trang này giả định rằng bạn đã đọc [Cơ bản về Component](/guide/essentials/component-basics). Hãy đọc trang đó trước nếu bạn mới bắt đầu với component.

## Prop Drilling {#prop-drilling}

Thông thường, khi chúng ta cần truyền dữ liệu từ component cha sang component con, chúng ta sử dụng [props](/guide/components/props). Tuy nhiên, hãy tưởng tượng trường hợp chúng ta có một cây component lớn, và một component lồng sâu cần một thứ gì đó từ một component tổ tiên xa. Chỉ với props, chúng ta sẽ phải truyền cùng một prop qua toàn bộ chuỗi cha:

![prop drilling diagram](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

Hãy lưu ý rằng mặc dù component `<Footer>` có thể không quan tâm đến các props này chút nào, nó vẫn cần khai báo và truyền chúng đi chỉ để `<DeepChild>` có thể truy cập chúng. Nếu có chuỗi cha dài hơn, nhiều component hơn sẽ bị ảnh hưởng theo đường đi. Điều này được gọi là "props drilling" và chắc chắn không thú vị để xử lý.

Chúng ta có thể giải quyết props drilling với `provide` và `inject`. Một component cha có thể đóng vai trò là **dependency provider** cho tất cả các component con cháu của nó. Bất kỳ component nào trong cây con cháu, bất kể nó lồng sâu đến đâu, đều có thể **inject** các dependency được provide bởi các component phía trên trong chuỗi cha của nó.

![Provide/inject scheme](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## Provide {#provide}

<div class="composition-api">

Để provide dữ liệu cho các component con cháu, sử dụng hàm [`provide()`](/api/composition-api-dependency-injection#provide):

```vue
<script setup>
import { provide } from 'vue'

provide(/* key */ 'message', /* value */ 'hello!')
</script>
```

Nếu không sử dụng `<script setup>`, hãy đảm bảo `provide()` được gọi đồng bộ bên trong `setup()`:

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* key */ 'message', /* value */ 'hello!')
  }
}
```

Hàm `provide()` chấp nhận hai tham số. Tham số đầu tiên được gọi là **injection key**, có thể là một chuỗi hoặc một `Symbol`. Injection key được các component con cháu sử dụng để tìm kiếm giá trị mong muốn để inject. Một component có thể gọi `provide()` nhiều lần với các injection key khác nhau để provide các giá trị khác nhau.

Tham số thứ hai là giá trị được provide. Giá trị có thể là bất kỳ loại nào, bao gồm cả reactive state như refs:

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

Provide các giá trị reactive cho phép các component con cháu sử dụng giá trị được provide thiết lập kết nối reactive với component provider.

</div>

<div class="options-api">

Để provide dữ liệu cho các component con cháu, sử dụng tùy chọn [`provide`](/api/options-composition#provide):

```js
export default {
  provide: {
    message: 'hello!'
  }
}
```

Đối với mỗi thuộc tính trong object `provide`, key được các component con sử dụng để định vị giá trị chính xác để inject, trong khi giá trị là thứ cuối cùng được inject.

Nếu chúng ta cần provide state theo từng instance, ví dụ dữ liệu được khai báo qua `data()`, thì `provide` phải sử dụng giá trị hàm:

```js{7-12}
export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    // sử dụng cú pháp hàm để chúng ta có thể truy cập `this`
    return {
      message: this.message
    }
  }
}
```

Tuy nhiên, hãy lưu ý điều này **không** làm cho injection trở nên reactive. Chúng ta sẽ thảo luận [làm cho injection reactive](#working-with-reactivity) bên dưới.

</div>

## App-level Provide {#app-level-provide}

Ngoài việc provide dữ liệu trong một component, chúng ta cũng có thể provide ở cấp độ app:

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* key */ 'message', /* value */ 'hello!')
```

Các provide ở cấp độ app có sẵn cho tất cả các component được render trong app. Điều này đặc biệt hữu ích khi viết [plugins](/guide/reusability/plugins), vì các plugin thường không thể provide giá trị bằng cách sử dụng component.

## Inject {#inject}

<div class="composition-api">

Để inject dữ liệu được provide bởi một component tổ tiên, sử dụng hàm [`inject()`](/api/composition-api-dependency-injection#inject):

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

Nếu nhiều component cha provide dữ liệu với cùng một key, inject sẽ giải quyết thành giá trị từ component cha gần nhất trong chuỗi cha của component.

Nếu giá trị được provide là một ref, nó sẽ được inject nguyên trạng và sẽ **không** được tự động unwrap. Điều này cho phép component injector giữ lại kết nối reactive với component provider.

[Full provide + inject Example with Reactivity](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

Lần nữa, nếu không sử dụng `<script setup>`, `inject()` chỉ nên được gọi đồng bộ bên trong `setup()`:

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

Để inject dữ liệu được provide bởi một component tổ tiên, sử dụng tùy chọn [`inject`](/api/options-composition#inject):

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // injected value
  }
}
```

Các injection được giải quyết **trước** state riêng của component, vì vậy bạn có thể truy cập các thuộc tính được inject trong `data()`:

```js
export default {
  inject: ['message'],
  data() {
    return {
      // dữ liệu ban đầu dựa trên giá trị được inject
      fullMessage: this.message
    }
  }
}
```

Nếu nhiều component cha provide dữ liệu với cùng một key, inject sẽ giải quyết thành giá trị từ component cha gần nhất trong chuỗi cha của component.

[Full provide + inject example](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### Injection Aliasing \* {#injection-aliasing}

Khi sử dụng cú pháp mảng cho `inject`, các thuộc tính được inject được expose trên instance component bằng cách sử dụng cùng một key. Trong ví dụ trên, thuộc tính được provide dưới key `"message"`, và inject thành `this.message`. Key cục bộ giống với injection key.

Nếu chúng ta muốn inject thuộc tính bằng cách sử dụng một key cục bộ khác, chúng ta cần sử dụng cú pháp object cho tùy chọn `inject`:

```js
export default {
  inject: {
    /* local key */ localMessage: {
      from: /* injection key */ 'message'
    }
  }
}
```

Ở đây, component sẽ định vị một thuộc tính được provide với key `"message"`, và sau đó expose nó thành `this.localMessage`.

</div>

### Injection Default Values {#injection-default-values}

Theo mặc định, `inject` giả định rằng key được inject được provide ở đâu đó trong chuỗi cha. Trong trường hợp key không được provide, sẽ có một cảnh báo runtime.

Nếu chúng ta muốn làm cho một thuộc tính được inject hoạt động với các provider tùy chọn, chúng ta cần khai báo một giá trị mặc định, tương tự như props:

<div class="composition-api">

```js
// `value` sẽ là "default value"
// nếu không có dữ liệu khớp với "message" được provide
const value = inject('message', 'default value')
```

Trong một số trường hợp, giá trị mặc định có thể cần được tạo bằng cách gọi một hàm hoặc khởi tạo một class mới. Để tránh tính toán không cần thiết hoặc các tác dụng phụ trong trường hợp giá trị tùy chọn không được sử dụng, chúng ta có thể sử dụng một factory function để tạo giá trị mặc định:

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

Tham số thứ ba chỉ ra rằng giá trị mặc định nên được coi là một factory function.

</div>

<div class="options-api">

```js
export default {
  // cú pháp object là bắt buộc
  // khi khai báo giá trị mặc định cho các injection
  inject: {
    message: {
      from: 'message', // điều này là tùy chọn nếu sử dụng cùng một key cho injection
      default: 'default value'
    },
    user: {
      // sử dụng factory function cho các giá trị không nguyên thủy tốn kém
      // để tạo, hoặc các giá trị nên là duy nhất theo từng instance component.
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## Working with Reactivity {#working-with-reactivity}

<div class="composition-api">

Khi sử dụng các giá trị provide / inject reactive, **được khuyến nghị là giữ mọi thay đổi đối với reactive state bên trong _provider_ bất cứ khi nào có thể**. Điều này đảm bảo rằng state được provide và các thay đổi có thể của nó được đặt cùng nhau trong cùng một component, giúp dễ dàng bảo trì hơn trong tương lai.

Có thể có lúc chúng ta cần cập nhật dữ liệu từ một component injector. Trong những trường hợp như vậy, chúng tôi khuyến nghị provide một hàm chịu trách nhiệm thay đổi state:

```vue{7-9,13}
<!-- bên trong component provider -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- trong component injector -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

Cuối cùng, bạn có thể wrap giá trị được provide với [`readonly()`](/api/reactivity-core#readonly) nếu bạn muốn đảm bảo rằng dữ liệu được truyền qua `provide` không thể bị thay đổi bởi component injector.

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

Để làm cho các injection được liên kết reactive với provider, chúng ta cần provide một computed property bằng cách sử dụng hàm [computed()](/api/reactivity-core#computed):

```js{12}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    return {
      // provide một computed property một cách rõ ràng
      message: computed(() => this.message)
    }
  }
}
```

[Full provide + inject Example with Reactivity](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

Hàm `computed()` thường được sử dụng trong các component Composition API, nhưng cũng có thể được sử dụng để bổ sung cho một số trường hợp sử dụng trong Options API. Bạn có thể tìm hiểu thêm về cách sử dụng của nó bằng cách đọc [Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals) và [Computed Properties](/guide/essentials/computed) với API Preference được đặt thành Composition API.

</div>

## Working with Symbol Keys {#working-with-symbol-keys}

Cho đến nay, chúng ta đã sử dụng các injection key dạng chuỗi trong các ví dụ. Nếu bạn đang làm việc trong một ứng dụng lớn với nhiều dependency provider, hoặc bạn đang viết các component sẽ được sử dụng bởi các nhà phát triển khác, tốt nhất là sử dụng các injection key [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) để tránh các xung đột tiềm ẩn.

Được khuyến nghị là export các Symbols trong một file riêng biệt:

```js [keys.js]
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// trong component provider
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* dữ liệu để provide */
})
```

```js
// trong component injector
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

Xem thêm: [Typing Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// trong component provider
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* dữ liệu để provide */
      }
    }
  }
}
```

```js
// trong component injector
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>

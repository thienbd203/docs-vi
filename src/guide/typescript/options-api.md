# TypeScript với Options API {#typescript-with-options-api}

> Trang này giả định rằng bạn đã đọc tổng quan về [Sử dụng Vue với TypeScript](./overview).

:::tip
Mặc dù Vue có hỗ trợ sử dụng TypeScript với Options API, nhưng chúng tôi khuyến nghị sử dụng Vue với TypeScript thông qua Composition API vì nó cung cấp khả năng suy luận kiểu đơn giản, hiệu quả và mạnh mẽ hơn.
:::

## Định kiểu Props của Component {#typing-component-props}

Suy luận kiểu cho props trong Options API yêu cầu bọc component với `defineComponent()`. Với điều này, Vue có thể suy luận các kiểu cho props dựa trên tùy chọn `props`, có tính đến các tùy chọn bổ sung như `required: true` và `default`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // suy luận kiểu được bật
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // kiểu: string | undefined
    this.id // kiểu: number | string | undefined
    this.msg // kiểu: string
    this.metadata // kiểu: any
  }
})
```

Tuy nhiên, tùy chọn `props` tại runtime chỉ hỗ trợ sử dụng hàm constructor làm kiểu của prop - không có cách nào để chỉ định các kiểu phức tạp như các đối tượng có thuộc tính lồng nhau hoặc chữ ký gọi hàm.

Để chú thích kiểu cho các props phức tạp, chúng ta có thể sử dụng kiểu tiện ích `PropType`:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // cung cấp kiểu cụ thể hơn cho `Object`
      type: Object as PropType<Book>,
      required: true
    },
    // cũng có thể chú thích hàm
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // Lỗi TS: đối số kiểu 'string' không thể
    // gán cho tham số kiểu 'number'
    this.callback?.('123')
  }
})
```

### Lưu ý {#caveats}

Nếu phiên bản TypeScript của bạn nhỏ hơn `4.7`, bạn cần cẩn thận khi sử dụng giá trị hàm cho các tùy chọn prop `validator` và `default` - hãy đảm bảo sử dụng arrow functions:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // Đảm bảo sử dụng arrow functions nếu phiên bản TypeScript của bạn nhỏ hơn 4.7
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

Điều này ngăn TypeScript phải suy luận kiểu của `this` bên trong các hàm này, điều đáng tiếc có thể gây ra lỗi suy luận kiểu. Đây là một [hạn chế thiết kế](https://github.com/microsoft/TypeScript/issues/38845) trước đây, và nay đã được cải thiện trong [TypeScript 4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods).

## Định kiểu Emits của Component {#typing-component-emits}

Chúng ta có thể khai báo kiểu payload mong đợi cho một sự kiện được phát ra bằng cách sử dụng cú pháp đối tượng của tùy chọn `emits`. Ngoài ra, tất cả các sự kiện được phát ra không được khai báo sẽ gây ra lỗi kiểu khi được gọi:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // thực hiện kiểm tra runtime
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // Lỗi kiểu!
      })

      this.$emit('non-declared-event') // Lỗi kiểu!
    }
  }
})
```

## Định kiểu Computed Properties {#typing-computed-properties}

Một computed property suy luận kiểu của nó dựa trên giá trị trả về:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // kiểu: string
  }
})
```

Trong một số trường hợp, bạn có thể muốn chú thích rõ ràng kiểu của một computed property để đảm bảo việc triển khai của nó là chính xác:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // chú thích rõ ràng kiểu trả về
    greeting(): string {
      return this.message + '!'
    },

    // chú thích một computed property có thể ghi
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

Các chú thích rõ ràng cũng có thể được yêu cầu trong một số trường hợp đặc biệt mà TypeScript không thể suy luận kiểu của một computed property do các vòng lặp suy luận vòng tròn.

## Định kiểu Event Handlers {#typing-event-handlers}

Khi xử lý các sự kiện DOM gốc, có thể hữu ích khi định kiểu đúng cho đối số chúng ta truyền cho handler. Hãy xem ví dụ này:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` ngầm định có kiểu `any`
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Nếu không có chú thích kiểu, đối số `event` sẽ ngầm định có kiểu `any`. Điều này cũng sẽ gây ra lỗi TS nếu `"strict": true` hoặc `"noImplicitAny": true` được sử dụng trong `tsconfig.json`. Do đó, được khuyến nghị là chú thích rõ ràng đối số của các event handlers. Ngoài ra, bạn có thể cần sử dụng type assertions khi truy cập các thuộc tính của `event`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## Mở rộng Global Properties {#augmenting-global-properties}

Một số plugin cài đặt các thuộc tính có sẵn toàn cục cho tất cả các instance của component thông qua [`app.config.globalProperties`](/api/application#app-config-globalproperties). Ví dụ, chúng ta có thể cài đặt `this.$http` để lấy dữ liệu hoặc `this.$translate` để quốc tế hóa. Để làm cho điều này hoạt động tốt với TypeScript, Vue cung cấp interface `ComponentCustomProperties` được thiết kế để mở rộng thông qua [TypeScript module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation):

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

Xem thêm:

- [Các bài kiểm tra đơn vị TypeScript cho phần mở rộng kiểu component](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

### Vị trí Đặt Type Augmentation {#type-augmentation-placement}

Chúng ta có thể đặt type augmentation này trong một file `.ts`, hoặc trong một file `*.d.ts` toàn dự án. Bằng cách nào, hãy đảm bảo nó được bao gồm trong `tsconfig.json`. Đối với các tác giả thư viện / plugin, file này nên được chỉ định trong thuộc tính `types` trong `package.json`.

Để tận dụng module augmentation, bạn cần đảm bảo augmentation được đặt trong một [TypeScript module](https://www.typescriptlang.org/docs/handbook/modules.html). Tức là, file cần chứa ít nhất một `import` hoặc `export` cấp cao nhất, ngay cả khi chỉ là `export {}`. Nếu augmentation được đặt bên ngoài một module, nó sẽ ghi đè các kiểu gốc thay vì mở rộng chúng!

```ts
// Không hoạt động, ghi đè các kiểu gốc.
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// Hoạt động đúng
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## Mở rộng Custom Options {#augmenting-custom-options}

Một số plugin, ví dụ `vue-router`, cung cấp hỗ trợ cho các tùy chọn component tùy chỉnh như `beforeRouteEnter`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

Nếu không có type augmentation thích hợp, các đối số của hook này sẽ ngầm định có kiểu `any`. Chúng ta có thể mở rộng interface `ComponentCustomOptions` để hỗ trợ các tùy chọn tùy chỉnh này:

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

Bây giờ tùy chọn `beforeRouteEnter` sẽ được định kiểu đúng. Lưu ý đây chỉ là một ví dụ - các thư viện có định kiểu tốt như `vue-router` nên tự động thực hiện các augmentation này trong các định nghĩa kiểu của chúng.

Vị trí của augmentation này tuân theo [cùng các hạn chế](#type-augmentation-placement) như augmentation của global properties.

Xem thêm:

- [Các bài kiểm tra đơn vị TypeScript cho phần mở rộng kiểu component](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

## Định kiểu Global Custom Directives {#typing-global-custom-directives}

Xem: [Định kiểu Custom Global Directives](/guide/typescript/composition-api#typing-global-custom-directives) <sup class="vt-badge ts" />

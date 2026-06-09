# Async Components {#async-components}

## Cơ bản {#basic-usage}

Trong các ứng dụng lớn, chúng ta có thể cần chia ứng dụng thành các phần nhỏ hơn và chỉ tải một component từ server khi cần thiết. Để làm được điều đó, Vue có hàm [`defineAsyncComponent`](/api/general#defineasynccomponent):

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...tải component từ server
    resolve(/* component đã tải */)
  })
})
// ... sử dụng `AsyncComp` như một component bình thường
```

Như bạn có thể thấy, `defineAsyncComponent` chấp nhận một loader function trả về một Promise. Callback `resolve` của Promise nên được gọi khi bạn đã lấy được định nghĩa component từ server. Bạn cũng có thể gọi `reject(reason)` để chỉ ra rằng việc tải đã thất bại.

[ES module dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) cũng trả về một Promise, vì vậy hầu hết thời gian chúng ta sẽ sử dụng nó kết hợp với `defineAsyncComponent`. Các bundler như Vite và webpack cũng hỗ trợ cú pháp này (và sẽ sử dụng nó như các điểm chia bundle), vì vậy chúng ta có thể sử dụng nó để import Vue SFCs:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

`AsyncComp` kết quả là một wrapper component chỉ gọi loader function khi nó thực sự được render trên trang. Ngoài ra, nó sẽ chuyển tiếp bất kỳ props và slots nào cho component bên trong, vì vậy bạn có thể sử dụng async wrapper để thay thế nguyên bản component gốc trong khi đạt được lazy loading.

Giống như các component bình thường, async components có thể được [đăng ký toàn cục](/guide/components/registration#global-registration) bằng cách sử dụng `app.component()`:

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

Bạn cũng có thể sử dụng `defineAsyncComponent` khi [đăng ký component cục bộ](/guide/components/registration#local-registration):

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

Chúng cũng có thể được định nghĩa trực tiếp bên trong component cha:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## Trạng thái Loading và Error {#loading-and-error-states}

Các thao tác không đồng bộ không thể tránh khỏi việc liên quan đến trạng thái loading và error - `defineAsyncComponent()` hỗ trợ xử lý các trạng thái này thông qua các tùy chọn nâng cao:

```js
const AsyncComp = defineAsyncComponent({
  // loader function
  loader: () => import('./Foo.vue'),

  // Component để sử dụng trong khi async component đang tải
  loadingComponent: LoadingComponent,
  // Độ trễ trước khi hiển thị loading component. Mặc định: 200ms.
  delay: 200,

  // Component để sử dụng nếu việc tải thất bại
  errorComponent: ErrorComponent,
  // Error component sẽ được hiển thị nếu timeout được
  // cung cấp và vượt quá. Mặc định: Infinity.
  timeout: 3000
})
```

Nếu một loading component được cung cấp, nó sẽ được hiển thị trước trong khi component bên trong đang được tải. Có độ trễ mặc định 200ms trước khi loading component được hiển thị - điều này là do trên mạng nhanh, trạng thái loading tức thì có thể được thay thế quá nhanh và cuối cùng trông giống như một sự nhấp nháy.

Nếu một error component được cung cấp, nó sẽ được hiển thị khi Promise được trả về bởi loader function bị reject. Bạn cũng có thể chỉ định một timeout để hiển thị error component khi yêu cầu mất quá nhiều thời gian.

## Lazy Hydration <sup class="vt-badge" data-text="3.5+" /> {#lazy-hydration}

> Phần này chỉ áp dụng nếu bạn đang sử dụng [Server-Side Rendering](/guide/scaling-up/ssr).

Trong Vue 3.5+, async components có thể kiểm soát khi chúng được hydrate bằng cách cung cấp một hydration strategy.

- Vue cung cấp một số hydration strategy tích hợp sẵn. Các strategy tích hợp sẵn này cần được import riêng lẻ để chúng có thể được tree-shaken nếu không được sử dụng.

- Thiết kế được cố ý ở mức thấp để linh hoạt. Cú pháp sugar của compiler có thể được xây dựng trên nền tảng này trong tương lai, hoặc trong core hoặc trong các giải pháp cấp cao hơn (ví dụ: Nuxt).

### Hydrate on Idle {#hydrate-on-idle}

Hydrate thông qua `requestIdleCallback`:

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnIdle(/* tùy chọn truyền vào max timeout */)
})
```

### Hydrate on Visible {#hydrate-on-visible}

Hydrate khi element(s) trở nên nhìn thấy được thông qua `IntersectionObserver`.

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

Có thể tùy chọn truyền vào một object tùy chọn cho observer:

```js
hydrateOnVisible({ rootMargin: '100px' })
```

### Hydrate on Media Query {#hydrate-on-media-query}

Hydrate khi media query được chỉ định khớp.

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

### Hydrate on Interaction {#hydrate-on-interaction}

Hydrate khi event(s) được chỉ định được kích hoạt trên component element(s). Event đã kích hoạt hydration cũng sẽ được phát lại sau khi hydration hoàn tất.

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

Cũng có thể là một danh sách nhiều loại event:

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

### Custom Strategy {#custom-strategy}

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement là một helper để lặp qua tất cả các root elements
  // trong DOM chưa hydrate của component, vì root có thể là một fragment
  // thay vì một element đơn lẻ
  forEachElement(el => {
    // ...
  })
  // gọi `hydrate` khi sẵn sàng
  hydrate()
  return () => {
    // trả về một teardown function nếu cần
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## Sử dụng với Suspense {#using-with-suspense}

Async components có thể được sử dụng với component tích hợp sẵn `<Suspense>`. Tương tác giữa `<Suspense>` và async components được tài liệu hóa trong [chương chuyên về `<Suspense>`](/guide/built-ins/suspense).

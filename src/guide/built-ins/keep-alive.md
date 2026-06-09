<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# KeepAlive {#keepalive}

`<KeepAlive>` là một component tích hợp sẵn cho phép chúng ta cache các component instance một cách có điều kiện khi chuyển đổi động giữa nhiều component.

## Cách Sử Dụng Cơ Bản {#basic-usage}

Trong chương Component Basics, chúng ta đã giới thiệu cú pháp cho [Dynamic Components](/guide/essentials/component-basics#dynamic-components), sử dụng special element `<component>`:

```vue-html
<component :is="activeComponent" />
```

Theo mặc định, một component instance đang hoạt động sẽ được unmount khi chuyển đổi khỏi nó. Điều này sẽ làm mất bất kỳ trạng thái đã thay đổi mà nó giữ. Khi component này được hiển thị lại, một instance mới sẽ được tạo với chỉ trạng thái ban đầu.

Trong ví dụ dưới đây, chúng ta có hai component có trạng thái - A chứa một bộ đếm, trong khi B chứa một thông điệp được đồng bộ với một input qua `v-model`. Hãy thử cập nhật trạng thái của một trong số chúng, chuyển đổi đi, và sau đó chuyển đổi lại:

<SwitchComponent />

Bạn sẽ nhận thấy rằng khi chuyển đổi lại, trạng thái đã thay đổi trước đó sẽ được reset.

Tạo component instance mới khi chuyển đổi thường là hành vi hữu ích, nhưng trong trường hợp này, chúng ta thực sự muốn hai component instance được bảo lưu ngay cả khi chúng không hoạt động. Để giải quyết vấn đề này, chúng ta có thể bọc dynamic component của mình với component tích hợp sẵn `<KeepAlive>`:

```vue-html
<!-- Các component không hoạt động sẽ được cache! -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

Bây giờ, trạng thái sẽ được duy trì qua các lần chuyển đổi component:

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip
Khi được sử dụng trong [in-DOM templates](/guide/essentials/component-basics#in-dom-template-parsing-caveats), nó nên được tham chiếu là `<keep-alive>`.
:::

## Include / Exclude {#include-exclude}

Theo mặc định, `<KeepAlive>` sẽ cache bất kỳ component instance nào bên trong. Chúng ta có thể tùy chỉnh hành vi này thông qua các props `include` và `exclude`. Cả hai props đều có thể là một chuỗi được phân tách bằng dấu phẩy, một `RegExp`, hoặc một mảng chứa một trong hai loại:

```vue-html
<!-- chuỗi được phân tách bằng dấu phẩy -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- regex (sử dụng `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- Mảng (sử dụng `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

Việc khớp được kiểm tra dựa trên option [`name`](/api/options-misc#name) của component, vì vậy các component cần được cache có điều kiện bởi `KeepAlive` phải khai báo rõ ràng một option `name`.

:::tip
Since version 3.2.34, a single-file component using `<script setup>` will automatically infer its `name` option based on the filename, removing the need to manually declare the name.
:::

## Max Cached Instances {#max-cached-instances}

We can limit the maximum number of component instances that can be cached via the `max` prop. When `max` is specified, `<KeepAlive>` behaves like an [LRU cache](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_Recently_Used_(LRU)>): if the number of cached instances is about to exceed the specified max count, the least recently accessed cached instance will be destroyed to make room for the new one.

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Lifecycle của Instance Được Cache {#lifecycle-of-cached-instance}

Khi một component instance được loại bỏ khỏi DOM nhưng là một phần của component tree được cache bởi `<KeepAlive>`, nó đi vào trạng thái **deactivated** thay vì được unmount. Khi một component instance được chèn vào DOM như một phần của cached tree, nó được **activated**.

<div class="composition-api">

Một component được keep-alive có thể đăng ký lifecycle hooks cho hai trạng thái này sử dụng [`onActivated()`](/api/composition-api-lifecycle#onactivated) và [`onDeactivated()`](/api/composition-api-lifecycle#ondeactivated):

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // được gọi trên mount ban đầu
  // và mỗi lần nó được chèn lại từ cache
})

onDeactivated(() => {
  // được gọi khi được loại bỏ khỏi DOM vào cache
  // và cũng khi được unmount
})
</script>
```

</div>
<div class="options-api">

Một component được keep-alive có thể đăng ký lifecycle hooks cho hai trạng thái này sử dụng hooks [`activated`](/api/options-lifecycle#activated) và [`deactivated`](/api/options-lifecycle#deactivated):

```js
export default {
  activated() {
    // called on initial mount
    // and every time it is re-inserted from the cache
  },
  deactivated() {
    // called when removed from the DOM into the cache
    // and also when unmounted
  }
}
```

</div>

Note that:

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> is also called on mount, and <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> on unmount.

- Both hooks work for not only the root component cached by `<KeepAlive>`, but also the descendant components in the cached tree.
---

**Related**

- [`<KeepAlive>` API reference](/api/built-in-components#keepalive)

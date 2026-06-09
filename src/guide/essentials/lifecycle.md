# Lifecycle Hooks {#lifecycle-hooks}

Mỗi instance của component Vue đều trải qua một loạt các bước khởi tạo khi được tạo ra - ví dụ, nó cần thiết lập quan sát dữ liệu, biên dịch template, gắn instance vào DOM, và cập nhật DOM khi dữ liệu thay đổi. Trong quá trình này, nó cũng chạy các hàm được gọi là lifecycle hooks, cho phép người dùng thêm code của mình vào các giai đoạn cụ thể.

## Đăng ký Lifecycle Hooks {#registering-lifecycle-hooks}

Ví dụ, hook <span class="composition-api">`onMounted`</span><span class="options-api">`mounted`</span> có thể được sử dụng để chạy code sau khi component đã hoàn tất việc render ban đầu và tạo ra các DOM node:

<div class="composition-api">

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  mounted() {
    console.log(`the component is now mounted.`)
  }
}
```

</div>

Cũng có các hook khác sẽ được gọi ở các giai đoạn khác nhau của lifecycle của instance, với những hook được sử dụng phổ biến nhất là <span class="composition-api">[`onMounted`](/api/composition-api-lifecycle#onmounted), [`onUpdated`](/api/composition-api-lifecycle#onupdated), và [`onUnmounted`](/api/composition-api-lifecycle#onunmounted).</span><span class="options-api">[`mounted`](/api/options-lifecycle#mounted), [`updated`](/api/options-lifecycle#updated), và [`unmounted`](/api/options-lifecycle#unmounted).</span>

<div class="options-api">

Tất cả lifecycle hooks đều được gọi với context `this` trỏ đến instance đang hoạt động gọi nó. Lưu ý điều này có nghĩa là bạn nên tránh sử dụng arrow functions khi khai báo lifecycle hooks, vì bạn sẽ không thể truy cập vào component instance thông qua `this` nếu làm vậy.

</div>

<div class="composition-api">

Khi gọi `onMounted`, Vue tự động liên kết hàm callback đã đăng ký với component instance đang hoạt động. Điều này yêu cầu các hook này phải được đăng ký **đồng bộ** trong quá trình thiết lập component. Ví dụ, đừng làm như sau:

```js
setTimeout(() => {
  onMounted(() => {
    // điều này sẽ không hoạt động.
  })
}, 100)
```

Lưu ý điều này không có nghĩa là lời gọi phải được đặt theo cú pháp bên trong `setup()` hoặc `<script setup>`. `onMounted()` có thể được gọi trong một hàm bên ngoài miễn là call stack là đồng bộ và bắt nguồn từ bên trong `setup()`.

</div>

## Sơ đồ Lifecycle {#lifecycle-diagram}

Dưới đây là sơ đồ cho lifecycle của instance. Bạn không cần hiểu đầy đủ mọi thứ đang diễn ra ngay bây giờ, nhưng khi bạn học và xây dựng nhiều hơn, nó sẽ là một tài liệu tham khảo hữu ích.

![Component lifecycle diagram](./images/lifecycle.png)

<!-- https://www.figma.com/file/Xw3UeNMOralY6NV7gSjWdS/Vue-Lifecycle -->

Consult the <span class="composition-api">[Lifecycle Hooks API reference](/api/composition-api-lifecycle)</span><span class="options-api">[Lifecycle Hooks API reference](/api/options-lifecycle)</span> for details on all lifecycle hooks and their respective use cases.

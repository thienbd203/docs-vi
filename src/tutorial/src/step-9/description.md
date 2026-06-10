# Lifecycle và Template Refs {#lifecycle-and-template-refs}

Cho đến nay, Vue đã xử lý tất cả các cập nhật DOM cho chúng ta, nhờ tính phản ứng và render khai báo. Tuy nhiên, không thể tránh khỏi có những trường hợp chúng ta cần làm việc thủ công với DOM.

Chúng ta có thể yêu cầu một **template ref** - tức là một tham chiếu đến một phần tử trong template - sử dụng <a target="_blank" href="/api/built-in-special-attributes.html#ref">thuộc tính `ref` đặc biệt</a>:

```vue-html
<p ref="pElementRef">hello</p>
```

<div class="composition-api">

Để truy cập ref, chúng ta cần khai báo<span class="html"> và expose</span> một ref với tên phù hợp:

<div class="sfc">

```js
const pElementRef = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const pElementRef = ref(null)

  return {
    pElementRef
  }
}
```

</div>

Lưu ý rằng ref được khởi tạo với giá trị `null`. Điều này là do phần tử chưa tồn tại khi <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span> được thực thi. Template ref chỉ có thể truy cập được sau khi component được **mount**.

Để chạy code sau khi mount, chúng ta có thể sử dụng hàm `onMounted()`:

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // component đã được mount.
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // component đã được mount.
    })
  }
})
```

</div>
</div>

<div class="options-api">

Phần tử sẽ được expose trên `this.$refs` dưới dạng `this.$refs.pElementRef`. Tuy nhiên, bạn chỉ có thể truy cập nó sau khi component được **mount**.

Để chạy code sau khi mount, chúng ta có thể sử dụng option `mounted`:

<div class="sfc">

```js
export default {
  mounted() {
    // component đã được mount.
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // component đã được mount.
  }
})
```

</div>
</div>

Đây được gọi là **lifecycle hook** - nó cho phép chúng ta đăng ký một callback để được gọi tại các thời điểm nhất định trong lifecycle của component. Có các hook khác như <span class="options-api">`created` và `updated`</span><span class="composition-api">`onUpdated` và `onUnmounted`</span>. Xem <a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">Lifecycle Diagram</a> để biết thêm chi tiết.

Bây giờ, hãy thử thêm <span class="options-api">hook `mounted`</span><span class="composition-api">hook `onMounted`</span>, truy cập `<p>` thông qua <span class="options-api">`this.$refs.pElementRef`</span><span class="composition-api">`pElementRef.value`</span>, và thực hiện một số thao tác DOM trực tiếp trên nó (ví dụ: thay đổi `textContent`).

# Bắt đầu {#getting-started}

Chào mừng đến với hướng dẫn Vue!

Mục tiêu của hướng dẫn này là nhanh chóng mang lại cho bạn trải nghiệm về cảm giác làm việc với Vue, ngay trong trình duyệt. Nó không nhằm mục đích toàn diện, và bạn không cần hiểu mọi thứ trước khi tiếp tục. Tuy nhiên, sau khi hoàn thành nó, hãy đảm bảo cũng đọc <a target="_blank" href="/guide/introduction.html">Hướng dẫn</a> bao gồm từng chủ đề chi tiết hơn.

## Điều kiện tiên quyết {#prerequisites}

Hướng dẫn giả định sự quen thuộc cơ bản với HTML, CSS và JavaScript. Nếu bạn hoàn toàn mới với phát triển frontend, có thể không phải là ý tưởng tốt nhất để nhảy ngay vào một framework làm bước đầu tiên - nắm bắt các cơ bản rồi quay lại! Kinh nghiệm trước với các framework khác giúp ích, nhưng không bắt buộc.

## Cách Sử dụng Hướng dẫn Này {#how-to-use-this-tutorial}

Bạn có thể chỉnh sửa mã <span class="wide">ở bên phải</span><span class="narrow">dưới đây</span> và xem kết quả cập nhật ngay lập tức. Mỗi bước sẽ giới thiệu một tính năng cốt lõi của Vue, và bạn được mong đợi hoàn thành mã để demo hoạt động. Nếu bạn gặp khó khăn, bạn sẽ có nút "Show me!" tiết lộ mã hoạt động cho bạn. Cố gắng không dựa vào nó quá nhiều - bạn sẽ học nhanh hơn bằng cách tự tìm ra mọi thứ.

Nếu bạn là một nhà phát triển có kinh nghiệm đến từ Vue 2 hoặc các framework khác, có một vài cài đặt bạn có thể điều chỉnh để sử dụng hướng dẫn này tốt nhất. Nếu bạn là người mới, được khuyến nghị đi với mặc định.

<details>
<summary>Tutorial Setting Details</summary>

- Vue offers two API styles: Options API and Composition API. This tutorial is designed to work for both - you can choose your preferred style using the **API Preference** switches at the top. <a target="_blank" href="/guide/introduction.html#api-styles">Learn more about API styles</a>.

- You can also switch between SFC-mode or HTML-mode. The former will show code examples in <a target="_blank" href="/guide/introduction.html#single-file-components">Single-File Component</a> (SFC) format, which is what most developers use when they use Vue with a build step. HTML-mode shows usage without a build step.

<div class="html">

:::tip
If you're about to use HTML-mode without a build step in your own applications, make sure you either change imports to:

```js
import { ... } from 'vue/dist/vue.esm-bundler.js'
```

inside your scripts or configure your build tool to resolve `vue` accordingly. Sample config for [Vite](https://vite.dev/):

```js [vite.config.js]
export default {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  }
}
```

See the respective [section in Tooling guide](/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation) for more information.
:::

</div>

</details>

Ready? Click "Next" to get started.

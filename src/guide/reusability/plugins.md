# Plugins {#plugins}

## Giới thiệu {#introduction}

Plugins là các đoạn mã độc lập thường thêm chức năng cấp ứng dụng cho Vue. Đây là cách chúng ta cài đặt một plugin:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* các tùy chọn tùy ý */
})
```

Một plugin được định nghĩa là một đối tượng có phương thức `install()`, hoặc đơn giản là một hàm đóng vai trò là hàm cài đặt. Hàm cài đặt nhận [instance của ứng dụng](/api/application) cùng với các tùy chọn bổ sung được truyền vào `app.use()`, nếu có:

```js
const myPlugin = {
  install(app, options) {
    // cấu hình ứng dụng
  }
}
```

Không có phạm vi được định nghĩa chặt chẽ cho một plugin, nhưng các tình huống phổ biến mà plugin hữu ích bao gồm:

1. Đăng ký một hoặc nhiều component toàn cục hoặc directive tùy chỉnh với [`app.component()`](/api/application#app-component) và [`app.directive()`](/api/application#app-directive).

2. Tạo một tài nguyên có thể [inject](/guide/components/provide-inject) trên toàn ứng dụng bằng cách gọi [`app.provide()`](/api/application#app-provide).

3. Thêm một số thuộc tính hoặc phương thức instance toàn cục bằng cách gắn chúng vào [`app.config.globalProperties`](/api/application#app-config-globalproperties).

4. Một thư viện cần thực hiện một số kết hợp của các mục trên (ví dụ: [vue-router](https://github.com/vuejs/vue-router-next)).

## Viết một Plugin {#writing-a-plugin}

Để hiểu rõ hơn cách tạo plugin Vue.js của riêng bạn, chúng ta sẽ tạo một phiên bản rất đơn giản của plugin hiển thị chuỗi `i18n` (viết tắt của [Internationalization](https://en.wikipedia.org/wiki/Internationalization_and_localization) - Quốc tế hóa).

Hãy bắt đầu bằng cách thiết lập đối tượng plugin. Nên tạo nó trong một file riêng và export nó, như được hiển thị bên dưới để giữ logic độc lập và tách biệt.

```js [plugins/i18n.js]
export default {
  install: (app, options) => {
    // Mã plugin được đặt ở đây
  }
}
```

Chúng ta muốn tạo một hàm dịch. Hàm này sẽ nhận một chuỗi `key` được phân tách bằng dấu chấm, mà chúng ta sẽ sử dụng để tìm chuỗi đã dịch trong các tùy chọn do người dùng cung cấp. Đây là cách sử dụng dự định trong template:

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

Vì hàm này nên có sẵn toàn cục trong tất cả các template, chúng ta sẽ làm điều đó bằng cách gắn nó vào `app.config.globalProperties` trong plugin của mình:

```js{3-10} [plugins/i18n.js]
export default {
  install: (app, options) => {
    // inject một phương thức $translate() có sẵn toàn cục
    app.config.globalProperties.$translate = (key) => {
      // truy xuất một thuộc tính lồng nhau trong `options`
      // sử dụng `key` làm đường dẫn
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

Hàm `$translate` của chúng ta sẽ nhận một chuỗi như `greetings.hello`, tìm trong cấu hình do người dùng cung cấp và trả về giá trị đã dịch.

Đối tượng chứa các key đã dịch nên được truyền cho plugin trong quá trình cài đặt thông qua các tham số bổ sung cho `app.use()`:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

Bây giờ, biểu thức ban đầu `$translate('greetings.hello')` của chúng ta sẽ được thay thế bằng `Bonjour!` tại runtime.

Xem thêm: [Mở rộng Thuộc tính Toàn cục](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
Sử dụng thuộc tính toàn cục một cách hạn chế, vì nó có thể nhanh chóng trở nên khó hiểu nếu quá nhiều thuộc tính toàn cục được inject bởi các plugin khác nhau được sử dụng trên toàn ứng dụng.
:::

### Provide / Inject với Plugins {#provide-inject-with-plugins}

Plugins cũng cho phép chúng ta sử dụng `provide` để cung cấp cho người dùng plugin quyền truy cập vào một hàm hoặc thuộc tính. Ví dụ, chúng ta có thể cho phép ứng dụng truy cập vào tham số `options` để có thể sử dụng đối tượng dịch.

```js{3} [plugins/i18n.js]
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

Người dùng plugin giờ sẽ có thể inject các tùy chọn plugin vào component của họ bằng cách sử dụng key `i18n`:

<div class="composition-api">

```vue{4}
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js{2}
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>

### Đóng gói cho NPM {#bundle-for-npm}

Nếu bạn muốn xây dựng và xuất bản plugin của mình để người khác sử dụng, xem [phần Chế độ Thư viện của Vite](https://vite.dev/guide/build.html#library-mode).

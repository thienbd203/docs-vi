---
outline: deep
---

# Cờ Biên Dịch {#compile-time-flags}

:::tip
Cờ biên dịch chỉ áp dụng khi sử dụng bản build `esm-bundler` của Vue (tức là `vue/dist/vue.esm-bundler.js`).
:::

Khi sử dụng Vue với một bước build, có thể cấu hình một số cờ biên dịch để bật / tắt một số tính năng nhất định. Lợi ích của việc sử dụng cờ biên dịch là các tính năng bị tắt theo cách này có thể được loại bỏ khỏi bundle cuối cùng thông qua tree-shaking.

Vue sẽ hoạt động ngay cả khi các cờ này không được cấu hình rõ ràng. Tuy nhiên, được khuyến nghị luôn cấu hình chúng để các tính năng liên quan có thể được loại bỏ đúng cách khi có thể.

Xem [Hướng dẫn Cấu hình](#configuration-guides) về cách cấu hình chúng tùy thuộc vào công cụ build của bạn.

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **Mặc định:** `true`

  Bật / tắt hỗ trợ Options API. Tắt điều này sẽ dẫn đến các bundle nhỏ hơn, nhưng có thể ảnh hưởng đến tương thích với các thư viện bên thứ ba nếu chúng dựa vào Options API.

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **Mặc định:** `false`

  Bật / tắt hỗ trợ devtools trong các bản build production. Điều này sẽ dẫn đến nhiều mã hơn được bao gồm trong bundle, vì vậy được khuyến nghị chỉ bật điều này cho mục đích debug.

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` {#VUE_PROD_HYDRATION_MISMATCH_DETAILS}

- **Mặc định:** `false`

  Bật/tắt các cảnh báo chi tiết cho các sự không khớp hydration trong các bản build production. Điều này sẽ dẫn đến nhiều mã hơn được bao gồm trong bundle, vì vậy được khuyến nghị chỉ bật điều này cho mục đích debug.

- Chỉ có sẵn trong 3.4+

## Hướng dẫn Cấu hình {#configuration-guides}

### Vite {#vite}

`@vitejs/plugin-vue` tự động cung cấp các giá trị mặc định cho các cờ này. Để thay đổi các giá trị mặc định, sử dụng tùy chọn cấu hình [`define` của Vite](https://vite.dev/config/shared-options.html#define):

```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // bật chi tiết không khớp hydration trong bản build production
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` tự động cung cấp các giá trị mặc định cho một số cờ này. Để cấu hình / thay đổi các giá trị:

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### webpack {#webpack}

Flags should be defined using webpack's [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

```js [webpack.config.js]
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

Flags should be defined using [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js [rollup.config.js]
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

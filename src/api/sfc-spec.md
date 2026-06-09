# Đặc tả Cú pháp SFC {#sfc-syntax-specification}

## Tổng quan {#overview}

Vue Single-File Component (SFC), thường sử dụng đuôi file `*.vue`, là một định dạng file tùy chỉnh sử dụng cú pháp giống HTML để mô tả một Vue component. Vue SFC tương thích về mặt cú pháp với HTML.

Mỗi file `*.vue` bao gồm ba loại khối ngôn ngữ cấp cao nhất: `<template>`, `<script>`, và `<style>`, và tùy chọn thêm các khối tùy chỉnh khác:

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  Đây có thể là ví dụ: tài liệu cho component.
</custom1>
```

## Các Khối Ngôn ngữ {#language-blocks}

### `<template>` {#template}

- Mỗi file `*.vue` có thể chứa tối đa một khối `<template>` cấp cao nhất.

- Nội dung sẽ được trích xuất và chuyển đến `@vue/compiler-dom`, được biên dịch trước thành các hàm render JavaScript, và gắn vào component được xuất như là tùy chọn `render` của nó.

### `<script>` {#script}

- Mỗi file `*.vue` có thể chứa tối đa một khối `<script>` (không bao gồm [`<script setup>`](/api/sfc-script-setup)).

- Script được thực thi như một ES Module.

- **Default export** nên là một đối tượng tùy chọn của Vue component, dưới dạng một đối tượng đơn giản hoặc là giá trị trả về của [defineComponent](/api/general#definecomponent).

### `<script setup>` {#script-setup}

- Mỗi file `*.vue` có thể chứa tối đa một khối `<script setup>` (không bao gồm `<script>` bình thường).

- Script được xử lý trước và được sử dụng như hàm `setup()` của component, điều này có nghĩa là nó sẽ được thực thi **cho mỗi instance của component**. Các binding cấp cao nhất trong `<script setup>` được tự động expose ra template. Để biết thêm chi tiết, xem [tài liệu chuyên sâu về `<script setup>`](/api/sfc-script-setup).

### `<style>` {#style}

- Một file `*.vue` có thể chứa nhiều thẻ `<style>`.

- Thẻ `<style>` có thể có thuộc tính `scoped` hoặc `module` (xem [Tính năng Style SFC](/api/sfc-css-features) để biết thêm chi tiết) để giúp đóng gói styles cho component hiện tại. Nhiều thẻ `<style>` với các chế độ đóng gói khác nhau có thể được trộn trong cùng một component.

### Khối Tùy chỉnh {#custom-blocks}

Các khối tùy chỉnh bổ sung có thể được bao gồm trong file `*.vue` cho bất kỳ nhu cầu cụ thể của dự án nào, ví dụ như khối `<docs>`. Một số ví dụ thực tế về các khối tùy chỉnh bao gồm:

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#i18n-custom-block)

Xử lý các Khối Tùy chỉnh sẽ phụ thuộc vào công cụ - nếu bạn muốn xây dựng các tích hợp khối tùy chỉnh của riêng mình, xem [phần công cụ tích hợp khối tùy chỉnh SFC](/guide/scaling-up/tooling#sfc-custom-block-integrations) để biết thêm chi tiết.

## Suy diễn Tên Tự động {#automatic-name-inference}

Một SFC tự động suy diễn tên của component từ **tên file** trong các trường hợp sau:

- Định dạng cảnh báo phát triển
- Kiểm tra DevTools
- Tự tham chiếu đệ quy, ví dụ một file tên là `FooBar.vue` có thể tham chiếu đến chính nó như `<FooBar/>` trong template của nó. Điều này có mức độ ưu tiên thấp hơn so với các component được đăng ký/nhập khẩu một cách rõ ràng.

## Bộ Xử lý Trước {#pre-processors}

Các khối có thể khai báo ngôn ngữ bộ xử lý trước bằng thuộc tính `lang`. Trường hợp phổ biến nhất là sử dụng TypeScript cho khối `<script>`:

```vue-html
<script lang="ts">
  // sử dụng TypeScript
</script>
```

`lang` có thể được áp dụng cho bất kỳ khối nào - ví dụ chúng ta có thể sử dụng `<style>` với [Sass](https://sass-lang.com/) và `<template>` với [Pug](https://pugjs.org/api/getting-started.html):

```vue-html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

Lưu ý rằng tích hợp với các bộ xử lý trước khác nhau có thể khác nhau tùy theo toolchain. Xem tài liệu tương ứng để có ví dụ:

- [Vite](https://vite.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## Nhập khẩu `src` {#src-imports}

Nếu bạn muốn chia nhỏ các component `*.vue` thành nhiều file, bạn có thể sử dụng thuộc tính `src` để nhập một file bên ngoài cho một khối ngôn ngữ:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

Lưu ý rằng nhập khẩu `src` tuân theo các quy tắc phân giải đường dẫn giống như các yêu cầu module của webpack, điều này có nghĩa là:

- Các đường dẫn tương đối cần bắt đầu bằng `./`
- Bạn có thể nhập tài nguyên từ các dependency npm:

```vue
<!-- nhập một file từ gói npm "todomvc-app-css" đã cài đặt -->
<style src="todomvc-app-css/index.css" />
```

Nhập khẩu `src` cũng hoạt động với các khối tùy chỉnh, ví dụ:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

:::warning Lưu ý
Khi sử dụng alias trong `src`, đừng bắt đầu bằng `~`, mọi thứ sau nó được hiểu là một yêu cầu module. Điều này có nghĩa là bạn có thể tham chiếu tài nguyên bên trong các node module:
```vue
<img src="~some-npm-package/foo.png">
```
:::

## Chú thích {#comments}

Bên trong mỗi khối, bạn nên sử dụng cú pháp chú thích của ngôn ngữ đang được sử dụng (HTML, CSS, JavaScript, Pug, v.v.). Đối với các chú thích cấp cao nhất, sử dụng cú pháp chú thích HTML: `<!-- nội dung chú thích ở đây -->`

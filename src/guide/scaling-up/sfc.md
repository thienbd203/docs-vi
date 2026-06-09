# Single-File Components {#single-file-components}

## Giới thiệu {#introduction}

Vue Single-File Components (hay còn gọi là file `*.vue`, viết tắt là **SFC**) là một định dạng file đặc biệt cho phép chúng ta đóng gói template, logic, **và** styling của một Vue component trong cùng một file. Đây là ví dụ về một SFC:

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

Như chúng ta có thể thấy, Vue SFC là một mở rộng tự nhiên của bộ ba kinh điển HTML, CSS và JavaScript. Các block `<template>`, `<script>`, và `<style>` đóng gói và đặt cùng nhau (colocate) view, logic và styling của một component trong cùng một file. Cú pháp đầy đủ được định nghĩa trong [SFC Syntax Specification](/api/sfc-spec).

## Tại sao dùng SFC {#why-sfc}

Mặc dù SFC yêu cầu một bước build, nhưng đổi lại có rất nhiều lợi ích:

- Viết các component dạng module bằng cú pháp HTML, CSS và JavaScript quen thuộc
- [Đặt cùng nhau các mối quan tâm vốn có liên kết với nhau (colocation of inherently coupled concerns)](#what-about-separation-of-concerns)
- Template được biên dịch trước (pre-compiled) mà không tốn chi phí biên dịch tại runtime
- [CSS có phạm vi component (component-scoped CSS)](/api/sfc-css-features)
- [Cú pháp thuận tiện hơn khi làm việc với Composition API](/api/sfc-script-setup)
- Nhiều tối ưu hóa tại thời điểm biên dịch (compile-time) bằng cách phân tích chéo template và script
- [Hỗ trợ IDE](/guide/scaling-up/tooling#ide-support) với tính năng auto-completion và type-checking cho các biểu thức trong template
- Hỗ trợ Hot-Module Replacement (HMR) có sẵn

SFC là một tính năng đặc trưng của Vue với tư cách là một framework, và là cách tiếp cận được khuyến nghị khi sử dụng Vue trong các trường hợp sau:

- Single-Page Applications (SPA)
- Static Site Generation (SSG)
- Bất kỳ frontend nào không quá đơn giản mà việc có bước build là hợp lý để có trải nghiệm phát triển (DX) tốt hơn.

Tuy nhiên, chúng tôi cũng nhận ra có những trường hợp SFC có thể cảm thấy quá phức tạp. Đó là lý do Vue vẫn có thể được sử dụng thông qua JavaScript thuần mà không cần bước build. Nếu bạn chỉ muốn cải thiện HTML chủ yếu là tĩnh với các tương tác nhẹ, bạn có thể tham khảo [petite-vue](https://github.com/vuejs/petite-vue), một phiên bản con 6 kB của Vue được tối ưu hóa cho progressive enhancement.

## Cách hoạt động {#how-it-works}

Vue SFC là một định dạng file đặc thù cho framework và phải được biên dịch trước (pre-compiled) bởi [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) thành JavaScript và CSS tiêu chuẩn. Một SFC đã biên dịch là một module JavaScript (ES) tiêu chuẩn - điều này có nghĩa là với cấu hình build phù hợp, bạn có thể import một SFC như một module:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

Các thẻ `<style>` bên trong SFC thường được inject dưới dạng thẻ `<style>` gốc trong quá trình phát triển để hỗ trợ cập nhật nóng (hot updates). Đối với production, chúng có thể được trích xuất và gộp thành một file CSS duy nhất.

Bạn có thể thử nghiệm với SFC và khám phá cách chúng được biên dịch trong [Vue SFC Playground](https://play.vuejs.org/).

Trong các dự án thực tế, chúng ta thường tích hợp trình biên dịch SFC với một công cụ build như [Vite](https://vite.dev/) hoặc [Vue CLI](http://cli.vuejs.org/) (dựa trên [webpack](https://webpack.js.org/)), và Vue cung cấp các công cụ scaffolding chính thức để giúp bạn bắt đầu với SFC nhanh nhất có thể. Xem thêm chi tiết trong phần [SFC Tooling](/guide/scaling-up/tooling).

## Vậy việc tách biệt mối quan tâm (Separation of Concerns) thì sao? {#what-about-separation-of-concerns}

Một số người dùng đến từ nền tảng phát triển web truyền thống có thể lo ngại rằng SFC đang trộn lẫn các mối quan tâm khác nhau ở cùng một nơi - điều mà HTML/CSS/JS vốn dĩ được thiết kế để tách biệt!

Để trả lời câu hỏi này, điều quan trọng là chúng ta cần đồng ý rằng **tách biệt mối quan tâm không đồng nghĩa với tách biệt loại file**. Mục tiêu cuối cùng của các nguyên tắc kỹ thuật là cải thiện khả năng bảo trì của codebase. Việc tách biệt mối quan tâm, khi áp dụng một cách giáo điều như việc tách biệt loại file, không giúp chúng ta đạt được mục tiêu đó trong bối cảnh các ứng dụng frontend ngày càng phức tạp.

Trong phát triển UI hiện đại, chúng tôi nhận thấy rằng thay vì chia codebase thành ba lớp lớn xen kẽ với nhau, việc chia chúng thành các component liên kết lỏng (loosely-coupled) và kết hợp chúng lại có ý nghĩa hơn nhiều. Bên trong một component, template, logic và styles vốn dĩ liên kết với nhau, và việc đặt chúng cùng nhau thực sự làm cho component gắn kết hơn và dễ bảo trì hơn.

Lưu ý rằng ngay cả khi bạn không thích ý tưởng về Single-File Components, bạn vẫn có thể tận dụng các tính năng hot-reloading và biên dịch trước (pre-compilation) của nó bằng cách tách JavaScript và CSS thành các file riêng biệt sử dụng [Src Imports](/api/sfc-spec#src-imports).

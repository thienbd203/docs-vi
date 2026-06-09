---
outline: deep
---

# Sử dụng Vue với TypeScript {#using-vue-with-typescript}

Một hệ thống kiểu như TypeScript có thể phát hiện nhiều lỗi phổ biến thông qua phân tích tĩnh tại thời gian build. Điều này giảm khả năng xảy ra lỗi runtime trong môi trường sản xuất, và cũng cho phép chúng ta tái cấu trúc code một cách tự tin hơn trong các ứng dụng quy mô lớn. TypeScript cũng cải thiện trải nghiệm nhà phát triển thông qua tính năng tự động hoàn thành dựa trên kiểu trong các IDE.

Vue được viết bằng chính TypeScript và cung cấp hỗ trợ TypeScript hạng nhất. Tất cả các gói chính thức của Vue đều đi kèm với các khai báo kiểu được đóng gói sẵn và hoạt động ngay lập tức.

## Thiết lập dự án {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue), công cụ tạo dự án chính thức, cung cấp các tùy chọn để tạo một dự án Vue dựa trên [Vite](https://vite.dev/) và sẵn sàng sử dụng TypeScript.

### Tổng quan {#overview}

Với thiết lập dựa trên Vite, máy chủ phát triển và công cụ đóng gói chỉ thực hiện chuyển đổi mã (transpilation) và không thực hiện bất kỳ kiểm tra kiểu nào. Điều này đảm bảo máy chủ phát triển Vite vẫn hoạt động cực nhanh ngay cả khi sử dụng TypeScript.

- Trong quá trình phát triển, chúng tôi khuyên bạn nên dựa vào [thiết lập IDE tốt](#ide-support) để nhận phản hồi tức thì về các lỗi kiểu.

- Nếu sử dụng SFC, hãy sử dụng công cụ [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) để kiểm tra kiểu từ dòng lệnh và tạo khai báo kiểu. `vue-tsc` là một trình bao bọc xung quanh `tsc`, giao diện dòng lệnh chính thức của TypeScript. Nó hoạt động gần giống như `tsc` ngoại trừ việc nó hỗ trợ Vue SFC ngoài các file TypeScript. Bạn có thể chạy `vue-tsc` ở chế độ watch song song với máy chủ phát triển Vite, hoặc sử dụng plugin Vite như [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) chạy các kiểm tra trong một luồng worker riêng biệt.

- Vue CLI cũng cung cấp hỗ trợ TypeScript, nhưng không còn được khuyến nghị. Xem [ghi chú bên dưới](#note-on-vue-cli-and-ts-loader).

### Hỗ trợ IDE {#ide-support}

- [Visual Studio Code](https://code.visualstudio.com/) (VS Code) được khuyến nghị mạnh mẽ nhờ hỗ trợ TypeScript tuyệt vời ngay từ đầu.

  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (trước đây là Volar) là tiện ích mở rộng VS Code chính thức cung cấp hỗ trợ TypeScript bên trong Vue SFC, cùng với nhiều tính năng tuyệt vời khác.

    :::tip
    Tiện ích mở rộng Vue - Official thay thế [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), tiện ích mở rộng VS Code chính thức trước đây của chúng tôi cho Vue 2. Nếu bạn hiện đang cài đặt Vetur, hãy đảm bảo tắt nó trong các dự án Vue 3.
    :::

- [WebStorm](https://www.jetbrains.com/webstorm/) cũng cung cấp hỗ trợ sẵn có cho cả TypeScript và Vue. Các IDE JetBrains khác cũng hỗ trợ chúng, hoặc sẵn có hoặc thông qua [plugin miễn phí](https://plugins.jetbrains.com/plugin/9442-vue-js). Kể từ phiên bản 2023.2, WebStorm và Vue Plugin đi kèm với hỗ trợ tích hợp cho Vue Language Server. Bạn có thể đặt dịch vụ Vue để sử dụng tích hợp Volar trên tất cả các phiên bản TypeScript, trong Settings > Languages & Frameworks > TypeScript > Vue. Theo mặc định, Volar sẽ được sử dụng cho các phiên bản TypeScript 5.0 trở lên.

### Cấu hình `tsconfig.json` {#configuring-tsconfig-json}

Các dự án được tạo thông qua `create-vue` bao gồm `tsconfig.json` được cấu hình sẵn. Cấu hình cơ bản được trừu tượng hóa trong gói [`@vue/tsconfig`](https://github.com/vuejs/tsconfig). Bên trong dự án, chúng tôi sử dụng [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) để đảm bảo các kiểu đúng cho code chạy trong các môi trường khác nhau (ví dụ: code ứng dụng và code kiểm thử nên có các biến toàn cục khác nhau).

Khi cấu hình `tsconfig.json` thủ công, một số tùy chọn đáng chú ý bao gồm:

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) được đặt thành `true` vì Vite sử dụng [esbuild](https://esbuild.github.io/) để chuyển đổi TypeScript và chịu các giới hạn chuyển đổi file đơn. [`compilerOptions.verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) là [một tập con của `isolatedModules`](https://github.com/microsoft/TypeScript/issues/53601) và cũng là một lựa chọn tốt - đây là những gì [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) sử dụng.

- Nếu bạn đang sử dụng Options API, bạn cần đặt [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) thành `true` (hoặc ít nhất là bật [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis), là một phần của cờ `strict`) để tận dụng kiểm tra kiểu của `this` trong các tùy chọn component. Nếu không, `this` sẽ được coi là `any`.

- Nếu bạn đã cấu hình các alias resolver trong công cụ build của mình, ví dụ alias `@/*` được cấu hình mặc định trong một dự án `create-vue`, bạn cũng cần cấu hình nó cho TypeScript thông qua [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths).

- Nếu bạn định sử dụng TSX với Vue, hãy đặt [`compilerOptions.jsx`](https://www.typescriptlang.org/tsconfig#jsx) thành `"preserve"`, và đặt [`compilerOptions.jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) thành `"vue"`.

Xem thêm:

- [Tài liệu tùy chọn trình biên dịch TypeScript chính thức](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Các lưu ý khi biên dịch TypeScript với esbuild](https://esbuild.github.io/content-types/#typescript-caveats)

### Ghi chú về Vue CLI và `ts-loader` {#note-on-vue-cli-and-ts-loader}

Trong các thiết lập dựa trên webpack như Vue CLI, việc thực hiện kiểm tra kiểu như một phần của pipeline chuyển đổi module là phổ biến, ví dụ với `ts-loader`. Tuy nhiên, đây không phải là một giải pháp sạch sẽ vì hệ thống kiểu cần có kiến thức về toàn bộ đồ thị module để thực hiện kiểm tra kiểu. Bước chuyển đổi của từng module đơn giản không phải là nơi phù hợp cho nhiệm vụ này. Điều này dẫn đến các vấn đề sau:

- `ts-loader` chỉ có thể kiểm tra kiểu code sau khi chuyển đổi. Điều này không phù hợp với các lỗi chúng ta thấy trong IDE hoặc từ `vue-tsc`, ánh xạ trực tiếp trở lại code nguồn.

- Kiểm tra kiểu có thể chậm. Khi nó được thực hiện trong cùng một luồng / quy trình với các chuyển đổi code, nó ảnh hưởng đáng kể đến tốc độ build của toàn bộ ứng dụng.

- Chúng ta đã có kiểm tra kiểu chạy ngay trong IDE của mình trong một quy trình riêng biệt, nên chi phí làm chậm trải nghiệm phát triển đơn giản không phải là một sự đánh đổi tốt.

Nếu bạn hiện đang sử dụng Vue 3 + TypeScript thông qua Vue CLI, chúng tôi khuyến nghị mạnh mẽ việc chuyển sang Vite. Chúng tôi cũng đang làm việc trên các tùy chọn CLI để bật hỗ trợ TS chỉ chuyển đổi (transpile-only), để bạn có thể chuyển sang `vue-tsc` để kiểm tra kiểu.

## Ghi chú sử dụng chung {#general-usage-notes}

### `defineComponent()` {#definecomponent}

Để TypeScript suy luận kiểu đúng bên trong các tùy chọn component, chúng ta cần định nghĩa các component với [`defineComponent()`](/api/general#definecomponent):

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // type inference enabled
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // type: string | undefined
    this.msg // type: string
    this.count // type: number
  }
})
```

`defineComponent()` cũng hỗ trợ suy luận các props được truyền vào `setup()` khi sử dụng Composition API mà không có `<script setup>`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // type inference enabled
  props: {
    message: String
  },
  setup(props) {
    props.message // type: string | undefined
  }
})
```

Xem thêm:

- [Ghi chú về webpack Treeshaking](/api/general#note-on-webpack-treeshaking)
- [kiểm tra kiểu cho `defineComponent`](https://github.com/vuejs/core/blob/main/packages-private/dts-test/defineComponent.test-d.tsx)

:::tip
`defineComponent()` cũng cho phép suy luận kiểu cho các component được định nghĩa trong JavaScript thuần.
:::

### Sử dụng trong Single-File Components {#usage-in-single-file-components}

Để sử dụng TypeScript trong SFC, hãy thêm thuộc tính `lang="ts"` vào thẻ `<script>`. Khi `lang="ts"` có mặt, tất cả các biểu thức template cũng được hưởng kiểm tra kiểu chặt chẽ hơn.

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- type checking and auto-completion enabled -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` cũng có thể được sử dụng với `<script setup>`:

```vue
<script setup lang="ts">
// TypeScript enabled
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- type checking and auto-completion enabled -->
  {{ count.toFixed(2) }}
</template>
```

### TypeScript trong Templates {#typescript-in-templates}

`<template>` cũng hỗ trợ TypeScript trong các biểu thức binding khi `<script lang="ts">` hoặc `<script setup lang="ts">` được sử dụng. Điều này hữu ích trong các trường hợp bạn cần thực hiện ép kiểu trong các biểu thức template.

Đây là một ví dụ giả định:

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- error because x could be a string -->
  {{ x.toFixed(2) }}
</template>
```

Điều này có thể được giải quyết bằng cách ép kiểu nội tuyến:

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
Nếu sử dụng Vue CLI hoặc thiết lập dựa trên webpack, TypeScript trong các biểu thức template yêu cầu `vue-loader@^16.8.0`.
:::

### Sử dụng với TSX {#usage-with-tsx}

Vue cũng hỗ trợ viết component với JSX / TSX. Chi tiết được đề cập trong hướng dẫn [Render Function & JSX](/guide/extras/render-function.html#jsx-tsx).

## Component Generic {#generic-components}

Component generic được hỗ trợ trong hai trường hợp:

- Trong SFC: [`<script setup>` với thuộc tính `generic`](/api/sfc-script-setup.html#generics)
- Component render function / JSX: [chữ ký hàm của `defineComponent()`](/api/general.html#function-signature)

## Công thức cụ thể theo API {#api-specific-recipes}

- [TS với Composition API](./composition-api)
- [TS với Options API](./options-api)

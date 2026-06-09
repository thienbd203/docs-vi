# Tùy chọn: Rendering {#options-rendering}

## template {#template}

Một chuỗi template cho component.

- **Kiểu**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Chi tiết**

  Template được cung cấp qua tùy chọn `template` sẽ được biên dịch ngay lập tức tại runtime. Nó chỉ được hỗ trợ khi sử dụng bản build của Vue có bao gồm trình biên dịch template. Trình biên dịch template **KHÔNG** được bao gồm trong các bản build của Vue có từ khóa `runtime` trong tên, ví dụ `vue.runtime.esm-bundler.js`. Xem [hướng dẫn về file dist](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) để biết thêm chi tiết về các bản build khác nhau.

  Nếu chuỗi bắt đầu bằng `#`, nó sẽ được sử dụng như một `querySelector` và sử dụng `innerHTML` của phần tử được chọn làm chuỗi template. Điều này cho phép template nguồn được viết bằng các phần tử `<template>` gốc.

  Nếu tùy chọn `render` cũng có mặt trong cùng một component, `template` sẽ bị bỏ qua.

  Nếu component gốc của ứng dụng không có tùy chọn `template` hoặc `render` được chỉ định, Vue sẽ cố gắng sử dụng `innerHTML` của phần tử được mount làm template thay thế.

  :::warning Lưu ý về bảo mật
  Chỉ sử dụng các nguồn template mà bạn tin tưởng. Không sử dụng nội dung do người dùng cung cấp làm template của bạn. Xem [Hướng dẫn bảo mật](/guide/best-practices/security#rule-no-1-never-use-non-trusted-templates) để biết thêm chi tiết.
  :::

## render {#render}

Một hàm trả về cây virtual DOM của component theo cách lập trình.

- **Kiểu**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **Chi tiết**

  `render` là một giải pháp thay thế cho các template dạng chuỗi, cho phép bạn tận dụng toàn bộ sức mạnh lập trình của JavaScript để khai báo kết quả render của component.

  Các template được biên dịch trước, ví dụ như trong Single-File Components, sẽ được biên dịch thành tùy chọn `render` tại thời điểm build. Nếu cả `render` và `template` đều có mặt trong một component, `render` sẽ có ưu tiên cao hơn.

- **Xem thêm**
  - [Cơ chế Rendering](/guide/extras/rendering-mechanism)
  - [Hàm Render](/guide/extras/render-function)

## compilerOptions {#compileroptions}

Cấu hình các tùy chọn trình biên dịch runtime cho template của component.

- **Kiểu**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // mặc định: 'condense'
      delimiters?: [string, string] // mặc định: ['{{', '}}']
      comments?: boolean // mặc định: false
    }
  }
  ```

- **Chi tiết**

  Tùy chọn cấu hình này chỉ được áp dụng khi sử dụng bản build đầy đủ (tức là `vue.js` độc lập có thể biên dịch template trong trình duyệt). Nó hỗ trợ các tùy chọn giống như [app.config.compilerOptions](/api/application#app-config-compileroptions) ở cấp độ ứng dụng, và có ưu tiên cao hơn cho component hiện tại.

- **Xem thêm** [app.config.compilerOptions](/api/application#app-config-compileroptions)

## slots<sup class="vt-badge ts"/> {#slots}

- Chỉ được hỗ trợ từ 3.3+

Một tùy chọn để hỗ trợ suy luận kiểu khi sử dụng slots theo cách lập trình trong các hàm render.

- **Chi tiết**

  Giá trị runtime của tùy chọn này không được sử dụng. Các kiểu thực tế nên được khai báo thông qua type casting bằng trình trợ giúp kiểu `SlotsType`:

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```

# API Custom Elements {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

Phương thức này chấp nhận cùng tham số với [`defineComponent`](#definecomponent), nhưng thay vào đó trả về một hàm tạo lớp [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) gốc.

- **Type**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & CustomElementsOptions)
      | ComponentOptions['setup'],
    options?: CustomElementsOptions
  ): {
    new (props?: object): HTMLElement
  }

  interface CustomElementsOptions {
    styles?: string[]

    // các tùy chọn sau là 3.5+
    configureApp?: (app: App) => void
    shadowRoot?: boolean
    nonce?: string
  }
  ```

  > Kiểu được đơn giản hóa để dễ đọc.

- **Chi tiết**

  Ngoài các tùy chọn component bình thường, `defineCustomElement()` cũng hỗ trợ một số tùy chọn dành riêng cho custom-elements:

  - **`styles`**: một mảng chuỗi CSS được nhúng để cung cấp CSS nên được chèn vào shadow root của phần tử.

  - **`configureApp`** <sup class="vt-badge" data-text="3.5+"/>: một hàm có thể được sử dụng để cấu hình instance ứng dụng Vue cho custom element.

  - **`shadowRoot`** <sup class="vt-badge" data-text="3.5+"/>: `boolean`, mặc định là `true`. Đặt thành `false` để render custom element mà không có shadow root. Điều này có nghĩa là `<style>` trong SFC của custom element sẽ không còn được đóng gói.

  - **`nonce`** <sup class="vt-badge" data-text="3.5+"/>: `string`, nếu được cung cấp, sẽ được đặt làm thuộc tính `nonce` trên các thẻ style được chèn vào shadow root.

  Lưu ý rằng thay vì được truyền như một phần của chính component, các tùy chọn này cũng có thể được truyền qua một tham số thứ hai:

  ```js
  import Element from './MyElement.ce.vue'

  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

  Giá trị trả về là một hàm tạo custom element có thể được đăng ký bằng cách sử dụng [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Ví dụ**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* tùy chọn component */
  })

  // Đăng ký custom element.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Xem thêm**

  - [Hướng dẫn - Xây dựng Custom Elements với Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Lưu ý rằng `defineCustomElement()` yêu cầu [cấu hình đặc biệt](/guide/extras/web-components#sfc-as-custom-element) khi được sử dụng với Single-File Components.

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

Một helper của Composition API trả về phần tử host của custom element Vue hiện tại.

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

Một helper của Composition API trả về shadow root của custom element Vue hiện tại.

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

Một thuộc tính của Options API hiển thị phần tử host của custom element Vue hiện tại.

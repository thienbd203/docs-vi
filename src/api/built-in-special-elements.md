# Các Element Đặc biệt Có Sẵn {#built-in-special-elements}

:::info Không Phải là Component
`<component>`, `<slot>` và `<template>` là các tính năng giống component và là một phần của cú pháp template. Chúng không phải là component thực sự và được biên dịch bỏ đi trong quá trình biên dịch template. Do đó, chúng thường được viết bằng chữ thường trong template.
:::

## `<component>` {#component}

Một "meta component" để render các component hoặc element động.

- **Props**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **Chi tiết**

  Component thực sự để render được xác định bởi prop `is`.

  - Khi `is` là một chuỗi, nó có thể là tên thẻ HTML hoặc tên đã đăng ký của một component.

  - Ngoài ra, `is` cũng có thể được bind trực tiếp đến định nghĩa của một component.

- **Ví dụ**

  Render component theo tên đã đăng ký (Options API):

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  Render component theo định nghĩa (Composition API với `<script setup>`):

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  Render các element HTML:

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  Các [component có sẵn](./built-in-components) đều có thể được truyền vào `is`, nhưng bạn phải đăng ký chúng nếu muốn truyền theo tên. Ví dụ:

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  Đăng ký không cần thiết nếu bạn truyền chính component vào `is` thay vì tên của nó, ví dụ trong `<script setup>`.

  Nếu `v-model` được sử dụng trên thẻ `<component>`, trình biên dịch template sẽ mở rộng nó thành prop `modelValue` và event listener `update:modelValue`, giống như với bất kỳ component nào khác. Tuy nhiên, điều này sẽ không tương thích với các element HTML gốc, như `<input>` hoặc `<select>`. Do đó, sử dụng `v-model` với một element gốc được tạo động sẽ không hoạt động:

  ```vue
  <script setup>
  import { ref } from 'vue'

  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- Điều này sẽ không hoạt động vì 'input' là một element HTML gốc -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  Trong thực tế, trường hợp ngoại lệ này không phổ biến vì các trường form gốc thường được bọc trong component trong các ứng dụng thực tế. Nếu bạn thực sự cần sử dụng một element gốc trực tiếp thì bạn có thể tách `v-model` thành một attribute và event thủ công.

- **Xem thêm** [Component Động](/guide/essentials/component-basics#dynamic-components)

## `<slot>` {#slot}

Chỉ định các vị trí xuất nội dung slot trong template.

- **Props**

  ```ts
  interface SlotProps {
    /**
     * Bất kỳ props nào được truyền vào <slot> sẽ được truyền
     * làm đối số cho scoped slots
     */
    [key: string]: any
    /**
     * Dành riêng để chỉ định tên slot.
     */
    name?: string
  }
  ```

- **Chi tiết**

  Element `<slot>` có thể sử dụng attribute `name` để chỉ định tên slot. Khi không có `name` được chỉ định, nó sẽ render slot mặc định. Các attribute bổ sung được truyền vào element slot sẽ được truyền làm slot props cho scoped slot được định nghĩa trong component cha.

  Chính element này sẽ được thay thế bởi nội dung slot khớp với nó.

  Các element `<slot>` trong template Vue được biên dịch thành JavaScript, vì vậy chúng không nên bị nhầm lẫn với [element `<slot>` gốc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot).

- **Xem thêm** [Component - Slots](/guide/components/slots)

## `<template>` {#template}

Thẻ `<template>` được sử dụng như một placeholder khi chúng ta muốn sử dụng một directive có sẵn mà không render một element trong DOM.

- **Chi tiết**

  Xử lý đặc biệt cho `<template>` chỉ được kích hoạt khi nó được sử dụng với một trong các directive sau:

  - `v-if`, `v-else-if`, hoặc `v-else`
  - `v-for`
  - `v-slot`

  Nếu không có directive nào trong số đó xuất hiện thì nó sẽ được render như một [element `<template>` gốc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).

  Một `<template>` với `v-for` cũng có thể có một [attribute `key`](/api/built-in-special-attributes#key). Tất cả các attribute và directive khác sẽ bị loại bỏ, vì chúng không có ý nghĩa mà không có một element tương ứng.

  Các single-file component sử dụng một [thẻ `<template>` cấp cao nhất](/api/sfc-spec#language-blocks) để bọc toàn bộ template. Cách sử dụng này tách biệt với cách sử dụng `<template>` được mô tả ở trên. Thẻ cấp cao nhất đó không phải là một phần của chính template và không hỗ trợ cú pháp template, như các directive.

- **Xem thêm**
  - [Hướng dẫn - `v-if` trên `<template>`](/guide/essentials/conditional#v-if-on-template)
  - [Hướng dẫn - `v-for` trên `<template>`](/guide/essentials/list#v-for-on-template)
  - [Hướng dẫn - Named slots](/guide/components/slots#named-slots)

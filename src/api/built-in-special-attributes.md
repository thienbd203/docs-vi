# Các Thuộc tính Đặc biệt Có Sẵn {#built-in-special-attributes}

## key {#key}

Thuộc tính đặc biệt `key` chủ yếu được sử dụng như một gợi ý cho thuật toán virtual DOM của Vue để xác định vnodes khi diffing danh sách node mới với danh sách cũ.

- **Mong đợi:** `number | string | symbol`

- **Chi tiết**

  Không có keys, Vue sử dụng một thuật toán giảm thiểu chuyển động phần tử và cố gắng patch/tái sử dụng các phần tử cùng loại tại chỗ càng nhiều càng tốt. Với keys, nó sẽ sắp xếp lại các phần tử dựa trên thay đổi thứ tự của keys, và các phần tử với keys không còn hiện diện sẽ luôn bị xóa / hủy.

  Các con của cùng một cha chung phải có **unique keys**. Keys trùng lặp sẽ gây ra lỗi render.

  Use case phổ biến nhất là kết hợp với `v-for`:

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  Nó cũng có thể được sử dụng để ép buộc thay thế một phần tử/component thay vì tái sử dụng nó. Điều này có thể hữu ích khi bạn muốn:

  - Kích hoạt đúng lifecycle hooks của một component
  - Kích hoạt transitions

  Ví dụ:

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  Khi `text` thay đổi, `<span>` sẽ luôn được thay thế thay vì được patch, do đó một transition sẽ được kích hoạt.

- **Xem thêm** [Hướng dẫn - List Rendering - Duy trì Trạng thái với `key`](/guide/essentials/list#maintaining-state-with-key)

## ref {#ref}

Chỉ định một [template ref](/guide/essentials/template-refs).

- **Mong đợi:** `string | Function`

- **Chi tiết**

  `ref` được sử dụng để đăng ký một tham chiếu đến một phần tử hoặc một component con.

  Trong Options API, tham chiếu sẽ được đăng ký dưới đối tượng `this.$refs` của component:

  ```vue-html
  <!-- stored as this.$refs.p -->
  <p ref="p">hello</p>
  ```

  In Composition API, the reference will be stored in a ref with matching name:

  ```vue
  <script setup>
  import { useTemplateRef } from 'vue'

  const pRef = useTemplateRef('p')
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  If used on a plain DOM element, the reference will be that element; if used on a child component, the reference will be the child component instance.

  Alternatively `ref` can accept a function value which provides full control over where to store the reference:

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  An important note about the ref registration timing: because the refs themselves are created as a result of the render function, you must wait until the component is mounted before accessing them.

  `this.$refs` is also non-reactive, therefore you should not attempt to use it in templates for data-binding.

- **See also**
  - [Guide - Template Refs](/guide/essentials/template-refs)
  - [Guide - Typing Template Refs](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Guide - Typing Component Template Refs](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## is {#is}

Used for binding [dynamic components](/guide/essentials/component-basics#dynamic-components).

- **Expects:** `string | Component`

- **Usage on native elements**
 
  - Only supported in 3.1+

  When the `is` attribute is used on a native HTML element, it will be interpreted as a [Customized built-in element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), which is a native web platform feature.

  There is, however, a use case where you may need Vue to replace a native element with a Vue component, as explained in [in-DOM Template Parsing Caveats](/guide/essentials/component-basics#in-dom-template-parsing-caveats). You can prefix the value of the `is` attribute with `vue:` so that Vue will render the element as a Vue component instead:

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **See also**

  - [Built-in Special Element - `<component>`](/api/built-in-special-elements#component)
  - [Dynamic Components](/guide/essentials/component-basics#dynamic-components)

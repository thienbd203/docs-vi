# Tính năng CSS của SFC {#sfc-css-features}

## Scoped CSS {#scoped-css}

Khi thẻ `<style>` có thuộc tính `scoped`, CSS của nó sẽ chỉ áp dụng cho các phần tử của component hiện tại. Điều này tương tự như việc đóng gói style (style encapsulation) được tìm thấy trong Shadow DOM. Nó có một số lưu ý, nhưng không yêu cầu bất kỳ polyfill nào. Nó được thực hiện bằng cách sử dụng PostCSS để chuyển đổi đoạn sau:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

Thành đoạn sau:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### Phần tử gốc của Component con {#child-component-root-elements}

Với `scoped`, style của component cha sẽ không bị rò rỉ vào các component con. Tuy nhiên, nút gốc của component con sẽ bị ảnh hưởng bởi cả CSS scoped của cha và CSS scoped của con. Điều này được thiết kế theo cách này để component cha có thể style phần tử gốc của component con cho mục đích bố cục.

### Deep Selectors {#deep-selectors}

Nếu bạn muốn một selector trong style `scoped` là "deep", tức là ảnh hưởng đến các component con, bạn có thể sử dụng pseudo-class `:deep()`:

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

Đoạn trên sẽ được biên dịch thành:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
Nội dung DOM được tạo bằng `v-html` không bị ảnh hưởng bởi scoped styles, nhưng bạn vẫn có thể style chúng bằng cách sử dụng deep selectors.
:::

### Slotted Selectors {#slotted-selectors}

Theo mặc định, scoped styles không ảnh hưởng đến nội dung được render bởi `<slot/>`, vì chúng được coi là thuộc sở hữu của component cha truyền chúng vào. Để nhắm mục tiêu rõ ràng đến nội dung slot, hãy sử dụng pseudo-class `:slotted`:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### Global Selectors {#global-selectors}

Nếu bạn muốn chỉ một rule áp dụng toàn cục, bạn có thể sử dụng pseudo-class `:global` thay vì tạo một `<style>` khác (xem bên dưới):

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### Kết hợp Style Local và Global {#mixing-local-and-global-styles}

Bạn cũng có thể bao gồm cả style scoped và non-scoped trong cùng một component:

```vue
<style>
/* global styles - style toàn cục */
</style>

<style scoped>
/* local styles - style cục bộ */
</style>
```

### Mẹo về Scoped Style {#scoped-style-tips}

- **Scoped styles không loại bỏ nhu cầu sử dụng classes**. Do cách trình duyệt render các CSS selector khác nhau, `p { color: red }` sẽ chậm hơn nhiều khi scoped (tức là khi kết hợp với một attribute selector). Nếu bạn sử dụng classes hoặc ids thay thế, chẳng hạn như trong `.example { color: red }`, thì bạn gần như loại bỏ được tác động hiệu suất đó.

- **Hãy cẩn thận với descendant selectors trong các component đệ quy!** Đối với một CSS rule với selector `.a .b`, nếu phần tử khớp với `.a` chứa một component con đệ quy, thì tất cả `.b` trong component con đó sẽ được khớp bởi rule.

## CSS Modules {#css-modules}

Thẻ `<style module>` được biên dịch thành [CSS Modules](https://github.com/css-modules/css-modules) và expose các class CSS kết quả cho component dưới dạng một object với key là `$style`:

```vue
<template>
  <p :class="$style.red">Đoạn này nên màu đỏ</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

Các class kết quả được hash để tránh xung đột, đạt được cùng hiệu quả của việc scope CSS chỉ cho component hiện tại.

Tham khảo [CSS Modules spec](https://github.com/css-modules/css-modules) để biết thêm chi tiết như [global exceptions](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#exceptions) và [composition](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#composition).

### Tùy chỉnh Tên Inject {#custom-inject-name}

Bạn có thể tùy chỉnh property key của object class được inject bằng cách cung cấp một giá trị cho thuộc tính `module`:

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Sử dụng với Composition API {#usage-with-composition-api}

Các class được inject có thể được truy cập trong `setup()` và `<script setup>` thông qua API `useCssModule`. Đối với các block `<style module>` với tên inject tùy chỉnh, `useCssModule` chấp nhận giá trị thuộc tính `module` tương ứng làm đối số đầu tiên:

```js
import { useCssModule } from 'vue'

// bên trong phạm vi setup()...
// mặc định, trả về classes cho <style module>
useCssModule()

// có tên, trả về classes cho <style module="classes">
useCssModule('classes')
```

- **Ví dụ**

```vue
<script setup lang="ts">
import { useCssModule } from 'vue'

const classes = useCssModule()
</script>

<template>
  <p :class="classes.red">red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

## `v-bind()` trong CSS {#v-bind-in-css}

Thẻ `<style>` của SFC hỗ trợ liên kết các giá trị CSS với trạng thái component động bằng cách sử dụng hàm CSS `v-bind`:

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

Cú pháp này hoạt động với [`<script setup>`](./sfc-script-setup) và hỗ trợ các biểu thức JavaScript (phải được bao quanh bằng dấu ngoặc kép):

```vue
<script setup>
import { ref } from 'vue'
const theme = ref({
    color: 'red',
})
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

Giá trị thực tế sẽ được biên dịch thành một CSS custom property được hash, do đó CSS vẫn là tĩnh. Custom property sẽ được áp dụng cho phần tử gốc của component thông qua inline styles và được cập nhật phản ứng nếu giá trị nguồn thay đổi.

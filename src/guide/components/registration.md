# Đăng ký Component {#component-registration}

> Trang này giả định rằng bạn đã đọc [Kiến thức cơ bản về Component](/guide/essentials/component-basics). Hãy đọc nó trước nếu bạn mới làm quen với component.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="Free Vue.js Component Registration Lesson"/>

Một Vue component cần được "đăng ký" để Vue biết nơi tìm implementation của nó khi gặp component đó trong template. Có hai cách để đăng ký component: toàn cục và cục bộ.

## Đăng ký toàn cục {#global-registration}

Chúng ta có thể làm cho các component có sẵn toàn cục trong [ứng dụng Vue](/guide/essentials/application) hiện tại bằng phương thức `.component()`:

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // tên đã đăng ký
  'MyComponent',
  // implementation
  {
    /* ... */
  }
)
```

Nếu sử dụng SFC, bạn sẽ đăng ký các file `.vue` đã import:

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

Phương thức `.component()` có thể được xâu chuỗi:

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

Các component được đăng ký toàn cục có thể được sử dụng trong template của bất kỳ component nào trong ứng dụng này:

```vue-html
<!-- điều này sẽ hoạt động trong bất kỳ component nào bên trong app -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

Điều này thậm chí áp dụng cho tất cả các component con, nghĩa là cả ba component này cũng sẽ có sẵn _bên trong nhau_.

## Đăng ký cục bộ {#local-registration}

Mặc dù tiện lợi, đăng ký toàn cục có một số nhược điểm:

1. Đăng ký toàn cục ngăn chặn hệ thống build loại bỏ các component không sử dụng (hay còn gọi là "tree-shaking"). Nếu bạn đăng ký toàn cục một component nhưng cuối cùng không sử dụng nó ở bất kỳ đâu trong ứng dụng, nó vẫn sẽ được bao gồm trong bundle cuối cùng.

2. Đăng ký toàn cục làm cho các mối quan hệ phụ thuộc ít rõ ràng hơn trong các ứng dụng lớn. Nó làm cho việc tìm implementation của một component con từ một component cha sử dụng nó trở nên khó khăn. Điều này có thể ảnh hưởng đến khả năng bảo trì lâu dài tương tự như việc sử dụng quá nhiều biến toàn cục.

Đăng ký cục bộ giới hạn tính sẵn có của các component đã đăng ký chỉ cho component hiện tại. Nó làm cho mối quan hệ phụ thuộc rõ ràng hơn và thân thiện hơn với tree-shaking.

<div class="composition-api">

Khi sử dụng SFC với `<script setup>`, các component đã import có thể được sử dụng cục bộ mà không cần đăng ký:

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

Trong trường hợp không sử dụng `<script setup>`, bạn sẽ cần sử dụng tùy chọn `components`:

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

Đăng ký cục bộ được thực hiện bằng tùy chọn `components`:

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

Đối với mỗi thuộc tính trong đối tượng `components`, key sẽ là tên đã đăng ký của component, trong khi value sẽ chứa implementation của component. Ví dụ trên đang sử dụng cú pháp viết tắt thuộc tính ES2015 và tương đương với:

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

Lưu ý rằng **các component được đăng ký cục bộ _không_ có sẵn trong các component con**. Trong trường hợp này, `ComponentA` sẽ chỉ có sẵn cho component hiện tại, không phải bất kỳ component con hoặc cháu nào của nó.

## Viết hoa tên Component {#component-name-casing}

Trong suốt hướng dẫn này, chúng ta sử dụng tên PascalCase khi đăng ký component. Điều này là vì:

1. Tên PascalCase là các định danh JavaScript hợp lệ. Điều này giúp việc import và đăng ký component trong JavaScript dễ dàng hơn. Nó cũng giúp IDE với tính năng auto-completion.

2. `<PascalCase />` làm cho việc này rõ ràng hơn rằng đây là một Vue component thay vì một phần tử HTML gốc trong template. Nó cũng phân biệt Vue component với các custom element (web component).

Đây là phong cách được khuyến nghị khi làm việc với SFC hoặc string template. Tuy nhiên, như đã thảo luận trong [Lưu ý khi phân tích cú pháp Template trong DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats), thẻ PascalCase không thể sử dụng trong template trong DOM.

May mắn thay, Vue hỗ trợ phân giải thẻ kebab-case thành các component được đăng ký bằng PascalCase. Điều này có nghĩa là một component được đăng ký là `MyComponent` có thể được tham chiếu trong một Vue template (hoặc bên trong một phần tử HTML được render bởi Vue) thông qua cả `<MyComponent>` và `<my-component>`. Điều này cho phép chúng ta sử dụng cùng một mã đăng ký component JavaScript bất kể nguồn template.

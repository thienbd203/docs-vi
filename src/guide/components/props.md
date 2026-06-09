# Props {#props}

> Trang này giả định rằng bạn đã đọc [Kiến thức cơ bản về Component](/guide/essentials/component-basics). Hãy đọc nó trước nếu bạn mới làm quen với component.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-3-reusable-components-with-props" title="Free Vue.js Props Lesson"/>
</div>

## Khai báo Props {#props-declaration}

Vue component yêu cầu khai báo props một cách rõ ràng để Vue biết các props bên ngoài được truyền vào component nên được xử lý như thuộc tính kế thừa (fallthrough attributes) (sẽ được thảo luận trong [phần riêng biệt](/guide/components/attrs)).

<div class="composition-api">

Trong SFC sử dụng `<script setup>`, props có thể được khai báo bằng macro `defineProps()`:

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

Trong các component không sử dụng `<script setup>`, props được khai báo bằng tùy chọn [`props`](/api/options-state#props):

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() nhận props làm đối số đầu tiên.
    console.log(props.foo)
  }
}
```

Lưu ý rằng đối số được truyền vào `defineProps()` giống với giá trị được cung cấp cho tùy chọn `props`: cùng một API tùy chọn props được chia sẻ giữa hai phong cách khai báo.

</div>

<div class="options-api">

Props được khai báo bằng tùy chọn [`props`](/api/options-state#props):

```js
export default {
  props: ['foo'],
  created() {
    // props được expose trên `this`
    console.log(this.foo)
  }
}
```

</div>

Ngoài việc khai báo props bằng mảng chuỗi, chúng ta cũng có thể sử dụng cú pháp object:

<div class="options-api">

```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>
<div class="composition-api">

```js
// trong <script setup>
defineProps({
  title: String,
  likes: Number
})
```

```js
// trong non-<script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>

Đối với mỗi thuộc tính trong cú pháp khai báo object, key là tên của prop, trong khi value nên là hàm constructor của kiểu mong đợi.

Điều này không chỉ tài liệu hóa component của bạn, mà cũng sẽ cảnh báo các nhà phát triển khác sử dụng component của bạn trong console của trình duyệt nếu họ truyền sai kiểu. Chúng ta sẽ thảo luận chi tiết hơn về [xác thực prop](#prop-validation) ở phần sau của trang này.

<div class="options-api">

Xem thêm: [Typing Component Props](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

Nếu bạn đang sử dụng TypeScript với `<script setup>`, cũng có thể khai báo props bằng các chú thích kiểu thuần túy:

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

Chi tiết thêm: [Typing Component Props](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

## Destructure Props Phản Hứng <sup class="vt-badge" data-text="3.5+" /> \*\* {#reactive-props-destructure}

Hệ thống phản ứng của Vue theo dõi việc sử dụng state dựa trên truy cập thuộc tính. Ví dụ: khi bạn truy cập `props.foo` trong một computed getter hoặc watcher, prop `foo` sẽ được theo dõi như một dependency.

Vì vậy, với đoạn mã sau:

```js
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // chỉ chạy một lần trước phiên bản 3.5
  // chạy lại khi prop "foo" thay đổi trong phiên bản 3.5+
  console.log(foo)
})
```

Trong phiên bản 3.4 và thấp hơn, `foo` là một hằng số thực tế và sẽ không bao giờ thay đổi. Trong phiên bản 3.5 và cao hơn, compiler của Vue tự động thêm tiền tố `props.` khi mã trong cùng khối `<script setup>` truy cập các biến được destructure từ `defineProps`. Do đó, đoạn mã trên trở nên tương đương với:

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` được chuyển đổi thành `props.foo` bởi compiler
  console.log(props.foo)
})
```

Ngoài ra, bạn có thể sử dụng cú pháp giá trị mặc định gốc của JavaScript để khai báo giá trị mặc định cho props. Điều này đặc biệt hữu ích khi sử dụng khai báo props dựa trên kiểu:

```ts
const { foo = 'hello' } = defineProps<{ foo?: string }>()
```

Nếu bạn muốn có sự phân biệt trực quan hơn giữa props được destructure và biến bình thường trong IDE của bạn, extension VSCode của Vue cung cấp một cài đặt để bật inlay-hints cho props được destructure.

### Truyền Props Được Destructure vào Hàm {#passing-destructured-props-into-functions}

Khi chúng ta truyền một prop được destructure vào một hàm, ví dụ:

```js
const { foo } = defineProps(['foo'])

watch(foo, /* ... */)
```

Điều này sẽ không hoạt động như mong đợi vì nó tương đương với `watch(props.foo, ...)` - chúng ta đang truyền một giá trị thay vì một nguồn dữ liệu phản ứng vào `watch`. Thực tế, compiler của Vue sẽ bắt các trường hợp như vậy và ném ra một cảnh báo.

Tương tự như cách chúng ta có thể watch một prop bình thường với `watch(() => props.foo, ...)`, chúng ta cũng có thể watch một prop được destructure bằng cách bọc nó trong một getter:

```js
watch(() => foo, /* ... */)
```

Ngoài ra, đây là cách tiếp cận được khuyến nghị khi chúng ta cần truyền một prop được destructure vào một hàm bên ngoài trong khi vẫn giữ phản ứng:

```js
useComposable(() => foo)
```

Hàm bên ngoài có thể gọi getter (hoặc chuẩn hóa nó bằng [toValue](/api/reactivity-utilities.html#tovalue)) khi nó cần theo dõi các thay đổi của prop được cung cấp, ví dụ trong một computed hoặc watcher getter.

</div>

## Chi Tiết Truyền Props {#prop-passing-details}

### Viết Hoa Tên Prop {#prop-name-casing}

Chúng ta khai báo tên prop dài bằng camelCase vì điều này tránh việc phải sử dụng dấu ngoặc kép khi sử dụng chúng làm key thuộc tính, và cho phép chúng ta tham chiếu trực tiếp chúng trong biểu thức template vì chúng là định danh JavaScript hợp lệ:

<div class="composition-api">

```js
defineProps({
  greetingMessage: String
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    greetingMessage: String
  }
}
```

</div>

```vue-html
<span>{{ greetingMessage }}</span>
```

Về mặt kỹ thuật, bạn cũng có thể sử dụng camelCase khi truyền props cho một component con (trừ trong [template trong DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats)). Tuy nhiên, quy ước là sử dụng kebab-case trong mọi trường hợp để phù hợp với thuộc tính HTML:

```vue-html
<MyComponent greeting-message="hello" />
```

Chúng ta sử dụng [PascalCase cho thẻ component](/guide/components/registration#component-name-casing) khi có thể vì nó cải thiện khả năng đọc của template bằng cách phân biệt Vue component với các phần tử gốc. Tuy nhiên, không có nhiều lợi ích thực tế khi sử dụng camelCase khi truyền props, vì vậy chúng ta chọn tuân theo quy ước của từng ngôn ngữ.

### Props Tĩnh vs. Động {#static-vs-dynamic-props}

Cho đến nay, bạn đã thấy props được truyền dưới dạng giá trị tĩnh, như trong:

```vue-html
<BlogPost title="My journey with Vue" />
```

Bạn cũng đã thấy props được gán động bằng `v-bind` hoặc phím tắt `:` của nó, như trong:

```vue-html
<!-- Gán động giá trị của một biến -->
<BlogPost :title="post.title" />

<!-- Gán động giá trị của một biểu thức phức tạp -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
```

### Truyền Các Kiểu Giá Trị Khác Nhau {#passing-different-value-types}

Trong hai ví dụ trên, chúng ta tình cờ truyền giá trị chuỗi, nhưng _bất kỳ_ kiểu giá trị nào cũng có thể được truyền cho một prop.

#### Number {#number}

```vue-html
<!-- Mặc dù `42` là tĩnh, chúng ta cần v-bind để nói với Vue rằng -->
<!-- đây là một biểu thức JavaScript thay vì một chuỗi.          -->
<BlogPost :likes="42" />

<!-- Gán động cho giá trị của một biến. -->
<BlogPost :likes="post.likes" />
```

#### Boolean {#boolean}

```vue-html
<!-- Bao gồm prop không có giá trị sẽ ngụ ý `true`. -->
<BlogPost is-published />

<!-- Mặc dù `false` là tĩnh, chúng ta cần v-bind để nói với Vue rằng -->
<!-- đây là một biểu thức JavaScript thay vì một chuỗi.              -->
<BlogPost :is-published="false" />

<!-- Gán động cho giá trị của một biến. -->
<BlogPost :is-published="post.isPublished" />
```

#### Array {#array}

```vue-html
<!-- Mặc dù mảng là tĩnh, chúng ta cần v-bind để nói với Vue rằng -->
<!-- đây là một biểu thức JavaScript thay vì một chuỗi.           -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- Gán động cho giá trị của một biến. -->
<BlogPost :comment-ids="post.commentIds" />
```

#### Object {#object}

```vue-html
<!-- Mặc dù object là tĩnh, chúng ta cần v-bind để nói với Vue rằng -->
<!-- đây là một biểu thức JavaScript thay vì một chuỗi.            -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- Gán động cho giá trị của một biến. -->
<BlogPost :author="post.author" />
```

### Ràng Buộc Nhiều Thuộc Tính Sử Dụng Object {#binding-multiple-properties-using-an-object}

Nếu bạn muốn truyền tất cả các thuộc tính của một object như props, bạn có thể sử dụng [`v-bind` không có đối số](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) (`v-bind` thay vì `:prop-name`). Ví dụ, với một object `post`:

<div class="options-api">

```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'My Journey with Vue'
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```

</div>

Template sau:

```vue-html
<BlogPost v-bind="post" />
```

Sẽ tương đương với:

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## Luồng Dữ Liệu Một Chiều {#one-way-data-flow}

Tất cả props tạo thành một **ràng buộc một chiều từ trên xuống** giữa thuộc tính con và thuộc tính cha: khi thuộc tính cha cập nhật, nó sẽ chảy xuống con, nhưng không ngược lại. Điều này ngăn chặn các component con vô tình thay đổi state của cha, điều này có thể làm cho luồng dữ liệu của ứng dụng khó hiểu hơn.

Ngoài ra, mỗi khi component cha được cập nhật, tất cả props trong component con sẽ được làm mới với giá trị mới nhất. Điều này có nghĩa là bạn **không nên** cố gắng thay đổi một prop bên trong một component con. Nếu bạn làm điều đó, Vue sẽ cảnh báo bạn trong console:

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ cảnh báo, props là readonly!
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ cảnh báo, props là readonly!
    this.foo = 'bar'
  }
}
```

</div>

Thường có hai trường hợp mà việc thay đổi prop là hấp dẫn:

1. **Prop được sử dụng để truyền một giá trị ban đầu; component con muốn sử dụng nó như một thuộc tính dữ liệu cục bộ sau đó.** Trong trường hợp này, tốt nhất là định nghĩa một thuộc tính dữ liệu cục bộ sử dụng prop làm giá trị ban đầu của nó:

   <div class="composition-api">

   ```js
   const props = defineProps(['initialCounter'])

   // counter chỉ sử dụng props.initialCounter làm giá trị ban đầu;
   // nó bị ngắt kết nối từ các cập nhật prop trong tương lai.
   const counter = ref(props.initialCounter)
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // counter chỉ sử dụng this.initialCounter làm giá trị ban đầu;
         // nó bị ngắt kết nối từ các cập nhật prop trong tương lai.
         counter: this.initialCounter
       }
     }
   }
   ```

   </div>

2. **Prop được truyền dưới dạng một giá trị thô cần được chuyển đổi.** Trong trường hợp này, tốt nhất là định nghĩa một thuộc tính computed sử dụng giá trị của prop:

   <div class="composition-api">

   ```js
   const props = defineProps(['size'])

   // computed property tự động cập nhật khi prop thay đổi
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['size'],
     computed: {
       // computed property tự động cập nhật khi prop thay đổi
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   </div>

### Thay Đổi Object / Array Props {#mutating-object-array-props}

Khi objects và arrays được truyền như props, trong khi component con không thể thay đổi ràng buộc prop, nó **sẽ** có thể thay đổi các thuộc tính lồng nhau của object hoặc array. Điều này là vì trong JavaScript objects và arrays được truyền theo tham chiếu, và việc ngăn chặn các thay đổi như vậy là quá tốn kém cho Vue.

Nhược điểm chính của các thay đổi như vậy là nó cho phép component con ảnh hưởng đến state cha theo một cách không rõ ràng với component cha, có thể làm cho việc lý luận về luồng dữ liệu trong tương lai khó khăn hơn. Là một thực hành tốt nhất, bạn nên tránh các thay đổi như vậy trừ khi cha và con được kết nối chặt chẽ theo thiết kế. Trong hầu hết các trường hợp, con nên [emit một sự kiện](/guide/components/events) để cho cha thực hiện thay đổi.

## Xác Thực Prop {#prop-validation}

Components có thể chỉ định các yêu cầu cho props của chúng, như các kiểu bạn đã thấy. Nếu một yêu cầu không được đáp ứng, Vue sẽ cảnh báo bạn trong console JavaScript của trình duyệt. Điều này đặc biệt hữu ích khi phát triển một component dự định được sử dụng bởi người khác.

Để chỉ định xác thực prop, bạn có thể cung cấp một object với các yêu cầu xác thực cho <span class="composition-api">macro `defineProps()`</span><span class="options-api">tùy chọn `props`</span>, thay vì một mảng chuỗi. Ví dụ:

<div class="composition-api">

```js
defineProps({
  // Kiểm tra kiểu cơ bản
  //  (giá trị `null` và `undefined` sẽ cho phép mọi kiểu)
  propA: Number,
  // Nhiều kiểu có thể
  propB: [String, Number],
  // Chuỗi bắt buộc
  propC: {
    type: String,
    required: true
  },
  // Chuỗi bắt buộc nhưng có thể null
  propD: {
    type: [String, null],
    required: true
  },
  // Số với giá trị mặc định
  propE: {
    type: Number,
    default: 100
  },
  // Object với giá trị mặc định
  propF: {
    type: Object,
    // Giá trị mặc định của object hoặc array phải được trả về từ
    // một hàm factory. Hàm nhận các props thô
    // mà component nhận được làm đối số.
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // Hàm xác thực tùy chỉnh
  // full props được truyền làm đối số thứ 2 từ 3.4+
  propG: {
    validator(value, props) {
      // Giá trị phải khớp với một trong các chuỗi này
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // Hàm với giá trị mặc định
  propH: {
    type: Function,
    // Khác với object hoặc array mặc định, đây không phải là hàm factory
    // - đây là một hàm để làm giá trị mặc định
    default() {
      return 'Default function'
    }
  }
})
```

:::tip
Code bên trong đối số của `defineProps()` **không thể truy cập các biến khác được khai báo trong `<script setup>`**, vì toàn bộ biểu thức được chuyển sang phạm vi hàm bên ngoài khi biên dịch.
:::

</div>
<div class="options-api">

```js
export default {
  props: {
    // Kiểm tra kiểu cơ bản
    //  (giá trị `null` và `undefined` sẽ cho phép mọi kiểu)
    propA: Number,
    // Nhiều kiểu có thể
    propB: [String, Number],
    // Chuỗi bắt buộc
    propC: {
      type: String,
      required: true
    },
    // Chuỗi bắt buộc nhưng có thể null
    propD: {
      type: [String, null],
      required: true
    },
    // Số với giá trị mặc định
    propE: {
      type: Number,
      default: 100
    },
    // Object với giá trị mặc định
    propF: {
      type: Object,
      // Giá trị mặc định của object hoặc array phải được trả về từ
      // một hàm factory. Hàm nhận các props thô
      // mà component nhận được làm đối số.
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // Hàm xác thực tùy chỉnh
    // full props được truyền làm đối số thứ 2 từ 3.4+
    propG: {
      validator(value, props) {
        // Giá trị phải khớp với một trong các chuỗi này
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // Hàm với giá trị mặc định
    propH: {
      type: Function,
      // Khác với object hoặc array mặc định, đây không phải là hàm factory
      // - đây là một hàm để làm giá trị mặc định
      default() {
        return 'Default function'
      }
    }
  }
}
```

</div>

Chi tiết bổ sung:

- Tất cả props đều là tùy chọn theo mặc định, trừ khi `required: true` được chỉ định.

- Một prop tùy chọn bị thiếu khác `Boolean` sẽ có giá trị `undefined`.

- Các prop `Boolean` bị thiếu sẽ được ép kiểu thành `false`. Bạn có thể thay đổi điều này bằng cách đặt `default` cho nó — ví dụ: `default: undefined` để hoạt động như một prop không phải Boolean.

- Nếu một giá trị `default` được chỉ định, nó sẽ được sử dụng nếu giá trị prop được giải quyết là `undefined` — điều này bao gồm cả khi prop bị thiếu, hoặc một giá trị `undefined` rõ ràng được truyền.

Khi xác thực prop thất bại, Vue sẽ tạo ra một cảnh báo trong console (nếu sử dụng bản phát triển).

<div class="composition-api">

Nếu sử dụng [Khai báo props dựa trên kiểu](/api/sfc-script-setup#type-only-props-emit-declarations) <sup class="vt-badge ts" />, Vue sẽ cố gắng hết sức để biên dịch các chú thích kiểu thành các khai báo prop runtime tương đương. Ví dụ, `defineProps<{ msg: string }>` sẽ được biên dịch thành `{ msg: { type: String, required: true }}`.

</div>
<div class="options-api">

::: tip Lưu ý
Lưu ý rằng props được xác thực **trước** khi một instance component được tạo, vì vậy các thuộc tính instance (ví dụ: `data`, `computed`, v.v.) sẽ không có sẵn bên trong các hàm `default` hoặc `validator`.
:::

</div>

### Kiểm tra Kiểu Runtime {#runtime-type-checks}

`type` có thể là một trong các constructor native sau:

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`
- `Error`

Ngoài ra, `type` cũng có thể là một class tùy chỉnh hoặc hàm constructor và việc xác nhận sẽ được thực hiện với một kiểm tra `instanceof`. Ví dụ, với class sau:

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

Bạn có thể sử dụng nó làm kiểu của một prop:

<div class="composition-api">

```js
defineProps({
  author: Person
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    author: Person
  }
}
```

</div>

Vue sẽ sử dụng `instanceof Person` để xác thực xem giá trị của prop `author` có thực sự là một instance của class `Person` hay không.

### Kiểu Có Thể Null {#nullable-type}

Nếu kiểu là bắt buộc nhưng có thể null, bạn có thể sử dụng cú pháp mảng bao gồm `null`:

<div class="composition-api">

```js
defineProps({
  id: {
    type: [String, null],
    required: true
  }
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    id: {
      type: [String, null],
      required: true
    }
  }
}
```

</div>

Lưu ý rằng nếu `type` chỉ là `null` mà không sử dụng cú pháp mảng, nó sẽ cho phép bất kỳ kiểu nào.

## Boolean Casting {#boolean-casting}

Props có kiểu `Boolean` có các quy tắc casting đặc biệt để mô phỏng hành vi của các thuộc tính boolean gốc. Với một `<MyComponent>` có khai báo sau:

<div class="composition-api">

```js
defineProps({
  disabled: Boolean
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: Boolean
  }
}
```

</div>

Component có thể được sử dụng như sau:

```vue-html
<!-- tương đương với việc truyền :disabled="true" -->
<MyComponent disabled />

<!-- tương đương với việc truyền :disabled="false" -->
<MyComponent />
```

Khi một prop được khai báo để cho phép nhiều kiểu, các quy tắc casting cho `Boolean` cũng sẽ được áp dụng. Tuy nhiên, có một trường hợp đặc biệt khi cả `String` và `Boolean` đều được cho phép - quy tắc casting Boolean chỉ được áp dụng nếu Boolean xuất hiện trước String:

<div class="composition-api">

```js
// disabled sẽ được cast thành true
defineProps({
  disabled: [Boolean, Number]
})

// disabled sẽ được cast thành true
defineProps({
  disabled: [Boolean, String]
})

// disabled sẽ được cast thành true
defineProps({
  disabled: [Number, Boolean]
})

// disabled sẽ được parse thành một chuỗi rỗng (disabled="")
defineProps({
  disabled: [String, Boolean]
})
```

</div>
<div class="options-api">

```js
// disabled sẽ được cast thành true
export default {
  props: {
    disabled: [Boolean, Number]
  }
}

// disabled sẽ được cast thành true
export default {
  props: {
    disabled: [Boolean, String]
  }
}

// disabled sẽ được cast thành true
export default {
  props: {
    disabled: [Number, Boolean]
  }
}

// disabled sẽ được parse thành một chuỗi rỗng (disabled="")
export default {
  props: {
    disabled: [String, Boolean]
  }
}
```

</div>

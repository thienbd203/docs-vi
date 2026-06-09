# List Rendering {#list-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="Free Vue.js List Rendering Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="Free Vue.js List Rendering Lesson"/>
</div>

## `v-for` {#v-for}

Chúng ta có thể sử dụng directive `v-for` để render một danh sách các mục dựa trên một mảng. Directive `v-for` yêu cầu một cú pháp đặc biệt dưới dạng `item in items`, trong đó `items` là mảng dữ liệu nguồn và `item` là một **alias** cho phần tử mảng đang được lặp qua:

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

Bên trong scope của `v-for`, các biểu thức template có thể truy cập tất cả các thuộc tính của scope cha. Ngoài ra, `v-for` cũng hỗ trợ một alias thứ hai tùy chọn cho chỉ số của mục hiện tại:

<div class="composition-api">

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJdAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

</div>

Phạm vi biến của `v-for` tương tự như JavaScript sau:

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // có quyền truy cập scope bên ngoài `parentMessage`
  // nhưng `item` và `index` chỉ có sẵn ở đây
  console.log(parentMessage, item.message, index)
})
```

Hãy chú ý cách giá trị `v-for` khớp với chữ ký hàm của callback `forEach`. Thực tế, bạn có thể sử dụng destructuring trên alias mục `v-for` tương tự như destructuring các đối số hàm:

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- với index alias -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

Đối với `v-for` lồng nhau, phạm vi cũng hoạt động tương tự như các hàm lồng nhau. Mỗi scope `v-for` có quyền truy cập các scope cha:

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

Bạn cũng có thể sử dụng `of` làm dấu phân tách thay vì `in`, để nó gần hơn với cú pháp của JavaScript cho các iterator:

```vue-html
<div v-for="item of items"></div>
```

## `v-for` với một Object {#v-for-with-an-object}

Bạn cũng có thể sử dụng `v-for` để lặp qua các thuộc tính của một object. Thứ tự lặp sẽ dựa trên kết quả của việc gọi `Object.values()` trên object đó:

<div class="composition-api">

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

Bạn cũng có thể cung cấp một alias thứ hai cho tên thuộc tính (hay còn gọi là key):

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

Và một alias khác cho chỉ số:

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33917Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxUka++E+itcoQX/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)

</div>

## `v-for` với một Range {#v-for-with-a-range}

`v-for` cũng có thể nhận một số nguyên. Trong trường hợp này, nó sẽ lặp lại template nhiều lần như vậy, dựa trên một phạm vi `1...n`.

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

Lưu ý ở đây `n` bắt đầu với giá trị ban đầu là `1` thay vì `0`.

## `v-for` trên `<template>` {#v-for-on-template}

Tương tự như template `v-if`, bạn cũng có thể sử dụng thẻ `<template>` với `v-for` để render một khối nhiều phần tử. Ví dụ:

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` với `v-if` {#v-for-with-v-if}

Khi chúng tồn tại trên cùng một node, `v-if` có độ ưu tiên cao hơn `v-for`. Điều này có nghĩa là điều kiện `v-if` sẽ không có quyền truy cập các biến từ scope của `v-for`:

```vue-html
<!--
Điều này sẽ gây ra lỗi vì thuộc tính "todo"
không được định nghĩa trên instance.
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

Vấn đề này có thể được khắc phục bằng cách di chuyển `v-for` vào một thẻ `<template>` bao quanh (cũng rõ ràng hơn):

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

:::warning Lưu ý
Không **khuyến nghị** sử dụng `v-if` và `v-for` trên cùng một phần tử do độ ưu tiên ngầm định.

Có hai trường hợp phổ biến mà điều này có thể hấp dẫn:

- Để lọc các mục trong danh sách (ví dụ: `v-for="user in users" v-if="user.isActive"`). Trong những trường hợp này, hãy thay thế `users` bằng một computed property mới trả về danh sách đã lọc của bạn (ví dụ: `activeUsers`).

- Để tránh render một danh sách nếu nó nên được ẩn (ví dụ: `v-for="user in users" v-if="shouldShowUsers"`). Trong những trường hợp này, hãy di chuyển `v-if` vào một phần tử container (ví dụ: `ul`, `ol`).
:::

## Duy trì State với `key` {#maintaining-state-with-key}

Khi Vue đang cập nhật danh sách các phần tử được render với `v-for`, theo mặc định nó sử dụng chiến lược "in-place patch". Nếu thứ tự của các mục dữ liệu đã thay đổi, thay vì di chuyển các phần tử DOM để khớp với thứ tự của các mục, Vue sẽ patch từng phần tử tại chỗ và đảm bảo nó phản ánh những gì nên được render tại chỉ số cụ thể đó.

Chế độ mặc định này hiệu quả, nhưng **chỉ phù hợp khi đầu ra render danh sách của bạn không phụ thuộc vào state của component con hoặc state DOM tạm thời (ví dụ: giá trị input form)**.

Để cung cấp cho Vue một gợi ý để nó có thể theo dõi danh tính của từng node, và do đó tái sử dụng và sắp xếp lại các phần tử hiện có, bạn cần cung cấp một thuộc tính `key` duy nhất cho mỗi mục:

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

Khi sử dụng `<template v-for>`, `key` nên được đặt trên container `<template>`:

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip Lưu ý
`key` ở đây là một thuộc tính đặc biệt được bind với `v-bind`. Nó không nên bị nhầm lẫn với biến key thuộc tính khi [sử dụng `v-for` với một object](#v-for-with-an-object).
:::

Khuyến nghị cung cấp một thuộc tính `key` với `v-for` bất cứ khi nào có thể, trừ khi nội dung DOM được lặp qua đơn giản (tức là không chứa component hoặc phần tử DOM có state), hoặc bạn đang cố ý dựa vào hành vi mặc định để tăng hiệu suất.

Binding `key` mong đợi các giá trị nguyên thủy - tức là chuỗi và số. Không sử dụng object làm key cho `v-for`. Để biết chi tiết về cách sử dụng thuộc tính `key`, vui lòng xem [tài liệu API `key`](/api/built-in-special-attributes#key).

## `v-for` với một Component {#v-for-with-a-component}

> Phần này giả định kiến thức về [Components](/guide/essentials/component-basics). Hãy thoải mái bỏ qua và quay lại sau.

Bạn có thể sử dụng trực tiếp `v-for` trên một component, giống như bất kỳ phần tử bình thường nào (đừng quên cung cấp một `key`):

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

Tuy nhiên, điều này sẽ không tự động truyền bất kỳ dữ liệu nào vào component, vì các component có scope riêng biệt của chúng. Để truyền dữ liệu được lặp vào component, chúng ta cũng nên sử dụng props:

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

Lý do không tự động inject `item` vào component là vì điều đó làm cho component bị phụ thuộc chặt chẽ vào cách `v-for` hoạt động. Rõ ràng về nơi dữ liệu của nó đến làm cho component có thể tái sử dụng trong các tình huống khác.

<div class="composition-api">

Xem [ví dụ về danh sách todo đơn giản này](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=) để xem cách render danh sách các component bằng `v-for`, truyền dữ liệu khác nhau cho mỗi instance.

</div>
<div class="options-api">

Xem [ví dụ về danh sách todo đơn giản này](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=) để xem cách render danh sách các component bằng `v-for`, truyền dữ liệu khác nhau cho mỗi instance.

</div>

## Phát hiện Thay đổi Mảng {#array-change-detection}

### Các Phương thức Mutation {#mutation-methods}

Vue có thể phát hiện khi các phương thức mutation của một mảng reactive được gọi và kích hoạt các cập nhật cần thiết. Các phương thức mutation này là:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### Thay thế một Mảng {#replacing-an-array}

Các phương thức mutation, như tên gợi ý, thay đổi mảng gốc mà chúng được gọi. So sánh với đó, cũng có các phương thức non-mutating, ví dụ `filter()`, `concat()` và `slice()`, không thay đổi mảng gốc nhưng **luôn trả về một mảng mới**. Khi làm việc với các phương thức non-mutating, chúng ta nên thay thế mảng cũ bằng mảng mới:

<div class="composition-api">

```js
// `items` is a ref with array value
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

Bạn có thể nghĩ điều này sẽ khiến Vue vứt bỏ DOM hiện có và render lại toàn bộ danh sách - may mắn là không phải vậy. Vue triển khai một số heuristic thông minh để tối đa hóa việc tái sử dụng phần tử DOM, vì vậy thay thế một mảng bằng một mảng khác chứa các object trùng lặp là một hoạt động rất hiệu quả.

## Hiển thị Kết quả Được Lọc/Sắp xếp {#displaying-filtered-sorted-results}

Đôi khi chúng ta muốn hiển thị phiên bản được lọc hoặc sắp xếp của một mảng mà không thực sự thay đổi hoặc đặt lại dữ liệu gốc. Trong trường hợp này, bạn có thể tạo một computed property trả về mảng đã lọc hoặc sắp xếp.

Ví dụ:

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

Trong các tình huống mà computed properties không khả thi (ví dụ: bên trong các vòng lặp `v-for` lồng nhau), bạn có thể sử dụng một phương thức:

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

Be careful with `reverse()` and `sort()` in a computed property! These two methods will mutate the original array, which should be avoided in computed getters. Create a copy of the original array before calling these methods:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```

# Quy tắc Ưu tiên A: Cốt lõi {#priority-a-rules-essential}

::: warning Lưu ý
Vue.js Style Guide này đã lỗi thời và cần được xem xét lại. Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng [mở một issue](https://github.com/vuejs/docs/issues/new).
:::

Các quy tắc này giúp ngăn chặn lỗi, vì vậy hãy học và tuân thủ chúng bằng mọi giá. Có thể có ngoại lệ, nhưng nên rất hiếm và chỉ được thực hiện bởi những người có kiến thức chuyên sâu về cả JavaScript và Vue.

## Sử dụng tên component nhiều từ {#use-multi-word-component-names}

Tên component người dùng phải luôn là nhiều từ, ngoại trừ component `App` gốc. Điều này [ngăn chặn xung đột](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) với các phần tử HTML hiện tại và tương lai, vì tất cả các phần tử HTML đều là một từ.

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html
<!-- trong các template được biên dịch trước -->
<Item />

<!-- trong các template trong DOM -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<!-- trong các template được biên dịch trước -->
<TodoItem />

<!-- trong các template trong DOM -->
<todo-item></todo-item>
```

</div>

## Sử dụng định nghĩa prop chi tiết {#use-detailed-prop-definitions}

Trong code đã commit, định nghĩa prop phải luôn chi tiết nhất có thể, chỉ định ít nhất là kiểu (type).

::: details Giải thích chi tiết
Các [định nghĩa prop chi tiết](/guide/components/props#prop-validation) có hai ưu điểm:

- Chúng tài liệu hóa API của component, giúp dễ dàng xem cách component được sử dụng.
- Trong quá trình phát triển, Vue sẽ cảnh báo nếu component được cung cấp prop không đúng định dạng, giúp bạn phát hiện các nguồn lỗi tiềm ẩn.
  :::

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Kém</h3>

```js
// Điều này chỉ OK khi tạo mẫu
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```js
props: {
  status: String
}
```

```js
// Tốt hơn nữa!
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Kém</h3>

```js
// Điều này chỉ OK khi tạo mẫu
const props = defineProps(['status'])
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```js
const props = defineProps({
  status: String
})
```

```js
// Tốt hơn nữa!

const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```

</div>

</div>

## Sử dụng `v-for` có key {#use-keyed-v-for}

`key` với `v-for` _luôn luôn_ được yêu cầu trên các component, để duy trì trạng thái nội bộ của component xuống cây con. Ngay cả với các phần tử, đây là một thực hành tốt để duy trì hành vi có thể dự đoán được, chẳng hạn như [tính hằng định của đối tượng](https://bost.ocks.org/mike/constancy/) trong các hoạt ảnh.

::: details Giải thích chi tiết
Giả sử bạn có một danh sách todos:

<div class="options-api">

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Learn to use v-for'
      },
      {
        id: 2,
        text: 'Learn to use key'
      }
    ]
  }
}
```

</div>

<div class="composition-api">

```js
const todos = ref([
  {
    id: 1,
    text: 'Learn to use v-for'
  },
  {
    id: 2,
    text: 'Learn to use key'
  }
])
```

</div>

Sau đó bạn sắp xếp chúng theo thứ tự bảng chữ cái. Khi cập nhật DOM, Vue sẽ tối ưu hóa việc render để thực hiện các thay đổi DOM rẻ nhất có thể. Điều đó có thể có nghĩa là xóa phần tử todo đầu tiên, sau đó thêm nó lại vào cuối danh sách.

Vấn đề là, có những trường hợp quan trọng không được xóa các phần tử sẽ vẫn còn trong DOM. Ví dụ, bạn có thể muốn sử dụng `<transition-group>` để tạo hoạt ảnh cho việc sắp xếp danh sách, hoặc duy trì focus nếu phần tử được render là một `<input>`. Trong những trường hợp này, thêm một key duy nhất cho mỗi mục (ví dụ `:key="todo.id"`) sẽ cho Vue biết cách hoạt động có thể dự đoán hơn.

Theo kinh nghiệm của chúng tôi, tốt hơn là _luôn luôn_ thêm một key duy nhất, để bạn và đội của bạn không bao giờ phải lo lắng về các trường hợp ngoại lệ này. Sau đó, trong các tình huống hiếm hoi, quan trọng về hiệu suất mà tính hằng định của đối tượng không cần thiết, bạn có thể tạo ra một ngoại lệ có ý thức.
:::

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

</div>

## Tránh `v-if` với `v-for` {#avoid-v-if-with-v-for}

**Không bao giờ sử dụng `v-if` trên cùng một phần tử với `v-for`.**

Có hai trường hợp phổ biến nơi điều này có thể hấp dẫn:

- Để lọc các mục trong danh sách (ví dụ `v-for="user in users" v-if="user.isActive"`). Trong những trường hợp này, thay thế `users` bằng một computed property mới trả về danh sách đã lọc của bạn (ví dụ `activeUsers`).

- Để tránh render một danh sách nếu nó nên được ẩn (ví dụ `v-for="user in users" v-if="shouldShowUsers"`). Trong những trường hợp này, di chuyển `v-if` đến một phần tử container (ví dụ `ul`, `ol`).

::: details Giải thích chi tiết
Khi Vue xử lý các directive, `v-if` có ưu tiên cao hơn `v-for`, vì vậy template này:

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Sẽ ném ra lỗi, vì directive `v-if` sẽ được đánh giá trước và biến lặp `user` không tồn tại tại thời điểm này.

Điều này có thể được khắc phục bằng cách lặp qua một computed property thay thế, như sau:

<div class="options-api">

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

</div>

<div class="composition-api">

```js
const activeUsers = computed(() => {
  return users.filter((user) => user.isActive)
})
```

</div>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Ngoài ra, chúng ta có thể sử dụng thẻ `<template>` với `v-for` để bao bọc phần tử `<li>`:

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

</div>

## Sử dụng styling có phạm vi component {#use-component-scoped-styling}

Đối với các ứng dụng, styles trong component `App` cấp cao nhất và trong các component layout có thể là toàn cục, nhưng tất cả các component khác phải luôn có phạm vi.

Điều này chỉ liên quan đến [Single-File Components](/guide/scaling-up/sfc). Nó _không_ yêu cầu sử dụng [thuộc tính `scoped`](https://vue-loader.vuejs.org/guide/scoped-css.html). Phạm vi có thể thông qua [CSS modules](https://vue-loader.vuejs.org/guide/css-modules.html), chiến lược dựa trên class như [BEM](http://getbem.com/), hoặc thư viện/quy ước khác.

**Tuy nhiên, các thư viện component nên ưu tiên chiến lược dựa trên class thay vì sử dụng thuộc tính `scoped`.**

Điều này giúp việc ghi đè các style nội bộ dễ dàng hơn, với tên class có thể đọc được bởi con người không có độ ưu tiên quá cao, nhưng vẫn rất khó gây ra xung đột.

::: details Giải thích chi tiết
Nếu bạn đang phát triển một dự án lớn, làm việc với các nhà phát triển khác, hoặc đôi khi bao gồm HTML/CSS của bên thứ ba (ví dụ từ Auth0), phạm vi nhất quán sẽ đảm bảo rằng styles của bạn chỉ áp dụng cho các component mà chúng được dành cho.

Ngoài thuộc tính `scoped`, việc sử dụng tên class duy nhất có thể giúp đảm bảo rằng CSS của bên thứ ba không áp dụng cho HTML của bạn. Ví dụ, nhiều dự án sử dụng tên class `button`, `btn`, hoặc `icon`, vì vậy ngay cả khi không sử dụng chiến lược như BEM, thêm tiền tố cụ thể cho ứng dụng và/hoặc component (ví dụ `ButtonClose-icon`) có thể cung cấp một số bảo vệ.
:::

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- Sử dụng thuộc tính `scoped` -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- Sử dụng CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- Sử dụng quy ước BEM -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```

</div>

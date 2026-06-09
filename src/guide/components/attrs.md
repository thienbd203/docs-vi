---
outline: deep
---

# Thuộc Tính Kế Thừa (Fallthrough Attributes) {#fallthrough-attributes}

> Trang này giả định rằng bạn đã đọc [Kiến thức cơ bản về Component](/guide/essentials/component-basics). Hãy đọc nó trước nếu bạn mới làm quen với component.

## Kế Thừa Thuộc Tính {#attribute-inheritance}

Một "thuộc tính kế thừa" (fallthrough attribute) là một thuộc tính hoặc event listener `v-on` được truyền đến một component, nhưng không được khai báo rõ ràng trong [props](./props) hoặc [emits](./events#declaring-emitted-events) của component nhận. Các ví dụ phổ biến bao gồm các thuộc tính `class`, `style`, và `id`.

Khi một component render một phần tử gốc đơn lẻ, các thuộc tính kế thừa sẽ được tự động thêm vào các thuộc tính của phần tử gốc. Ví dụ, với một component `<MyButton>` có template sau:

```vue-html
<!-- template của <MyButton> -->
<button>Click Me</button>
```

Và một component cha sử dụng component này với:

```vue-html
<MyButton class="large" />
```

DOM cuối cùng được render sẽ là:

```html
<button class="large">Click Me</button>
```

Ở đây, `<MyButton>` không khai báo `class` như một prop được chấp nhận. Do đó, `class` được xử lý như một thuộc tính kế thừa và tự động thêm vào phần tử gốc của `<MyButton>`.

### Gộp `class` và `style` {#class-and-style-merging}

Nếu phần tử gốc của component con đã có các thuộc tính `class` hoặc `style` hiện có, nó sẽ được gộp với các giá trị `class` và `style` được kế thừa từ component cha. Giả sử chúng ta thay đổi template của `<MyButton>` trong ví dụ trước thành:

```vue-html
<!-- template của <MyButton> -->
<button class="btn">Click Me</button>
```

Sau đó DOM cuối cùng được render sẽ trở thành:

```html
<button class="btn large">Click Me</button>
```

### Kế Thừa Listener `v-on` {#v-on-listener-inheritance}

Quy tắc tương tự áp dụng cho event listener `v-on`:

```vue-html
<MyButton @click="onClick" />
```

Listener `click` sẽ được thêm vào phần tử gốc của `<MyButton>`, tức là phần tử `<button>` gốc. Khi phần tử `<button>` gốc được click, nó sẽ kích hoạt phương thức `onClick` của component cha. Nếu phần tử `<button>` gốc đã có một listener `click` được ràng buộc với `v-on`, thì cả hai listener sẽ được kích hoạt.

### Kế Thừa Component Lồng Nhau {#nested-component-inheritance}

Nếu một component render một component khác làm nút gốc của nó, ví dụ, chúng ta refactor `<MyButton>` để render một `<BaseButton>` làm gốc của nó:

```vue-html
<!-- template của <MyButton/> chỉ đơn giản render một component khác -->
<BaseButton />
```

Sau đó các thuộc tính kế thừa nhận được bởi `<MyButton>` sẽ được tự động chuyển tiếp đến `<BaseButton>`.

Lưu ý rằng:

1. Các thuộc tính được chuyển tiếp không bao gồm bất kỳ thuộc tính nào được khai báo như props, hoặc listener `v-on` của các sự kiện được khai báo bởi `<MyButton>` - nói cách khác, các props và listener được khai báo đã được "tiêu thụ" bởi `<MyButton>`.

2. Các thuộc tính được chuyển tiếp có thể được chấp nhận như props bởi `<BaseButton>`, nếu được khai báo bởi nó.

## Vô Hiệu Hóa Kế Thừa Thuộc Tính {#disabling-attribute-inheritance}

Nếu bạn **không** muốn một component tự động kế thừa thuộc tính, bạn có thể đặt `inheritAttrs: false` trong các tùy chọn của component.

<div class="composition-api">

 Kể từ phiên bản 3.3, bạn cũng có thể sử dụng [`defineOptions`](/api/sfc-script-setup#defineoptions) trực tiếp trong `<script setup>`:

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...logic setup
</script>
```

</div>

Kịch bản phổ biến để vô hiệu hóa kế thừa thuộc tính là khi các thuộc tính cần được áp dụng cho các phần tử khác ngoài nút gốc. Bằng cách đặt tùy chọn `inheritAttrs` thành `false`, bạn có thể kiểm soát hoàn toàn nơi các thuộc tính kế thừa nên được áp dụng.

Các thuộc tính kế thừa này có thể được truy cập trực tiếp trong các biểu thức template như `$attrs`:

```vue-html
<span>Thuộc tính kế thừa: {{ $attrs }}</span>
```

Object `$attrs` bao gồm tất cả các thuộc tính không được khai báo bởi các tùy chọn `props` hoặc `emits` của component (ví dụ: `class`, `style`, listener `v-on`, v.v.).

Một số lưu ý:

- Khác với props, các thuộc tính kế thừa giữ nguyên viết hoa gốc của chúng trong JavaScript, vì vậy một thuộc tính như `foo-bar` cần được truy cập như `$attrs['foo-bar']`.

- Một event listener `v-on` như `@click` sẽ được expose trên object như một hàm dưới `$attrs.onClick`.

Sử dụng ví dụ component `<MyButton>` của chúng ta từ [phần trước](#attribute-inheritance) - đôi khi chúng ta có thể cần bọc phần tử `<button>` thực tế với một `<div>` thêm vào cho mục đích styling:

```vue-html
<div class="btn-wrapper">
  <button class="btn">Click Me</button>
</div>
```

Chúng ta muốn tất cả các thuộc tính kế thừa như `class` và listener `v-on` được áp dụng cho `<button>` bên trong, không phải `<div>` bên ngoài. Chúng ta có thể đạt được điều này với `inheritAttrs: false` và `v-bind="$attrs"`:

```vue-html{2}
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>
```

Hãy nhớ rằng [`v-bind` không có đối số](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) ràng buộc tất cả các thuộc tính của một object như các thuộc tính của phần tử đích.

## Kế Thừa Thuộc Tính Trên Nhiều Nút Gốc {#attribute-inheritance-on-multiple-root-nodes}

Khác với các component có một nút gốc đơn lẻ, các component có nhiều nút gốc không có hành vi kế thừa thuộc tính tự động. Nếu `$attrs` không được ràng buộc rõ ràng, một cảnh báo runtime sẽ được phát ra.

```vue-html
<CustomLayout id="custom-layout" @click="changeValue" />
```

Nếu `<CustomLayout>` có template multi-root sau, sẽ có một cảnh báo vì Vue không thể chắc chắn nơi áp dụng các thuộc tính kế thừa:

```vue-html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

Cảnh báo sẽ bị chặn nếu `$attrs` được ràng buộc rõ ràng:

```vue-html{2}
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## Truy Cập Thuộc Tính Kế Thừa Trong JavaScript {#accessing-fallthrough-attributes-in-javascript}

<div class="composition-api">

Nếu cần, bạn có thể truy cập các thuộc tính kế thừa của một component trong `<script setup>` sử dụng API `useAttrs()`:

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

Nếu không sử dụng `<script setup>`, `attrs` sẽ được expose như một thuộc tính của context `setup()`:

```js
export default {
  setup(props, ctx) {
    // các thuộc tính kế thừa được expose như ctx.attrs
    console.log(ctx.attrs)
  }
}
```

Lưu ý rằng mặc dù object `attrs` ở đây luôn phản ánh các thuộc tính kế thừa mới nhất, nó không phản ứng (vì lý do hiệu suất). Bạn không thể sử dụng watchers để quan sát các thay đổi của nó. Nếu bạn cần phản ứng, hãy sử dụng prop. Ngoài ra, bạn có thể sử dụng `onUpdated()` để thực hiện các tác dụng phụ với `attrs` mới nhất trên mỗi cập nhật.

</div>

<div class="options-api">

Nếu cần, bạn có thể truy cập các thuộc tính kế thừa của một component thông qua thuộc tính instance `$attrs`:

```js
export default {
  created() {
    console.log(this.$attrs)
  }
}
```

</div>

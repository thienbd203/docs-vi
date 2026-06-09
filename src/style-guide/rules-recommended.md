# Quy tắc Ưu tiên C: Khuyến nghị {#priority-c-rules-recommended}

::: warning Lưu ý
Vue.js Style Guide này đã lỗi thời và cần được xem xét lại. Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng [mở một issue](https://github.com/vuejs/docs/issues/new).
:::

Khi có nhiều lựa chọn tốt tương đương nhau, một lựa chọn tùy ý có thể được đưa ra để đảm bảo tính nhất quán. Trong các quy tắc này, chúng tôi mô tả từng lựa chọn chấp nhận được và đề xuất một lựa chọn mặc định. Điều đó có nghĩa là bạn có thể tự do đưa ra một lựa chọn khác trong codebase của mình, miễn là bạn nhất quán và có lý do chính đáng. Tuy nhiên, hãy đảm bảo bạn có một lý do chính đáng! Bằng cách thích nghi với tiêu chuẩn cộng đồng, bạn sẽ:

1. Đào tạo bộ não của mình để dễ dàng phân tích hầu hết mã nguồn cộng đồng mà bạn gặp phải
2. Có thể sao chép và dán hầu hết các ví dụ mã nguồn cộng đồng mà không cần chỉnh sửa
3. Thường thấy rằng nhân viên mới đã quen với phong cách viết mã ưa thích của bạn, ít nhất là về mặt Vue

## Thứ tự các tùy chọn component/instance {#component-instance-options-order}

**Các tùy chọn component/instance nên được sắp xếp một cách nhất quán.**

Đây là thứ tự mặc định mà chúng tôi khuyến nghị cho các tùy chọn component. Chúng được chia thành các danh mục, vì vậy bạn sẽ biết nơi thêm các thuộc tính mới từ các plugin.

1. **Nhận thức Toàn cục** (yêu cầu kiến thức ngoài component)

   - `name`

2. **Tùy chọn Trình biên dịch Template** (thay đổi cách các template được biên dịch)

   - `compilerOptions`

3. **Phụ thuộc Template** (tài sản được sử dụng trong template)

   - `components`
   - `directives`

4. **Kết hợp** (gộp các thuộc tính vào các tùy chọn)

   - `extends`
   - `mixins`
   - `provide`/`inject`

5. **Giao diện** (giao diện đến component)

   - `inheritAttrs`
   - `props`
   - `emits`

6. **Composition API** (điểm nhập để sử dụng Composition API)

   - `setup`

7. **Trạng thái Cục bộ** (các thuộc tính phản hồi cục bộ)

   - `data`
   - `computed`

8. **Sự kiện** (các callback được kích hoạt bởi các sự kiện phản hồi)

   - `watch`
   - Sự kiện Vòng đời (theo thứ tự chúng được gọi)
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeUnmount`
     - `unmounted`
     - `errorCaptured`
     - `renderTracked`
     - `renderTriggered`

9. **Thuộc tính Không Phản hồi** (các thuộc tính instance độc lập với hệ thống phản hồi)

   - `methods`

10. **Kết xuất** (mô tả khai báo của đầu ra component)
    - `template`/`render`

## Thứ tự thuộc tính element {#element-attribute-order}

**Các thuộc tính của các element (bao gồm cả component) nên được sắp xếp một cách nhất quán.**

Đây là thứ tự mặc định mà chúng tôi khuyến nghị cho các tùy chọn component. Chúng được chia thành các danh mục, vì vậy bạn sẽ biết nơi thêm các thuộc tính tùy chỉnh và directives.

1. **Định nghĩa** (cung cấp các tùy chọn component)

   - `is`

2. **Kết xuất Danh sách** (tạo ra nhiều biến thể của cùng một element)

   - `v-for`

3. **Điều kiện** (element có được kết xuất/hiển thị hay không)

   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **Bộ sửa đổi Kết xuất** (thay đổi cách element kết xuất)

   - `v-pre`
   - `v-once`

5. **Nhận thức Toàn cục** (yêu cầu kiến thức ngoài component)

   - `id`

6. **Thuộc tính Duy nhất** (các thuộc tính yêu cầu giá trị duy nhất)

   - `ref`
   - `key`

7. **Ràng buộc Hai chiều** (kết hợp ràng buộc và sự kiện)

   - `v-model`

8. **Các Thuộc tính Khác** (tất cả các thuộc tính được ràng buộc và không được ràng buộc không được chỉ định)

9. **Sự kiện** (người nghe sự kiện component)

   - `v-on`

10. **Nội dung** (ghi đè nội dung của element)
    - `v-html`
    - `v-text`

## Dòng trống trong các tùy chọn component/instance {#empty-lines-in-component-instance-options}

**Bạn có thể muốn thêm một dòng trống giữa các thuộc tính nhiều dòng, đặc biệt là nếu các tùy chọn không còn vừa trên màn hình của bạn mà không cần cuộn.**

Khi các component bắt đầu cảm thấy chật chội hoặc khó đọc, thêm khoảng trắng giữa các thuộc tính nhiều dòng có thể giúp chúng dễ dàng đọc lại. Trong một số trình soạn thảo, chẳng hạn như Vim, các tùy chọn định dạng như thế này cũng có thể giúp chúng dễ dàng điều hướng bằng bàn phím.

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Kém</h3>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```js
// Không có khoảng trắng cũng được, miễn là component
// vẫn dễ đọc và điều hướng.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Kém</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
})
const formattedValue = computed(() => {
  // ...
})
const inputClasses = computed(() => {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
})

const formattedValue = computed(() => {
  // ...
})

const inputClasses = computed(() => {
  // ...
})
```

</div>

</div>

## Thứ tự element cấp cao nhất của single-file component {#single-file-component-top-level-element-order}

**[Single-File Components](/guide/scaling-up/sfc) nên luôn sắp xếp các thẻ `<script>`, `<template>`, và `<style>` một cách nhất quán, với `<style>` ở cuối, vì ít nhất một trong hai thẻ kia luôn cần thiết.**

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html [ComponentX.vue]
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html [ComponentA.vue]
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html [ComponentB.vue]
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html [ComponentA.vue]
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html [ComponentB.vue]
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

hoặc

```vue-html  [ComponentA.vue]
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

```vue-html [ComponentB.vue]
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

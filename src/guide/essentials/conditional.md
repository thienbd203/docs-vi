# Render có điều kiện {#conditional-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Free Vue.js Conditional Rendering Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Free Vue.js Conditional Rendering Lesson"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

Directive `v-if` được sử dụng để render một block có điều kiện. Block chỉ được render nếu biểu thức của directive trả về giá trị truthy.

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

## `v-else` {#v-else}

Bạn có thể sử dụng directive `v-else` để chỉ định một "else block" cho `v-if`:

```vue-html
<button @click="awesome = !awesome">Toggle</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Toggle</button>
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</div>

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNpFjkEOgjAQRa8ydIMulLA1hegJ3LnqBskAjdA27RQXhHu4M/GEHsEiKLv5mfdf/sBOxux7j+zAuCutNAQOyZtcKNkZbQkGsFjBCJXVHcQBjYUSqtTKERR3dLpDyCZmQ9bjViiezKKgCIGwM21BGBIAv3oireBYtrK8ZYKtgmg5BctJ13WLPJnhr0YQb1Lod7JaS4G8eATpfjMinjTphC8wtg7zcwNKw/v5eC1fnvwnsfEDwaha7w==)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNpFjj0OwjAMha9iMsEAFWuVVnACNqYsoXV/RJpEqVOQqt6DDYkTcgRSWoplWX7y56fXs6O1u84jixlvM1dbSoXGuzWOIMdCekXQCw2QS5LrzbQLckje6VEJglDyhq1pMAZyHidkGG9hhObRYh0EYWOVJAwKgF88kdFwyFSdXRPBZidIYDWvgqVkylIhjyb4ayOIV3votnXxfwrk2SPU7S/PikfVfsRnGFWL6akCbeD9fLzmK4+WSGz4AA5dYQY=)

</div>

Một phần tử `v-else` phải ngay lập tức theo sau một phần tử `v-if` hoặc `v-else-if` - nếu không nó sẽ không được nhận diện.

## `v-else-if` {#v-else-if}

`v-else-if`, như tên gọi gợi ý, đóng vai trò là một "else if block" cho `v-if`. Nó cũng có thể được xâu chuỗi nhiều lần:

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

Tương tự như `v-else`, một phần tử `v-else-if` phải ngay lập tức theo sau một phần tử `v-if` hoặc `v-else-if`.

## `v-if` trên `<template>` {#v-if-on-template}

Vì `v-if` là một directive, nó phải được gắn vào một phần tử duy nhất. Nhưng nếu chúng ta muốn toggle nhiều hơn một phần tử thì sao? Trong trường hợp này, chúng ta có thể sử dụng `v-if` trên một phần tử `<template>`, đóng vai trò là một wrapper vô hình. Kết quả render cuối cùng sẽ không bao gồm phần tử `<template>`.

```vue-html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

`v-else` và `v-else-if` cũng có thể được sử dụng trên `<template>`.

## `v-show` {#v-show}

Một lựa chọn khác để hiển thị một phần tử có điều kiện là directive `v-show`. Cách sử dụng phần lớn giống nhau:

```vue-html
<h1 v-show="ok">Hello!</h1>
```

Sự khác biệt là một phần tử với `v-show` sẽ luôn được render và giữ lại trong DOM; `v-show` chỉ toggle thuộc tính CSS `display` của phần tử.

`v-show` không hỗ trợ phần tử `<template>`, và cũng không hoạt động với `v-else`.

## `v-if` so với `v-show` {#v-if-vs-v-show}

`v-if` là render có điều kiện "thực sự" vì nó đảm bảo rằng event listeners và các component con bên trong block có điều kiện được hủy và tạo lại đúng cách trong quá trình toggle.

`v-if` cũng **lazy**: nếu điều kiện là false khi render lần đầu, nó sẽ không làm gì cả - block có điều kiện sẽ không được render cho đến khi điều kiện trở thành true lần đầu tiên.

So sánh với đó, `v-show` đơn giản hơn nhiều - phần tử luôn được render bất kể điều kiện ban đầu, với toggle dựa trên CSS.

Nói chung, `v-if` có chi phí toggle cao hơn trong khi `v-show` có chi phí render ban đầu cao hơn. Vì vậy, hãy ưu tiên `v-show` nếu bạn cần toggle một cái gì đó rất thường xuyên, và ưu tiên `v-if` nếu điều kiện khó thay đổi tại runtime.

## `v-if` với `v-for` {#v-if-with-v-for}

Khi `v-if` và `v-for` đều được sử dụng trên cùng một phần tử, `v-if` sẽ được đánh giá trước. Xem [hướng dẫn render danh sách](list#v-for-with-v-if) để biết chi tiết.

::: warning Lưu ý
**Không** khuyến khích sử dụng `v-if` và `v-for` trên cùng một phần tử do độ ưu tiên ngầm định. Tham khảo [hướng dẫn render danh sách](list#v-for-with-v-if) để biết chi tiết.
:::

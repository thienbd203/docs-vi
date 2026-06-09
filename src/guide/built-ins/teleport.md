# Teleport {#teleport}

 <VueSchoolLink href="https://vueschool.io/lessons/vue-3-teleport" title="Free Vue.js Teleport Lesson"/>

`<Teleport>` là một component tích hợp sẵn cho phép chúng ta "teleport" một phần của template của component vào một DOM node tồn tại bên ngoài hệ thống phân cấp DOM của component đó.

## Cách Sử Dụng Cơ Bản {#basic-usage}

Đôi khi một phần của template của component thuộc về nó về mặt logic, nhưng từ góc độ trực quan, nó nên được hiển thị ở một nơi khác trong DOM, thậm chí có thể bên ngoài ứng dụng Vue.

Ví dụ phổ biến nhất của điều này là khi xây dựng một modal toàn màn hình. Lý tưởng nhất, chúng ta muốn mã cho nút của modal và chính modal được viết trong cùng một single-file component, vì cả hai đều liên quan đến trạng thái mở / đóng của modal. Nhưng điều đó có nghĩa là modal sẽ được render cùng với nút, lồng sâu trong hệ thống phân cấp DOM của ứng dụng. Điều này có thể tạo ra một số vấn đề khó khăn khi định vị modal thông qua CSS.

Hãy xem xét cấu trúc HTML sau.

```vue-html
<div class="outer">
  <h3>Vue Teleport Example</h3>
  <div>
    <MyModal />
  </div>
</div>
```

Và đây là triển khai của `<MyModal>`:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>

Component này chứa một `<button>` để kích hoạt việc mở modal, và một `<div>` với class `.modal`, sẽ chứa nội dung của modal và một nút để tự đóng.

Khi sử dụng component này bên trong cấu trúc HTML ban đầu, có một số vấn đề tiềm ẩn:

- `position: fixed` chỉ đặt phần tử tương đối với viewport khi không có phần tử tổ tiên nào có property `transform`, `perspective` hoặc `filter` được đặt. Ví dụ, nếu chúng ta định animate phần tử tổ tiên `<div class="outer">` với một CSS transform, nó sẽ phá vỡ layout của modal!

- `z-index` của modal bị giới hạn bởi các phần tử chứa nó. Nếu có một phần tử khác chồng lên `<div class="outer">` và có `z-index` cao hơn, nó sẽ che modal của chúng ta.

`<Teleport>` cung cấp một cách sạch sẽ để giải quyết các vấn đề này, bằng cách cho phép chúng ta thoát khỏi cấu trúc DOM lồng nhau. Hãy sửa đổi `<MyModal>` để sử dụng `<Teleport>`:

```vue-html{3,8}
<button @click="open = true">Open Modal</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

Target `to` của `<Teleport>` mong đợi một chuỗi selector CSS hoặc một DOM node thực tế. Ở đây, chúng ta về cơ bản đang nói với Vue để "**teleport** fragment template này **to** thẻ **`body`**".

Bạn có thể nhấp vào nút bên dưới và kiểm tra thẻ `<body>` thông qua devtools của trình duyệt:

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<div class="demo">
  <button @click="open = true">Open Modal</button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="open" class="demo modal-demo">
        <p style="margin-bottom:20px">Hello from the modal!</p>
        <button @click="open = false">Close</button>
      </div>
    </Teleport>
  </ClientOnly>
</div>

<style>
.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>

Bạn có thể kết hợp `<Teleport>` với [`<Transition>`](./transition) để tạo các modal có animation - xem [Ví dụ tại đây](/examples/#modal).

:::tip
Target `to` của teleport phải đã có trong DOM khi component `<Teleport>` được mount. Lý tưởng nhất, đây nên là một phần tử bên ngoài toàn bộ ứng dụng Vue. Nếu nhắm đến một phần tử khác được render bởi Vue, bạn cần đảm bảo rằng phần tử đó được mount trước `<Teleport>`. Nếu bạn đang sử dụng SSR, xem [Xử lý Teleports trong SSR](/guide/scaling-up/ssr#teleports).
:::

## Sử Dụng với Components {#using-with-components}

`<Teleport>` chỉ thay đổi cấu trúc DOM được render - nó không ảnh hưởng đến hệ thống phân cấp logic của các component. Điều đó có nghĩa là, nếu `<Teleport>` chứa một component, component đó sẽ vẫn là một con logic của component cha chứa `<Teleport>`. Việc truyền props và phát ra sự kiện sẽ tiếp tục hoạt động theo cùng một cách.

Điều này cũng có nghĩa là các injection từ component cha hoạt động như mong đợi, và component con sẽ được lồng bên dưới component cha trong Vue Devtools, thay vì được đặt nơi nội dung thực tế chuyển đến.

## Vô Hiệu Hóa Teleport {#disabling-teleport}

Trong một số trường hợp, chúng ta có thể muốn vô hiệu hóa có điều kiện `<Teleport>`. Ví dụ, chúng ta có thể muốn render một component như một overlay cho desktop, nhưng inline trên mobile. `<Teleport>` hỗ trợ prop `disabled` có thể được chuyển đổi động:

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

Sau đó chúng ta có thể cập nhật động `isMobile`.

## Nhiều Teleport trên Cùng Một Target {#multiple-teleports-on-the-same-target}

Một trường hợp sử dụng phổ biến sẽ là một component `<Modal>` có thể tái sử dụng, với khả năng nhiều instance có thể hoạt động cùng một lúc. Đối với loại kịch bản này, nhiều component `<Teleport>` có thể mount nội dung của chúng đến cùng một phần tử target. Thứ tự sẽ là một append đơn giản, với các mount sau được đặt sau các mount trước, nhưng tất cả nằm trong phần tử target.

Given the following usage:

```vue-html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

Kết quả được render sẽ là:

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## Deferred Teleport <sup class="vt-badge" data-text="3.5+" /> {#deferred-teleport}

Trong Vue 3.5 trở lên, chúng ta có thể sử dụng prop `defer` để hoãn việc giải quyết target của một Teleport cho đến khi các phần khác của ứng dụng đã mount. Điều này cho phép Teleport nhắm đến một phần tử container được render bởi Vue, nhưng ở phần sau của component tree:

```vue-html
<Teleport defer to="#late-div">...</Teleport>

<!-- somewhere later in the template -->
<div id="late-div"></div>
```

Lưu ý rằng phần tử target phải được render trong cùng mount / update tick với Teleport - tức là nếu `<div>` chỉ được mount một giây sau đó, Teleport vẫn sẽ báo lỗi. Defer hoạt động tương tự như lifecycle hook `mounted`.

---

**Related**

- [`<Teleport>` API reference](/api/built-in-components#teleport)
- [Handling Teleports in SSR](/guide/scaling-up/ssr#teleports)

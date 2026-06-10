# Attribute Bindings {#attribute-bindings}

Trong Vue, mustaches chỉ được sử dụng cho nội suy văn bản. Để liên kết một thuộc tính với một giá trị động, chúng ta sử dụng directive `v-bind`:

```vue-html
<div v-bind:id="dynamicId"></div>
```

Một **directive** là một thuộc tính đặc biệt bắt đầu với tiền tố `v-`. Chúng là một phần của cú pháp template của Vue. Tương tự như nội suy văn bản, giá trị directive là các biểu thức JavaScript có quyền truy cập vào trạng thái của component. Chi tiết đầy đủ về `v-bind` và cú pháp directive được thảo luận trong <a target="_blank" href="/guide/essentials/template-syntax.html">Hướng dẫn - Cú pháp Template</a>.

Phần sau dấu hai chấm (`:id`) là "đối số" của directive. Ở đây, thuộc tính `id` của phần tử sẽ được đồng bộ với thuộc tính `dynamicId` từ trạng thái của component.

Vì `v-bind` được sử dụng rất thường xuyên, nó có một cú pháp viết tắt chuyên dụng:

```vue-html
<div :id="dynamicId"></div>
```

Bây giờ, hãy thử thêm một liên kết `class` động vào `<h1>`, sử dụng `titleClass` <span class="options-api">thuộc tính data</span><span class="composition-api">ref</span> làm giá trị của nó. Nếu được liên kết đúng, văn bản sẽ chuyển sang màu đỏ.

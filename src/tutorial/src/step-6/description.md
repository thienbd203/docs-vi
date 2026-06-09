# Render Có Điều Kiện {#conditional-rendering}

Chúng ta có thể sử dụng directive `v-if` để render có điều kiện một phần tử:

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

`<h1>` này sẽ chỉ được render nếu giá trị của `awesome` là [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy). Nếu `awesome` thay đổi thành một giá trị [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), nó sẽ bị loại bỏ khỏi DOM.

Chúng ta cũng có thể sử dụng `v-else` và `v-else-if` để chỉ ra các nhánh khác của điều kiện:

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

Hiện tại, demo đang hiển thị cả hai `<h1>` cùng một lúc, và nút không làm gì cả. Hãy thử thêm các directive `v-if` và `v-else` vào chúng, và triển khai phương thức `toggle()` để chúng ta có thể sử dụng nút để toggle giữa chúng.

Chi tiết thêm về `v-if`: <a target="_blank" href="/guide/essentials/conditional.html">Hướng dẫn - Render Có Điều Kiện</a>

# List Rendering {#list-rendering}

Chúng ta có thể sử dụng directive `v-for` để render một danh sách các phần tử dựa trên một mảng nguồn:

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

Ở đây `todo` là một biến cục bộ đại diện cho phần tử mảng hiện đang được lặp. Nó chỉ có thể truy cập được trên hoặc bên trong phần tử `v-for`, tương tự như một phạm vi hàm.

Lưu ý cách chúng ta cũng đang cấp cho mỗi đối tượng todo một `id` duy nhất, và liên kết nó làm <a target="_blank" href="/api/built-in-special-attributes.html#key">thuộc tính `key` đặc biệt</a> cho mỗi `<li>`. `key` cho phép Vue di chuyển chính xác mỗi `<li>` để khớp với vị trí của đối tượng tương ứng của nó trong mảng.

Có hai cách để cập nhật danh sách:

1. Gọi các [phương thức đột biến](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) trên mảng nguồn:

   <div class="composition-api">

   ```js
   todos.value.push(newTodo)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos.push(newTodo)
   ```

   </div>

2. Replace the array with a new one:

   <div class="composition-api">

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   </div>

Here we have a simple todo list - try to implement the logic for `addTodo()` and `removeTodo()` methods to make it work!

More details on `v-for`: <a target="_blank" href="/guide/essentials/list.html">Guide - List Rendering</a>

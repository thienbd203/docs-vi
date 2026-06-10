# Watchers {#watchers}

Đôi khi chúng ta có thể cần thực hiện "side effects" phản ứng - ví dụ, ghi log một số vào console khi nó thay đổi. Chúng ta có thể đạt được điều này với watchers:

<div class="composition-api">

```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // đúng, console.log() là một side effect
  console.log(`new count is: ${newCount}`)
})
```

`watch()` có thể watch trực tiếp một ref, và callback được kích hoạt bất cứ khi nào giá trị của `count` thay đổi. `watch()` cũng có thể watch các loại nguồn dữ liệu khác - chi tiết thêm được bao gồm trong <a target="_blank" href="/guide/essentials/watchers.html">Hướng dẫn - Watchers</a>.

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newCount) {
      // yes, console.log() is a side effect
      console.log(`new count is: ${newCount}`)
    }
  }
}
```

Here, we are using the `watch` option to watch changes to the `count` property. The watch callback is called when `count` changes, and receives the new value as the argument. More details are covered in <a target="_blank" href="/guide/essentials/watchers.html">Guide - Watchers</a>.

</div>

A more practical example than logging to the console would be fetching new data when an ID changes. The code we have is fetching todos data from a mock API on component mount. There is also a button that increments the todo ID that should be fetched. Try to implement a watcher that fetches a new todo when the button is clicked.

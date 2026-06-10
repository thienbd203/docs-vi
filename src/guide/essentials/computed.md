# Computed Properties {#computed-properties}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/computed-properties-in-vue-3" title="Free Vue.js Computed Properties Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api" title="Free Vue.js Computed Properties Lesson"/>
</div>

## Ví dụ Cơ bản {#basic-example}

Các biểu thức trong template rất tiện lợi, nhưng chúng được dành cho các hoạt động đơn giản. Đặt quá nhiều logic trong template của bạn có thể làm chúng phình to và khó bảo trì. Ví dụ, nếu chúng ta có một đối tượng với một mảng lồng nhau:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
```

</div>

Và chúng ta muốn hiển thị các thông điệp khác nhau tùy thuộc vào việc `author` đã có một số sách hay chưa:

```vue-html
<p>Has published books:</p>
<span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
```

Tại thời điểm này, template đang trở nên hơi lộn xộn. Chúng ta phải nhìn vào nó một giây trước khi nhận ra rằng nó thực hiện một tính toán phụ thuộc vào `author.books`. Quan trọng hơn, chúng ta có thể không muốn lặp lại chính mình nếu chúng ta cần bao gồm tính toán này trong template nhiều hơn một lần.

Đó là lý do tại sao cho logic phức tạp bao gồm dữ liệu phản ứng, được khuyến nghị sử dụng một **computed property**. Đây là ví dụ tương tự, được refactor:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  },
  computed: {
    // một computed getter
    // một computed getter
    publishedBooksMessage() {
      // `this` trỏ đến instance component
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}
```

```vue-html
<p>Has published books:</p>
<span>{{ publishedBooksMessage }}</span>
```

[Try it in the Playground](https://play.vuejs.org/#eNqFkN1KxDAQhV/l0JsqaFfUq1IquwiKsF6JINaLbDNui20S8rO4lL676c82eCFCIDOZMzkzXxetlUoOjqI0ykypa2XzQtC3ktqC0ydzjUVXCIAzy87OpxjQZJ0WpwxgzlZSp+EBEKylFPGTrATuJcUXobST8sukeA8vQPzqCNe4xJofmCiJ48HV/FfbLLrxog0zdfmn4tYrXirC9mgs6WMcBB+nsJ+C8erHH0rZKmeJL0sot2tqUxHfDONuyRi2p4BggWCr2iQTgGTcLGlI7G2FHFe4Q/xGJoYn8SznQSbTQviTrRboPrHUqoZZ8hmQqfyRmTDFTC1bqalsFBN5183o/3NG33uvoWUwXYyi/gdTEpwK)

Ở đây chúng ta đã khai báo một computed property `publishedBooksMessage`.
Ở đây chúng ta đã khai báo một computed property `publishedBooksMessage`.

Hãy thử thay đổi giá trị của mảng `books` trong `data` ứng dụng và bạn sẽ thấy cách `publishedBooksMessage` thay đổi tương ứng.

Bạn có thể data-bind đến computed properties trong templates giống như một thuộc tính bình thường. Vue biết rằng `this.publishedBooksMessage` phụ thuộc vào `this.author.books`, vì vậy nó sẽ cập nhật bất kỳ liên kết nào phụ thuộc vào `this.publishedBooksMessage` khi `this.author.books` thay đổi.

Xem thêm: [Typing Computed Properties](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// một computed ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNp1kE9Lw0AQxb/KI5dtoTainkoaaREUoZ5EEONhm0ybYLO77J9CCfnuzta0vdjbzr6Zeb95XbIwZroPlMySzJW2MR6OfDB5oZrWaOvRwZIsfbOnCUrdmuCpQo+N1S0ET4pCFarUynnI4GttMT9PjLpCAUq2NIN41bXCkyYxiZ9rrX/cDF/xDYiPQLjDDRbVXqqSHZ5DUw2tg3zP8lK6pvxHe2DtvSasDs6TPTAT8F2ofhzh0hTygm5pc+I1Yb1rXE3VMsKsyDm5JcY/9Y5GY8xzHI+wnIpVw4nTI/10R2rra+S4xSPEJzkBvvNNs310ztK/RDlLLjy1Zic9cQVkJn+R7gIwxJGlMXiWnZEq77orhH3Pq2NH9DjvTfpfSBSbmA==)

Ở đây chúng ta đã khai báo một computed property `publishedBooksMessage`. Hàm `computed()` mong đợi được truyền một [getter function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description), và giá trị được trả về là một **computed ref**. Tương tự như các refs bình thường, bạn có thể truy cập kết quả tính toán như `publishedBooksMessage.value`. Computed refs cũng được auto-unwrapped trong templates vì vậy bạn có thể tham chiếu chúng mà không cần `.value` trong các biểu thức template.

Một computed property tự động theo dõi các phụ thuộc phản ứng của nó. Vue biết rằng tính toán của `publishedBooksMessage` phụ thuộc vào `author.books`, vì vậy nó sẽ cập nhật bất kỳ liên kết nào phụ thuộc vào `publishedBooksMessage` khi `author.books` thay đổi.

Xem thêm: [Typing Computed](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

</div>

## Computed Caching so với Methods {#computed-caching-vs-methods}

Bạn có thể nhận thấy chúng ta có thể đạt được kết quả tương tự bằng cách gọi một method trong biểu thức:

```vue-html
<p>{{ calculateBooksMessage() }}</p>
```

<div class="options-api">

```js
// trong component
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Yes' : 'No'
  }
}
```

</div>

<div class="composition-api">

```js
// trong component
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
```

</div>

Thay vì sử dụng computed property, chúng ta có thể định nghĩa cùng một function như một method. Đối với kết quả cuối cùng, hai cách tiếp cận này thực sự hoàn toàn giống nhau. Tuy nhiên, sự khác biệt là **computed properties được cache dựa trên các dependency phản ứng của chúng.** Một computed property chỉ sẽ được tính toán lại khi một số dependency phản ứng của nó đã thay đổi. Điều này có nghĩa là miễn là `author.books` chưa thay đổi, việc truy cập nhiều lần vào `publishedBooksMessage` sẽ ngay lập tức trả về kết quả đã tính toán trước đó mà không cần chạy getter function lần nữa.

Điều này cũng có nghĩa là computed property sau đây sẽ không bao giờ cập nhật, vì `Date.now()` không phải là một dependency phản ứng:

<div class="options-api">

```js
computed: {
  now() {
    return Date.now()
  }
}
```

</div>

<div class="composition-api">

```js
const now = computed(() => Date.now())
```

</div>

So sánh lại, việc gọi một method sẽ **luôn luôn** chạy function bất cứ khi nào re-render xảy ra.

Tại sao chúng ta cần caching? Hãy tưởng tượng chúng ta có một computed property tốn kém `list`, yêu cầu lặp qua một mảng khổng lồ và thực hiện nhiều tính toán. Sau đó chúng ta có thể có các computed properties khác lần lượt phụ thuộc vào `list`. Nếu không có caching, chúng ta sẽ thực thi getter của `list` nhiều lần hơn mức cần thiết! Trong trường hợp bạn không muốn caching, hãy sử dụng method call thay thế.

## Writable Computed {#writable-computed}

Computed properties mặc định chỉ có getter. Nếu bạn cố gắng gán một giá trị mới cho một computed property, bạn sẽ nhận được một runtime warning. Trong những trường hợp hiếm khi bạn cần một computed property "có thể ghi", bạn có thể tạo một bằng cách cung cấp cả getter và setter:
Computed properties mặc định chỉ có getter. Nếu bạn cố gắng gán một giá trị mới cho một computed property, bạn sẽ nhận được một runtime warning. Trong những trường hợp hiếm khi bạn cần một computed property "có thể ghi", bạn có thể tạo một bằng cách cung cấp cả getter và setter:

<div class="options-api">

```js
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName: {
      // getter
      get() {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set(newValue) {
        // Lưu ý: chúng ta đang sử dụng cú pháp destructuring assignment ở đây.
        [this.firstName, this.lastName] = newValue.split(' ')
      }
    }
  }
}
```

Bây giờ khi bạn chạy `this.fullName = 'John Doe'`, setter sẽ được gọi và `this.firstName` và `this.lastName` sẽ được cập nhật tương ứng.
Bây giờ khi bạn chạy `this.fullName = 'John Doe'`, setter sẽ được gọi và `this.firstName` và `this.lastName` sẽ được cập nhật tương ứng.

</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // Lưu ý: chúng ta đang sử dụng cú pháp destructuring assignment ở đây.
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

Bây giờ khi bạn chạy `fullName.value = 'John Doe'`, setter sẽ được gọi và `firstName` và `lastName` sẽ được cập nhật tương ứng.
Bây giờ khi bạn chạy `fullName.value = 'John Doe'`, setter sẽ được gọi và `firstName` và `lastName` sẽ được cập nhật tương ứng.

</div>

## Lấy Giá Trị Trước Đó {#previous}

- Chỉ được hỗ trợ từ 3.4+
- Chỉ được hỗ trợ từ 3.4+

<p class="options-api">
Trong trường hợp bạn cần nó, bạn có thể lấy giá trị trước đó được trả về bởi computed property bằng cách truy cập
tham số thứ hai của getter:
</p>

<p class="composition-api">
Trong trường hợp bạn cần nó, bạn có thể lấy giá trị trước đó được trả về bởi computed property bằng cách truy cập
tham số đầu tiên của getter:
</p>

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 2
    }
  },
  computed: {
    // Computed này sẽ trả về giá trị của count khi nó nhỏ hơn hoặc bằng 3.
    // Khi count >= 4, giá trị cuối cùng thỏa mãn điều kiện của chúng ta sẽ được trả về
    // thay thế cho đến khi count nhỏ hơn hoặc bằng 3
    alwaysSmall(_, previous) {
      if (this.count <= 3) {
        return this.count
      }

      return previous
    }
  }
}
```
</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(2)

// Computed này sẽ trả về giá trị của count khi nó nhỏ hơn hoặc bằng 3.
// Khi count >= 4, giá trị cuối cùng thỏa mãn điều kiện của chúng ta sẽ được trả về
// thay thế cho đến khi count nhỏ hơn hoặc bằng 3
const alwaysSmall = computed((previous) => {
  if (count.value <= 3) {
    return count.value
  }

  return previous
})
</script>
```
</div>

Trong trường hợp bạn đang sử dụng một writable computed:
Trong trường hợp bạn đang sử dụng một writable computed:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 2
    }
  },
  computed: {
    alwaysSmall: {
      get(_, previous) {
        if (this.count <= 3) {
          return this.count
        }

        return previous;
      },
      set(newValue) {
        this.count = newValue * 2
      }
    }
  }
}
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(2)

const alwaysSmall = computed({
  get(previous) {
    if (count.value <= 3) {
      return count.value
    }

    return previous
  },
  set(newValue) {
    count.value = newValue * 2
  }
})
</script>
```

</div>


## Best Practices {#best-practices}

### Getters nên không có side-effect {#getters-should-be-side-effect-free}

Điều quan trọng cần nhớ là computed getter functions chỉ nên thực hiện tính toán thuần túy và không có side effects. Ví dụ, **đừng thay đổi state khác, thực hiện async requests, hoặc thay đổi DOM bên trong một computed getter!** Hãy coi computed property như việc mô tả một cách khai báo cách để derive một giá trị dựa trên các giá trị khác - trách nhiệm duy nhất của nó nên là tính toán và trả về giá trị đó. Sau này trong hướng dẫn, chúng ta sẽ thảo luận về cách chúng ta có thể thực hiện side effects phản ứng với các thay đổi state bằng [watchers](./watchers).

### Tránh thay đổi giá trị computed {#avoid-mutating-computed-value}

Giá trị trả về từ một computed property là derived state. Hãy coi nó như một snapshot tạm thời - mỗi khi source state thay đổi, một snapshot mới được tạo ra. Việc thay đổi một snapshot không có ý nghĩa, vì vậy giá trị trả về của computed nên được coi là read-only và không bao giờ được thay đổi - thay vào đó, hãy cập nhật source state mà nó phụ thuộc vào để kích hoạt các tính toán mới.
Giá trị trả về từ một computed property là derived state. Hãy coi nó như một snapshot tạm thời - mỗi khi source state thay đổi, một snapshot mới được tạo ra. Việc thay đổi một snapshot không có ý nghĩa, vì vậy giá trị trả về của computed nên được coi là read-only và không bao giờ được thay đổi - thay vào đó, hãy cập nhật source state mà nó phụ thuộc vào để kích hoạt các tính toán mới.

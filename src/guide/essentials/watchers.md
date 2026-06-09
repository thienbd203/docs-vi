# Watchers {#watchers}

## Ví dụ Cơ bản {#basic-example}

Computed properties cho phép chúng ta tính toán các giá trị dẫn xuất một cách khai báo. Tuy nhiên, có những trường hợp chúng ta cần thực hiện "side effects" phản ứng với thay đổi trạng thái - ví dụ, thay đổi DOM, hoặc thay đổi một phần trạng thái khác dựa trên kết quả của một hoạt động async.

<div class="options-api">

Với Options API, chúng ta có thể sử dụng tùy chọn [`watch`](/api/options-state#watch) để kích hoạt động một hàm bất cứ khi một thuộc tính phản ứng thay đổi:

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Questions usually contain a question mark. ;-)',
      loading: false
    }
  },
  watch: {
    // whenever question changes, this function will run
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.loading = true
      this.answer = 'Thinking...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Error! Could not reach the API. ' + error
      } finally {
        this.loading = false
      }
    }
  }
}
```

```vue-html
<p>
  Ask a yes/no question:
  <input v-model="question" :disabled="loading" />
</p>
<p>{{ answer }}</p>
```

[Try it in the Playground](https://play.vuejs.org/#eNp9VE1v2zAM/SucLnaw1D70lqUbsiKH7rB1W4++aDYdq5ElTx9xgiD/fbT8lXZFAQO2+Mgn8pH0mW2aJjl4ZCu2trkRjfucKTw22jgosOReOjhnCqDgjseL/hvAoPNGjSeAvx6tE1qtIIqWo5Er26Ih088BteCt51KeINfKcaGAT5FQc7NP4NPNYiaQmhdC7VZQcmlxMF+61yUcWu7yajVmkabQVqjwgGZmzSuudmiX4CphofQqD+ZWSAnGqz5y9I4VtmOuS9CyGA9T3QCihGu3RKhc+gJtHH2JFld+EG5Mdug2QYZ4MSKhgBd11OgqXdipEm5PKoer0Jk2kA66wB044/EF1GtOSPRUCbUnryRJosnFnK4zpC5YR7205M9bLhyUSIrGUeVcY1dpekKrdNK6MuWNiKYKXt8V98FElDxbknGxGLCpZMi7VkGMxmjzv0pz1tvO4QPcay8LULoj5RToKoTN40MCEXyEQDJTl0KFmXpNOqsUxudN+TNFzzqdJp8ODutGcod0Alg34QWwsXsaVtIjVXqe9h5bC9V4B4ebWhco7zI24hmDVSEs/yOxIPOQEFnTnjzt2emS83nYFrhcevM6nRJhS+Ys9aoUu6Av7WqoNWO5rhsh0fxownplbBqhjJEmuv0WbN2UDNtDMRXm+zfsz/bY2TL2SH1Ec8CMTZjjhqaxh7e/v+ORvieQqvaSvN8Bf6HV0veSdG5fvSoo7Su/kO1D3f13SKInuz06VHYsahzzfl0yRj+s+3dKn9O9TW7HPrPLP624lFU=)

Tùy chọn `watch` cũng hỗ trợ một đường dẫn được phân tách bằng dấu chấm làm key:

```js
export default {
  watch: {
    // Note: only simple paths. Expressions are not supported.
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

Với Composition API, chúng ta có thể sử dụng hàm [`watch`](/api/reactivity-core#watch) để kích hoạt một callback bất cứ khi nào một phần trạng thái phản ứng thay đổi:

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
const loading = ref(false)

// watch works directly on a ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Try it in the Playground](https://play.vuejs.org/#eNp9U8Fy0zAQ/ZVFF9tDah96C2mZ0umhHKBAj7oIe52oUSQjyXEyGf87KytyoDC9JPa+p+e3b1cndtd15b5HtmQrV1vZeXDo++6Wa7nrjPVwAovtAgbh6w2M0Fqzg4xOZFxzXRvtPPzq0XlpNNwEbp5lRUKEdgPaVP925jnoXS+UOgKxvJAaxEVjJ+y2hA9XxUVFGdFIvT7LtEI5JIzrqjrbGozdOmikxdqTKqmIQOV6gvOkvQDhjrqGXOOQvCzAqCa9FHBzCyeuAWT7F6uUulZ9gy7PPmZFETmQjJV7oXoke972GJHY+Axkzxupt4FalhRcYHh7TDIQcqA+LTriikFIDy0G59nG+84tq+qITpty8G0lOhmSiedefSaPZ0mnfHFG50VRRkbkj1BPceVorbFzF/+6fQj4O7g3vWpAm6Ao6JzfINw9PZaQwXuYNJJuK/U0z1nxdTLT0M7s8Ec/I3WxquLS0brRi8ddp4RHegNYhR0M/Du3pXFSAJU285osI7aSuus97K92pkF1w1nCOYNlI534qbCh8tkOVasoXkV1+sjplLZ0HGN5Vc1G2IJ5R8Np5XpKlK7J1CJntdl1UqH92k0bzdkyNc8ZRWGGz1MtbMQi1esN1tv/1F/cIdQ4e6LJod0jZzPmhV2jj/DDjy94oOcZpK57Rew3wO/ojOpjJIH2qdcN2f6DN7l9nC47RfTsHg4etUtNpZUeJz5ndPPv32j9Yve6vE6DZuNvu1R2Tg==)

### Watch Source Types {#watch-source-types}

`watch`'s first argument can be different types of reactive "sources": it can be a ref (including computed refs), a reactive object, a [getter function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description), or an array of multiple sources:

```js
const x = ref(0)
const y = ref(0)

// single ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// array of multiple sources
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

Do note that you can't watch a property of a reactive object like this:

```js
const obj = reactive({ count: 0 })

// this won't work because we are passing a number to watch()
watch(obj.count, (count) => {
  console.log(`Count is: ${count}`)
})
```

Thay vào đó, hãy sử dụng một getter:

```js
// instead, use a getter:
watch(
  () => obj.count,
  (count) => {
    console.log(`Count is: ${count}`)
  }
)
```

</div>

## Deep Watchers {#deep-watchers}

<div class="options-api">

`watch` is shallow by default: the callback will only trigger when the watched property has been assigned a new value - it won't trigger on nested property changes. If you want the callback to fire on all nested mutations, you need to use a deep watcher:

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // Note: `newValue` will be equal to `oldValue` here
        // on nested mutations as long as the object itself
        // hasn't been replaced.
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

Khi bạn gọi `watch()` trực tiếp trên một đối tượng phản ứng, nó sẽ ngầm tạo một deep watcher - callback sẽ được kích hoạt trên tất cả các nested mutations:

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // fires on nested property mutations
  // Note: `newValue` will be equal to `oldValue` here
  // because they both point to the same object!
})

obj.count++
```

Điều này nên được phân biệt với một getter trả về một đối tượng phản ứng - trong trường hợp sau, callback sẽ chỉ kích hoạt nếu getter trả về một đối tượng khác:

```js
watch(
  () => state.someObject,
  () => {
    // fires only when state.someObject is replaced
  }
)
```

You can, however, force the second case into a deep watcher by explicitly using the `deep` option:

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Note: `newValue` will be equal to `oldValue` here
    // *unless* state.someObject has been replaced
  },
  { deep: true }
)
```

</div>

Trong Vue 3.5+, tùy chọn `deep` cũng có thể là một số chỉ ra độ sâu duyệt tối đa - tức là bao nhiêu cấp độ Vue nên duyệt qua các thuộc tính lồng nhau của một đối tượng.

:::warning Use with Caution
Deep watch requires traversing all nested properties in the watched object, and can be expensive when used on large data structures. Use it only when necessary and beware of the performance implications.
:::

## Eager Watchers {#eager-watchers}

`watch` is lazy by default: the callback won't be called until the watched source has changed. But in some cases we may want the same callback logic to be run eagerly - for example, we may want to fetch some initial data, and then re-fetch the data whenever relevant state changes.

<div class="options-api">

We can force a watcher's callback to be executed immediately by declaring it using an object with a `handler` function and the `immediate: true` option:

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // this will be run immediately on component creation.
      },
      // force eager callback execution
      immediate: true
    }
  }
  // ...
}
```

Việc thực hiện ban đầu của hàm handler sẽ xảy ra ngay trước hook `created`. Vue sẽ đã xử lý các tùy chọn `data`, `computed`, và `methods`, nên các thuộc tính đó sẽ có sẵn trong lần gọi đầu tiên.

</div>

<div class="composition-api">

We can force a watcher's callback to be executed immediately by passing the `immediate: true` option:

```js
watch(
  source,
  (newValue, oldValue) => {
    // executed immediately, then again when `source` changes
  },
  { immediate: true }
)
```

</div>

## Once Watchers {#once-watchers}

- Only supported in 3.4+

Watcher's callback will execute whenever the watched source changes. If you want the callback to trigger only once when the source changes, use the `once: true` option.

<div class="options-api">

```js
export default {
  watch: {
    source: {
      handler(newValue, oldValue) {
        // when `source` changes, triggers only once
      },
      once: true
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(
  source,
  (newValue, oldValue) => {
    // when `source` changes, triggers only once
  },
  { once: true }
)
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

It is common for the watcher callback to use exactly the same reactive state as the source. For example, consider the following code, which uses a watcher to load a remote resource whenever the `todoId` ref changes:

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

Đặc biệt, hãy chú ý cách watcher sử dụng `todoId` hai lần, một lần làm nguồn và sau đó một lần nữa bên trong callback.

Điều này có thể được đơn giản hóa với [`watchEffect()`](/api/reactivity-core#watcheffect). `watchEffect()` cho phép chúng ta theo dõi các phụ thuộc phản ứng của callback một cách tự động. Watcher ở trên có thể được viết lại như:

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

Here, the callback will run immediately, there's no need to specify `immediate: true`. During its execution, it will automatically track `todoId.value` as a dependency (similar to computed properties). Whenever `todoId.value` changes, the callback will be run again. With `watchEffect()`, we no longer need to pass `todoId` explicitly as the source value.

Bạn có thể xem [ví dụ này](/examples/#fetching-data) về `watchEffect()` và reactive data-fetching trong hành động.

Đối với các ví dụ như thế này, chỉ có một phụ thuộc, lợi ích của `watchEffect()` tương đối nhỏ. Nhưng đối với các watcher có nhiều phụ thuộc, sử dụng `watchEffect()` loại bỏ gánh nặng phải duy trì danh sách phụ thuộc thủ công. Ngoài ra, nếu bạn cần watch nhiều thuộc tính trong một cấu trúc dữ liệu lồng nhau, `watchEffect()` có thể chứng minh hiệu quả hơn một deep watcher, vì nó sẽ chỉ theo dõi các thuộc tính được sử dụng trong callback, thay vì theo dõi đệ quy tất cả chúng.

:::tip
`watchEffect` only tracks dependencies during its **synchronous** execution. When using it with an async callback, only properties accessed before the first `await` tick will be tracked.
:::

### `watch` vs. `watchEffect` {#watch-vs-watcheffect}

`watch` and `watchEffect` both allow us to reactively perform side effects. Their main difference is the way they track their reactive dependencies:

- `watch` only tracks the explicitly watched source. It won't track anything accessed inside the callback. In addition, the callback only triggers when the source has actually changed. `watch` separates dependency tracking from the side effect, giving us more precise control over when the callback should fire.

- `watchEffect`, on the other hand, combines dependency tracking and side effect into one phase. It automatically tracks every reactive property accessed during its synchronous execution. This is more convenient and typically results in terser code, but makes its reactive dependencies less explicit.

</div>

## Side Effect Cleanup {#side-effect-cleanup}

Sometimes we may perform side effects, e.g. asynchronous requests, in a watcher:

<div class="composition-api">

```js
watch(id, (newId) => {
  fetch(`/api/${newId}`).then(() => {
    // callback logic
  })
})
```

</div>
<div class="options-api">

```js
export default {
  watch: {
    id(newId) {
      fetch(`/api/${newId}`).then(() => {
        // callback logic
      })
    }
  }
}
```

</div>

But what if `id` changes before the request completes? When the previous request completes, it will still fire the callback with an ID value that is already stale. Ideally, we want to be able to cancel the stale request when `id` changes to a new value.

We can use the [`onWatcherCleanup()`](/api/reactivity-core#onwatchercleanup) <sup class="vt-badge" data-text="3.5+" /> API to register a cleanup function that will be called when the watcher is invalidated and is about to re-run:

<div class="composition-api">

```js {10-13}
import { watch, onWatcherCleanup } from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()

  fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
    // callback logic
  })

  onWatcherCleanup(() => {
    // abort stale request
    controller.abort()
  })
})
```

</div>
<div class="options-api">

```js {12-15}
import { onWatcherCleanup } from 'vue'

export default {
  watch: {
    id(newId) {
      const controller = new AbortController()

      fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
        // callback logic
      })

      onWatcherCleanup(() => {
        // abort stale request
        controller.abort()
      })
    }
  }
}
```

</div>

Note that `onWatcherCleanup` is only supported in Vue 3.5+ and must be called during the synchronous execution of a `watchEffect` effect function or `watch` callback function: you cannot call it after an `await` statement in an async function.

Ngoài ra, một hàm `onCleanup` cũng được truyền cho các watcher callbacks làm đối số thứ 3<span class="composition-api">, và cho hàm effect `watchEffect` làm đối số đầu tiên</span>:

<div class="composition-api">

```js
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // cleanup logic
  })
})

watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // cleanup logic
  })
})
```

</div>
<div class="options-api">

```js
export default {
  watch: {
    id(newId, oldId, onCleanup) {
      // ...
      onCleanup(() => {
        // cleanup logic
      })
    }
  }
}
```

</div>

`onCleanup` passed via function argument is bound to the watcher instance so it is not subject to the synchronous constraint of `onWatcherCleanup`.

## Callback Flush Timing {#callback-flush-timing}

Khi bạn thay đổi trạng thái phản ứng, nó có thể kích hoạt cả cập nhật component Vue và các watcher callback do bạn tạo ra.

Tương tự như cập nhật component, các watcher callback do người dùng tạo được batch để tránh các lần gọi trùng lặp. Ví dụ, chúng ta có thể không muốn một watcher kích hoạt một nghìn lần nếu chúng ta đồng bộ đẩy một nghìn mục vào một mảng đang được watch.

Theo mặc định, callback của watcher được gọi **sau** cập nhật component cha (nếu có), và **trước** cập nhật DOM của component sở hữu. Điều này có nghĩa là nếu bạn cố gắng truy cập DOM riêng của component sở hữu bên trong một watcher callback, DOM sẽ ở trạng thái pre-update.

### Post Watchers {#post-watchers}

Nếu bạn muốn truy cập DOM của component sở hữu trong một watcher callback **sau** khi Vue đã cập nhật nó, bạn cần chỉ định tùy chọn `flush: 'post'`:

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

Post-flush `watchEffect()` also has a convenience alias, `watchPostEffect()`:

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* executed after Vue updates */
})
```

</div>

### Sync Watchers {#sync-watchers}

It's also possible to create a watcher that fires synchronously, before any Vue-managed updates:

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'sync'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'sync'
})

watchEffect(callback, {
  flush: 'sync'
})
```

Sync `watchEffect()` also has a convenience alias, `watchSyncEffect()`:

```js
import { watchSyncEffect } from 'vue'

watchSyncEffect(() => {
  /* executed synchronously upon reactive data change */
})
```

</div>

:::warning Use with Caution
Sync watchers do not have batching and triggers every time a reactive mutation is detected. It's ok to use them to watch simple boolean values, but avoid using them on data sources that might be synchronously mutated many times, e.g. arrays.
:::

<div class="options-api">

## `this.$watch()` \* {#this-watch}

It's also possible to imperatively create watchers using the [`$watch()` instance method](/api/component-instance#watch):

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

Điều này hữu ích khi bạn cần thiết lập một watcher có điều kiện, hoặc chỉ watch một cái gì đó phản hồi với tương tác người dùng. Nó cũng cho phép bạn dừng watcher sớm.

</div>

## Stopping a Watcher {#stopping-a-watcher}

<div class="options-api">

Các watcher được khai báo sử dụng tùy chọn `watch` hoặc phương thức instance `$watch()` được tự động dừng khi component sở hữu được unmount, vì vậy trong hầu hết các trường hợp bạn không cần lo lắng về việc dừng watcher mình.

Trong trường hợp hiếm khi bạn cần dừng một watcher trước khi component sở hữu unmount, API `$watch()` trả về một hàm cho việc đó:

```js
const unwatch = this.$watch('foo', callback)

// ...when the watcher is no longer needed:
unwatch()
```

</div>

<div class="composition-api">

Các watcher được khai báo đồng bộ bên trong `setup()` hoặc `<script setup>` được liên kết với instance component sở hữu, và sẽ được tự động dừng khi component sở hữu được unmount. Trong hầu hết các trường hợp, bạn không cần lo lắng về việc dừng watcher mình.

Chìa khóa ở đây là watcher phải được tạo **đồng bộ**: nếu watcher được tạo trong một async callback, nó sẽ không được liên kết với component sở hữu và phải được dừng thủ công để tránh rò rỉ bộ nhớ. Đây là một ví dụ:

```vue
<script setup>
import { watchEffect } from 'vue'

// this one will be automatically stopped
watchEffect(() => {})

// ...this one will not!
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

Để dừng thủ công một watcher, hãy sử dụng hàm handle được trả về. Điều này hoạt động cho cả `watch` và `watchEffect`:

```js
const unwatch = watchEffect(() => {})

// ...later, when no longer needed
unwatch()
```

Note that there should be very few cases where you need to create watchers asynchronously, and synchronous creation should be preferred whenever possible. If you need to wait for some async data, you can make your watch logic conditional instead:

```js
// data to be loaded asynchronously
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // do something when data is loaded
  }
})
```

</div>

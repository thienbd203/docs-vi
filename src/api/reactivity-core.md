# Reactivity API: Core {#reactivity-api-core}

:::info Xem thêm
Để hiểu rõ hơn về Reactivity APIs, được khuyến nghị đọc các chương sau trong hướng dẫn:

- [Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals) (với tùy chọn API được đặt là Composition API)
- [Reactivity in Depth](/guide/extras/reactivity-in-depth)
  :::

## ref() {#ref}

Nhận một giá trị bên trong và trả về một đối tượng ref phản ứng và có thể thay đổi, có một thuộc tính duy nhất `.value` trỏ đến giá trị bên trong.

- **Type**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **Details**

  Đối tượng ref có thể thay đổi - tức là bạn có thể gán giá trị mới cho `.value`. Nó cũng có tính phản ứng - tức là mọi thao tác đọc `.value` đều được theo dõi, và các thao tác ghi sẽ kích hoạt các hiệu ứng liên quan.

  Nếu một đối tượng được gán làm giá trị của ref, đối tượng đó sẽ được biến đổi thành phản ứng sâu với [reactive()](#reactive). Điều này cũng có nghĩa là nếu đối tượng chứa các ref lồng nhau, chúng sẽ được unwrap sâu.

  Để tránh chuyển đổi sâu, hãy sử dụng [`shallowRef()`](./reactivity-advanced#shallowref) thay thế.

- **Example**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value = 1
  console.log(count.value) // 1
  ```

- **Xem thêm**
  - [Guide - Reactivity Fundamentals with `ref()`](/guide/essentials/reactivity-fundamentals#ref)
  - [Guide - Typing `ref()`](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

## computed() {#computed}

Nhận một [getter function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) và trả về một đối tượng [ref](#ref) phản ứng chỉ đọc cho giá trị trả về từ getter. Nó cũng có thể nhận một đối tượng với các hàm `get` và `set` để tạo một đối tượng ref có thể ghi.

- **Type**

  ```ts
  // read-only
  function computed<T>(
    getter: (oldValue: T | undefined) => T,
    // xem liên kết "Computed Debugging" bên dưới
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // writable
  function computed<T>(
    options: {
      get: (oldValue: T | undefined) => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **Example**

  Tạo một computed ref chỉ đọc:

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // error
  ```

  Tạo một computed ref có thể ghi:

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  Debug:

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Xem thêm**
  - [Guide - Computed Properties](/guide/essentials/computed)
  - [Guide - Computed Debugging](/guide/extras/reactivity-in-depth#computed-debugging)
  - [Guide - Typing `computed()`](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />
  - [Guide - Performance - Computed Stability](/guide/best-practices/performance#computed-stability)

## reactive() {#reactive}

Trả về một proxy phản ứng của đối tượng.

- **Type**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **Details**

  Chuyển đổi phản ứng là "sâu": nó ảnh hưởng đến tất cả các thuộc tính lồng nhau. Một đối tượng phản ứng cũng unwrap sâu bất kỳ thuộc tính nào là [refs](#ref) trong khi duy trì tính phản ứng.

  Cũng cần lưu ý rằng không có unwrap ref nào được thực hiện khi ref được truy cập dưới dạng phần tử của một mảng phản ứng hoặc kiểu collection native như `Map`.

  Để tránh chuyển đổi sâu và chỉ giữ tính phản ứng ở mức gốc, hãy sử dụng [shallowReactive()](./reactivity-advanced#shallowreactive) thay thế.

  Đối tượng trả về và các đối tượng lồng nhau của nó được bọc bằng [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) và **không** bằng với các đối tượng gốc. Được khuyến nghị chỉ làm việc với proxy phản ứng và tránh dựa vào đối tượng gốc.

- **Example**

  Tạo một đối tượng phản ứng:

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  Ref unwrapping:

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // ref sẽ được unwrap
  console.log(obj.count === count.value) // true

  // nó sẽ cập nhật `obj.count`
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // nó cũng sẽ cập nhật ref `count`
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```

  Lưu ý rằng refs **không** được unwrap khi được truy cập dưới dạng phần tử mảng hoặc collection:

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // cần .value ở đây
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // cần .value ở đây
  console.log(map.get('count').value)
  ```

  Khi gán một [ref](#ref) cho một thuộc tính `reactive`, ref đó cũng sẽ được tự động unwrap:

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **Xem thêm**
  - [Guide - Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals)
  - [Guide - Typing `reactive()`](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## readonly() {#readonly}

Nhận một đối tượng (phản ứng hoặc thường) hoặc một [ref](#ref) và trả về một proxy chỉ đọc đến bản gốc.

- **Type**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **Details**

  Proxy chỉ đọc là sâu: bất kỳ thuộc tính lồng nào được truy cập cũng sẽ chỉ đọc. Nó cũng có hành vi unwrap ref giống như `reactive()`, ngoại trừ các giá trị được unwrap cũng sẽ được biến thành chỉ đọc.

  Để tránh chuyển đổi sâu, hãy sử dụng [shallowReadonly()](./reactivity-advanced#shallowreadonly) thay thế.

- **Example**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // hoạt động cho theo dõi phản ứng
    console.log(copy.count)
  })

  // thay đổi bản gốc sẽ kích hoạt các watcher dựa vào bản sao
  original.count++

  // thay đổi bản sao sẽ thất bại và dẫn đến cảnh báo
  copy.count++ // warning!
  ```

## watchEffect() {#watcheffect}

Chạy một hàm ngay lập tức trong khi theo dõi phản ứng các phụ thuộc của nó và chạy lại nó bất cứ khi nào các phụ thuộc thay đổi.

- **Type**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): WatchHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // mặc định: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  interface WatchHandle {
    (): void // có thể gọi, giống như `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Details**

  Đối số đầu tiên là hàm effect để chạy. Hàm effect nhận một hàm có thể được sử dụng để đăng ký callback dọn dẹp. Callback dọn dẹp sẽ được gọi ngay trước lần tiếp theo effect được chạy lại, và có thể được sử dụng để dọn dẹp các side effect không còn hợp lệ, ví dụ: một request async đang chờ (xem ví dụ bên dưới).

  Đối số thứ hai là một đối tượng tùy chọn tùy ý có thể được sử dụng để điều chỉnh thời điểm flush của effect hoặc để debug các phụ thuộc của effect.

  Theo mặc định, watcher sẽ chạy ngay trước khi component render. Thiết lập `flush: 'post'` sẽ trì hoãn watcher cho đến sau khi component render. Xem [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) để biết thêm thông tin. Trong các trường hợp hiếm, có thể cần kích hoạt watcher ngay lập tức khi một phụ thuộc phản ứng thay đổi, ví dụ: để vô hiệu hóa cache. Điều này có thể đạt được bằng cách sử dụng `flush: 'sync'`. Tuy nhiên, cài đặt này nên được sử dụng thận trọng, vì nó có thể dẫn đến các vấn đề về hiệu suất và tính nhất quán của dữ liệu nếu nhiều thuộc tính đang được cập nhật cùng lúc.

  Giá trị trả về là một hàm handle có thể được gọi để ngăn effect chạy lại.

- **Example**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> logs 0

  count.value++
  // -> logs 1
  ```

  Dừng watcher:

  ```js
  const stop = watchEffect(() => {})

  // khi watcher không còn cần thiết:
  stop()
  ```

  Tạm dừng / tiếp tục watcher: <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watchEffect(() => {})

  // tạm dừng watcher
  pause()

  // tiếp tục sau đó
  resume()

  // dừng
  stop()
  ```

  Dọn dẹp side effect:

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` sẽ được gọi nếu `id` thay đổi, hủy
    // request trước đó nếu nó chưa hoàn thành
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Dọn dẹp side effect trong 3.5+:

  ```js
  import { onWatcherCleanup } from 'vue'

  watchEffect(async () => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` sẽ được gọi nếu `id` thay đổi, hủy
    // request trước đó nếu nó chưa hoàn thành
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

  Tùy chọn:

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Xem thêm**
  - [Guide - Watchers](/guide/essentials/watchers#watcheffect)
  - [Guide - Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging)

## watchPostEffect() {#watchposteffect}

Bí danh của [`watchEffect()`](#watcheffect) với tùy chọn `flush: 'post'`.

## watchSyncEffect() {#watchsynceffect}

Bí danh của [`watchEffect()`](#watcheffect) với tùy chọn `flush: 'sync'`.

## watch() {#watch}

Theo dõi một hoặc nhiều nguồn dữ liệu phản ứng và gọi một hàm callback khi các nguồn thay đổi.

- **Type**

  ```ts
  // theo dõi nguồn đơn
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): WatchHandle

  // theo dõi nhiều nguồn
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): WatchHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // getter
    | (T extends object ? T : never) // reactive object

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // mặc định: false
    deep?: boolean | number // mặc định: false
    flush?: 'pre' | 'post' | 'sync' // mặc định: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    once?: boolean // mặc định: false (3.4+)
  }

  interface WatchHandle {
    (): void // có thể gọi, giống như `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

  > Types được đơn giản hóa để dễ đọc.

- **Details**

  `watch()` theo mặc định là lười - tức là callback chỉ được gọi khi nguồn được theo dõi đã thay đổi.

  Đối số đầu tiên là **nguồn** của watcher. Nguồn có thể là một trong các sau:

  - Một hàm getter trả về một giá trị
  - Một ref
  - Một đối tượng phản ứng
  - ...hoặc một mảng của các trên.

  Đối số thứ hai là callback sẽ được gọi khi nguồn thay đổi. Callback nhận ba đối số: giá trị mới, giá trị cũ, và một hàm để đăng ký callback dọn dẹp side effect. Callback dọn dẹp sẽ được gọi ngay trước lần tiếp theo effect được chạy lại, và có thể được sử dụng để dọn dẹp các side effect không còn hợp lệ, ví dụ: một request async đang chờ.

  Khi theo dõi nhiều nguồn, callback nhận hai mảng chứa giá trị mới / cũ tương ứng với mảng nguồn.

  Đối số thứ ba tùy chọn là một đối tượng tùy chọn hỗ trợ các tùy chọn sau:

  - **`immediate`**: kích hoạt callback ngay lập tức khi tạo watcher. Giá trị cũ sẽ là `undefined` trong lần gọi đầu tiên.
  - **`deep`**: ép buộc duyệt sâu nguồn nếu nó là một đối tượng, để callback kích hoạt trên các thay đổi sâu. Trong 3.5+, điều này cũng có thể là một số chỉ định độ sâu duyệt tối đa. Xem [Deep Watchers](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: điều chỉnh thời điểm flush của callback. Xem [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) và [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: debug các phụ thuộc của watcher. Xem [Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging).
  - **`once`**: (3.4+) chạy callback chỉ một lần. Watcher tự động dừng sau lần chạy callback đầu tiên.

  So với [`watchEffect()`](#watcheffect), `watch()` cho phép chúng ta:

  - Thực hiện side effect một cách lười biếng;
  - Cụ thể hơn về trạng thái nào nên kích hoạt watcher chạy lại;
  - Truy cập cả giá trị trước và hiện tại của trạng thái được theo dõi.

- **Example**

  Theo dõi một getter:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  Theo dõi một ref:

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  Khi theo dõi nhiều nguồn, callback nhận các mảng chứa giá trị mới / cũ tương ứng với mảng nguồn:

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  Khi sử dụng nguồn getter, watcher chỉ kích hoạt nếu giá trị trả về của getter đã thay đổi. Nếu bạn muốn callback kích hoạt ngay cả trên các thay đổi sâu, bạn cần ép buộc watcher vào chế độ sâu với `{ deep: true }`. Lưu ý trong chế độ sâu, giá trị mới và giá trị cũ sẽ là cùng một đối tượng nếu callback được kích hoạt bởi một thay đổi sâu:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```

  Khi theo dõi trực tiếp một đối tượng phản ứng, watcher tự động ở chế độ sâu:

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* kích hoạt trên thay đổi sâu của state */
  })
  ```

  `watch()` chia sẻ cùng thời điểm flush và tùy chọn debug với [`watchEffect()`](#watcheffect):

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  Dừng watcher:

  ```js
  const stop = watch(source, callback)

  // khi watcher không còn cần thiết:
  stop()
  ```

  Tạm dừng / tiếp tục watcher: <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watch(() => {})

  // tạm dừng watcher
  pause()

  // tiếp tục sau đó
  resume()

  // dừng
  stop()
  ```

  Dọn dẹp side effect:

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` sẽ được gọi nếu `id` thay đổi, hủy
    // request trước đó nếu nó chưa hoàn thành
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Dọn dẹp side effect trong 3.5+:

  ```js
  import { onWatcherCleanup } from 'vue'

  watch(id, async (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

- **Xem thêm**

  - [Guide - Watchers](/guide/essentials/watchers)
  - [Guide - Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging)

## onWatcherCleanup() <sup class="vt-badge" data-text="3.5+" /> {#onwatchercleanup}

Đăng ký một hàm dọn dẹp để thực thi khi watcher hiện tại sắp chạy lại. Chỉ có thể được gọi trong quá trình thực thi đồng bộ của hàm effect `watchEffect` hoặc hàm callback `watch` (tức là nó không thể được gọi sau một câu lệnh `await` trong một hàm async.)

- **Type**

  ```ts
  function onWatcherCleanup(
    cleanupFn: () => void,
    failSilently?: boolean
  ): void
  ```

- **Example**

  ```ts
  import { watch, onWatcherCleanup } from 'vue'

  watch(id, (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` sẽ được gọi nếu `id` thay đổi, hủy
    // request trước đó nếu nó chưa hoàn thành
    onWatcherCleanup(cancel)
  })
  ```

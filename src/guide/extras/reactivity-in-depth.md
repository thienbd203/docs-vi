---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# Tìm hiểu sâu về Tính phản ứng {#reactivity-in-depth}

Một trong những tính năng đặc biệt nhất của Vue là hệ thống tính phản ứng không xâm nhập. Trạng thái của component bao gồm các đối tượng JavaScript phản ứng. Khi bạn sửa đổi chúng, giao diện sẽ được cập nhật. Điều này giúp quản lý state trở nên đơn giản và trực quan, nhưng cũng rất quan trọng để hiểu cách nó hoạt động nhằm tránh một số lỗi phổ biến. Trong phần này, chúng ta sẽ đi sâu vào một số chi tiết cấp thấp hơn của hệ thống tính phản ứng của Vue.

## Tính phản ứng là gì? {#what-is-reactivity}

Thuật ngữ này xuất hiện trong lập trình khá nhiều ngày nay, nhưng mọi người có ý gì khi nói về nó? Tính phản ứng là một mô hình lập trình cho phép chúng ta thích ứng với các thay đổi theo cách khai báo. Ví dụ kinh điển mà mọi người thường hiển thị, vì nó rất hay, là một bảng tính Excel:

<SpreadSheet />

Ở đây ô A2 được định nghĩa bằng công thức `= A0 + A1` (bạn có thể nhấp vào A2 để xem hoặc chỉnh sửa công thức), vì vậy bảng tính cho chúng ta kết quả là 3. Không có gì bất ngờ ở đây. Nhưng nếu bạn cập nhật A0 hoặc A1, bạn sẽ nhận thấy rằng A2 cũng tự động cập nhật theo.

JavaScript thường không hoạt động như vậy. Nếu chúng ta viết một cái tương tự trong JavaScript:

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // Still 3
```

Khi chúng ta thay đổi `A0`, `A2` không tự động thay đổi.

Vậy làm thế nào để chúng ta làm điều này trong JavaScript? Đầu tiên, để chạy lại code cập nhật `A2`, hãy bọc nó trong một hàm:

```js
let A2

function update() {
  A2 = A0 + A1
}
```

Sau đó, chúng ta cần định nghĩa một số thuật ngữ:

- Hàm `update()` tạo ra một **side effect**, hoặc gọi tắt là **effect**, vì nó sửa đổi trạng thái của chương trình.

- `A0` và `A1` được coi là **dependencies** (phụ thuộc) của effect, vì giá trị của chúng được sử dụng để thực hiện effect. Effect được gọi là **subscriber** (người đăng ký) của các dependencies đó.

Những gì chúng ta cần là một hàm ma thuật có thể gọi `update()` (the **effect**) bất cứ khi nào `A0` hoặc `A1` (the **dependencies**) thay đổi:

```js
whenDepsChange(update)
```

Hàm `whenDepsChange()` này có các nhiệm vụ sau:

1. Theo dõi khi một biến được đọc. Ví dụ: khi đánh giá biểu thức `A0 + A1`, cả `A0` và `A1` đều được đọc.

2. Nếu một biến được đọc khi có một effect đang chạy, hãy biến effect đó thành subscriber của biến đó. Ví dụ: vì `A0` và `A1` được đọc khi `update()` đang được thực thi, `update()` trở thành subscriber của cả `A0` và `A1` sau lần gọi đầu tiên.

3. Phát hiện khi một biến bị thay đổi. Ví dụ: khi `A0` được gán một giá trị mới, thông báo cho tất cả các effect subscriber của nó để chạy lại.

## Tính phản ứng hoạt động trong Vue như thế nào {#how-reactivity-works-in-vue}

Chúng ta không thực sự có thể theo dõi việc đọc và ghi các biến cục bộ như trong ví dụ. Không có cơ chế nào để làm điều đó trong JavaScript thuần. Những gì chúng ta **có thể** làm là chặn việc đọc và ghi các **thuộc tính đối tượng**.

Có hai cách để chặn truy cập thuộc tính trong JavaScript: [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) / [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) và [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Vue 2 chỉ sử dụng getter / setters do hạn chế về hỗ trợ trình duyệt. Trong Vue 3, Proxies được sử dụng cho các đối tượng phản ứng và getter / setters được sử dụng cho refs. Đây là một số pseudo-code minh họa cách chúng hoạt động:

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip
Các đoạn code ở đây và dưới đây nhằm giải thích các khái niệm cốt lõi ở dạng đơn giản nhất, vì vậy nhiều chi tiết bị bỏ qua và các trường hợp đặc biệt bị bỏ qua.
:::

Điều này giải thích một số [hạn chế của các đối tượng phản ứng](/guide/essentials/reactivity-fundamentals#limitations-of-reactive) mà chúng ta đã thảo luận trong phần cơ bản:

- Khi bạn gán hoặc destructuring một thuộc tính của đối tượng phản ứng cho một biến cục bộ, việc truy cập hoặc gán cho biến đó là không phản ứng vì nó không còn kích hoạt các trap get / set của proxy trên đối tượng nguồn. Lưu ý rằng sự "ngắt kết nối" này chỉ ảnh hưởng đến ràng buộc biến - nếu biến trỏ đến một giá trị không nguyên thủy như một đối tượng, việc thay đổi đối tượng đó vẫn sẽ phản ứng.

- Proxy được trả về từ `reactive()`, mặc dù hoạt động giống hệt như bản gốc, có một định danh khác nếu chúng ta so sánh nó với bản gốc bằng toán tử `===`.

Bên trong `track()`, chúng ta kiểm tra xem có effect nào đang chạy không. Nếu có, chúng ta tra cứu các effect subscriber (được lưu trữ trong một Set) cho thuộc tính đang được theo dõi, và thêm effect vào Set đó:

```js
// Điều này sẽ được đặt ngay trước khi một effect
// sắp chạy. Chúng ta sẽ xử lý điều này sau.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

Các subscription effect được lưu trữ trong một cấu trúc dữ liệu toàn cục `WeakMap<target, Map<key, Set<effect>>>`. Nếu không tìm thấy Set effect subscriber nào cho một thuộc tính (được theo dõi lần đầu tiên), nó sẽ được tạo. Đây là những gì hàm `getSubscribersForProperty()` làm, tóm tắt là vậy. Để đơn giản, chúng ta sẽ bỏ qua chi tiết của nó.

Bên trong `trigger()`, chúng ta lại tra cứu các effect subscriber cho thuộc tính. Nhưng lần này chúng ta gọi chúng thay vì:

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

Bây giờ hãy quay lại hàm `whenDepsChange()`:

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

Nó bọc hàm `update` thô trong một effect tự đặt mình làm effect hoạt động hiện tại trước khi chạy cập nhật thực tế. Điều này cho phép các lệnh gọi `track()` trong quá trình cập nhật định vị được effect hoạt động hiện tại.

Tại thời điểm này, chúng ta đã tạo ra một effect tự động theo dõi các dependencies của nó và chạy lại bất cứ khi nào một dependency thay đổi. Chúng ta gọi đây là **Reactive Effect**.

Vue cung cấp một API cho phép bạn tạo các effect phản ứng: [`watchEffect()`](/api/reactivity-core#watcheffect). Thực tế, bạn có thể nhận thấy rằng nó hoạt động khá giống với `whenDepsChange()` ma thuật trong ví dụ. Bây giờ chúng ta có thể viết lại ví dụ gốc bằng các API Vue thực tế:

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // tracks A0 and A1
  A2.value = A0.value + A1.value
})

// triggers the effect
A0.value = 2
```

Sử dụng một effect phản ứng để thay đổi một ref không phải là trường hợp sử dụng thú vị nhất - thực tế, sử dụng một computed property làm cho nó mang tính khai báo hơn:

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

Bên trong, `computed` quản lý việc vô hiệu hóa và tính toán lại của nó bằng một effect phản ứng.

Vậy ví dụ về một effect phản ứng phổ biến và hữu ích là gì? Chà, cập nhật DOM! Chúng ta có thể triển khai "reactive rendering" đơn giản như sau:

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `Count is: ${count.value}`
})

// updates the DOM
count.value++
```

Thực tế, điều này khá gần với cách một component Vue giữ cho state và DOM đồng bộ - mỗi instance component tạo ra một effect phản ứng để render và cập nhật DOM. Tất nhiên, các component Vue sử dụng các cách hiệu quả hơn nhiều để cập nhật DOM so với `innerHTML`. Điều này được thảo luận trong [Cơ chế Render](./rendering-mechanism).

<div class="options-api">

Các API `ref()`, `computed()` và `watchEffect()` đều là một phần của Composition API. Nếu bạn chỉ sử dụng Options API với Vue cho đến nay, bạn sẽ nhận thấy rằng Composition API gần hơn với cách hệ thống tính phản ứng của Vue hoạt động bên dưới. Thực tế, trong Vue 3, Options API được triển khai dựa trên Composition API. Tất cả các truy cập thuộc tính trên instance component (`this`) kích hoạt getter / setters để theo dõi tính phản ứng, và các tùy chọn như `watch` và `computed` gọi các tương đương Composition API của chúng bên trong.

</div>

## Tính phản ứng Runtime vs Compile-time {#runtime-vs-compile-time-reactivity}

Hệ thống tính phản ứng của Vue chủ yếu dựa trên runtime: việc theo dõi và kích hoạt đều được thực hiện trong khi code chạy trực tiếp trong trình duyệt. Lợi ích của tính phản ứng runtime là nó có thể hoạt động mà không cần bước build, và có ít trường hợp đặc biệt hơn. Mặt khác, điều này làm cho nó bị hạn chế bởi các hạn chế cú pháp của JavaScript, dẫn đến nhu cầu các container giá trị như Vue refs.

Một số framework, chẳng hạn như [Svelte](https://svelte.dev/), chọn để vượt qua các hạn chế này bằng cách triển khai tính phản ứng trong quá trình biên dịch. Nó phân tích và chuyển đổi code để mô phỏng tính phản ứng. Bước biên dịch cho phép framework thay đổi ngữ nghĩa của chính JavaScript - ví dụ: ngầm chèn code thực hiện phân tích dependency và kích hoạt effect xung quanh việc truy cập các biến được định nghĩa cục bộ. Nhược điểm là các chuyển đổi như vậy yêu cầu bước build, và thay đổi ngữ nghĩa JavaScript về cơ bản là tạo ra một ngôn ngữ trông giống JavaScript nhưng biên dịch thành một cái gì đó khác.

Đội ngũ Vue đã khám phá hướng này thông qua một tính năng thử nghiệm gọi là [Reactivity Transform](/guide/extras/reactivity-transform), nhưng cuối cùng chúng tôi đã quyết định rằng nó sẽ không phù hợp với dự án do [lý do tại đây](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

## Debug Tính phản ứng {#reactivity-debugging}

Tuyệt vời khi hệ thống tính phản ứng của Vue tự động theo dõi các dependencies, nhưng trong một số trường hợp chúng ta có thể muốn tìm hiểu chính xác những gì đang được theo dõi, hoặc điều gì đang khiến một component render lại.

### Hooks Debug Component {#component-debugging-hooks}

Chúng ta có thể debug các dependencies được sử dụng trong quá trình render của một component và dependency nào đang kích hoạt cập nhật bằng cách sử dụng các lifecycle hook <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> và <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span>. Cả hai hook đều sẽ nhận được một sự kiện debugger chứa thông tin về dependency đang được hỏi. Khuyến nghị đặt câu lệnh `debugger` trong các callback để kiểm tra dependency một cách tương tác:

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip
Hook debug component chỉ hoạt động trong chế độ phát triển.
:::

Các đối tượng sự kiện debug có kiểu sau:

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### Debug Computed {#computed-debugging}

<!-- TODO options API equivalent -->

Chúng ta có thể debug các computed property bằng cách chuyển cho `computed()` một đối tượng tùy chọn thứ hai với các callback `onTrack` và `onTrigger`:

- `onTrack` sẽ được gọi khi một thuộc tính phản ứng hoặc ref được theo dõi như một dependency.

- `onTrigger` sẽ được gọi khi callback watcher được kích hoạt bởi sự thay đổi của một dependency.

Cả hai callback đều sẽ nhận được các sự kiện debugger trong [cùng định dạng](#debugger-event) với các hook debug component:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // triggered when count.value is tracked as a dependency
    debugger
  },
  onTrigger(e) {
    // triggered when count.value is mutated
    debugger
  }
})

// access plusOne, should trigger onTrack
console.log(plusOne.value)

// mutate count.value, should trigger onTrigger
count.value++
```

:::tip
Các tùy chọn computed `onTrack` và `onTrigger` chỉ hoạt động trong chế độ phát triển.
:::

### Debug Watcher {#watcher-debugging}

<!-- TODO options API equivalent -->

Tương tự như `computed()`, các watcher cũng hỗ trợ các tùy chọn `onTrack` và `onTrigger`:

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
Các tùy chọn watcher `onTrack` và `onTrigger` chỉ hoạt động trong chế độ phát triển.
:::

## Tích hợp với Hệ thống State Bên ngoài {#integration-with-external-state-systems}

Hệ thống tính phản ứng của Vue hoạt động bằng cách chuyển đổi sâu các đối tượng JavaScript thuần thành các proxy phản ứng. Việc chuyển đổi sâu có thể không cần thiết hoặc đôi khi không mong muốn khi tích hợp với các hệ thống quản lý state bên ngoài (ví dụ: nếu một giải pháp bên ngoài cũng sử dụng Proxies).

Ý tưởng chung của việc tích hợp hệ thống tính phản ứng của Vue với một giải pháp quản lý state bên ngoài là giữ state bên ngoài trong một [`shallowRef`](/api/reactivity-advanced#shallowref). Một shallow ref chỉ phản ứng khi thuộc tính `.value` của nó được truy cập - giá trị bên trong được giữ nguyên. Khi state bên ngoài thay đổi, thay thế giá trị ref để kích hoạt cập nhật.

### Dữ liệu Bất biến {#immutable-data}

Nếu bạn đang triển khai tính năng undo / redo, bạn có thể muốn chụp ảnh trạng thái của ứng dụng trên mỗi lần chỉnh sửa của người dùng. Tuy nhiên, hệ thống tính phản ứng có thể thay đổi của Vue không phù hợp nhất cho điều này nếu cây trạng thái lớn, vì việc tuần tự hóa toàn bộ đối tượng trạng thái trên mỗi lần cập nhật có thể tốn kém về cả chi phí CPU và bộ nhớ.

[Cấu trúc dữ liệu bất biến](https://en.wikipedia.org/wiki/Persistent_data_structure) giải quyết điều này bằng cách không bao giờ thay đổi các đối tượng trạng thái - thay vào đó, nó tạo ra các đối tượng mới chia sẻ các phần giống nhau, không thay đổi với các đối tượng cũ. Có nhiều cách khác nhau để sử dụng dữ liệu bất biến trong JavaScript, nhưng chúng tôi khuyến nghị sử dụng [Immer](https://immerjs.github.io/immer/) với Vue vì nó cho phép bạn sử dụng dữ liệu bất biến trong khi giữ cú pháp có thể thay đổi, thuận tiện hơn.

Chúng ta có thể tích hợp Immer với Vue thông qua một composable đơn giản:

```js
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Thử trong Playground](https://play.vuejs.org/#eNp9VMFu2zAM/RXNl6ZAYnfoTlnSdRt66DBsQ7vtEuXg2YyjRpYEUU5TBPn3UZLtuE1RH2KLfCIfycfsk8/GpNsGkmkyw8IK4xiCa8wVV6I22jq2Zw3CbV2DZQe2srpmZ2km/PmMK8a4KrRCxxbCQY1j1pgyd3DrD0s27++OFh689z/0OOEkTBlPvkNuFfvbAE/Gra/UilzOko0Mh2A+ufcHwd9ij8KtWUjwMsAqlxgjcLU854qrVaMKJ7RiTleVDBRHQpWwO4/xB8xHoRg2v+oyh/MioJepT0ClvTsxhnSUi1LOsthN6iMdCGgkBacTY7NGhjd9ScG2k5W2c56M9rG6ceBPdbOWm1AxO0/a+uiZFjJHpFv7Fj10XhdSFBtyntTJkzaxf/ZtQnYguoFNJkUkmAWGs2xAm47onqT/jPWHxjjYuUkJhba57+yUSaFg4tZWN9X6Y9eIcC8ZJ1FQkzo36QNqRZILQXjroAqnXb+9LQzVD3vtnMFpljXKbKq00HWU3/X7i/QivcxKgS5aUglVXjxNAGvK8KnWZSNJWa0KDoGChzmk3L28jSVcQX1o1d1puwfgOpdSP97BqsfQxhCCK9gFTC+tXu7/coR7R71rxRWXBL2FpHOMOAAeYVGJhBvFL3s+kGKIkW5zSfKfd+RHA2u3gzZEpML9y9JS06YtAq5DLFmOMWXsjkM6rET1YjzUcSMk2J/G1/h8TKGOb8HmV7bdQbqzhmLziv0Bd3Govywg2O1x8Umvua3ARffN/Q/S1sDZDfMN5x2glo3nGGFfGlUS7QEusL0NcxWq+o03OwcKu6Ke/+fwhIb89Y3Sj3Qv0w+9xg7/AWfvyMs=)

### State Machines {#state-machines}

[State Machine](https://en.wikipedia.org/wiki/Finite-state_machine) là một mô hình để mô tả tất cả các trạng thái có thể mà một ứng dụng có thể ở, và tất cả các cách có thể để chuyển từ trạng thái này sang trạng thái khác. Mặc dù có thể quá mức cần thiết cho các component đơn giản, nó có thể giúp làm cho các luồng trạng thái phức tạp trở nên mạnh mẽ và dễ quản lý hơn.

Một trong các triển khai state machine phổ biến nhất trong JavaScript là [XState](https://xstate.js.org/). Đây là một composable tích hợp với nó:

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[Thử trong Playground](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGvGrqk8SBSzQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVdept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFaYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M=)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) là một thư viện để làm việc với các luồng sự kiện bất đồng bộ. Thư viện [VueUse](https://vueuse.org/) cung cấp add-on [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) để kết nối các luồng RxJS với hệ thống tính phản ứng của Vue.

## Kết nối với Signals {#connection-to-signals}

Khá nhiều framework khác đã giới thiệu các nguyên thủy tính phản ứng tương tự như refs từ Composition API của Vue, dưới thuật ngữ "signals":

- [Solid Signals](https://docs.solidjs.com/concepts/signals)
- [Angular Signals](https://angular.dev/guide/signals)
- [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [Qwik Signals](https://qwik.builder.io/docs/components/state/#usesignal)

Về cơ bản, signals là cùng một loại nguyên thủy tính phản ứng như Vue refs. Nó là một container giá trị cung cấp theo dõi dependency khi truy cập, và kích hoạt side-effect khi thay đổi. Mô hình dựa trên nguyên thủy tính phản ứng này không phải là một khái niệm đặc biệt mới trong thế giới frontend: nó có từ các triển khai như [Knockout observables](https://knockoutjs.com/documentation/observables.html) và [Meteor Tracker](https://docs.meteor.com/api/tracker.html) từ hơn một thập kỷ trước. Vue Options API và thư viện quản lý state React [MobX](https://mobx.js.org/) cũng dựa trên cùng các nguyên tắc, nhưng ẩn các nguyên thủy đằng sau các thuộc tính đối tượng.

Mặc dù không phải là một đặc điểm cần thiết để một thứ được coi là signals, ngày nay khái niệm này thường được thảo luận cùng với mô hình render trong đó các cập nhật được thực hiện thông qua các subscription chi tiết. Do việc sử dụng Virtual DOM, Vue hiện tại [dựa vào các trình biên dịch để đạt được các tối ưu hóa tương tự](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom). Tuy nhiên, chúng tôi cũng đang khám phá một chiến lược biên dịch mới lấy cảm hứng từ Solid, được gọi là [Vapor Mode](https://github.com/vuejs/core-vapor), không dựa vào Virtual DOM và tận dụng nhiều hơn hệ thống tính phản ứng tích hợp của Vue.

### Sự đánh đổi trong Thiết kế API {#api-design-trade-offs}

Thiết kế của signals của Preact và Qwik rất giống với [shallowRef](/api/reactivity-advanced#shallowref) của Vue: cả ba đều cung cấp một giao diện có thể thay đổi thông qua thuộc tính `.value`. Chúng tôi sẽ tập trung thảo luận về signals của Solid và Angular.

#### Solid Signals {#solid-signals}

Thiết kế API `createSignal()` của Solid nhấn mạnh sự tách biệt đọc / ghi. Signals được expose dưới dạng getter chỉ đọc và một setter riêng biệt:

```js
const [count, setCount] = createSignal(0)

count() // access the value
setCount(1) // update the value
```

Lưu ý cách signal `count` có thể được chuyển xuống mà không cần setter. Điều này đảm bảo rằng state không bao giờ có thể bị thay đổi trừ khi setter cũng được expose rõ ràng. Việc đảm bảo an toàn này có biện minh cho cú pháp dài dòng hơn hay không có thể phụ thuộc vào yêu cầu của dự án và sở thích cá nhân - nhưng nếu bạn thích kiểu API này, bạn có thể dễ dàng sao chép nó trong Vue:

```js
import { shallowRef, triggerRef } from 'vue'

export function createSignal(value, options) {
  const r = shallowRef(value)
  const get = () => r.value
  const set = (v) => {
    r.value = typeof v === 'function' ? v(r.value) : v
    if (options?.equals === false) triggerRef(r)
  }
  return [get, set]
}
```

[Thử trong Playground](https://play.vuejs.org/#eNpdUk1TgzAQ/Ss7uQAjgr12oNXxH+ix9IAYaDQkMV/qMPx3N6G0Uy9Msu/tvn2PTORJqcI7SrakMp1myoKh1qldI9iopLYwQadpa+krG0TLYYZeyxGSojSSs/d7E8vFh0ka0YhOCmPh0EknbB4mPYfTEeqbIelD1oiqXPRQCS+WjoojAW8A1Wmzm1A39KYZzHNVYiUib85aKeCx46z7rBuySqQe6h14uINN1pDIBWACVUcqbGwtl17EqvIiR3LyzwcmcXFuTi3n8vuF9jlYzYaBajxfMsDcomv6E/m9E51luN2NV99yR3OQKkAmgykss+SkMZerxMLEZFZ4oBYJGAA600VEryAaD6CPaJwJKwnr9ldR2WMedV1Dsi6WwB58emZlsAV/zqmH9LzfvqBfruUmNvZ4QN7VearjenP4aHwmWsABt4x/+tiImcx/z27Jqw==)

#### Angular Signals {#angular-signals}

Angular đang trải qua một số thay đổi cơ bản bằng cách bỏ qua dirty-checking và giới thiệu triển khai riêng của một nguyên thủy tính phản ứng. API Angular Signal trông như sau:

```js
const count = signal(0)

count() // access the value
count.set(1) // set new value
count.update((v) => v + 1) // update based on previous value
```

Một lần nữa, chúng ta có thể dễ dàng sao chép API trong Vue:

```js
import { shallowRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  return s
}
```

[Thử trong Playground](https://play.vuejs.org/#eNp9Ul1v0zAU/SuWX9ZCSRh7m9IKGHuAB0AD8WQJZclt6s2xLX+ESlH+O9d2krbr1Df7nnPu17k9/aR11nmgt7SwleHaEQvO6w2TvNXKONITyxtZihWpVKu9g5oMZGtUS66yvJSNF6V5lyjZk71ikslKSeuQ7qUj61G+eL+cgFr5RwGITAkXiyVZb5IAn2/IB+QWeeoHO8GPg1aL0gH+CCl215u7mJ3bW9L3s3IYihyxifMlFRpJqewL1qN3TknysRK8el4zGjNlXtdYa9GFrjryllwvGY18QrisDLQgXZTnSX8pF64zzD7pDWDghbbI5/Hoip7tFL05eLErhVD/HmB75Edpyd8zc9DUaAbso3TrZeU4tjfawSV3vBR/SuFhSfrQUXLHBMvmKqe8A8siK7lmsi5gAbJhWARiIGD9hM7BIfHSgjGaHljzlDyGF2MEPQs6g5dpcAIm8Xs+2XxODTgUn0xVYdJ5RxPhKOd4gdMsA/rgLEq3vEEHlEQPYrbgaqu5APNDh6KWUTyuZC2jcWvfYswZD6spXu2gen4l/mT3Icboz3AWpgNGZ8yVBttM8P2v77DH9wy2qvYC2RfAB7BK+NBjon32ssa2j3ix26/xsrhsftv7vQNpp6FCo4E5RD6jeE93F0Y/tHuT3URd2OLwHyXleRY=)

So với Vue refs, kiểu API dựa trên getter của Solid và Angular cung cấp một số sự đánh đổi thú vị khi sử dụng trong các component Vue:

- `()` ít dài dòng hơn `.value` một chút, nhưng việc cập nhật giá trị dài dòng hơn.

- Không có ref-unwrapping: việc truy cập giá trị luôn yêu cầu `()`. Điều này làm cho việc truy cập giá trị nhất quán ở mọi nơi. Điều này cũng có nghĩa là bạn có thể chuyển các signals thô xuống dưới dạng props của component.

Việc các kiểu API này có phù hợp với bạn hay không là chủ quan đến một mức độ nào đó. Mục tiêu của chúng tôi ở đây là chứng minh sự tương đồng cơ bản và sự đánh đổi giữa các thiết kế API khác nhau này. Chúng tôi cũng muốn cho thấy rằng Vue rất linh hoạt: bạn không thực sự bị khóa vào các API hiện có. Nếu cần thiết, bạn có thể tạo API nguyên thủy tính phản ứng của riêng mình để phù hợp với các nhu cầu cụ thể hơn.

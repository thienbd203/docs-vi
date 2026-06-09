---
outline: deep
---

# Cơ Bản Về Tính Phản Ứng {#reactivity-fundamentals}

:::tip Ưu Tiên API
Trang này và nhiều chương sau trong hướng dẫn này chứa nội dung khác nhau cho Options API và Composition API. Lựa chọn hiện tại của bạn là <span class="options-api">Options API</span><span class="composition-api">Composition API</span>. Bạn có thể chuyển đổi giữa các kiểu API bằng các công tắc "Ưu Tiên API" ở trên cùng của thanh bên trái.
:::

<div class="options-api">

## Khai Báo Trạng Thái Phản Ứng \* {#declaring-reactive-state}

Với Options API, chúng ta sử dụng tùy chọn `data` để khai báo trạng thái phản ứng của một component. Giá trị tùy chọn nên là một hàm trả về một đối tượng. Vue sẽ gọi hàm này khi tạo một thể hiện component mới, và bọc đối tượng trả về trong hệ thống phản ứng của nó. Mọi thuộc tính cấp cao nhất của đối tượng này được proxy trên thể hiện component (`this` trong các phương thức và lifecycle hooks):

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` là một lifecycle hook mà chúng ta sẽ giải thích sau
  mounted() {
    // `this` tham chiếu đến thể hiện component.
    console.log(this.count) // => 1

    // data cũng có thể được thay đổi
    this.count = 2
  }
}
```

[Thử trong Playground](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

Các thuộc tính thể hiện này chỉ được thêm khi thể hiện được tạo lần đầu tiên, vì vậy bạn cần đảm bảo tất cả chúng đều có mặt trong đối tượng được trả về bởi hàm `data`. Khi cần thiết, hãy sử dụng `null`, `undefined` hoặc một số giá trị giữ chỗ khác cho các thuộc tính mà giá trị mong muốn chưa có sẵn.

Có thể thêm một thuộc tính mới trực tiếp vào `this` mà không cần bao gồm nó trong `data`. Tuy nhiên, các thuộc tính được thêm theo cách này sẽ không thể kích hoạt cập nhật phản ứng.

Vue sử dụng tiền tố `$` khi expos các API tích hợp sẵn của nó thông qua thể hiện component. Nó cũng dành riêng tiền tố `_` cho các thuộc tính nội bộ. Bạn nên tránh sử dụng tên cho các thuộc tính `data` cấp cao nhất bắt đầu bằng một trong hai ký tự này.

### Proxy Phản Ứng vs. Gốc \* {#reactive-proxy-vs-original}

Trong Vue 3, data được tạo phản ứng bằng cách tận dụng [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Người dùng chuyển từ Vue 2 nên lưu ý trường hợp đặc biệt sau:

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

Khi bạn truy cập `this.someObject` sau khi gán nó, giá trị là một proxy phản ứng của `newObject` gốc. **Khác với Vue 2, `newObject` gốc được giữ nguyên và sẽ không được tạo phản ứng: hãy đảm bảo luôn truy cập trạng thái phản ứng như một thuộc tính của `this`.**

</div>

<div class="composition-api">

## Khai Báo Trạng Thái Phản Ứng \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

Trong Composition API, cách được khuyến nghị để khai báo trạng thái phản ứng là sử dụng hàm [`ref()`](/api/reactivity-core#ref):

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` nhận đối số và trả về nó được bọc trong một đối tượng ref với thuộc tính `.value`:

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> Xem thêm: [Typing Refs](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

Để truy cập refs trong template của một component, hãy khai báo và trả về chúng từ hàm `setup()` của component:

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup` là một hook đặc biệt dành cho Composition API.
  setup() {
    const count = ref(0)

    // expose ref cho template
    return {
      count
    }
  }
}
```

```vue-html
<div>{{ count }}</div>
```

Lưu ý rằng chúng ta **không** cần thêm `.value` khi sử dụng ref trong template. Để thuận tiện, refs được tự động unwrap khi sử dụng bên trong các template (với một số [lưu ý](#caveat-when-unwrapping-in-templates)).

Bạn cũng có thể thay đổi ref trực tiếp trong các event handler:

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

Đối với logic phức tạp hơn, chúng ta có thể khai báo các hàm thay đổi refs trong cùng phạm vi và expose chúng như các phương thức cùng với trạng thái:

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // .value cần thiết trong JavaScript
      count.value++
    }

    // đừng quên expose hàm cũng như.
    return {
      count,
      increment
    }
  }
}
```

Các phương thức được expose sau đó có thể được sử dụng như các event handler:

```vue-html{1}
<button @click="increment">
  {{ count }}
</button>
```

Đây là ví dụ trực tiếp trên [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo), không sử dụng bất kỳ công cụ build nào.

### `<script setup>` \*\* {#script-setup}

Việc expose thủ công trạng thái và phương thức thông qua `setup()` có thể dài dòng. May mắn thay, nó có thể tránh được khi sử dụng [Single-File Components (SFCs)](/guide/scaling-up/sfc). Chúng ta có thể đơn giản hóa việc sử dụng với `<script setup>`:

```vue{1}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

[Thử trong Playground](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)

Các import, biến và hàm cấp cao nhất được khai báo trong `<script setup>` tự động có thể sử dụng được trong template của cùng một component. Hãy coi template như một hàm JavaScript được khai báo trong cùng phạm vi - nó tự nhiên có quyền truy cập vào mọi thứ được khai báo cùng với nó.

:::tip
Đối với phần còn lại của hướng dẫn, chúng ta sẽ chủ yếu sử dụng cú pháp SFC + `<script setup>` cho các ví dụ mã Composition API, vì đó là cách sử dụng phổ biến nhất cho các nhà phát triển Vue.

Nếu bạn không sử dụng SFC, bạn vẫn có thể sử dụng Composition API với tùy chọn [`setup()`](/api/composition-api-setup).
:::

### Tại Sao Cần Refs? \*\* {#why-refs}

Bạn có thể tự hỏi tại sao chúng ta cần refs với `.value` thay vì các biến đơn giản. Để giải thích điều đó, chúng ta sẽ cần thảo luận ngắn gọn về cách hệ thống phản ứng của Vue hoạt động.

Khi bạn sử dụng ref trong một template, và thay đổi giá trị của ref sau đó, Vue tự động phát hiện thay đổi và cập nhật DOM tương ứng. Điều này có thể thực hiện được với hệ thống phản ứng dựa trên theo dõi phụ thuộc. Khi một component được render lần đầu tiên, Vue **theo dõi** mọi ref được sử dụng trong quá trình render. Sau đó, khi một ref bị thay đổi, nó sẽ **kích hoạt** render lại cho các component đang theo dõi nó.

Trong JavaScript tiêu chuẩn, không có cách nào để phát hiện việc truy cập hoặc thay đổi các biến đơn giản. Tuy nhiên, chúng ta có thể chặn các thao tác get và set của các thuộc tính đối tượng bằng các phương thức getter và setter.

Thuộc tính `.value` cho Vue cơ hội để phát hiện khi một ref được truy cập hoặc thay đổi. Bên dưới, Vue thực hiện theo dõi trong getter của nó, và thực hiện kích hoạt trong setter của nó. Về mặt khái niệm, bạn có thể coi ref như một đối tượng trông như sau:

```js
// mã giả, không phải triển khai thực tế
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

Một đặc điểm tốt khác của refs là không giống như các biến đơn giản, bạn có thể truyền refs vào các hàm trong khi vẫn giữ quyền truy cập vào giá trị mới nhất và kết nối phản ứng. Điều này đặc biệt hữu ích khi refactor logic phức tạp thành mã có thể tái sử dụng.

Hệ thống phản ứng được thảo luận chi tiết hơn trong phần [Reactivity in Depth](/guide/extras/reactivity-in-depth).
</div>

<div class="options-api">

## Khai Báo Phương Thức \* {#declaring-methods}

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="Free Vue.js Methods Lesson"/>

Để thêm phương thức vào một thể hiện component, chúng ta sử dụng tùy chọn `methods`. Nó nên là một đối tượng chứa các phương thức mong muốn:

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // phương thức có thể được gọi trong lifecycle hooks, hoặc các phương thức khác!
    this.increment()
  }
}
```

Vue tự động ràng buộc giá trị `this` cho `methods` để nó luôn tham chiếu đến thể hiện component. Điều này đảm bảo rằng một phương thức giữ giá trị `this` đúng nếu nó được sử dụng như một event listener hoặc callback. Bạn nên tránh sử dụng arrow functions khi định nghĩa `methods`, vì điều đó ngăn Vue ràng buộc giá trị `this` phù hợp:

```js
export default {
  methods: {
    increment: () => {
      // TỒI: không có quyền truy cập `this` ở đây!
    }
  }
}
```

Giống như tất cả các thuộc tính khác của thể hiện component, `methods` có thể truy cập được từ bên trong template của component. Bên trong template, chúng thường được sử dụng như các event listener:

```vue-html
<button @click="increment">{{ count }}</button>
```

[Thử trong Playground](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

Trong ví dụ trên, phương thức `increment` sẽ được gọi khi `<button>` được nhấp.

</div>

### Tính Phản Ứng Sâu {#deep-reactivity}

<div class="options-api">

Trong Vue, trạng thái mặc định là phản ứng sâu. Điều này có nghĩa là bạn có thể mong đợi các thay đổi được phát hiện ngay cả khi bạn thay đổi các đối tượng lồng nhau hoặc mảng:

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // những thứ này sẽ hoạt động như mong đợi.
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

Refs có thể giữ bất kỳ loại giá trị nào, bao gồm các đối tượng lồng nhau sâu, mảng, hoặc các cấu trúc dữ liệu tích hợp sẵn của JavaScript như `Map`.

Một ref sẽ làm cho giá trị của nó phản ứng sâu. Điều này có nghĩa là bạn có thể mong đợi các thay đổi được phát hiện ngay cả khi bạn thay đổi các đối tượng lồng nhau hoặc mảng:

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // những thứ này sẽ hoạt động như mong đợi.
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

Các giá trị không nguyên thủy được chuyển thành các proxy phản ứng thông qua [`reactive()`](#reactive), được thảo luận dưới đây.

Cũng có thể chọn không sử dụng tính phản ứng sâu với [shallow refs](/api/reactivity-advanced#shallowref). Đối với shallow refs, chỉ có truy cập `.value` được theo dõi cho phản ứng. Shallow refs có thể được sử dụng để tối ưu hóa hiệu suất bằng cách tránh chi phí quan sát của các đối tượng lớn, hoặc trong các trường hợp trạng thái nội bộ được quản lý bởi một thư viện bên ngoài.

Đọc thêm:

- [Giảm Chi Phí Phản Ứng Cho Các Cấu Trúc Bất Biến Lớn](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [Tích Hợp Với Các Hệ Thống Trạng Thái Bên Ngoài](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### Thời Gian Cập Nhật DOM {#dom-update-timing}

Khi bạn thay đổi trạng thái phản ứng, DOM được cập nhật tự động. Tuy nhiên, nên lưu ý rằng các cập nhật DOM không được áp dụng đồng bộ. Thay vào đó, Vue buffer chúng cho đến "next tick" trong chu kỳ cập nhật để đảm bảo rằng mỗi component chỉ cập nhật một lần bất kể bạn đã thực hiện bao nhiêu thay đổi trạng thái.

Để chờ cập nhật DOM hoàn tất sau một thay đổi trạng thái, bạn có thể sử dụng API toàn cầu [nextTick()](/api/general#nexttick):

<div class="composition-api">

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // Bây giờ DOM đã được cập nhật
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    async increment() {
      this.count++
      await nextTick()
      // Bây giờ DOM đã được cập nhật
    }
  }
}
```

</div>

<div class="composition-api">

## `reactive()` \*\* {#reactive}

Có một cách khác để khai báo trạng thái phản ứng, với API `reactive()`. Khác với ref bọc giá trị nội bộ trong một đối tượng đặc biệt, `reactive()` làm cho chính đối tượng phản ứng:

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> Xem thêm: [Typing Reactive](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

Sử dụng trong template:

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

Các đối tượng phản ứng là [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) và hoạt động giống như các đối tượng bình thường. Sự khác biệt là Vue có thể chặn việc truy cập và thay đổi của tất cả các thuộc tính của một đối tượng phản ứng để theo dõi phản ứng và kích hoạt.

`reactive()` chuyển đổi đối tượng sâu: các đối tượng lồng nhau cũng được bọc với `reactive()` khi được truy cập. Nó cũng được gọi bởi `ref()` nội bộ khi giá trị ref là một đối tượng. Tương tự như shallow refs, cũng có API [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) để chọn không sử dụng tính phản ứng sâu.

### Proxy Phản Ứng vs. Gốc \*\* {#reactive-proxy-vs-original-1}

Điều quan trọng cần lưu ý là giá trị trả về từ `reactive()` là một [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) của đối tượng gốc, không bằng với đối tượng gốc:

```js
const raw = {}
const proxy = reactive(raw)

// proxy KHÔNG bằng với đối tượng gốc.
console.log(proxy === raw) // false
```

Chỉ proxy là phản ứng - thay đổi đối tượng gốc sẽ không kích hoạt cập nhật. Do đó, thực hành tốt nhất khi làm việc với hệ thống phản ứng của Vue là **chỉ sử dụng các phiên bản proxy của trạng thái của bạn**.

Để đảm bảo truy cập nhất quán vào proxy, việc gọi `reactive()` trên cùng một đối tượng luôn trả về cùng một proxy, và gọi `reactive()` trên một proxy hiện có cũng trả về cùng một proxy đó:

```js
// gọi reactive() trên cùng một đối tượng trả về cùng một proxy
console.log(reactive(raw) === proxy) // true

// gọi reactive() trên một proxy trả về chính nó
console.log(reactive(proxy) === proxy) // true
```

Quy tắc này cũng áp dụng cho các đối tượng lồng nhau. Do tính phản ứng sâu, các đối tượng lồng nhau bên trong một đối tượng phản ứng cũng là các proxy:

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### Hạn Chế Của `reactive()` \*\* {#limitations-of-reactive}

API `reactive()` có một vài hạn chế:

1. **Giới hạn loại giá trị:** nó chỉ hoạt động cho các loại đối tượng (đối tượng, mảng, và [loại collection](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections) như `Map` và `Set`). Nó không thể giữ [các loại nguyên thủy](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) như `string`, `number` hoặc `boolean`.

2. **Không thể thay thế toàn bộ đối tượng:** vì theo dõi phản ứng của Vue hoạt động qua truy cập thuộc tính, chúng ta phải luôn giữ cùng một tham chiếu đến đối tượng phản ứng. Điều này có nghĩa là chúng ta không thể dễ dàng "thay thế" một đối tượng phản ứng vì kết nối phản ứng đến tham chiếu đầu tiên bị mất:

   ```js
   let state = reactive({ count: 0 })

   // tham chiếu ở trên ({ count: 0 }) không còn được theo dõi
   // (kết nối phản ứng bị mất!)
   state = reactive({ count: 1 })
   ```

3. **Không thân thiện với destructuring:** khi chúng ta destructuring một thuộc tính loại nguyên thủy của một đối tượng phản ứng vào các biến cục bộ, hoặc khi chúng ta chuyển thuộc tính đó vào một hàm, chúng ta sẽ mất kết nối phản ứng:

   ```js
   const state = reactive({ count: 0 })

   // count bị ngắt kết nối từ state.count khi được destructuring.
   let { count } = state
   // không ảnh hưởng đến trạng thái gốc
   count++

   // hàm nhận một số đơn giản và
   // sẽ không thể theo dõi các thay đổi của state.count
   // chúng ta phải chuyển toàn bộ đối tượng vào để giữ phản ứng
   callSomeFunction(state.count)
   ```

Do những hạn chế này, chúng tôi khuyến nghị sử dụng `ref()` như API chính để khai báo trạng thái phản ứng.

## Chi Tiết Unwrap Ref Thêm \*\* {#additional-ref-unwrapping-details}

### Như Thuộc Tính Đối Tượng Phản Ứng \*\* {#ref-unwrapping-as-reactive-object-property}

Một ref được tự động unwrap khi được truy cập hoặc thay đổi như một thuộc tính của một đối tượng phản ứng. Nói cách khác, nó hoạt động như một thuộc tính bình thường:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Nếu một ref mới được gán cho một thuộc tính liên kết với một ref hiện có, nó sẽ thay thế ref cũ:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// ref gốc hiện bị ngắt kết nối từ state.count
console.log(count.value) // 1
```

Ref unwrap chỉ xảy ra khi lồng bên trong một đối tượng phản ứng sâu. Nó không áp dụng khi được truy cập như một thuộc tính của một [đối tượng phản ứng nông](/api/reactivity-advanced#shallowreactive).

### Lưu Ý Trong Mảng Và Collections \*\* {#caveat-in-arrays-and-collections}

Khác với các đối tượng phản ứng, **không** có unwrap nào được thực hiện khi ref được truy cập như một phần tử của một mảng phản ứng hoặc một loại collection gốc như `Map`:

```js
const books = reactive([ref('Vue 3 Guide')])
// cần .value ở đây
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// cần .value ở đây
console.log(map.get('count').value)
```

### Lưu Ý Khi Unwrap Trong Templates \*\* {#caveat-when-unwrapping-in-templates}

Ref unwrap trong templates chỉ áp dụng nếu ref là một thuộc tính cấp cao nhất trong ngữ cảnh render template.

Trong ví dụ dưới đây, `count` và `object` là các thuộc tính cấp cao nhất, nhưng `object.id` không phải:

```js
const count = ref(0)
const object = { id: ref(1) }
```

Do đó, biểu thức này hoạt động như mong đợi:

```vue-html
{{ count + 1 }}
```

...trong khi cái này **KHÔNG**:

```vue-html
{{ object.id + 1 }}
```

Kết quả render sẽ là `[object Object]1` vì `object.id` không được unwrap khi đánh giá biểu thức và vẫn là một đối tượng ref. Để sửa điều này, chúng ta có thể destructuring `id` thành một thuộc tính cấp cao nhất:

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

Bây giờ kết quả render sẽ là `2`.

Một điều khác cần lưu ý là một ref được unwrap nếu nó là giá trị được đánh giá cuối cùng của một nội suy văn bản (tức là thẻ <code v-pre>{{ }}</code>), vì vậy những điều sau sẽ render `1`:

```vue-html
{{ object.id }}
```

Đây chỉ là một tính năng thuận tiện của nội suy văn bản và tương đương với <code v-pre>{{ object.id.value }}</code>.

</div>

<div class="options-api">

### Phương Thức Có Trạng Thái \* {#stateful-methods}

Trong một số trường hợp, chúng ta có thể cần tạo động một hàm phương thức, ví dụ tạo một event handler debounced:

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // Debouncing với Lodash
    click: debounce(function () {
      // ... phản hồi click ...
    }, 500)
  }
}
```

Tuy nhiên, cách tiếp cận này có vấn đề đối với các component được tái sử dụng vì một hàm debounced là **có trạng thái**: nó duy trì một số trạng thái nội bộ về thời gian đã trôi qua. Nếu nhiều thể hiện component chia sẻ cùng một hàm debounced, chúng sẽ can thiệp vào nhau.

Để giữ hàm debounced của mỗi thể hiện component độc lập với các thể hiện khác, chúng ta có thể tạo phiên bản debounced trong lifecycle hook `created`:

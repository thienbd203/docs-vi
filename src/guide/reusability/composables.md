# Composables {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
Phần này giả định bạn có kiến thức cơ bản về Composition API. Nếu bạn chỉ học Vue với Options API, bạn có thể đặt API Preference thành Composition API (sử dụng nút chuyển ở đầu thanh bên trái) và đọc lại các chương [Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals) và [Lifecycle Hooks](/guide/essentials/lifecycle).
:::

## "Composable" là gì? {#what-is-a-composable}

Trong ngữ cảnh của các ứng dụng Vue, "composable" là một hàm sử dụng Composition API của Vue để đóng gói và tái sử dụng **stateful logic**.

Khi xây dựng các ứng dụng frontend, chúng ta thường cần tái sử dụng logic cho các tác vụ phổ biến. Ví dụ, chúng ta có thể cần định dạng ngày tháng ở nhiều nơi, vì vậy chúng ta trích xuất một hàm có thể tái sử dụng cho việc đó. Hàm định dạng này đóng gói **stateless logic**: nó nhận một số đầu vào và trả về kết quả mong muốn ngay lập tức. Có nhiều thư viện để tái sử dụng stateless logic - ví dụ [lodash](https://lodash.com/) và [date-fns](https://date-fns.org/), mà bạn có thể đã nghe qua.

Ngược lại, stateful logic liên quan đến việc quản lý trạng thái thay đổi theo thời gian. Một ví dụ đơn giản là theo dõi vị trí hiện tại của chuột trên một trang. Trong các tình huống thực tế, nó cũng có thể là logic phức tạp hơn như các cử chỉ chạm hoặc trạng thái kết nối với cơ sở dữ liệu.

## Ví dụ Theo dõi Chuột {#mouse-tracker-example}

Nếu chúng ta triển khai chức năng theo dõi chuột bằng cách sử dụng Composition API trực tiếp bên trong một component, nó sẽ trông như sau:

```vue [MouseComponent.vue]
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

Nhưng nếu chúng ta muốn tái sử dụng cùng một logic trong nhiều component thì sao? Chúng ta có thể trích xuất logic vào một file bên ngoài, dưới dạng một hàm composable:

```js [mouse.js]
import { ref, onMounted, onUnmounted } from 'vue'

// theo quy ước, tên hàm composable bắt đầu bằng "use"
export function useMouse() {
  // state được đóng gói và quản lý bởi composable
  const x = ref(0)
  const y = ref(0)

  // một composable có thể cập nhật state mà nó quản lý theo thời gian.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // một composable cũng có thể hook vào lifecycle
  // của component sở hữu để thiết lập và dọn dẹp side effects.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expose state được quản lý dưới dạng giá trị trả về
  return { x, y }
}
```

Và đây là cách nó có thể được sử dụng trong các component:

```vue [MouseComponent.vue]
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

<div class="demo">
  Mouse position is at: {{ x }}, {{ y }}
</div>

[Try it in the Playground](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drDIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc9YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

Như chúng ta có thể thấy, logic cốt lõi vẫn giữ nguyên - tất cả những gì chúng ta phải làm là chuyển nó vào một hàm bên ngoài và trả về state nên được expose. Giống như bên trong một component, bạn có thể sử dụng toàn bộ [Composition API functions](/api/#composition-api) trong các composables. Chức năng `useMouse()` giống nhau giờ đây có thể được sử dụng trong bất kỳ component nào.

Phần thú vị hơn về composables là bạn cũng có thể lồng chúng: một hàm composable có thể gọi một hoặc nhiều hàm composable khác. Điều này cho phép chúng ta kết hợp logic phức tạp bằng cách sử dụng các đơn vị nhỏ, cô lập, tương tự như cách chúng ta kết hợp một ứng dụng hoàn chỉnh bằng cách sử dụng các component. Thực tế, đây là lý do tại sao chúng ta quyết định gọi tập hợp các API làm cho pattern này có thể thực hiện được là Composition API.

Ví dụ, chúng ta có thể trích xuất logic thêm và xóa một DOM event listener vào composable riêng của nó:

```js [event.js]
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // nếu bạn muốn, bạn cũng có thể làm cho
  // điều này hỗ trợ selector strings làm target
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

Và bây giờ composable `useMouse()` của chúng ta có thể được đơn giản hóa thành:

```js{2,8-11} [mouse.js]
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
Mỗi instance component gọi `useMouse()` sẽ tạo ra các bản sao riêng của state `x` và `y` để chúng không can thiệp vào nhau. Nếu bạn muốn quản lý shared state giữa các component, hãy đọc chương [State Management](/guide/scaling-up/state-management).
:::

## Ví dụ Async State {#async-state-example}

Composable `useMouse()` không nhận bất kỳ đối số nào, vì vậy hãy xem một ví dụ khác sử dụng một đối số. Khi thực hiện async data fetching, chúng ta thường cần xử lý các trạng thái khác nhau: loading, success, và error:

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>
```

Việc phải lặp lại pattern này trong mọi component cần fetch dữ liệu sẽ rất tẻ nhạt. Hãy trích xuất nó vào một composable:

```js [fetch.js]
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

Bây giờ trong component của chúng ta, chúng ta chỉ cần làm:

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

### Chấp nhận Reactive State {#accepting-reactive-state}

`useFetch()` nhận một chuỗi URL tĩnh làm đầu vào - vì vậy nó chỉ thực hiện fetch một lần và sau đó kết thúc. Điều gì sẽ xảy ra nếu chúng ta muốn nó fetch lại mỗi khi URL thay đổi? Để đạt được điều này, chúng ta cần truyền reactive state vào hàm composable, và để composable tạo watchers thực hiện các hành động bằng cách sử dụng state được truyền.

Ví dụ, `useFetch()` nên có thể chấp nhận một ref:

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// điều này nên kích hoạt một re-fetch
url.value = '/new-url'
```

Hoặc, chấp nhận một [getter function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description):

```js
// re-fetch khi props.id thay đổi
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

Chúng ta có thể refactor triển khai hiện tại của mình với các API [`watchEffect()`](/api/reactivity-core.html#watcheffect) và [`toValue()`](/api/reactivity-utilities.html#tovalue):

```js{7,12} [fetch.js]
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // reset state trước khi fetch..
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

`toValue()` là một API được thêm vào trong 3.3. Nó được thiết kế để chuẩn hóa refs hoặc getters thành các giá trị. Nếu đối số là một ref, nó trả về giá trị của ref; nếu đối số là một hàm, nó sẽ gọi hàm và trả về giá trị trả về của hàm đó. Nếu không, nó trả về đối số nguyên vẹn. Nó hoạt động tương tự như [`unref()`](/api/reactivity-utilities.html#unref), nhưng có xử lý đặc biệt cho các hàm.

Lưu ý rằng `toValue(url)` được gọi **bên trong** callback `watchEffect`. Điều này đảm bảo rằng bất kỳ reactive dependencies nào được truy cập trong quá trình chuẩn hóa `toValue()` đều được theo dõi bởi watcher.

Phiên bản `useFetch()` này giờ đây chấp nhận các chuỗi URL tĩnh, refs, và getters, làm cho nó linh hoạt hơn nhiều. Watch effect sẽ chạy ngay lập tức, và sẽ theo dõi bất kỳ dependencies nào được truy cập trong quá trình `toValue(url)`. Nếu không có dependencies nào được theo dõi (ví dụ: url đã là một chuỗi), effect chỉ chạy một lần; nếu không, nó sẽ chạy lại mỗi khi một tracked dependency thay đổi.

Đây là [phiên bản cập nhật của `useFetch()`](https://play.vuejs.org/#eNp9Vdtu20YQ/ZUpUUA0qpAOjL4YktCbC7Rom8BN8sSHrMihtfZql9iLZEHgv2dml6SpxMiDIWkuZ+acmR2fs1+7rjgEzG6zlaut7Dw49KHbVFruO2M9nMFiu4Ta7LvgsYEeWmv2sKCkxSwoOPwTfb2b/EU5mopHR5GVro12HrbC4UerYA2Lnfeduy3LR2d0p0SNO6MatIU/dbI2DRZUtPSmMa4kgJQuG8qkjvLF28XVaAwRb2wxz69gvZkK/UQ5xUGogBQ/ZpyhEV4sAa01lnpeTwRyApsFWvT2RO6Eea40THBMgfq6NLwlS1/pVZnUJB3ph8c98fNIvwD+MaKBzkQut2xYbYP3RsPhTWvsusokSA0/Vxn8UitZP7GFSX/+8Sz7z1W2OZ9BQt+vypQXS1R+1cgDQciW4iMrimR0wu8270znfoC7SBaJWdAeLTa3QFgxuNijc+IBIy5PPyYOjU19RDEI954/Z/UptKTy6VvqA5XD1AwLTTl/0Aco4s5lV51F5sG+VJJ+v4qxYbmkfiiKYvSvyknPbJnNtoyW+HJpj4Icd22LtV+CN5/ikC4XuNL4HFPaoGsvie3FIqSJp1WIzabl00HxkoyetEVfufhv1kAu3EnX8z0CKEtKofcGzhMb2CItAELL1SPlFMV1pwVj+GROc/vWPoc26oDgdxhfSArlLnbWaBOcOoEzIP3CgbeifqLXLRyICaDBDnVD+3KC7emCSyQ4sifspOx61Hh4Qy/d8BsaOEdkYb1sZS2FoiJKnIC6FbqhsaTVZfk8gDgK6cHLPZowFGUzAQTNWl/BUSrFbzRYHXmSdeAp28RMsI0fyFDaUJg9Spd0SbERZcvZDBRleCPdQMCPh8ARwdRRnBCTjGz5WkT0i0GlSMqixTR6VKyHmmWEHIfV+naSOETyRx8vEYwMv7pa8dJU+hU9Kz2t86ReqjcgaTzCe3oGpEOeD4uyJOcjTXe+obScHwaAi82lo9dC/q/wuyINjrwbuC5uZrS4WAQeyTN9ftOXIVwy537iecoX92kR4q/F1UvqIMsSbq6vo5XF6ekCeEcTauVDFJpuQESvMv53IBXadx3r4KqMrt0w0kwoZY5/R5u3AZejvd5h/fSK/dE9s63K3vN7tQesssnnhX1An9x3//+Hz/R9cu5NExRFf8d5zyIF7jGF/RZ0Q23P4mK3f8XLRmfhg7t79qjdSIobjXLE+Cqju/b7d6i/tHtT3MQ8VrH/Ahstp5A=), với độ trễ nhân tạo và lỗi ngẫu nhiên cho mục đích demo.

## Quy ước và Best Practices {#conventions-and-best-practices}

### Đặt tên {#naming}

Theo quy ước, tên hàm composable nên được đặt theo camelCase và bắt đầu bằng "use".

### Đối số đầu vào {#input-arguments}

Một composable có thể chấp nhận các đối số ref hoặc getter ngay cả khi nó không phụ thuộc vào chúng cho reactivity. Nếu bạn đang viết một composable có thể được sử dụng bởi các nhà phát triển khác, thì nên xử lý trường hợp các đối số đầu vào là refs hoặc getters thay vì các giá trị thô. Hàm tiện ích [`toValue()`](/api/reactivity-utilities#tovalue) sẽ rất hữu ích cho mục đích này:

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // Nếu maybeRefOrGetter là một ref hoặc một getter,
  // giá trị đã chuẩn hóa của nó sẽ được trả về.
  // Nếu không, nó được trả về nguyên vẹn.
  const value = toValue(maybeRefOrGetter)
}
```

Nếu composable của bạn tạo ra các reactive effects khi đầu vào là một ref hoặc một getter, hãy đảm bảo rằng bạn要么 explicitly watch ref / getter với `watch()`, hoặc gọi `toValue()` bên trong một `watchEffect()` để nó được theo dõi đúng cách.

[triển khai useFetch() đã thảo luận trước đó](#accepting-reactive-state) cung cấp một ví dụ cụ thể về một composable chấp nhận refs, getters và các giá trị thô làm đối số đầu vào.

### Giá trị trả về {#return-values}

Bạn có thể đã nhận thấy rằng chúng ta chỉ sử dụng `ref()` thay vì `reactive()` trong các composables. Quy ước được khuyến nghị là các composables luôn trả về một đối tượng thuần, không reactive chứa nhiều refs. Điều này cho phép nó được destructuring trong các component trong khi vẫn giữ reactivity:

```js
// x và y là refs
const { x, y } = useMouse()
```

Trả về một đối tượng reactive từ một composable sẽ làm cho các destructuring như vậy mất kết nối reactivity với state bên trong composable, trong khi refs sẽ giữ kết nối đó.

Nếu bạn thích sử dụng state trả về từ các composables dưới dạng các thuộc tính đối tượng, bạn có thể bọc đối tượng trả về với `reactive()` để các refs được unwrap. Ví dụ:

```js
const mouse = reactive(useMouse())
// mouse.x được liên kết với ref gốc
console.log(mouse.x)
```

```vue-html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### Side Effects {#side-effects}

Việc thực hiện side effects (ví dụ: thêm DOM event listeners hoặc fetch dữ liệu) trong các composables là OK, nhưng hãy chú ý đến các quy tắc sau:

- Nếu bạn đang làm việc trên một ứng dụng sử dụng [Server-Side Rendering](/guide/scaling-up/ssr) (SSR), hãy đảm bảo thực hiện các side effects cụ thể của DOM trong các lifecycle hook post-mount, ví dụ `onMounted()`. Các hook này chỉ được gọi trong trình duyệt, vì vậy bạn có thể chắc chắn rằng code bên trong chúng có quyền truy cập vào DOM.

- Hãy nhớ dọn dẹp side effects trong `onUnmounted()`. Ví dụ, nếu một composable thiết lập một DOM event listener, nó nên xóa listener đó trong `onUnmounted()` như chúng ta đã thấy trong ví dụ `useMouse()`. Việc sử dụng một composable tự động làm điều này cho bạn có thể là một ý tưởng tốt, như ví dụ `useEventListener()`.

### Hạn chế sử dụng {#usage-restrictions}

Composables chỉ nên được gọi trong `<script setup>` hoặc hook `setup()`. Chúng cũng nên được gọi **đồng bộ** trong các ngữ cảnh này. Trong một số trường hợp, bạn cũng có thể gọi chúng trong các lifecycle hook như `onMounted()`.

Các hạn chế này rất quan trọng vì đây là các ngữ cảnh mà Vue có thể xác định instance component hiện tại đang hoạt động. Quyền truy cập vào một instance component đang hoạt động là cần thiết để:

1. Các lifecycle hook có thể được đăng ký vào nó.

2. Các watchers có thể được liên kết với nó, để chúng có thể được disposed khi instance được unmounted để ngăn chặn rò rỉ bộ nhớ.

:::tip
`<script setup>` là nơi duy nhất bạn có thể gọi các composables **sau** khi sử dụng `await`. Trình biên dịch tự động khôi phục ngữ cảnh instance đang hoạt động cho bạn sau khi hoạt động async hoàn tất.
:::

## Trích xuất Composables để Tổ chức Code {#extracting-composables-for-code-organization}

Composables có thể được trích xuất không chỉ để tái sử dụng, mà còn để tổ chức code. Khi độ phức tạp của các component của bạn tăng lên, bạn có thể kết thúc với các component quá lớn để điều hướng và hiểu. Composition API cung cấp cho bạn sự linh hoạt hoàn toàn để tổ chức code component của mình thành các hàm nhỏ hơn dựa trên các mối quan tâm logic:

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

Ở một mức độ nào đó, bạn có thể coi các composables được trích xuất này là các services có phạm vi component có thể giao tiếp với nhau.

## Sử dụng Composables trong Options API {#using-composables-in-options-api}

Nếu bạn đang sử dụng Options API, các composables phải được gọi bên trong `setup()`, và các bindings được trả về phải được trả về từ `setup()` để chúng được expose cho `this` và template:

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // các thuộc tính được expose bởi setup() có thể được truy cập trên `this`
    console.log(this.x)
  }
  // ...các tùy chọn khác
}
```

## So sánh với Các Kỹ thuật Khác {#comparisons-with-other-techniques}

### vs. Mixins {#vs-mixins}

Người dùng đến từ Vue 2 có thể quen thuộc với tùy chọn [mixins](/api/options-composition#mixins), tùy chọn này cũng cho phép chúng ta trích xuất logic component thành các đơn vị có thể tái sử dụng. Có ba nhược điểm chính của mixins:

1. **Nguồn thuộc tính không rõ ràng**: khi sử dụng nhiều mixins, việc xác định thuộc tính instance nào được inject bởi mixin nào trở nên không rõ ràng, làm cho việc theo dõi triển khai và hiểu hành vi của component trở nên khó khăn. Đây cũng là lý do tại sao chúng tôi khuyến nghị sử dụng pattern refs + destructure cho các composables: nó làm cho nguồn thuộc tính rõ ràng trong các component tiêu thụ.

2. **Xung đột namespace**: nhiều mixins từ các tác giả khác nhau có thể đăng ký cùng một khóa thuộc tính, gây ra xung đột namespace. Với các composables, bạn có thể đổi tên các biến được destructuring nếu có các khóa xung đột từ các composables khác nhau.

3. **Giao tiếp cross-mixin ngầm định**: nhiều mixins cần tương tác với nhau phải dựa vào các khóa thuộc tính chia sẻ, làm cho chúng được coupled ngầm định. Với các composables, các giá trị được trả về từ một composable có thể được truyền vào một composable khác làm đối số, giống như các hàm bình thường.

Vì các lý do trên, chúng tôi không còn khuyến nghị sử dụng mixins trong Vue 3. Tính năng này chỉ được giữ lại cho mục đích migration và sự quen thuộc.

### vs. Renderless Components {#vs-renderless-components}

Trong chương component slots, chúng ta đã thảo luận về pattern [Renderless Component](/guide/components/slots#renderless-components) dựa trên scoped slots. Chúng ta thậm chí đã triển khai cùng một demo theo dõi chuột bằng cách sử dụng renderless components.

Lợi thế chính của composables so với renderless components là các composables không gây ra chi phí overhead của instance component bổ sung. Khi sử dụng trên toàn bộ một ứng dụng, số lượng instance component bổ sung được tạo bởi pattern renderless component có thể trở thành một chi phí hiệu suất đáng chú ý.

Khuyến nghị là sử dụng các composables khi tái sử dụng logic thuần túy, và sử dụng các component khi tái sử dụng cả logic và bố cục trực quan.

### vs. React Hooks {#vs-react-hooks}

Nếu bạn có kinh nghiệm với React, bạn có thể nhận thấy điều này trông rất giống với các custom React hooks. Composition API được truyền cảm hứng một phần từ React hooks, và các Vue composables thực sự tương tự như React hooks về khả năng kết hợp logic. Tuy nhiên, các Vue composables dựa trên hệ thống reactivity tinh granular của Vue, vốn khác biệt cơ bản với mô hình thực thi của React hooks. Điều này được thảo luận chi tiết hơn trong [Composition API FAQ](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Đọc Thêm {#further-reading}

- [Reactivity In Depth](/guide/extras/reactivity-in-depth): để hiểu ở mức thấp về cách hệ thống reactivity của Vue hoạt động.
- [State Management](/guide/scaling-up/state-management): cho các pattern quản lý state được chia sẻ bởi nhiều component.
- [Testing Composables](/guide/scaling-up/testing#testing-composables): các mẹo về unit testing các composables.
- [VueUse](https://vueuse.org/): một bộ sưu tập các Vue composables ngày càng phát triển. Source code cũng là một tài nguyên học tập tuyệt vời.

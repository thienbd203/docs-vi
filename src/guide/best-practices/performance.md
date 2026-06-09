---
outline: deep
---

# Hiệu suất {#performance}

## Tổng quan {#overview}

Vue được thiết kế để có hiệu suất tốt cho hầu hết các trường hợp sử dụng phổ biến mà không cần nhiều tối ưu hóa thủ công. Tuy nhiên, luôn có những kịch bản khó khăn cần tinh chỉnh thêm. Trong phần này, chúng ta sẽ thảo luận về những điều bạn cần chú ý khi nói đến hiệu suất trong một ứng dụng Vue.

Trước hết, hãy thảo luận về hai khía cạnh chính của hiệu suất web:

- **Hiệu suất tải trang**: ứng dụng hiển thị nội dung và trở nên tương tác nhanh như thế nào trong lần truy cập đầu tiên. Điều này thường được đo bằng các chỉ số web vital như [Largest Contentful Paint (LCP)](https://web.dev/lcp/) và [Interaction to Next Paint](https://web.dev/articles/inp).

- **Hiệu suất cập nhật**: ứng dụng cập nhật nhanh như thế nào để phản hồi đầu vào của người dùng. Ví dụ, danh sách cập nhật nhanh như thế nào khi người dùng nhập vào ô tìm kiếm, hoặc trang chuyển đổi nhanh như thế nào khi người dùng nhấp vào liên kết điều hướng trong Single-Page Application (SPA).

Mặc dù lý tưởng nhất là tối đa hóa cả hai, các kiến trúc frontend khác nhau có xu hướng ảnh hưởng đến mức độ dễ dàng đạt được hiệu suất mong muốn ở các khía cạnh này. Ngoài ra, loại ứng dụng bạn đang xây dựng ảnh hưởng rất lớn đến những gì bạn nên ưu tiên về hiệu suất. Do đó, bước đầu tiên để đảm bảo hiệu suất tối ưu là chọn kiến trúc phù hợp cho loại ứng dụng bạn đang xây dựng:

- Tham khảo [Cách sử dụng Vue](/guide/extras/ways-of-using-vue) để xem cách bạn có thể tận dụng Vue theo các cách khác nhau.

- Jason Miller thảo luận về các loại ứng dụng web và cách triển khai/phân phối lý tưởng tương ứng của chúng trong [Application Holotypes](https://jasonformat.com/application-holotypes/).

## Tùy chọn Profiling {#profiling-options}

Để cải thiện hiệu suất, chúng ta cần biết cách đo lường nó trước. Có một số công cụ tuyệt vời có thể giúp ích trong việc này:

Để profiling hiệu suất tải của các bản triển khai production:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

Để profiling hiệu suất trong quá trình phát triển cục bộ:

- [Chrome DevTools Performance Panel](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application#app-config-performance) bật các marker hiệu suất dành riêng cho Vue trong timeline hiệu suất của Chrome DevTools.
- [Vue DevTools Extension](/guide/scaling-up/tooling#browser-devtools) cũng cung cấp tính năng profiling hiệu suất.

## Tối ưu hóa Tải trang {#page-load-optimizations}

Có nhiều khía cạnh không phụ thuộc framework để tối ưu hóa hiệu suất tải trang - hãy xem [hướng dẫn web.dev này](https://web.dev/fast/) để có tổng quan toàn diện. Ở đây, chúng ta sẽ tập trung chủ yếu vào các kỹ thuật dành riêng cho Vue.

### Chọn Kiến trúc Phù hợp {#choosing-the-right-architecture}

Nếu trường hợp sử dụng của bạn nhạy cảm về hiệu suất tải trang, hãy tránh triển khai nó dưới dạng SPA phía client thuần túy. Bạn muốn máy chủ của mình gửi trực tiếp HTML chứa nội dung mà người dùng muốn xem. Rendering phía client thuần túy gặp vấn đề về thời gian hiển thị nội dung chậm. Điều này có thể được giảm thiểu bằng [Server-Side Rendering (SSR)](/guide/extras/ways-of-using-vue#fullstack-ssr) hoặc [Static Site Generation (SSG)](/guide/extras/ways-of-using-vue#jamstack-ssg). Hãy xem [Hướng dẫn SSR](/guide/scaling-up/ssr) để tìm hiểu về việc thực hiện SSR với Vue. Nếu ứng dụng của bạn không có yêu cầu về tính tương tác phong phú, bạn cũng có thể sử dụng máy chủ backend truyền thống để render HTML và nâng cấp nó với Vue ở phía client.

Nếu ứng dụng chính của bạn phải là SPA, nhưng có các trang marketing (landing, about, blog), hãy triển khai chúng riêng biệt! Các trang marketing của bạn lý tưởng nhất nên được triển khai dưới dạng HTML tĩnh với JS tối thiểu, bằng cách sử dụng SSG.

### Kích thước Bundle và Tree-shaking {#bundle-size-and-tree-shaking}

Một trong những cách hiệu quả nhất để cải thiện hiệu suất tải trang là gửi các bundle JavaScript nhỏ hơn. Dưới đây là một số cách để giảm kích thước bundle khi sử dụng Vue:

- Sử dụng bước build nếu có thể.

  - Nhiều API của Vue có thể ["tree-shakable"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) nếu được bundle thông qua công cụ build hiện đại. Ví dụ, nếu bạn không sử dụng component `<Transition>` tích hợp sẵn, nó sẽ không được bao gồm trong bundle production cuối cùng. Tree-shaking cũng có thể loại bỏ các module không sử dụng khác trong mã nguồn của bạn.

  - Khi sử dụng bước build, các template được biên dịch trước nên chúng ta không cần gửi trình biên dịch Vue đến trình duyệt. Điều này tiết kiệm **14kb** JavaScript min+gzipped và tránh chi phí biên dịch runtime.

- Hãy cẩn trọng về kích thước khi thêm các dependency mới! Trong các ứng dụng thực tế, các bundle phình to thường là kết quả của việc thêm các dependency nặng mà không nhận ra.

  - Nếu sử dụng bước build, hãy ưu tiên các dependency cung cấp định dạng ES module và thân thiện với tree-shaking. Ví dụ, hãy ưu tiên `lodash-es` thay vì `lodash`.

  - Kiểm tra kích thước của một dependency và đánh giá xem nó có đáng giá với chức năng mà nó cung cấp hay không. Lưu ý rằng nếu dependency thân thiện với tree-shaking, kích thước tăng thực tế sẽ phụ thuộc vào các API mà bạn thực sự import từ nó. Các công cụ như [bundlejs.com](https://bundlejs.com/) có thể được sử dụng để kiểm tra nhanh, nhưng đo lường với thiết lập build thực tế của bạn sẽ luôn chính xác nhất.

- Nếu bạn sử dụng Vue chủ yếu cho progressive enhancement và muốn tránh bước build, hãy cân nhắc sử dụng [petite-vue](https://github.com/vuejs/petite-vue) (chỉ **6kb**) thay thế.

### Code Splitting {#code-splitting}

Code splitting là khi công cụ build chia bundle ứng dụng thành nhiều chunk nhỏ hơn, sau đó có thể được tải theo yêu cầu hoặc song song. Với code splitting phù hợp, các tính năng cần thiết khi tải trang có thể được tải xuống ngay lập tức, với các chunk bổ sung được lazy load chỉ khi cần, do đó cải thiện hiệu suất.

Các bundler như Rollup (mà Vite dựa trên) hoặc webpack có thể tự động tạo các chunk được chia nhỏ bằng cách phát hiện cú pháp dynamic import ESM:

```js
// lazy.js và các dependency của nó sẽ được chia thành một chunk riêng biệt
// và chỉ được tải khi `loadLazy()` được gọi.
function loadLazy() {
  return import('./lazy.js')
}
```

Lazy loading được sử dụng tốt nhất cho các tính năng không cần thiết ngay sau khi tải trang ban đầu. Trong các ứng dụng Vue, điều này có thể được sử dụng kết hợp với tính năng [Async Component](/guide/components/async) của Vue để tạo các chunk được chia nhỏ cho cây component:

```js
import { defineAsyncComponent } from 'vue'

// một chunk riêng biệt được tạo cho Foo.vue và các dependency của nó.
// nó chỉ được tải theo yêu cầu khi component async được
// render trên trang.
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

Đối với các ứng dụng sử dụng Vue Router, rất khuyến khích sử dụng lazy loading cho các component route. Vue Router có hỗ trợ rõ ràng cho lazy loading, tách biệt với `defineAsyncComponent`. Xem [Lazy Loading Routes](https://router.vuejs.org/guide/advanced/lazy-loading.html) để biết thêm chi tiết.

## Tối ưu hóa Cập nhật {#update-optimizations}

### Sự ổn định của Props {#props-stability}

Trong Vue, một component con chỉ cập nhật khi ít nhất một trong các props nhận được của nó đã thay đổi. Hãy xem xét ví dụ sau:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

Bên trong component `<ListItem>`, nó sử dụng các props `id` và `activeId` để xác định xem nó có phải là mục hiện đang hoạt động hay không. Mặc dù điều này hoạt động, vấn đề là bất cứ khi nào `activeId` thay đổi, **mọi** `<ListItem>` trong danh sách phải cập nhật!

Lý tưởng nhất, chỉ các mục có trạng thái hoạt động thay đổi mới nên cập nhật. Chúng ta có thể đạt được điều đó bằng cách chuyển tính toán trạng thái hoạt động vào component cha, và làm cho `<ListItem>` chấp nhận trực tiếp một prop `active` thay thế:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

Bây giờ, đối với hầu hết các component, prop `active` sẽ giữ nguyên khi `activeId` thay đổi, do đó chúng không còn cần cập nhật. Nói chung, ý tưởng là giữ các props được truyền đến các component con càng ổn định càng tốt.

### `v-once` {#v-once}

`v-once` là một directive tích hợp có thể được sử dụng để render nội dung phụ thuộc vào dữ liệu runtime nhưng không bao giờ cần cập nhật. Toàn bộ cây con mà nó được sử dụng sẽ được bỏ qua cho tất cả các cập nhật trong tương lai. Hãy tham khảo [tài liệu API](/api/built-in-directives#v-once) của nó để biết thêm chi tiết.

### `v-memo` {#v-memo}

`v-memo` là một directive tích hợp có thể được sử dụng để có điều kiện bỏ qua cập nhật của các cây con lớn hoặc danh sách `v-for`. Hãy tham khảo [tài liệu API](/api/built-in-directives#v-memo) của nó để biết thêm chi tiết.

### Sự ổn định của Computed {#computed-stability}

Trong Vue 3.4 trở lên, một computed property chỉ kích hoạt effects khi giá trị tính toán của nó đã thay đổi so với giá trị trước đó. Ví dụ, computed `isEven` sau chỉ kích hoạt effects nếu giá trị trả về đã thay đổi từ `true` sang `false`, hoặc ngược lại:

```js
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => console.log(isEven.value)) // true

// sẽ không kích hoạt log mới vì giá trị computed vẫn là `true`
count.value = 2
count.value = 4
```

Điều này giảm thiểu các kích hoạt effect không cần thiết, nhưng đáng tiếc là không hoạt động nếu computed tạo một đối tượng mới mỗi khi tính toán:

```js
const computedObj = computed(() => {
  return {
    isEven: count.value % 2 === 0
  }
})
```

Vì một đối tượng mới được tạo mỗi lần, giá trị mới về mặt kỹ thuật luôn khác với giá trị cũ. Ngay cả khi thuộc tính `isEven` giữ nguyên, Vue sẽ không thể biết trừ khi nó thực hiện so sánh sâu giữa giá trị cũ và giá trị mới. So sánh như vậy có thể tốn kém và có thể không đáng giá.

Thay vào đó, chúng ta có thể tối ưu hóa điều này bằng cách so sánh thủ công giá trị mới với giá trị cũ, và có điều kiện trả về giá trị cũ nếu chúng ta biết không có gì thay đổi:

```js
const computedObj = computed((oldValue) => {
  const newValue = {
    isEven: count.value % 2 === 0
  }
  if (oldValue && oldValue.isEven === newValue.isEven) {
    return oldValue
  }
  return newValue
})
```

[Try it in the playground](https://play.vuejs.org/#eNqVVMtu2zAQ/JUFgSZK4UpuczMkow/40AJ9IC3aQ9mDIlG2EokUyKVt1PC/d0lKtoEminMQQC1nZ4c7S+7Yu66L11awGUtNoesOwQi03ZzLuu2URtiBFtUECtV2FkU5gU2OxWpRVaJA2EOlVQuXxHDJJZeFkgYJayVC5hKj6dUxLnzSjZXmV40rZfFrh3Vb/82xVrLH//5DCQNNKPkweNiNVFP+zBsrIJvDjksgGrRahjVAbRZrIWdBVLz2yBfwBrIsg6mD7LncPyryfIVnywupUmz68HOEEqqCI+XFBQzrOKR79MDdx66GCn1jhpQDZx8f0oZ+nBgdRVcH/aMuBt1xZ80qGvGvh/X6nlXwnGpPl6qsLLxTtitzFFTNl0oSN/79AKOCHHQuS5pw4XorbXsr9ImHZN7nHFdx1SilI78MeOJ7Ca+nbvgd+GgomQOv6CNjSQqXaRJuHd03+kHRdg3JoT+A3a7XsfcmpbcWkQS/LZq6uM84C8o5m4fFuOg0CemeOXXX2w2E6ylsgj2gTgeYio/f1l5UEqj+Z3yC7lGuNDlpApswNNTrql7Gd0ZJeqW8TZw5t+tGaMdDXnA2G4acs7xp1OaTj6G2YjLEi5Uo7h+I35mti3H2TQsj9Jp6etjDXC8Fhu3F9y9iS+vDZqtK2xB6ZPNGGNVYpzHA3ltZkuwTnFf70b+1tVz+MIstCmmGQzmh/p56PGf00H4YOfpR7nV8PTxubP8P2GAP9Q==)

Lưu ý rằng bạn nên luôn thực hiện tính toán đầy đủ trước khi so sánh và trả về giá trị cũ, để cùng các dependency có thể được thu thập trong mỗi lần chạy.

## Tối ưu hóa Chung {#general-optimizations}

> Các mẹo sau đây ảnh hưởng đến cả hiệu suất tải trang và hiệu suất cập nhật.

### Ảo hóa Danh sách Lớn {#virtualize-large-lists}

Một trong những vấn đề hiệu suất phổ biến nhất trong tất cả các ứng dụng frontend là render danh sách lớn. Bất kể framework có hiệu suất tốt như thế nào, render một danh sách với hàng nghìn mục **sẽ** chậm do số lượng DOM node khổng lồ mà trình duyệt cần xử lý.

Tuy nhiên, chúng ta không nhất thiết phải render tất cả các node này ngay từ đầu. Trong hầu hết các trường hợp, kích thước màn hình của người dùng chỉ có thể hiển thị một tập hợp con nhỏ của danh sách lớn của chúng ta. Chúng ta có thể cải thiện đáng kể hiệu suất với **ảo hóa danh sách**, kỹ thuật chỉ render các mục hiện đang ở trong hoặc gần viewport trong một danh sách lớn.

Triển khai ảo hóa danh sách không dễ dàng, may mắn là có các thư viện cộng đồng hiện có mà bạn có thể sử dụng trực tiếp:

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### Giảm Overhead Reactivity cho Các Cấu trúc Bất biến Lớn {#reduce-reactivity-overhead-for-large-immutable-structures}

Hệ thống reactivity của Vue là sâu theo mặc định. Mặc dù điều này làm cho quản lý state trực quan, nó tạo ra một mức độ overhead nhất định khi kích thước dữ liệu lớn, vì mọi truy cập thuộc tính kích hoạt các proxy trap thực hiện theo dõi dependency. Điều này thường trở nên đáng chú ý khi xử lý các mảng lớn của các đối tượng lồng nhau sâu, nơi một lần render cần truy cập 100,000+ thuộc tính, do đó nó chỉ nên ảnh hưởng đến các trường hợp sử dụng rất cụ thể.

Vue cung cấp một cách để loại bỏ deep reactivity bằng cách sử dụng [`shallowRef()`](/api/reactivity-advanced#shallowref) và [`shallowReactive()`](/api/reactivity-advanced#shallowreactive). Các API shallow tạo state chỉ có tính reactivity ở mức gốc, và hiển thị tất cả các đối tượng lồng nhau không bị thay đổi. Điều này giữ cho truy cập thuộc tính lồng nhau nhanh, với sự đánh đổi là chúng ta giờ phải coi tất cả các đối tượng lồng nhau là bất biến, và các cập nhật chỉ có thể được kích hoạt bằng cách thay thế state gốc:

```js
const shallowArray = shallowRef([
  /* danh sách lớn của các đối tượng sâu */
])

// điều này sẽ không kích hoạt cập nhật...
shallowArray.value.push(newObject)
// điều này thì có:
shallowArray.value = [...shallowArray.value, newObject]

// điều này sẽ không kích hoạt cập nhật...
shallowArray.value[0].foo = 1
// điều này thì có:
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### Tránh Các Trừu tượng Component Không Cần thiết {#avoid-unnecessary-component-abstractions}

Đôi khi chúng ta có thể tạo [renderless components](/guide/components/slots#renderless-components) hoặc higher-order components (tức là các component render các component khác với các props bổ sung) để có trừu tượng tốt hơn hoặc tổ chức mã tốt hơn. Mặc dù không có gì sai với điều này, hãy nhớ rằng các instance component tốn kém hơn nhiều so với các DOM node đơn giản, và tạo quá nhiều chúng do các mẫu trừu tượng sẽ gây ra chi phí hiệu suất.

Lưu ý rằng việc giảm chỉ một vài instance sẽ không có hiệu quả đáng chú ý, vì vậy đừng lo lắng nếu component chỉ được render một vài lần trong ứng dụng. Kịch bản tốt nhất để xem xét tối ưu hóa này một lần nữa là trong các danh sách lớn. Hãy tưởng tượng một danh sách 100 mục trong đó mỗi component mục chứa nhiều component con. Loại bỏ một trừu tượng component không cần thiết ở đây có thể dẫn đến việc giảm hàng trăm instance component.

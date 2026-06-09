---
outline: deep
---

# Suspense {#suspense}

:::warning Tính năng Thử nghiệm
`<Suspense>` là một tính năng thử nghiệm. Không đảm bảo sẽ đạt trạng thái ổn định và API có thể thay đổi trước khi đó.
:::

`<Suspense>` là một component tích hợp sẵn để điều phối các phụ thuộc không đồng bộ trong một cây component. Nó có thể hiển thị trạng thái đang tải trong khi chờ nhiều phụ thuộc không đồng bộ lồng nhau trong cây component được giải quyết.

## Phụ thuộc Không đồng bộ {#async-dependencies}

Để giải thích vấn đề mà `<Suspense>` đang cố gắng giải quyết và cách nó tương tác với các phụ thuộc không đồng bộ này, hãy tưởng tượng một cấu trúc component như sau:

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus> (component with async setup())
   └─ <Content>
      ├─ <ActivityFeed> (async component)
      └─ <Stats> (async component)
```

Trong cây component có nhiều component lồng nhau mà việc hiển thị của chúng phụ thuộc vào một số tài nguyên không đồng bộ cần được giải quyết trước. Nếu không có `<Suspense>`, mỗi component sẽ cần xử lý trạng thái đang tải / lỗi và đã tải của riêng nó. Trong trường hợp xấu nhất, chúng ta có thể thấy ba vòng xoay tải trên trang, với nội dung được hiển thị vào các thời điểm khác nhau.

Component `<Suspense>` cho phép chúng ta hiển thị trạng thái đang tải / lỗi ở cấp cao nhất trong khi chờ các phụ thuộc không đồng bộ lồng nhau này được giải quyết.

Có hai loại phụ thuộc không đồng bộ mà `<Suspense>` có thể chờ đợi:

1. Các component có hook `setup()` không đồng bộ. Điều này bao gồm các component sử dụng `<script setup>` với biểu thức `await` ở cấp cao nhất.

2. [Component Không đồng bộ](/guide/components/async).

### `async setup()` {#async-setup}

Hook `setup()` của một component Composition API có thể không đồng bộ:

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

Nếu sử dụng `<script setup>`, sự hiện diện của biểu thức `await` ở cấp cao nhất sẽ tự động biến component thành một phụ thuộc không đồng bộ:

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

### Component Không đồng bộ {#async-components}

Component không đồng bộ mặc định là **"có thể treo" (suspensible)**. Điều này có nghĩa là nếu có một `<Suspense>` trong chuỗi cha, nó sẽ được coi là một phụ thuộc không đồng bộ của `<Suspense>` đó. Trong trường hợp này, trạng thái đang tải sẽ được kiểm soát bởi `<Suspense>`, và các tùy chọn loading, error, delay và timeout của chính component sẽ bị bỏ qua.

Component không đồng bộ có thể từ chối sự kiểm soát của `Suspense` và để component luôn kiểm soát trạng thái đang tải của chính nó bằng cách chỉ định `suspensible: false` trong các tùy chọn của nó.

## Trạng thái Đang tải {#loading-state}

Component `<Suspense>` có hai slot: `#default` và `#fallback`. Cả hai slot chỉ cho phép **một** node con trực tiếp. Node trong slot mặc định sẽ được hiển thị nếu có thể. Nếu không, node trong slot dự phòng sẽ được hiển thị thay thế.

```vue-html
<Suspense>
  <!-- component với các phụ thuộc không đồng bộ lồng nhau -->
  <Dashboard />

  <!-- trạng thái đang tải qua slot #fallback -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

Khi hiển thị lần đầu, `<Suspense>` sẽ hiển thị nội dung slot mặc định của nó trong bộ nhớ. Nếu bất kỳ phụ thuộc không đồng bộ nào được gặp trong quá trình này, nó sẽ chuyển sang trạng thái **đang chờ xử lý (pending)**. Trong trạng thái đang chờ xử lý, nội dung dự phòng sẽ được hiển thị. Khi tất cả các phụ thuộc không đồng bộ đã gặp được giải quyết, `<Suspense>` chuyển sang trạng thái **đã giải quyết (resolved)** và nội dung slot mặc định đã giải quyết được hiển thị.

Nếu không có phụ thuộc không đồng bộ nào được gặp trong lần hiển thị đầu tiên, `<Suspense>` sẽ chuyển trực tiếp sang trạng thái đã giải quyết.

Khi đã ở trạng thái đã giải quyết, `<Suspense>` sẽ chỉ chuyển lại sang trạng thái đang chờ xử lý nếu node gốc của slot `#default` được thay thế. Các phụ thuộc không đồng bộ mới lồng sâu hơn trong cây sẽ **không** gây ra việc `<Suspense>` chuyển lại sang trạng thái đang chờ xử lý.

Khi một lần chuyển lại xảy ra, nội dung dự phòng sẽ không được hiển thị ngay lập tức. Thay vào đó, `<Suspense>` sẽ hiển thị nội dung `#default` trước đó trong khi chờ nội dung mới và các phụ thuộc không đồng bộ của nó được giải quyết. Hành vi này có thể được cấu hình với prop `timeout`: `<Suspense>` sẽ chuyển sang nội dung dự phòng nếu mất nhiều hơn `timeout` mili-giây để hiển thị nội dung mặc định mới. Giá trị `timeout` là `0` sẽ khiến nội dung dự phòng được hiển thị ngay lập tức khi nội dung mặc định được thay thế.

## Sự kiện {#events}

Component `<Suspense>` phát ra 3 sự kiện: `pending`, `resolve` và `fallback`. Sự kiện `pending` xảy ra khi chuyển sang trạng thái đang chờ xử lý. Sự kiện `resolve` được phát ra khi nội dung mới đã hoàn tất giải quyết trong slot `default`. Sự kiện `fallback` được kích hoạt khi nội dung của slot `fallback` được hiển thị.

Các sự kiện này có thể được sử dụng, ví dụ, để hiển thị một chỉ báo tải ở phía trước DOM cũ trong khi các component mới đang tải.

## Xử lý Lỗi {#error-handling}

`<Suspense>` hiện không cung cấp xử lý lỗi thông qua chính component - tuy nhiên, bạn có thể sử dụng tùy chọn [`errorCaptured`](/api/options-lifecycle#errorcaptured) hoặc hook [`onErrorCaptured()`](/api/composition-api-lifecycle#onerrorcaptured) để bắt và xử lý các lỗi không đồng bộ trong component cha của `<Suspense>`.

## Kết hợp với Các Component Khác {#combining-with-other-components}

Thông thường, chúng ta muốn sử dụng `<Suspense>` kết hợp với các component [`<Transition>`](./transition) và [`<KeepAlive>`](./keep-alive). Thứ tự lồng nhau của các component này rất quan trọng để đảm bảo chúng hoạt động đúng.

Ngoài ra, các component này thường được sử dụng cùng với component `<RouterView>` từ [Vue Router](https://router.vuejs.org/).

Ví dụ sau đây cho thấy cách lồng các component này để chúng hoạt động như mong đợi. Đối với các kết hợp đơn giản hơn, bạn có thể loại bỏ các component mà bạn không cần:

```vue-html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- nội dung chính -->
          <component :is="Component"></component>

          <!-- trạng thái đang tải -->
          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

Vue Router có hỗ trợ tích hợp sẵn cho [tải lười các component](https://router.vuejs.org/guide/advanced/lazy-loading.html) sử dụng dynamic imports. Những component này khác với component không đồng bộ và hiện tại chúng sẽ không kích hoạt `<Suspense>`. Tuy nhiên, chúng vẫn có thể có các component không đồng bộ là con và những component đó có thể kích hoạt `<Suspense>` theo cách thông thường.

## Suspense Lồng nhau {#nested-suspense}

- Chỉ được hỗ trợ từ 3.3+

Khi chúng ta có nhiều component không đồng bộ (thường gặp cho các route lồng nhau hoặc dựa trên layout) như sau:

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <component :is="DynamicAsyncInner" />
  </component>
</Suspense>
```

`<Suspense>` tạo ra một ranh giới sẽ giải quyết tất cả các component không đồng bộ xuống cây, như mong đợi. Tuy nhiên, khi chúng ta thay đổi `DynamicAsyncOuter`, `<Suspense>` chờ đợi nó đúng cách, nhưng khi chúng ta thay đổi `DynamicAsyncInner`, `DynamicAsyncInner` lồng nhau hiển thị một node trống cho đến khi nó được giải quyết (thay vì node trước đó hoặc slot dự phòng).

Để giải quyết vấn đề đó, chúng ta có thể có một suspense lồng nhau để xử lý việc vá cho component lồng nhau, như sau:

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <Suspense suspensible> <!-- cái này -->
      <component :is="DynamicAsyncInner" />
    </Suspense>
  </component>
</Suspense>
```

Nếu bạn không đặt prop `suspensible`, `<Suspense>` bên trong sẽ được coi như một component đồng bộ bởi `<Suspense>` cha. Điều này có nghĩa là nó có slot dự phòng riêng và nếu cả hai component `Dynamic` thay đổi cùng lúc, có thể có các node trống và nhiều chu kỳ vá trong khi `<Suspense>` con đang tải cây phụ thuộc của chính nó, điều này có thể không mong muốn. Khi được đặt, tất cả việc xử lý phụ thuộc không đồng bộ được chuyển cho `<Suspense>` cha (bao gồm cả các sự kiện được phát ra) và `<Suspense>` bên trong chỉ đóng vai trò là một ranh giới khác cho việc giải quyết phụ thuộc và vá.

---

**Liên quan**

- [Tham chiếu API `<Suspense>`](/api/built-in-components#suspense)

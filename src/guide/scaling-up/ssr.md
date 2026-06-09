---
outline: deep
---

# Server-Side Rendering (SSR) {#server-side-rendering-ssr}

## Tổng quan {#overview}

### SSR là gì? {#what-is-ssr}

Vue.js là một framework để xây dựng các ứng dụng phía client. Theo mặc định, các component Vue tạo và thao tác DOM trong trình duyệt làm đầu ra. Tuy nhiên, cũng có thể render các component đó thành chuỗi HTML trên server, gửi trực tiếp đến trình duyệt, và cuối cùng "hydrate" markup tĩnh thành một ứng dụng hoàn toàn tương tác trên client.

Một ứng dụng Vue.js được render trên server cũng có thể được coi là "đẳng cấu" (isomorphic) hoặc "đa năng" (universal), theo nghĩa là phần lớn mã của ứng dụng chạy trên cả server **và** client.

### Tại sao cần SSR? {#why-ssr}

So với một Single-Page Application (SPA) phía client, lợi ích của SSR chủ yếu nằm ở:

- **Thời gian hiển thị nội dung nhanh hơn**: điều này nổi bật hơn trên kết nối internet chậm hoặc thiết bị chậm. Markup được render trên server không cần đợi cho đến khi tất cả JavaScript được tải xuống và thực thi để hiển thị, vì vậy người dùng sẽ thấy một trang được render hoàn chỉnh sớm hơn. Ngoài ra, việc lấy dữ liệu được thực hiện trên phía client cho lần truy cập đầu tiên, có khả năng có kết nối nhanh hơn đến cơ sở dữ liệu của bạn so với client. Điều này thường dẫn đến cải thiện các chỉ số [Core Web Vitals](https://web.dev/vitals/), trải nghiệm người dùng tốt hơn, và có thể quan trọng đối với các ứng dụng mà thời gian hiển thị nội dung liên quan trực tiếp đến tỷ lệ chuyển đổi.

- **Mô hình tư duy thống nhất**: bạn có thể sử dụng cùng một ngôn ngữ và cùng một mô hình tư duy theo hướng component và khai báo để phát triển toàn bộ ứng dụng, thay vì phải chuyển đổi qua lại giữa hệ thống template backend và framework frontend.

- **SEO tốt hơn**: các crawler của công cụ tìm kiếm sẽ nhìn thấy trực tiếp trang được render hoàn chỉnh.

  :::tip
  Hiện tại, Google và Bing có thể index các ứng dụng JavaScript đồng bộ (synchronous) tốt. Từ khóa ở đây là đồng bộ. Nếu ứng dụng của bạn bắt đầu với một loading spinner, sau đó lấy nội dung qua Ajax, crawler sẽ không đợi bạn hoàn thành. Điều này có nghĩa là nếu bạn có nội dung được lấy bất đồng bộ trên các trang mà SEO quan trọng, SSR có thể là cần thiết.
  :::

Cũng có một số sự đánh đổi cần xem xét khi sử dụng SSR:

- Ràng buộc phát triển. Mã dành riêng cho trình duyệt chỉ có thể được sử dụng bên trong một số lifecycle hook nhất định; một số thư viện bên ngoài có thể cần xử lý đặc biệt để có thể chạy trong ứng dụng được render trên server.

- Thiết lập build và yêu cầu triển khai phức tạp hơn. Không giống như một SPA hoàn toàn tĩnh có thể được triển khai trên bất kỳ server tĩnh nào, ứng dụng được render trên server yêu cầu một môi trường mà server Node.js có thể chạy.

- Tải phía server nhiều hơn. Render một ứng dụng đầy đủ trong Node.js sẽ tốn nhiều CPU hơn là chỉ phục vụ các tệp tĩnh, vì vậy nếu bạn dự kiến lưu lượng truy cập cao, hãy chuẩn bị cho tải server tương ứng và sử dụng chiến lược caching một cách khôn ngoan.

Trước khi sử dụng SSR cho ứng dụng của bạn, câu hỏi đầu tiên bạn nên hỏi là liệu bạn thực sự cần nó hay không. Nó chủ yếu phụ thuộc vào mức độ quan trọng của thời gian hiển thị nội dung đối với ứng dụng của bạn. Ví dụ, nếu bạn đang xây dựng một dashboard nội bộ mà thêm vài trăm mili-giây khi tải ban đầu không quan trọng lắm, SSR sẽ là quá mức cần thiết. Tuy nhiên, trong trường hợp thời gian hiển thị nội dung hoàn toàn quan trọng, SSR có thể giúp bạn đạt được hiệu suất tải ban đầu tốt nhất có thể.

### SSR so với SSG {#ssr-vs-ssg}

**Static Site Generation (SSG)**, còn được gọi là pre-rendering, là một kỹ thuật phổ biến khác để xây dựng các trang web nhanh. Nếu dữ liệu cần thiết để render một trang trên server giống nhau cho mọi người dùng, thì thay vì render trang mỗi khi có yêu cầu, chúng ta có thể render nó chỉ một lần, trước thời hạn, trong quá trình build. Các trang được pre-render được tạo ra và phục vụ dưới dạng tệp HTML tĩnh.

SSG giữ lại các đặc điểm hiệu suất giống như ứng dụng SSR: nó cung cấp hiệu suất hiển thị nội dung tuyệt vời. Đồng thời, nó rẻ hơn và dễ triển khai hơn so với ứng dụng SSR vì đầu ra là HTML và tài sản tĩnh. Từ khóa ở đây là **tĩnh**: SSG chỉ có thể được áp dụng cho các trang cung cấp dữ liệu tĩnh, tức là dữ liệu được biết tại thời điểm build và không thể thay đổi giữa các yêu cầu. Mỗi khi dữ liệu thay đổi, cần một lần triển khai mới.

Nếu bạn chỉ đang nghiên cứu SSR để cải thiện SEO của một vài trang marketing (ví dụ: `/`, `/about`, `/contact`, v.v.), thì có lẽ bạn muốn SSG thay vì SSR. SSG cũng tuyệt vời cho các trang web dựa trên nội dung như trang tài liệu hoặc blog. Trên thực tế, trang web bạn đang đọc ngay bây giờ được tạo tĩnh bằng [VitePress](https://vitepress.dev/), một trình tạo trang tĩnh dựa trên Vue.

## Hướng dẫn cơ bản {#basic-tutorial}

### Render một ứng dụng {#rendering-an-app}

Hãy xem ví dụ đơn giản nhất về Vue SSR trong hành động.

1. Tạo một thư mục mới và `cd` vào đó
2. Chạy `npm init -y`
3. Thêm `"type": "module"` trong `package.json` để Node.js chạy ở [chế độ ES modules](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
4. Chạy `npm install vue`
5. Tạo một tệp `example.js`:

```js
// đoạn mã này chạy trong Node.js trên server.
import { createSSRApp } from 'vue'
// API server-rendering của Vue được hiển thị dưới `vue/server-renderer`.
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

Sau đó chạy:

```sh
> node example.js
```

Nó sẽ in ra dòng sau trên dòng lệnh:

```
<button>1</button>
```

[`renderToString()`](/api/ssr#rendertostring) nhận một instance ứng dụng Vue và trả về một Promise được giải quyết thành HTML được render của ứng dụng. Cũng có thể stream render bằng cách sử dụng [Node.js Stream API](https://nodejs.org/api/stream.html) hoặc [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Xem [Tài liệu tham khảo API SSR](/api/ssr) để biết chi tiết đầy đủ.

Sau đó, chúng ta có thể chuyển mã Vue SSR vào một trình xử lý yêu cầu server, bao bọc markup ứng dụng với HTML trang đầy đủ. Chúng ta sẽ sử dụng [`express`](https://expressjs.com/) cho các bước tiếp theo:

- Chạy `npm install express`
- Tạo tệp `server.js` sau:

```js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('ready')
})
```

Cuối cùng, chạy `node server.js` và truy cập `http://localhost:3000`. Bạn sẽ thấy trang hoạt động với nút bấm.

[Try it on StackBlitz](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### Hydration phía Client {#client-hydration}

Nếu bạn nhấp vào nút, bạn sẽ nhận thấy số không thay đổi. HTML hoàn toàn tĩnh trên client vì chúng ta không đang tải Vue trong trình duyệt.

Để làm cho ứng dụng phía client tương tác, Vue cần thực hiện bước **hydration**. Trong quá trình hydration, nó tạo ra cùng một ứng dụng Vue đã chạy trên server, khớp từng component với các nút DOM mà nó nên kiểm soát, và gắn các trình nghe sự kiện DOM.

Để mount một ứng dụng ở chế độ hydration, chúng ta cần sử dụng [`createSSRApp()`](/api/application#createssrapp) thay vì `createApp()`:

```js{2}
// đoạn mã này chạy trong trình duyệt.
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...cùng ứng dụng như trên server
})

// mounting một ứng dụng SSR trên client giả định
// HTML đã được pre-render và sẽ thực hiện
// hydration thay vì mount các nút DOM mới.
app.mount('#app')
```

### Cấu trúc mã {#code-structure}

Lưu ý cách chúng ta cần tái sử dụng cùng một triển khai ứng dụng như trên server. Đây là nơi chúng ta cần bắt đầu suy nghĩ về cấu trúc mã trong ứng dụng SSR - làm thế nào để chia sẻ cùng một mã ứng dụng giữa server và client?

Ở đây chúng ta sẽ trình bày thiết lập đơn giản nhất. Đầu tiên, hãy chia logic tạo ứng dụng thành một tệp chuyên dụng, `app.js`:

```js [app.js]
// (chia sẻ giữa server và client)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

Tệp này và các dependency của nó được chia sẻ giữa server và client - chúng ta gọi chúng là **mã đa năng** (universal code). Có một số điều bạn cần chú ý khi viết mã đa năng, như chúng ta sẽ [thảo luận dưới đây](#writing-ssr-friendly-code).

Điểm nhập client của chúng ta nhập mã đa năng, tạo ứng dụng, và thực hiện mount:

```js [client.js]
import { createApp } from './app.js'

createApp().mount('#app')
```

Và server sử dụng cùng logic tạo ứng dụng trong trình xử lý yêu cầu:

```js{2,5} [server.js]
// (mã không liên quan bị bỏ qua)
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

Ngoài ra, để tải các tệp client trong trình duyệt, chúng ta cũng cần:

1. Phục vụ các tệp client bằng cách thêm `server.use(express.static('.'))` trong `server.js`.
2. Tải điểm nhập client bằng cách thêm `<script type="module" src="/client.js"></script>` vào HTML shell.
3. Hỗ trợ sử dụng như `import * from 'vue'` trong trình duyệt bằng cách thêm [Import Map](https://github.com/WICG/import-maps) vào HTML shell.

[Thử ví dụ hoàn chỉnh trên StackBlitz](https://stackblitz.com/fork/vue-ssr-example?file=index.js). Nút bấm giờ đã tương tác!

## Giải pháp cấp cao hơn {#higher-level-solutions}

Chuyển từ ví dụ sang một ứng dụng SSR sẵn sàng cho sản xuất liên quan đến nhiều việc hơn. Chúng ta sẽ cần:

- Hỗ trợ Vue SFC và các yêu cầu build khác. Trên thực tế, chúng ta sẽ cần điều phối hai build cho cùng một ứng dụng: một cho client, và một cho server.

  :::tip
  Các component Vue được biên dịch khác nhau khi sử dụng cho SSR - template được biên dịch thành chuỗi nối thay vì các hàm render Virtual DOM để có hiệu suất render tốt hơn.
  :::

- Trong trình xử lý yêu cầu server, render HTML với các liên kết tài sản phía client đúng và các gợi ý tài nguyên tối ưu. Chúng ta cũng có thể cần chuyển đổi giữa chế độ SSR và SSG, hoặc thậm chí kết hợp cả hai trong cùng một ứng dụng.

- Quản lý routing, lấy dữ liệu, và các cửa hàng quản lý trạng thái theo cách đa năng.

Một triển khai hoàn chỉnh sẽ khá phức tạp và phụ thuộc vào chuỗi công cụ build mà bạn đã chọn để làm việc. Do đó, chúng tôi khuyên bạn nên chọn một giải pháp cấp cao hơn, có quan điểm trừu tượng hóa sự phức tạp cho bạn. Dưới đây chúng tôi sẽ giới thiệu một số giải pháp SSR được khuyến nghị trong hệ sinh thái Vue.

### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) là một framework cấp cao hơn được xây dựng trên hệ sinh thái Vue cung cấp trải nghiệm phát triển hợp lý để viết các ứng dụng Vue đa năng. Tốt hơn nữa, bạn cũng có thể sử dụng nó như một trình tạo trang tĩnh! Chúng tôi khuyên bạn nên thử nó.

### Quasar {#quasar}

[Quasar](https://quasar.dev) là một giải pháp hoàn toàn dựa trên Vue cho phép bạn nhắm đến SPA, SSR, PWA, ứng dụng di động, ứng dụng desktop và tiện ích trình duyệt, tất cả đều sử dụng một codebase. Nó không chỉ xử lý thiết lập build, mà còn cung cấp một bộ sưu tập đầy đủ các component UI tuân thủ Material Design.

### Vite SSR {#vite-ssr}

Vite cung cấp [hỗ trợ tích hợp cho server-side rendering của Vue](https://vite.dev/guide/ssr.html), nhưng nó được thiết kế ở cấp thấp. Nếu bạn muốn đi trực tiếp với Vite, hãy xem [vite-plugin-ssr](https://vite-plugin-ssr.com/), một plugin cộng đồng trừu tượng hóa nhiều chi tiết khó khăn cho bạn.

Bạn cũng có thể tìm thấy một dự án Vue + Vite SSR sử dụng thiết lập thủ công [ở đây](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue), có thể đóng vai trò là cơ sở để xây dựng thêm. Lưu ý điều này chỉ được khuyến nghị nếu bạn có kinh nghiệm với SSR / công cụ build và thực sự muốn có kiểm soát hoàn toàn kiến trúc cấp cao hơn.

## Viết mã thân thiện với SSR {#writing-ssr-friendly-code}

Bất kể thiết lập build hoặc lựa chọn framework cấp cao hơn của bạn, có một số nguyên tắc áp dụng trong tất cả các ứng dụng Vue SSR.

### Tính phản hồi trên Server {#reactivity-on-the-server}

Trong SSR, mỗi URL yêu cầu ánh xạ đến một trạng thái mong muốn của ứng dụng của chúng ta. Không có tương tác người dùng và không có cập nhật DOM, vì vậy tính phản hồi là không cần thiết trên server. Theo mặc định, tính phản hồi bị vô hiệu hóa trong SSR để có hiệu suất tốt hơn.

### Lifecycle Hooks của Component {#component-lifecycle-hooks}

Vì không có cập nhật động, các lifecycle hook như <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> hoặc <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> sẽ **KHÔNG** được gọi trong SSR và chỉ được thực thi trên client.<span class="options-api"> Các hook duy nhất được gọi trong SSR là `beforeCreate` và `created`</span>

Bạn nên tránh mã tạo ra các tác dụng phụ cần dọn dẹp trong <span class="options-api">`beforeCreate` và `created`</span><span class="composition-api">`setup()` hoặc phạm vi gốc của `<script setup>`</span>. Một ví dụ về các tác dụng phụ như vậy là thiết lập bộ đếm thời gian với `setInterval`. Trong mã chỉ phía client, chúng ta có thể thiết lập một bộ đếm thời gian và sau đó dỡ nó trong <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> hoặc <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span>. Tuy nhiên, vì các hook unmount sẽ không bao giờ được gọi trong SSR, các bộ đếm thời gian sẽ tồn tại mãi mãi. Để tránh điều này, hãy chuyển mã tác dụng phụ của bạn vào <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> thay thế.

### Truy cập API dành riêng cho nền tảng {#access-to-platform-specific-apis}

Mã đa năng không thể giả định truy cập vào các API dành riêng cho nền tảng, vì vậy nếu mã của bạn sử dụng trực tiếp các biến toàn cầu chỉ dành cho trình duyệt như `window` hoặc `document`, chúng sẽ ném lỗi khi thực thi trong Node.js, và ngược lại.

Đối với các tác vụ được chia sẻ giữa server và client nhưng có các API nền tảng khác nhau, được khuyến nghị là bọc các triển khai dành riêng cho nền tảng bên trong một API đa năng, hoặc sử dụng các thư viện làm điều này cho bạn. Ví dụ, bạn có thể sử dụng [`node-fetch`](https://github.com/node-fetch/node-fetch) để sử dụng cùng một fetch API trên cả server và client.

Đối với các API chỉ dành cho trình duyệt, cách tiếp cận phổ biến là truy cập chúng một cách lười biếng bên trong các lifecycle hook chỉ dành cho client như <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

Lưu ý rằng nếu một thư viện bên thứ ba không được viết với suy nghĩ về sử dụng đa năng, có thể khó tích hợp nó vào một ứng dụng được render trên server. Bạn _có thể_ có thể làm cho nó hoạt động bằng cách giả lập một số biến toàn cầu, nhưng nó sẽ là một giải pháp hacky và có thể can thiệp vào mã phát hiện môi trường của các thư viện khác.

### Ô nhiễm trạng thái cross-request {#cross-request-state-pollution}

Trong chương Quản lý trạng thái, chúng tôi đã giới thiệu một [mô hình quản lý trạng thái đơn giản sử dụng API phản hồi](state-management#simple-state-management-with-reactivity-api). Trong bối cảnh SSR, mô hình này yêu cầu một số điều chỉnh bổ sung.

Mô hình này khai báo trạng thái chia sẻ trong phạm vi gốc của một module JavaScript. Điều này làm cho chúng trở thành **singleton** - tức là chỉ có một instance của đối tượng phản hồi trong toàn bộ vòng đời ứng dụng của chúng ta. Điều này hoạt động như mong đợi trong một ứng dụng Vue thuần phía client, vì các module trong ứng dụng của chúng ta được khởi tạo mới cho mỗi lần truy cập trang trình duyệt.

Tuy nhiên, trong bối cảnh SSR, các module ứng dụng thường chỉ được khởi tạo một lần trên server, khi server khởi động. Các instance module giống nhau sẽ được tái sử dụng trên nhiều yêu cầu server, và do đó các đối tượng trạng thái singleton của chúng ta cũng vậy. Nếu chúng ta thay đổi trạng thái singleton chia sẻ với dữ liệu dành riêng cho một người dùng, nó có thể bị rò rỉ một cách tình cờ sang một yêu cầu từ người dùng khác. Chúng ta gọi đây là **ô nhiễm trạng thái cross-request.**

Về mặt kỹ thuật, chúng ta có thể khởi tạo lại tất cả các module JavaScript trên mỗi yêu cầu, giống như chúng ta làm trong trình duyệt. Tuy nhiên, khởi tạo các module JavaScript có thể tốn kém, vì vậy điều này sẽ ảnh hưởng đáng kể đến hiệu suất server.

Giải pháp được khuyến nghị là tạo một instance mới của toàn bộ ứng dụng - bao gồm router và các cửa hàng toàn cầu - trên mỗi yêu cầu. Sau đó, thay vì nhập trực tiếp nó trong các component của chúng ta, chúng ta cung cấp trạng thái chia sẻ bằng cách sử dụng [provide cấp ứng dụng](/guide/components/provide-inject#app-level-provide) và inject nó trong các component cần nó:

```js [app.js]
// (chia sẻ giữa server và client)
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// được gọi trên mỗi yêu cầu
export function createApp() {
  const app = createSSRApp(/* ... */)
  // tạo instance mới của store cho mỗi yêu cầu
  const store = createStore(/* ... */)
  // provide store ở cấp ứng dụng
  app.provide('store', store)
  // cũng hiển thị store cho mục đích hydration
  return { app, store }
}
```

Các thư viện quản lý trạng thái như Pinia được thiết kế với suy nghĩ này. Tham khảo [hướng dẫn SSR của Pinia](https://pinia.vuejs.org/ssr/) để biết chi tiết.

### Sự không khớp Hydration {#hydration-mismatch}

Nếu cấu trúc DOM của HTML được pre-render không khớp với đầu ra mong đợi của ứng dụng phía client, sẽ có lỗi không khớp hydration. Sự không khớp hydration thường được gây ra bởi các nguyên nhân sau:

1. Template chứa cấu trúc lồng HTML không hợp lệ, và HTML được render đã được "sửa" bởi hành vi phân tích HTML gốc của trình duyệt. Ví dụ, một vấn đề phổ biến là [`<div>` không thể được đặt bên trong `<p>`](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it):

   ```html
   <p><div>hi</div></p>
   ```

   Nếu chúng ta tạo ra điều này trong HTML được render trên server của chúng ta, trình duyệt sẽ chấm dứt `<p>` đầu tiên khi gặp `<div>` và phân tích nó thành cấu trúc DOM sau:

   ```html
   <p></p>
   <div>hi</div>
   <p></p>
   ```

2. Dữ liệu được sử dụng trong quá trình render chứa các giá trị được tạo ngẫu nhiên. Vì cùng một ứng dụng sẽ chạy hai lần - một lần trên server, và một lần trên client - các giá trị ngẫu nhiên không được đảm bảo giống nhau giữa hai lần chạy. Có hai cách để tránh các sự không khớp do giá trị ngẫu nhiên:

   1. Sử dụng `v-if` + `onMounted` để render phần phụ thuộc vào giá trị ngẫu nhiên chỉ trên client. Framework của bạn cũng có thể có các tính năng tích hợp để làm điều này dễ dàng hơn, ví dụ component `<ClientOnly>` trong VitePress.

   2. Sử dụng thư viện tạo số ngẫu nhiên hỗ trợ tạo với seed, và đảm bảo lần chạy server và lần chạy client sử dụng cùng một seed (ví dụ: bằng cách bao gồm seed trong trạng thái được serialize và truy xuất nó trên client).

3. Server và client ở các múi giờ khác nhau. Đôi khi, chúng ta có thể muốn chuyển đổi một dấu thời gian thành giờ địa phương của người dùng. Tuy nhiên, múi giờ trong lần chạy server và múi giờ trong lần chạy client không phải lúc nào cũng giống nhau, và chúng ta có thể không biết một cách đáng tin cậy múi giờ của người dùng trong lần chạy server. Trong những trường hợp như vậy, chuyển đổi giờ địa phương cũng nên được thực hiện như một hoạt động chỉ dành cho client.

Khi Vue gặp sự không khớp hydration, nó sẽ cố gắng tự động phục hồi và điều chỉnh DOM được pre-render để khớp với trạng thái phía client. Điều này sẽ dẫn đến một số mất mát hiệu suất render do các nút không chính xác bị loại bỏ và các nút mới được mount, nhưng trong hầu hết các trường hợp, ứng dụng sẽ tiếp tục hoạt động như mong đợi. Điều đó nói rằng, vẫn tốt nhất là loại bỏ các sự không khớp hydration trong quá trình phát triển.

#### Chặn các sự không khớp Hydration <sup class="vt-badge" data-text="3.5+" /> {#suppressing-hydration-mismatches}

Trong Vue 3.5+, có thể chặn có chọn lọc các sự không khớp hydration không thể tránh khỏi bằng cách sử dụng thuộc tính [`data-allow-mismatch`](/api/ssr#data-allow-mismatch).

### Directive tùy chỉnh {#custom-directives}

Vì hầu hết các directive tùy chỉnh liên quan đến thao tác DOM trực tiếp, chúng bị bỏ qua trong SSR. Tuy nhiên, nếu bạn muốn chỉ định cách một directive tùy chỉnh nên được render (tức là các thuộc tính nó nên thêm vào phần tử được render), bạn có thể sử dụng hook directive `getSSRProps`:

```js
const myDirective = {
  mounted(el, binding) {
    // triển khai phía client:
    // cập nhật DOM trực tiếp
    el.id = binding.value
  },
  getSSRProps(binding) {
    // triển khai phía server:
    // trả về các props để được render.
    // getSSRProps chỉ nhận binding của directive.
    return {
      id: binding.value
    }
  }
}
```

### Teleports {#teleports}

Teleports yêu cầu xử lý đặc biệt trong SSR. Nếu ứng dụng được render chứa Teleports, nội dung được teleport sẽ không là một phần của chuỗi được render. Một giải pháp dễ hơn là render có điều kiện Teleport khi mount.

Nếu bạn thực sự cần hydrate nội dung được teleport, chúng được hiển thị dưới thuộc tính `teleports` của đối tượng ngữ cảnh ssr:

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```

Bạn cần chèn markup teleport vào vị trí đúng trong HTML trang cuối cùng tương tự như cách bạn cần chèn markup ứng dụng chính.

:::tip
Tránh nhắm đến `body` khi sử dụng Teleports và SSR cùng nhau - thường, `<body>` sẽ chứa nội dung được render trên server khác, điều này làm cho Teleports không thể xác định vị trí bắt đầu đúng cho hydration.

Thay vào đó, hãy ưu tiên một container chuyên dụng, ví dụ `<div id="teleported"></div>` chỉ chứa nội dung được teleport.
:::

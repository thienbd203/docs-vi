# Triển khai Production {#production-deployment}

## Development vs. Production {#development-vs-production}

Trong quá trình phát triển, Vue cung cấp một số tính năng để cải thiện trải nghiệm phát triển:

- Cảnh báo cho các lỗi và cạm bẫy phổ biến
- Xác thực props / events
- [Reactivity debugging hooks](/guide/extras/reactivity-in-depth#reactivity-debugging)
- Tích hợp Devtools

Tuy nhiên, các tính năng này trở nên vô dụng trong production. Một số kiểm tra cảnh báo cũng có thể gây ra một lượng nhỏ chi phí hiệu suất. Khi triển khai sang production, chúng ta nên loại bỏ tất cả các nhánh mã không sử dụng, chỉ dành cho phát triển để có kích thước payload nhỏ hơn và hiệu suất tốt hơn.

## Không Có Build Tools {#without-build-tools}

Nếu bạn đang sử dụng Vue không có build tool bằng cách tải nó từ CDN hoặc script tự lưu trữ, hãy đảm bảo sử dụng bản production (các file dist kết thúc bằng `.prod.js`) khi triển khai sang production. Các bản production được minify trước với tất cả các nhánh mã chỉ dành cho phát triển được loại bỏ.

- Nếu sử dụng bản global (truy cập qua `Vue` global): sử dụng `vue.global.prod.js`.
- Nếu sử dụng bản ESM (truy cập qua các import ESM gốc): sử dụng `vue.esm-browser.prod.js`.

Tham khảo [hướng dẫn file dist](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) để biết thêm chi tiết.

## Với Build Tools {#with-build-tools}

Các dự án được scaffold qua `create-vue` (dựa trên Vite) hoặc Vue CLI (dựa trên webpack) được cấu hình trước cho các bản production.

Nếu sử dụng cài đặt tùy chỉnh, hãy đảm bảo rằng:

1. `vue` resolves đến `vue.runtime.esm-bundler.js`.
2. Các [compile time feature flags](/api/compile-time-flags) được cấu hình đúng.
3. <code>process.env<wbr>.NODE_ENV</code> được thay thế bằng `"production"` trong quá trình build.

Tham khảo thêm:

- [Hướng dẫn build production Vite](https://vite.dev/guide/build.html)
- [Hướng dẫn triển khai Vite](https://vite.dev/guide/static-deploy.html)
- [Hướng dẫn triển khai Vue CLI](https://cli.vuejs.org/guide/deployment.html)

## Theo dõi Lỗi Runtime {#tracking-runtime-errors}

[App-level error handler](/api/application#app-config-errorhandler) có thể được sử dụng để báo cáo lỗi cho các dịch vụ theo dõi:

```js
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // báo cáo lỗi cho các dịch vụ theo dõi
}
```

Các dịch vụ như [Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) và [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/) cũng cung cấp tích hợp chính thức cho Vue.

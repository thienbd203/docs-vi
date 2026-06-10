<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Công cụ {#tooling}

## Thử Trực Tuyến {#try-it-online}

Bạn không cần cài đặt bất cứ thứ gì trên máy của mình để thử Vue SFC - có các playground trực tuyến cho phép bạn làm điều đó ngay trong trình duyệt:

- [Vue SFC Playground](https://play.vuejs.org)
  - Luôn được triển khai từ commit mới nhất
  - Được thiết kế để kiểm tra kết quả biên dịch component
- [Vue + Vite on StackBlitz](https://vite.new/vue)
  - Môi trường giống IDE chạy Vite dev server thực tế trong trình duyệt
  - Gần giống với thiết lập cục bộ nhất

Ngoài ra, cũng được khuyến nghị sử dụng các playground trực tuyến này để cung cấp bản tái hiện khi báo cáo lỗi.

## Khởi Tạo Dự Án {#project-scaffolding}

### Vite {#vite}

[Vite](https://vite.dev/) là một công cụ build nhẹ và nhanh với hỗ trợ Vue SFC hạng nhất. Nó được tạo bởi Evan You, người cũng là tác giả của Vue!

Để bắt đầu với Vite + Vue, chỉ cần chạy:

::: code-group

```sh [npm]
$ npm create vue@latest
```

```sh [pnpm]
$ pnpm create vue@latest
```
  
```sh [yarn]
# Đối với Yarn Modern (v2+)
$ yarn create vue@latest

# Đối với Yarn ^v4.11
$ yarn dlx create-vue@latest
```
  
```sh [bun]
$ bun create vue@latest
```

:::

Lệnh này sẽ cài đặt và thực thi [create-vue](https://github.com/vuejs/create-vue), công cụ khởi tạo dự án Vue chính thức.

- Để tìm hiểu thêm về Vite, hãy xem [tài liệu Vite](https://vite.dev/).
- Để cấu hình hành vi cụ thể của Vue trong dự án Vite, ví dụ truyền các tùy chọn cho Vue compiler, hãy xem tài liệu của [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme).

Cả hai playground trực tuyến được đề cập ở trên đều hỗ trợ tải xuống file dưới dạng dự án Vite.

### Vue CLI {#vue-cli}

[Vue CLI](https://cli.vuejs.org/) là toolchain dựa trên webpack chính thức cho Vue. Nó hiện đang ở chế độ bảo trì và chúng tôi khuyến nghị bắt đầu các dự án mới với Vite trừ khi bạn phụ thuộc vào các tính năng chỉ có ở webpack. Vite sẽ cung cấp trải nghiệm phát triển vượt trội trong hầu hết các trường hợp.

Để biết thông tin về việc di chuyển từ Vue CLI sang Vite:

- [Hướng dẫn di chuyển Vue CLI -> Vite từ VueSchool.io](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [Công cụ / Plugin giúp tự động di chuyển](https://github.com/vitejs/awesome-vite#vue-cli)

### Lưu ý về Biên dịch Template trong Trình duyệt {#note-on-in-browser-template-compilation}

Khi sử dụng Vue mà không có bước build, template của component được viết trực tiếp trong HTML của trang hoặc dưới dạng chuỗi JavaScript. Trong những trường hợp này, Vue cần gửi template compiler đến trình duyệt để thực hiện biên dịch template theo thời gian thực. Mặt khác, compiler sẽ không cần thiết nếu chúng ta biên dịch trước các template với bước build. Để giảm kích thước bundle client, Vue cung cấp [các "build" khác nhau](https://unpkg.com/browse/vue@3/dist/) được tối ưu hóa cho các trường hợp sử dụng khác nhau.

- Các file build bắt đầu bằng `vue.runtime.*` là **runtime-only builds**: chúng không bao gồm compiler. Khi sử dụng các build này, tất cả template phải được biên dịch trước thông qua bước build.

- Các file build không bao gồm `.runtime` là **full builds**: chúng bao gồm compiler và hỗ trợ biên dịch template trực tiếp trong trình duyệt. Tuy nhiên, chúng sẽ tăng payload lên khoảng 14kb.

Thiết lập tooling mặc định của chúng tôi sử dụng runtime-only build vì tất cả template trong SFC đều được biên dịch trước. Nếu, vì một lý do nào đó, bạn cần biên dịch template trong trình duyệt ngay cả khi có bước build, bạn có thể làm điều đó bằng cách cấu hình công cụ build để alias `vue` thành `vue/dist/vue.esm-bundler.js` thay thế.

Nếu bạn đang tìm kiếm một giải pháp thay thế nhẹ hơn cho việc sử dụng không có bước build, hãy xem [petite-vue](https://github.com/vuejs/petite-vue).

## Hỗ trợ IDE {#ide-support}

- Thiết lập IDE được khuyến nghị là [VS Code](https://code.visualstudio.com/) + [extension Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (trước đây là Volar). Extension này cung cấp syntax highlighting, hỗ trợ TypeScript, và intellisense cho template expressions và component props.

  :::tip
  Vue - Official thay thế [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), extension VS Code chính thức trước đây của chúng tôi cho Vue 2. Nếu bạn hiện đang cài đặt Vetur, hãy đảm bảo tắt nó trong các dự án Vue 3.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) cũng cung cấp hỗ trợ tích hợp tuyệt vời cho Vue SFC.

- Các IDE khác hỗ trợ [Language Service Protocol](https://microsoft.github.io/language-server-protocol/) (LSP) cũng có thể tận dụng các chức năng cốt lõi của Volar thông qua LSP:

  - Hỗ trợ Sublime Text thông qua [LSP-Volar](https://github.com/sublimelsp/LSP-volar).

  - Hỗ trợ vim / Neovim thông qua [coc-volar](https://github.com/yaegassy/coc-volar).

  - Hỗ trợ emacs thông qua [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/)

## Devtools Trình duyệt {#browser-devtools}

Extension devtools trình duyệt Vue cho phép bạn khám phá cây component của ứng dụng Vue, kiểm tra trạng thái của từng component, theo dõi các sự kiện quản lý trạng thái, và phân tích hiệu suất.

![devtools screenshot](./images/devtools.png)

- [Tài liệu](https://devtools.vuejs.org/)
- [Extension Chrome](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Plugin Vite](https://devtools.vuejs.org/guide/vite-plugin)
- [Ứng dụng Electron độc lập](https://devtools.vuejs.org/guide/standalone)

## TypeScript {#typescript}

Bài viết chính: [Sử dụng Vue với TypeScript](/guide/typescript/overview).

- [Extension Vue - Official](https://github.com/vuejs/language-tools) cung cấp kiểm tra kiểu cho SFC sử dụng các block `<script lang="ts">`, bao gồm template expressions và xác thực props giữa các component.

- Sử dụng [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) để thực hiện kiểm tra kiểu tương tự từ dòng lệnh, hoặc để tạo file `d.ts` cho SFC.

## Kiểm thử {#testing}

Bài viết chính: [Hướng dẫn Kiểm thử](/guide/scaling-up/testing).

- [Cypress](https://www.cypress.io/) được khuyến nghị cho kiểm thử E2E. Nó cũng có thể được sử dụng để kiểm thử component cho Vue SFCs thông qua [Cypress Component Test Runner](https://docs.cypress.io/guides/component-testing/introduction).

- [Vitest](https://vitest.dev/) là một test runner được tạo bởi các thành viên của đội Vue / Vite tập trung vào tốc độ. Nó được thiết kế đặc biệt cho các ứng dụng dựa trên Vite để cung cấp vòng phản hồi tức thì tương tự cho kiểm thử đơn vị / component.

- [Jest](https://jestjs.io/) có thể được sử dụng với Vite thông qua [vite-jest](https://github.com/sodatea/vite-jest). Tuy nhiên, điều này chỉ được khuyến nghị nếu bạn có các bộ kiểm thử dựa trên Jest hiện có cần di chuyển sang thiết lập dựa trên Vite, vì Vitest cung cấp các chức năng tương tự với tích hợp hiệu quả hơn nhiều.

## Linting {#linting}

Đội Vue duy trì [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), một plugin [ESLint](https://eslint.org/) hỗ trợ các quy tắc linting đặc thù cho SFC.

Người dùng trước đây sử dụng Vue CLI có thể đã quen với việc có linters được cấu hình qua webpack loaders. Tuy nhiên khi sử dụng thiết lập build dựa trên Vite, khuyến nghị chung của chúng ta là:

1. `npm install -D eslint eslint-plugin-vue`, sau đó theo [hướng dẫn cấu hình](https://eslint.vuejs.org/user-guide/#usage) của `eslint-plugin-vue`.

2. Thiết lập các phần mở rộng IDE ESLint, ví dụ [ESLint for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), để bạn nhận được phản hồi linter ngay trong editor của mình trong quá trình phát triển. Điều này cũng tránh chi phí linting không cần thiết khi khởi động dev server.

3. Chạy ESLint như một phần của lệnh build production, để bạn nhận được phản hồi linter đầy đủ trước khi ship đến production.

4. (Tùy chọn) Thiết lập các công cụ như [lint-staged](https://github.com/okonet/lint-staged) để tự động lint các file đã sửa đổi trên git commit.

## Định dạng {#formatting}

- Extension [Vue - Official](https://github.com/vuejs/language-tools) VS Code cung cấp định dạng cho Vue SFCs ngay lập tức.

- Ngoài ra, [Prettier](https://prettier.io/) cung cấp hỗ trợ định dạng Vue SFC tích hợp.

## Tích hợp Custom Block SFC {#sfc-custom-block-integrations}

Custom blocks được biên dịch thành các import đến cùng một file Vue với các truy vấn yêu cầu khác nhau. Việc xử lý các yêu cầu import này phụ thuộc vào công cụ build bên dưới.

- Nếu sử dụng Vite, một plugin Vite tùy chỉnh nên được sử dụng để chuyển đổi các custom block khớp thành JavaScript thực thi. [Ví dụ](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- Nếu sử dụng Vue CLI hoặc webpack thuần, một webpack loader nên được cấu hình để chuyển đổi các block khớp. [Ví dụ](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## Các Package Cấp Thấp {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [Tài liệu](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

Package này là một phần của Vue core monorepo và luôn được xuất bản với cùng phiên bản như package `vue` chính. Nó được bao gồm như một dependency của package `vue` chính và được proxy dưới `vue/compiler-sfc` vì vậy bạn không cần cài đặt nó riêng lẻ.

Package chính nó cung cấp các tiện ích cấp thấp hơn để xử lý Vue SFCs và chỉ dành cho các tác giả tooling cần hỗ trợ Vue SFCs trong các công cụ tùy chỉnh.

:::tip
Luôn ưu tiên sử dụng package này qua deep import `vue/compiler-sfc` vì điều này đảm bảo phiên bản của nó đồng bộ với Vue runtime.
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [Tài liệu](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

Plugin chính thức cung cấp hỗ trợ Vue SFC trong Vite.

### `vue-loader` {#vue-loader}

- [Tài liệu](https://vue-loader.vuejs.org/)

Loader chính thức cung cấp hỗ trợ Vue SFC trong webpack. Nếu bạn đang sử dụng Vue CLI, hãy xem thêm [tài liệu về sửa đổi tùy chọn `vue-loader` trong Vue CLI](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

## Các Playground Trực Tuyến Khác {#other-online-playgrounds}

- [VueUse Playground](https://play.vueuse.org)
- [Vue + Vite on Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue on CodeSandbox](https://codesandbox.io/p/devbox/github/codesandbox/sandbox-templates/tree/main/vue-vite)
- [Vue on Codepen](https://codepen.io/pen/editor/vue)
- [Vue on WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->

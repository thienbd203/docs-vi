<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>
<style>
.lambdatest {
  background-color: var(--vt-c-bg-soft);
  border-radius: 8px;
  padding: 12px 16px 12px 12px;
  font-size: 13px;
  a {
    display: flex;
    color: var(--vt-c-text-2);
  }
  img {
    background-color: #fff;
    padding: 12px 16px;
    border-radius: 6px;
    margin-right: 24px;
  }
  .testing-partner {
    color: var(--vt-c-text-1);
    font-size: 15px;
    font-weight: 600;
  }
}
</style>

# Kiểm thử {#testing}

## Tại sao cần Kiểm thử? {#why-test}

Các bài kiểm thử tự động giúp bạn và nhóm của bạn xây dựng các ứng dụng Vue phức tạp một cách nhanh chóng và tự tin bằng cách ngăn chặn các lỗi hồi quy và khuyến khích bạn chia nhỏ ứng dụng thành các hàm, module, class và component có thể kiểm thử được. Giống như bất kỳ ứng dụng nào, ứng dụng Vue mới của bạn có thể gặp lỗi theo nhiều cách khác nhau, và việc bạn có thể phát hiện các vấn đề này và khắc phục chúng trước khi phát hành là rất quan trọng.

Trong hướng dẫn này, chúng tôi sẽ bao gồm các thuật ngữ cơ bản và đưa ra các khuyến nghị của chúng tôi về việc chọn công cụ nào cho ứng dụng Vue 3 của bạn.

Có một phần dành riêng cho Vue bao gồm các composables. Xem [Kiểm thử Composables](#testing-composables) bên dưới để biết thêm chi tiết.

## Khi nào nên Kiểm thử {#when-to-test}

Hãy bắt đầu kiểm thử sớm! Chúng tôi khuyến nghị bạn bắt đầu viết các bài kiểm thử càng sớm càng tốt. Bạn càng chậm thêm các bài kiểm thử vào ứng dụng, ứng dụng của bạn sẽ càng có nhiều phụ thuộc, và việc bắt đầu sẽ càng khó khăn hơn.

## Các loại Kiểm thử {#testing-types}

Khi thiết kế chiến lược kiểm thử cho ứng dụng Vue của bạn, bạn nên tận dụng các loại kiểm thử sau:

- **Đơn vị (Unit)**: Kiểm tra xem các đầu vào của một hàm, class, hoặc composable cụ thể có tạo ra đầu ra hoặc tác dụng phụ mong đợi hay không.
- **Component**: Kiểm tra xem component của bạn có được mount, render, có thể tương tác và hoạt động như mong đợi hay không. Các bài kiểm thử này nhập nhiều code hơn bài kiểm thử đơn vị, phức tạp hơn và cần nhiều thời gian hơn để thực thi.
- **End-to-end**: Kiểm tra các tính năng trải dài qua nhiều trang và thực hiện các yêu cầu mạng thực tế đối với ứng dụng Vue đã build cho production. Các bài kiểm thử này thường liên quan đến việc thiết lập cơ sở dữ liệu hoặc backend khác.

Mỗi loại kiểm thử đều đóng vai trò trong chiến lược kiểm thử của ứng dụng của bạn, và mỗi loại sẽ bảo vệ bạn chống lại các loại vấn đề khác nhau.

## Tổng quan {#overview}

Chúng tôi sẽ thảo luận ngắn gọn về từng loại này, cách chúng có thể được triển khai cho các ứng dụng Vue, và đưa ra một số khuyến nghị chung.

## Kiểm thử Đơn vị {#unit-testing}

Các bài kiểm thử đơn vị được viết để xác minh rằng các đơn vị code nhỏ, độc lập đang hoạt động như mong đợi. Một bài kiểm thử đơn vị thường bao gồm một hàm, class, composable hoặc module duy nhất. Các bài kiểm thử đơn vị tập trung vào tính logic chính xác và chỉ quan tâm đến một phần nhỏ của chức năng tổng thể của ứng dụng. Chúng có thể mock một phần lớn môi trường của ứng dụng (ví dụ: trạng thái ban đầu, các class phức tạp, module bên thứ ba và các yêu cầu mạng).

Nói chung, các bài kiểm thử đơn vị sẽ phát hiện các vấn đề với logic nghiệp vụ và tính logic chính xác của một hàm.

Ví dụ, hãy xem hàm `increment` này:

```js [helpers.js]
export function increment(current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

Vì nó rất tự chứa, sẽ dễ dàng để gọi hàm increment và xác nhận rằng nó trả về những gì nó nên trả về, vì vậy chúng ta sẽ viết một Bài kiểm thử Đơn vị.

Nếu bất kỳ xác nhận nào thất bại, rõ ràng là vấn đề nằm trong hàm `increment`.

```js{3-15} [helpers.spec.js]
import { increment } from './helpers'

describe('increment', () => {
  test('increments the current number by 1', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('does not increment the current number over the max', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('has a default max of 10', () => {
    expect(increment(10)).toBe(10)
  })
})
```

Như đã đề cập trước đó, kiểm thử đơn vị thường được áp dụng cho logic nghiệp vụ tự chứa, các component, class, module hoặc hàm không liên quan đến việc render UI, yêu cầu mạng hoặc các mối quan tâm môi trường khác.

Đây thường là các module JavaScript / TypeScript thuần không liên quan đến Vue. Nói chung, việc viết các bài kiểm thử đơn vị cho logic nghiệp vụ trong các ứng dụng Vue không khác biệt đáng kể so với các ứng dụng sử dụng các framework khác.

Có hai trường hợp bạn CẦN kiểm thử đơn vị các tính năng cụ thể của Vue:

1. Composables
2. Components

### Composables {#composables}

Một danh mục hàm cụ thể cho các ứng dụng Vue là [Composables](/guide/reusability/composables), có thể cần xử lý đặc biệt trong quá trình kiểm thử.
Xem [Kiểm thử Composables](#testing-composables) bên dưới để biết thêm chi tiết.

### Kiểm thử Đơn vị Component {#unit-testing-components}

Một component có thể được kiểm thử theo hai cách:

1. Whitebox: Kiểm thử Đơn vị

   Các bài kiểm thử "Whitebox tests" biết về chi tiết triển khai và các phụ thuộc của một component. Chúng tập trung vào việc **cô lập** component đang được kiểm thử. Các bài kiểm thử này thường liên quan đến việc mock một số, nếu không phải là tất cả các component con của bạn, cũng như thiết lập trạng thái plugin và các phụ thuộc (ví dụ: Pinia).

2. Blackbox: Kiểm thử Component

   Các bài kiểm thử "Blackbox tests" không biết về chi tiết triển khai của một component. Các bài kiểm thử này mock càng ít càng tốt để kiểm tra tích hợp của component và toàn bộ hệ thống. Chúng thường render tất cả các component con và được coi là một "bài kiểm thử tích hợp" hơn. Xem [Khuyến nghị Kiểm thử Component](#component-testing) bên dưới.

### Khuyến nghị {#recommendation}

- [Vitest](https://vitest.dev/)

  Vì cấu hình chính thức được tạo bởi `create-vue` dựa trên [Vite](https://vite.dev/), chúng tôi khuyến nghị sử dụng một framework kiểm thử đơn vị có thể tận dụng cùng cấu hình và pipeline chuyển đổi trực tiếp từ Vite. [Vitest](https://vitest.dev/) là một framework kiểm thử đơn vị được thiết kế riêng cho mục đích này, được tạo và duy trì bởi các thành viên của nhóm Vue / Vite. Nó tích hợp với các dự án dựa trên Vite với nỗ lực tối thiểu và cực kỳ nhanh.

### Các lựa chọn khác {#other-options}

- [Jest](https://jestjs.io/) là một framework kiểm thử đơn vị phổ biến. Tuy nhiên, chúng tôi chỉ khuyến nghị Jest nếu bạn có một bộ kiểm thử Jest hiện có cần được chuyển sang dự án dựa trên Vite, vì Vitest cung cấp tích hợp liền mạch hơn và hiệu suất tốt hơn.

## Kiểm thử Component {#component-testing}

Trong các ứng dụng Vue, các component là các khối xây dựng chính của UI. Do đó, các component là đơn vị cô lập tự nhiên khi nói đến việc xác thực hành vi của ứng dụng. Từ góc độ độ chi tiết, kiểm thử component nằm ở đâu đó trên kiểm thử đơn vị và có thể được coi là một hình thức kiểm thử tích hợp. Phần lớn ứng dụng Vue của bạn nên được bao phủ bởi một bài kiểm thử component và chúng tôi khuyến nghị rằng mỗi component Vue có file spec riêng của nó.

Các bài kiểm thử component nên phát hiện các vấn đề liên quan đến props, events, slots mà component cung cấp, styles, classes, lifecycle hooks và nhiều hơn nữa.

Các bài kiểm thử component không nên mock các component con, thay vào đó kiểm tra các tương tác giữa component và các component con của nó bằng cách tương tác với các component như người dùng sẽ. Ví dụ, một bài kiểm thử component nên nhấp vào một phần tử như người dùng sẽ thay vì tương tác theo lập trình với component.

Các bài kiểm thử component nên tập trung vào các giao diện công khai của component thay vì chi tiết triển khai nội bộ. Đối với hầu hết các component, giao diện công khai bị giới hạn ở: events được phát ra, props và slots. Khi kiểm thử, hãy nhớ đến **kiểm thử component làm gì, không phải cách nó làm**.

**NÊN**

- Đối với logic **Visual**: xác nhận đầu ra render đúng dựa trên props và slots được nhập.
- Đối với logic **Hành vi**: xác nhận các cập nhật render hoặc events được phát ra đúng để phản hồi các sự kiện nhập của người dùng.

  Trong ví dụ dưới đây, chúng tôi trình bày một component Stepper có một phần tử DOM được gắn nhãn "increment" và có thể được nhấp. Chúng ta truyền một prop gọi là `max` ngăn chặn Stepper được tăng lên quá `2`, vì vậy nếu chúng ta nhấp vào nút 3 lần, UI vẫn nên nói `2`.

  Chúng ta không biết gì về triển khai của Stepper, chỉ biết rằng "đầu vào" là prop `max` và "đầu ra" là trạng thái của DOM như người dùng sẽ thấy nó.

::: code-group

```js [Vue Test Utils]
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

const wrapper = mount(Stepper, {
  props: {
    max: 1
  }
})

expect(wrapper.find(valueSelector).text()).toContain('0')

await wrapper.find(buttonSelector).trigger('click')

expect(wrapper.find(valueSelector).text()).toContain('1')
```

```js [Cypress]
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

mount(Stepper, {
  props: {
    max: 1
  }
})

cy.get(valueSelector)
  .should('be.visible')
  .and('contain.text', '0')
  .get(buttonSelector)
  .click()
  .get(valueSelector)
  .should('contain.text', '1')
```

```js [Testing Library]
const { getByText } = render(Stepper, {
  props: {
    max: 1
  }
})

getByText('0') // Implicit assertion that "0" is within the component

const button = getByRole('button', { name: /increment/i })

// Dispatch a click event to our increment button.
await fireEvent.click(button)

getByText('1')

await fireEvent.click(button)
```

:::

**KHÔNG NÊN**

- Không xác nhận trạng thái riêng tư của một thể hiện component hoặc kiểm tra các phương thức riêng tư của một component. Kiểm thử chi tiết triển khai làm cho các bài kiểm thử trở nên mong manh, vì chúng có nhiều khả năng bị hỏng và cần cập nhật khi triển khai thay đổi.

  Công việc cuối cùng của component là render đầu ra DOM đúng, vì vậy các bài kiểm thử tập trung vào đầu ra DOM cung cấp cùng mức độ đảm bảo tính chính xác (nếu không nhiều hơn) trong khi mạnh mẽ hơn và linh hoạt hơn với thay đổi.

  Không chỉ dựa vào các bài kiểm thử snapshot. Xác nhận các chuỗi HTML không mô tả tính chính xác. Hãy viết các bài kiểm thử có chủ đích.

  Nếu một phương thức cần được kiểm thử kỹ lưỡng, hãy xem xét việc trích xuất nó thành một hàm tiện ích độc lập và viết một bài kiểm thử đơn vị dành riêng cho nó. Nếu nó không thể được trích xuất sạch, nó có thể được kiểm thử như một phần của bài kiểm thử component, tích hợp hoặc end-to-end bao phủ nó.

### Khuyến nghị {#recommendation-1}

- [Vitest](https://vitest.dev/) cho các component hoặc composables render không có giao diện (ví dụ: hàm [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) trong VueUse). Các component và DOM có thể được kiểm thử bằng [`@vue/test-utils`](https://github.com/vuejs/test-utils).

- [Cypress Component Testing](https://on.cypress.io/component) cho các component có hành vi mong đợi phụ thuộc vào việc render styles đúng hoặc kích hoạt các sự kiện DOM gốc. Nó có thể được sử dụng với Testing Library thông qua [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro).

Sự khác biệt chính giữa Vitest và các runner dựa trên trình duyệt là tốc độ và ngữ cảnh thực thi. Tóm lại, các runner dựa trên trình duyệt, như Cypress, có thể phát hiện các vấn đề mà các runner dựa trên node, như Vitest, không thể (ví dụ: các vấn đề về style, các sự kiện DOM gốc thực sự, cookies, bộ nhớ cục bộ và lỗi mạng), nhưng các runner dựa trên trình duyệt _chậm hơn Vitest nhiều cấp độ_ vì chúng mở một trình duyệt, biên dịch các stylesheet của bạn và nhiều hơn nữa. Cypress là một runner dựa trên trình duyệt hỗ trợ kiểm thử component. Vui lòng đọc [trang so sánh của Vitest](https://vitest.dev/guide/comparisons.html#cypress) để biết thông tin mới nhất so sánh Vitest và Cypress.

### Thư viện Mounting {#mounting-libraries}

Kiểm thử component thường liên quan đến việc mount component đang được kiểm thử một cách cô lập, kích hoạt các sự kiện nhập người dùng được mô phỏng và xác nhận trên đầu ra DOM được render. Có các thư viện tiện ích chuyên dụng làm cho các nhiệm vụ này đơn giản hơn.

- [`@vue/test-utils`](https://github.com/vuejs/test-utils) là thư viện kiểm thử component cấp thấp chính thức được viết để cung cấp cho người dùng quyền truy cập vào các API cụ thể của Vue. Nó cũng là thư viện cấp thấp mà `@testing-library/vue` được xây dựng trên đó.

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) là thư viện kiểm thử Vue tập trung vào việc kiểm thử các component mà không dựa vào chi tiết triển khai. Nguyên tắc hướng dẫn của nó là các bài kiểm thử càng giống cách phần mềm được sử dụng, chúng càng có thể cung cấp nhiều sự tự tin hơn.

Chúng tôi khuyến nghị sử dụng `@vue/test-utils` để kiểm thử các component trong các ứng dụng. `@testing-library/vue` có các vấn đề với việc kiểm thử component bất đồng bộ với Suspense, vì vậy nó nên được sử dụng một cách thận trọng.

### Các lựa chọn khác {#other-options-1}

- [Nightwatch](https://nightwatchjs.org/) là một runner kiểm thử E2E với hỗ trợ Kiểm thử Component Vue. ([Dự án Ví dụ](https://github.com/nightwatchjs-community/todo-vue))

- [WebdriverIO](https://webdriver.io/docs/component-testing/vue) cho kiểm thử component đa trình duyệt dựa trên tương tác người dùng gốc dựa trên tự động hóa chuẩn hóa. Nó cũng có thể được sử dụng với Testing Library.

## Kiểm thử E2E {#e2e-testing}

Mặc dù các bài kiểm thử đơn vị cung cấp cho các nhà phát triển một mức độ tự tin nào đó, các bài kiểm thử đơn vị và component bị giới hạn trong khả năng cung cấp bao phủ toàn diện cho một ứng dụng khi được triển khai đến production. Do đó, các bài kiểm thử end-to-end (E2E) cung cấp bao phủ cho những gì có thể là khía cạnh quan trọng nhất của một ứng dụng: điều gì xảy ra khi người dùng thực sự sử dụng các ứng dụng của bạn.

Các bài kiểm thử end-to-end tập trung vào hành vi ứng dụng đa trang thực hiện các yêu cầu mạng đối với ứng dụng Vue đã build cho production của bạn. Chúng thường liên quan đến việc thiết lập cơ sở dữ liệu hoặc backend khác và thậm chí có thể được chạy đối với một môi trường staging trực tiếp.

Các bài kiểm thử end-to-end thường sẽ phát hiện các vấn đề với router, thư viện quản lý trạng thái, các component cấp cao nhất (ví dụ: App hoặc Layout), tài sản công khai hoặc bất kỳ xử lý yêu cầu nào. Như đã nêu ở trên, chúng phát hiện các vấn đề quan trọng có thể không thể phát hiện với các bài kiểm thử đơn vị hoặc component.

Các bài kiểm thử end-to-end không nhập bất kỳ code nào của ứng dụng Vue của bạn mà thay vào đó dựa hoàn toàn vào việc kiểm thử ứng dụng của bạn bằng cách điều hướng qua các trang hoàn chỉnh trong một trình duyệt thực.

Các bài kiểm thử end-to-end xác thực nhiều lớp trong ứng dụng của bạn. Chúng có thể nhắm đến ứng dụng được build cục bộ của bạn hoặc thậm chí một môi trường Staging trực tiếp. Kiểm thử đối với môi trường Staging của bạn không chỉ bao gồm code frontend và máy chủ tĩnh của bạn mà tất cả các dịch vụ backend và cơ sở hạ tầng liên quan.

> Các bài kiểm thử của bạn càng giống cách phần mềm được sử dụng, chúng càng có thể cung cấp nhiều sự tự tin hơn cho bạn. - [Kent C. Dodds](https://x.com/kentcdodds/status/977018512689455106) - Tác giả của Testing Library

Bằng cách kiểm thử cách các hành động của người dùng ảnh hưởng đến ứng dụng của bạn, các bài kiểm thử E2E thường là chìa khóa để có sự tự tin cao hơn về việc một ứng dụng có hoạt động đúng hay không.

### Chọn Giải pháp Kiểm thử E2E {#choosing-an-e2e-testing-solution}

Mặc dù kiểm thử end-to-end (E2E) trên web đã có danh tiếng tiêu cực về các bài kiểm thử không đáng tin cậy (flaky) và làm chậm quy trình phát triển, các công cụ E2E hiện đại đã có bước tiến để tạo ra các bài kiểm thử đáng tin cậy, tương tác và hữu ích hơn. Khi chọn một framework kiểm thử E2E, các phần sau cung cấp một số hướng dẫn về những điều cần lưu ý khi chọn một framework kiểm thử cho ứng dụng của bạn.

#### Kiểm thử đa trình duyệt {#cross-browser-testing}

Một trong những lợi ích chính mà kiểm thử end-to-end (E2E) được biết đến là khả năng kiểm thử ứng dụng của bạn trên nhiều trình duyệt. Mặc dù có vẻ mong muốn có bao phủ đa trình duyệt 100%, điều quan trọng cần lưu ý là kiểm thử đa trình duyệt có lợi nhuận giảm dần trên tài nguyên của nhóm do thời gian bổ sung và sức mạnh máy tính cần thiết để chạy chúng một cách nhất quán. Do đó, điều quan trọng là phải lưu ý đến sự đánh đổi này khi chọn lượng kiểm thử đa trình duyệt mà ứng dụng của bạn cần.

#### Vòng phản hồi nhanh hơn {#faster-feedback-loops}

Một trong những vấn đề chính với các bài kiểm thử end-to-end (E2E) và phát triển là việc chạy toàn bộ bộ kiểm thử mất nhiều thời gian. Thông thường, điều này chỉ được thực hiện trong các pipeline tích hợp và triển khai liên tục (CI/CD). Các framework kiểm thử E2E hiện đại đã giúp giải quyết điều này bằng cách thêm các tính năng như song song hóa, cho phép các pipeline CI/CD thường chạy nhanh hơn nhiều cấp độ so với trước đây. Ngoài ra, khi phát triển cục bộ, khả năng chạy chọn lọc một bài kiểm thử duy nhất cho trang bạn đang làm việc trong khi cũng cung cấp hot reloading của các bài kiểm thử có thể giúp tăng quy trình làm việc và năng suất của nhà phát triển.

#### Trải nghiệm gỡ lỗi hạng nhất {#first-class-debugging-experience}

Mặc dù các nhà phát triển truyền thống dựa vào việc quét logs trong cửa sổ terminal để giúp xác định điều gì đã sai trong một bài kiểm thử, các framework kiểm thử end-to-end (E2E) hiện đại cho phép các nhà phát triển tận dụng các công cụ họ đã quen thuộc, ví dụ: công cụ phát triển trình duyệt.

#### Khả năng hiển thị trong chế độ headless {#visibility-in-headless-mode}

Khi các bài kiểm thử end-to-end (E2E) được chạy trong các pipeline tích hợp/triển khai liên tục, chúng thường được chạy trong các trình duyệt headless (tức là không có trình duyệt hiển thị nào được mở cho người dùng xem). Một tính năng quan trọng của các framework kiểm thử E2E hiện đại là khả năng xem các snapshot và/hoặc video của ứng dụng trong quá trình kiểm thử, cung cấp một số thông tin về lý do tại sao các lỗi đang xảy ra. Về mặt lịch sử, việc duy trì các tích hợp này rất tẻ nhạt.

### Khuyến nghị {#recommendation-2}

- [Playwright](https://playwright.dev/) là một giải pháp kiểm thử E2E tuyệt vời hỗ trợ Chromium, WebKit và Firefox. Kiểm thử trên Windows, Linux và macOS, cục bộ hoặc trên CI, headless hoặc headed với mô phỏng di động gốc của Google Chrome cho Android và Mobile Safari. Nó có UI thông tin, khả năng gỡ lỗi xuất sắc, các xác nhận tích hợp sẵn, song song hóa, traces và được thiết kế để loại bỏ các bài kiểm thử flaky. Hỗ trợ cho [Kiểm thử Component](https://playwright.dev/docs/test-components) có sẵn, nhưng được đánh dấu là thử nghiệm. Playwright là mã nguồn mở và được duy trì bởi Microsoft.

- [Cypress](https://www.cypress.io/) có giao diện đồ họa thông tin, khả năng gỡ lỗi xuất sắc, các xác nhận tích hợp sẵn, stubs, khả năng chống flake và snapshots. Như đã đề cập ở trên, nó cung cấp hỗ trợ ổn định cho [Kiểm thử Component](https://docs.cypress.io/guides/component-testing/introduction). Cypress hỗ trợ các trình duyệt dựa trên Chromium, Firefox và Electron. Hỗ trợ WebKit có sẵn, nhưng được đánh dấu là thử nghiệm. Cypress được cấp phép MIT, nhưng một số tính năng như song song hóa yêu cầu đăng ký vào Cypress Cloud.

<div class="lambdatest">
  <a href="https://lambdatest.com" target="_blank">
    <img src="/images/lambdatest.svg">
    <div>
      <div class="testing-partner">Nhà tài trợ Kiểm thử</div>
      <div>Lambdatest là nền tảng đám mây để chạy các bài kiểm thử E2E, khả năng truy cập và hồi quy trực quan trên tất cả các trình duyệt chính và thiết bị thực, với tạo bài kiểm thử được hỗ trợ bởi AI!</div>
    </div>
  </a>
</div>

### Các lựa chọn khác {#other-options-2}

- [Nightwatch](https://nightwatchjs.org/) là một giải pháp kiểm thử E2E dựa trên [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver). Điều này mang lại cho nó phạm vi hỗ trợ trình duyệt rộng nhất, bao gồm kiểm thử di động gốc. Các giải pháp dựa trên Selenium sẽ chậm hơn Playwright hoặc Cypress.

- [WebdriverIO](https://webdriver.io/) là một framework tự động hóa kiểm thử cho kiểm thử web và di động dựa trên giao thức WebDriver.

## Công thức {#recipes}

### Thêm Vitest vào một Dự án {#adding-vitest-to-a-project}

Trong một dự án Vue dựa trên Vite, hãy chạy:

```sh
> npm install -D vitest happy-dom @testing-library/vue
```

Tiếp theo, cập nhật cấu hình Vite để thêm khối tùy chọn `test`:

```js{5-11} [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // bật các API kiểm thử toàn cầu giống jest
    globals: true,
    // mô phỏng DOM với happy-dom
    // (yêu cầu cài đặt happy-dom như một phụ thuộc peer)
    environment: 'happy-dom'
  }
})
```

:::tip
Nếu bạn sử dụng TypeScript, hãy thêm `vitest/globals` vào trường `types` trong `tsconfig.json` của bạn.

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

:::

Sau đó, tạo một file kết thúc bằng `*.test.js` trong dự án của bạn. Bạn có thể đặt tất cả các file kiểm thử trong một thư mục kiểm thử ở gốc dự án hoặc trong các thư mục kiểm thử bên cạnh các file nguồn của bạn. Vitest sẽ tự động tìm kiếm chúng theo quy ước đặt tên.

```js [MyComponent.test.js]
import { render } from '@testing-library/vue'
import MyComponent from './MyComponent.vue'

test('it should work', () => {
  const { getByText } = render(MyComponent, {
    props: {
      /* ... */
    }
  })

  // xác nhận đầu ra
  getByText('...')
})
```

Cuối cùng, cập nhật `package.json` để thêm script kiểm thử và chạy nó:

```json{4} [package.json]
{
  // ...
  "scripts": {
    "test": "vitest"
  }
}
```

```sh
> npm test
```

### Kiểm thử Composables {#testing-composables}

> Phần này giả định bạn đã đọc phần [Composables](/guide/reusability/composables).

Khi nói đến kiểm thử composables, chúng ta có thể chia chúng thành hai danh mục: các composables không phụ thuộc vào một thể hiện component chủ, và các composables có phụ thuộc.

Một composable phụ thuộc vào một thể hiện component chủ khi nó sử dụng các API sau:

- Lifecycle hooks
- Provide / Inject

Nếu một composable chỉ sử dụng các API Reactivity, thì nó có thể được kiểm thử bằng cách gọi trực tiếp nó và xác nhận trạng thái/phương thức được trả về của nó:

```js [counter.js]
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return {
    count,
    increment
  }
}
```

```js [counter.test.js]
import { useCounter } from './counter.js'

test('useCounter', () => {
  const { count, increment } = useCounter()
  expect(count.value).toBe(0)

  increment()
  expect(count.value).toBe(1)
})
```

Một composable phụ thuộc vào lifecycle hooks hoặc Provide / Inject cần được bọc trong một component chủ để được kiểm thử. Chúng ta có thể tạo một helper như sau:

```js [test-utils.js]
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // chặn cảnh báo thiếu template
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // trả về kết quả và thể hiện app
  // để kiểm thử provide/unmount
  return [result, app]
}
```

```js [foo.test.js]
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // mock provide để kiểm tra các injections
  app.provide(...)
  // chạy các xác nhận
  expect(result.foo.value).toBe(1)
  // kích hoạt hook onUnmounted nếu cần
  app.unmount()
})
```

Đối với các composables phức tạp hơn, việc kiểm thử nó bằng cách viết các bài kiểm thử đối với component bao bọc sử dụng các kỹ thuật [Kiểm thử Component](#component-testing) cũng có thể dễ dàng hơn.

<!--
TODO thêm nhiều công thức kiểm thử hơn trong tương lai, ví dụ:
- Cách thiết lập CI thông qua GitHub actions
- Cách thực hiện mocking trong kiểm thử component
-->

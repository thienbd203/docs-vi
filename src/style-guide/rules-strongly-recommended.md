# Quy tắc Ưu tiên B: Khuyên dùng mạnh {#priority-b-rules-strongly-recommended}

::: warning Lưu ý
Hướng dẫn phong cách Vue.js này đã lỗi thời và cần được xem xét lại. Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng [mở một issue](https://github.com/vuejs/docs/issues/new).
:::

Các quy tắc này đã được chứng minh là giúp cải thiện khả năng đọc và/hoặc trải nghiệm của nhà phát triển trong hầu hết các dự án. Mã của bạn vẫn sẽ chạy nếu bạn vi phạm chúng, nhưng các vi phạm nên hiếm và có lý do chính đáng.

## File component {#component-files}

**Bất cứ khi nào có hệ thống build để nối các file, mỗi component nên nằm trong một file riêng biệt.**

Điều này giúp bạn tìm component nhanh hơn khi cần chỉnh sửa hoặc xem cách sử dụng nó.

<div class="style-example style-example-bad">
<h3>Kém</h3>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```

</div>

## Viết hoa tên file Single-File Component {#single-file-component-filename-casing}

**Tên file của [Single-File Components](/guide/scaling-up/sfc) nên luôn là PascalCase hoặc luôn là kebab-case.**

PascalCase hoạt động tốt nhất với tính năng tự động hoàn thành trong trình soạn thảo mã, vì nó nhất quán với cách chúng ta tham chiếu component trong JS(X) và template, bất cứ khi nào có thể. Tuy nhiên, tên file có viết hoa/thường đôi khi có thể tạo ra vấn đề trên hệ thống file không phân biệt hoa thường, đó là lý do tại sao kebab-case cũng hoàn toàn chấp nhận được.

<div class="style-example style-example-bad">
<h3>Kém</h3>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## Tên component cơ bản {#base-component-names}

**Component cơ bản (còn gọi là presentational, dumb, hoặc pure components) áp dụng styling và quy tắc cụ thể của ứng dụng nên đều bắt đầu bằng một tiền tố cụ thể, như `Base`, `App`, hoặc `V`.**

::: details Giải thích chi tiết
Các component này tạo nền tảng cho styling và hành vi nhất quán trong ứng dụng của bạn. Chúng có thể **chỉ** chứa:

- phần tử HTML,
- component cơ bản khác, và
- component UI bên thứ ba.

Nhưng chúng sẽ **không bao giờ** chứa trạng thái toàn cục (ví dụ: từ store [Pinia](https://pinia.vuejs.org/)).

Tên của chúng thường bao gồm tên của phần tử mà chúng bao bọc (ví dụ: `BaseButton`, `BaseTable`), trừ khi không có phần tử nào tồn tại cho mục đích cụ thể của chúng (ví dụ: `BaseIcon`). Nếu bạn xây dựng các component tương tự cho một ngữ cảnh cụ thể hơn, chúng sẽ hầu như luôn sử dụng các component này (ví dụ: `BaseButton` có thể được sử dụng trong `ButtonSubmit`).

Một số lợi ích của quy ước này:

- Khi được sắp xếp theo bảng chữ cái trong trình soạn thảo, các component cơ bản của ứng dụng của bạn đều được liệt kê cùng nhau, giúp dễ dàng xác định hơn.

- Vì tên component nên luôn là nhiều từ, quy ước này ngăn bạn phải chọn một tiền tố tùy ý cho các wrapper component đơn giản (ví dụ: `MyButton`, `VueButton`).

- Vì các component này được sử dụng rất thường xuyên, bạn có thể muốn đơn giản là làm chúng toàn cục thay vì nhập chúng ở mọi nơi. Một tiền tố làm cho điều này có thể thực hiện được với Webpack:

  ```js
  const requireComponent = require.context(
    './src',
    true,
    /Base[A-Z]\w+\.(vue|js)$/
  )
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig =
      baseComponentConfig.default || baseComponentConfig
    const baseComponentName =
      baseComponentConfig.name ||
      fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
    app.component(baseComponentName, baseComponentConfig)
  })
  ```

  :::

<div class="style-example style-example-bad">
<h3>Kém</h3>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

</div>

## Tên component liên kết chặt chẽ {#tightly-coupled-component-names}

**Component con liên kết chặt chẽ với component cha nên bao gồm tên component cha làm tiền tố.**

Nếu một component chỉ có ý nghĩa trong ngữ cảnh của một component cha duy nhất, mối quan hệ đó nên rõ ràng trong tên của nó. Vì trình soạn thảo thường sắp xếp file theo bảng chữ cái, điều này cũng giữ các file liên quan này ở cạnh nhau.

::: details Giải thích chi tiết
Bạn có thể bị cám dỗ để giải quyết vấn đề này bằng cách lồng các component con trong các thư mục được đặt tên theo component cha của chúng. Ví dụ:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

hoặc:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Điều này không được khuyến nghị, vì nó dẫn đến:

- Nhiều file với tên tương tự, làm cho việc chuyển đổi file nhanh trong trình soạn thảo mã khó khăn hơn.
- Nhiều thư mục con lồng nhau, làm tăng thời gian cần thiết để duyệt qua các component trong thanh bên của trình soạn thảo.
  :::

<div class="style-example style-example-bad">
<h3>Kém</h3>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

</div>

## Thứ tự từ trong tên component {#order-of-words-in-component-names}

**Tên component nên bắt đầu bằng các từ cấp cao nhất (thường là chung nhất) và kết thúc bằng các từ mô tả sửa đổi.**

::: details Giải thích chi tiết
Bạn có thể đang thắc mắc:

> "Tại sao chúng ta lại buộc tên component phải sử dụng ngôn ngữ ít tự nhiên hơn?"

Trong tiếng Anh tự nhiên, tính từ và các từ mô tả khác thường xuất hiện trước danh từ, trong khi các ngoại lệ yêu cầu từ nối. Ví dụ:

- Cà phê _với_ sữa
- Súp _của_ ngày
- Khách tham quan _đến_ bảo tàng

Bạn chắc chắn có thể bao gồm các từ nối này trong tên component nếu bạn muốn, nhưng thứ tự vẫn quan trọng.

Cũng lưu ý rằng **được coi là "cấp cao nhất" sẽ phụ thuộc vào ngữ cảnh của ứng dụng của bạn**. Ví dụ, hãy tưởng tượng một ứng dụng với biểu mẫu tìm kiếm. Nó có thể bao gồm các component như thế này:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Như bạn có thể nhận thấy, khá khó để thấy các component nào là cụ thể cho tìm kiếm. Bây giờ hãy đổi tên các component theo quy tắc:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Vì trình soạn thảo thường sắp xếp file theo bảng chữ cái, tất cả các mối quan hệ quan trọng giữa các component giờ đều rõ ràng ngay lập tức.

Bạn có thể bị cám dỗ để giải quyết vấn đề này theo cách khác, lồng tất cả các component tìm kiếm dưới thư mục "search", sau đó tất cả các component cài đặt dưới thư mục "settings". Chúng tôi chỉ khuyến nghị xem xét cách tiếp cận này trong các ứng dụng rất lớn (ví dụ: 100+ component), vì những lý do sau:

- Nói chung mất nhiều thời gian hơn để điều hướng qua các thư mục con lồng nhau, so với cuộn qua một thư mục `components` duy nhất.
- Xung đột tên (ví dụ: nhiều component `ButtonDelete.vue`) làm cho việc điều hướng nhanh đến một component cụ thể trong trình soạn thảo mã khó khăn hơn.
- Việc refactor trở nên khó khăn hơn, vì tìm và thay thế thường không đủ để cập nhật các tham chiếu tương đối đến một component đã di chuyển.
  :::

<div class="style-example style-example-bad">
<h3>Kém</h3>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

</div>

## Component tự đóng {#self-closing-components}

**Component không có nội dung nên tự đóng trong [Single-File Components](/guide/scaling-up/sfc), template chuỗi, và [JSX](/guide/extras/render-function#jsx-tsx) - nhưng không bao giờ trong template trong DOM.**

Component tự đóng thông báo rằng chúng không chỉ không có nội dung, mà còn **được dự định** không có nội dung. Đó là sự khác biệt giữa một trang trống trong một cuốn sách và một trang được dán nhãn "Trang này được để trống có chủ đích". Mã của bạn cũng sạch hơn mà không cần thẻ đóng không cần thiết.

Thật không may, HTML không cho phép các phần tử tùy chỉnh tự đóng - chỉ có [các phần tử "void" chính thức](https://www.w3.org/TR/html/syntax.html#void-elements). Đó là lý do tại sao chiến lược này chỉ có thể thực hiện được khi trình biên dịch template của Vue có thể tiếp cận template trước DOM, sau đó phục vụ HTML tuân thủ đặc tả DOM.

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html
<!-- Trong Single-File Components, template chuỗi, và JSX -->
<MyComponent></MyComponent>
```

```vue-html
<!-- Trong template trong DOM -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<!-- Trong Single-File Components, template chuỗi, và JSX -->
<MyComponent/>
```

```vue-html
<!-- Trong template trong DOM -->
<my-component></my-component>
```

</div>

## Viết hoa tên component trong template {#component-name-casing-in-templates}

**Trong hầu hết các dự án, tên component nên luôn là PascalCase trong [Single-File Components](/guide/scaling-up/sfc) và template chuỗi - nhưng là kebab-case trong template trong DOM.**

PascalCase có một số lợi thế so với kebab-case:

- Trình soạn thảo có thể tự động hoàn thành tên component trong template, vì PascalCase cũng được sử dụng trong JavaScript.
- `<MyComponent>` dễ phân biệt trực quan hơn với một phần tử HTML một từ hơn là `<my-component>`, vì có hai sự khác biệt về ký tự (hai chữ hoa), thay vì chỉ một (dấu gạch ngang).
- Nếu bạn sử dụng bất kỳ phần tử tùy chỉnh không phải Vue nào trong template của mình, chẳng hạn như một web component, PascalCase đảm bảo rằng các component Vue của bạn vẫn hiển thị rõ ràng.

Thật không may, do sự không phân biệt hoa thường của HTML, template trong DOM vẫn phải sử dụng kebab-case.

Cũng lưu ý rằng nếu bạn đã đầu tư nhiều vào kebab-case, sự nhất quán với các quy ước HTML và khả năng sử dụng cùng một cách viết trên tất cả các dự án của bạn có thể quan trọng hơn các lợi ích được liệt kê ở trên. Trong những trường hợp đó, **sử dụng kebab-case ở mọi nơi cũng chấp nhận được.**

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html
<!-- Trong Single-File Components và template chuỗi -->
<mycomponent/>
```

```vue-html
<!-- Trong Single-File Components và template chuỗi -->
<myComponent/>
```

```vue-html
<!-- Trong template trong DOM -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<!-- Trong Single-File Components và template chuỗi -->
<MyComponent/>
```

```vue-html
<!-- Trong template trong DOM -->
<my-component></my-component>
```

HOẶC

```vue-html
<!-- Ở mọi nơi -->
<my-component></my-component>
```

</div>

## Viết hoa tên component trong JS/JSX {#component-name-casing-in-js-jsx}

**Tên component trong JS/[JSX](/guide/extras/render-function#jsx-tsx) nên luôn là PascalCase, mặc dù chúng có thể là kebab-case trong chuỗi cho các ứng dụng đơn giản hơn chỉ sử dụng đăng ký component toàn cục thông qua `app.component`.**

::: details Giải thích chi tiết
Trong JavaScript, PascalCase là quy ước cho các lớp và hàm tạo nguyên mẫu - về cơ bản, bất cứ thứ gì có thể có các thể riêng biệt. Các component Vue cũng có các thể, vì vậy việc sử dụng PascalCase là hợp lý. Là một lợi ích bổ sung, việc sử dụng PascalCase trong JSX (và template) cho phép người đọc mã dễ dàng phân biệt giữa component và phần tử HTML hơn.

Tuy nhiên, đối với các ứng dụng chỉ sử dụng **chỉ** định nghĩa component toàn cục thông qua `app.component`, chúng tôi khuyến nghị sử dụng kebab-case thay thế. Các lý do là:

- Rất hiếm khi các component toàn cục được tham chiếu trong JavaScript, vì vậy việc tuân theo quy ước cho JavaScript ít ý nghĩa hơn.
- Các ứng dụng này luôn bao gồm nhiều template trong DOM, nơi [kebab-case **phải** được sử dụng](#component-name-casing-in-templates).
  :::

<div class="style-example style-example-bad">
<h3>Kém</h3>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent'
  // ...
}
```

```js
export default {
  name: 'my-component'
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent'
  // ...
}
```

</div>

## Tên component từ đầy đủ {#full-word-component-names}

**Tên component nên ưu tiên từ đầy đủ hơn là viết tắt.**

Tính năng tự động hoàn thành trong trình soạn thảo làm cho chi phí viết tên dài hơn rất thấp, trong khi sự rõ ràng mà chúng cung cấp là vô giá. Các viết tắt không phổ biến, đặc biệt, nên luôn tránh.

<div class="style-example style-example-bad">
<h3>Kém</h3>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## Viết hoa tên prop {#prop-name-casing}

**Tên prop nên luôn sử dụng camelCase trong quá trình khai báo. Khi được sử dụng trong template trong DOM, prop nên là kebab-case. Template Single-File Components và [JSX](/guide/extras/render-function#jsx-tsx) có thể sử dụng prop kebab-case hoặc camelCase. Viết hoa nên nhất quán - nếu bạn chọn sử dụng prop camelCase, hãy đảm bảo bạn không sử dụng prop kebab-case trong ứng dụng của bạn**

<div class="style-example style-example-bad">
<h3>Kém</h3>

<div class="options-api">

```js
props: {
  'greeting-text': String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  'greeting-text': String
})
```

</div>

```vue-html
// cho template trong DOM
<welcome-message greetingText="hi"></welcome-message>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

<div class="options-api">

```js
props: {
  greetingText: String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  greetingText: String
})
```

</div>

```vue-html
// cho SFC - hãy đảm bảo cách viết của bạn nhất quán trong toàn bộ dự án
// bạn có thể sử dụng quy ước nào nhưng chúng tôi không khuyến nghị trộn hai kiểu viết khác nhau
<WelcomeMessage greeting-text="hi"/>
// hoặc
<WelcomeMessage greetingText="hi"/>
```

```vue-html
// cho template trong DOM
<welcome-message greeting-text="hi"></welcome-message>
```

</div>

## Phần tử nhiều thuộc tính {#multi-attribute-elements}

**Phần tử có nhiều thuộc tính nên trải dài trên nhiều dòng, với một thuộc tính mỗi dòng.**

Trong JavaScript, việc chia các đối tượng có nhiều thuộc tính trên nhiều dòng được coi rộng rãi là một quy ước tốt, vì nó dễ đọc hơn nhiều. Template và [JSX](/guide/extras/render-function#jsx-tsx) của chúng tôi xứng đáng được xem xét tương tự.

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```vue-html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

</div>

## Biểu thức đơn giản trong template {#simple-expressions-in-templates}

**Template component nên chỉ bao gồm các biểu thức đơn giản, với các biểu thức phức tạp hơn được refactor thành computed properties hoặc methods.**

Các biểu thức phức tạp trong template của bạn làm cho chúng ít mang tính khai báo hơn. Chúng ta nên nỗ lực mô tả _cái gì_ nên xuất hiện, không phải _cách chúng ta_ tính toán giá trị đó. Computed properties và methods cũng cho phép mã được tái sử dụng.

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<!-- Trong một template -->
{{ normalizedFullName }}
```

<div class="options-api">

```js
// Biểu thức phức tạp đã được chuyển đến một computed property
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

<div class="composition-api">

```js
// Biểu thức phức tạp đã được chuyển đến một computed property
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

</div>

</div>

## Computed properties đơn giản {#simple-computed-properties}

**Computed properties phức tạp nên được chia thành nhiều property đơn giản hơn nhiều nhất có thể.**

::: details Giải thích chi tiết
Computed properties đơn giản hơn, được đặt tên tốt là:

- **Dễ kiểm tra hơn**

  Khi mỗi computed property chỉ chứa một biểu thức rất đơn giản, với rất ít dependency, việc viết các kiểm tra xác nhận rằng nó hoạt động đúng dễ dàng hơn nhiều.

- **Dễ đọc hơn**

  Việc đơn giản hóa computed properties buộc bạn phải đặt tên mô tả cho mỗi giá trị, ngay cả khi nó không được tái sử dụng. Điều này làm cho việc tập trung vào mã mà họ quan tâm và tìm ra những gì đang diễn ra dễ dàng hơn nhiều cho các nhà phát triển khác (và bản thân bạn trong tương lai).

- **Thích ứng hơn với các yêu cầu thay đổi**

  Bất kỳ giá trị nào có thể được đặt tên có thể hữu ích cho view. Ví dụ, chúng ta có thể quyết định hiển thị một thông báo cho người dùng biết họ đã tiết kiệm bao nhiêu tiền. Chúng ta cũng có thể quyết định tính thuế bán hàng, nhưng có thể hiển thị nó riêng biệt, thay vì là một phần của giá cuối cùng.

  Các computed properties nhỏ, tập trung đưa ra ít giả định hơn về cách thông tin sẽ được sử dụng, vì vậy yêu cầu ít refactor hơn khi yêu cầu thay đổi.
  :::

<div class="style-example style-example-bad">
<h3>Kém</h3>

<div class="options-api">

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

</div>

<div class="composition-api">

```js
const price = computed(() => {
  const basePrice = manufactureCost.value / (1 - profitMargin.value)
  return basePrice - basePrice * (discountPercent.value || 0)
})
```

</div>

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

<div class="options-api">

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

</div>

<div class="composition-api">

```js
const basePrice = computed(
  () => manufactureCost.value / (1 - profitMargin.value)
)

const discount = computed(
  () => basePrice.value * (discountPercent.value || 0)
)

const finalPrice = computed(() => basePrice.value - discount.value)
```

</div>

</div>

## Giá trị thuộc tính trong dấu ngoặc {#quoted-attribute-values}

**Giá trị thuộc tính HTML không rỗng nên luôn nằm trong dấu ngoặc (đơn hoặc kép, bất kỳ cái nào không được sử dụng trong JS).**

Mặc dù các giá trị thuộc tính không có bất kỳ khoảng trắng nào không cần có dấu ngoặc trong HTML, thực hành này thường dẫn đến _tránh_ khoảng trắng, làm cho giá trị thuộc tính ít dễ đọc hơn.

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## Viết tắt directive {#directive-shorthands}

**Viết tắt directive (`:` cho `v-bind:`, `@` cho `v-on:` và `#` cho `v-slot`) nên được sử dụng luôn hoặc không bao giờ.**

<div class="style-example style-example-bad">
<h3>Kém</h3>

```vue-html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Ở đây có thể là tiêu đề trang</h1>
</template>

<template #footer>
  <p>Ở đây có một số thông tin liên hệ</p>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Tốt</h3>

```vue-html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```vue-html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```vue-html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Ở đây có thể là tiêu đề trang</h1>
</template>

<template v-slot:footer>
  <p>Ở đây có một số thông tin liên hệ</p>
</template>
```

```vue-html
<template #header>
  <h1>Ở đây có thể là tiêu đề trang</h1>
</template>

<template #footer>
  <p>Ở đây có một số thông tin liên hệ</p>
</template>
```

</div>

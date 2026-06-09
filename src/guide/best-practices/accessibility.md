# Accessibility {#accessibility}

Web accessibility (còn được gọi là a11y) đề cập đến thực hành tạo ra các trang web mà bất kỳ ai cũng có thể sử dụng — dù là người khuyết tật, có kết nối chậm, phần cứng cũ hoặc hỏng, hay đơn giản là người đang ở trong môi trường không thuận lợi. Ví dụ, thêm phụ đề cho video sẽ giúp cả người dùng khiếm thính và người dùng khó nghe, cũng như những người dùng đang ở môi trường ồn ào và không thể nghe điện thoại của họ. Tương tự, đảm bảo văn bản của bạn không có độ tương phản quá thấp sẽ giúp cả người dùng thị lực kém và người dùng đang cố gắng sử dụng điện thoại dưới ánh nắng mặt trời rực rỡ.

Sẵn sàng bắt đầu nhưng không biết bắt đầu từ đâu?

Xem [Hướng dẫn lập kế hoạch và quản lý accessibility trên web](https://www.w3.org/WAI/planning-and-managing/) được cung cấp bởi [World Wide Web Consortium (W3C)](https://www.w3.org/)

## Skip link {#skip-link}

Bạn nên thêm một liên kết ở đầu mỗi trang dẫn trực tiếp đến khu vực nội dung chính để người dùng có thể bỏ qua nội dung được lặp lại trên nhiều trang web.

Thông thường điều này được thực hiện ở đầu `App.vue` vì nó sẽ là phần tử có thể focus đầu tiên trên tất cả các trang của bạn:

```vue-html
<span ref="backToTop" tabindex="-1" />
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink" class="skip-link">Skip to main content</a>
  </li>
</ul>
```

Để ẩn liên kết trừ khi nó được focus, bạn có thể thêm style sau:

```css
.skip-links {
  list-style: none;
}
.skip-link {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
}
```

Khi người dùng thay đổi route, hãy đưa focus trở lại ngay đầu trang, ngay trước skip link. Điều này có thể đạt được bằng cách gọi focus trên template ref `backToTop` (giả sử sử dụng `vue-router`):

<div class="options-api">

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.backToTop.focus()
    }
  }
}
</script>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const backToTop = ref()

watch(
  () => route.path,
  () => {
    backToTop.value.focus()
  }
)
</script>
```

</div>

[Đọc tài liệu về skip link đến nội dung chính](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## Content Structure {#content-structure}

Một trong những phần quan trọng nhất của accessibility là đảm bảo rằng thiết kế có thể hỗ trợ việc triển khai accessibility. Thiết kế nên xem xét không chỉ độ tương phản màu sắc, lựa chọn font, kích thước văn bản và ngôn ngữ, mà còn cả cách nội dung được cấu trúc trong ứng dụng.

### Headings {#headings}

Người dùng có thể điều hướng qua ứng dụng thông qua các heading. Có các heading mô tả cho từng phần của ứng dụng giúp người dùng dễ dàng dự đoán nội dung của từng phần. Khi nói đến heading, có một số thực hành accessibility được khuyến nghị:

- Lồng các heading theo thứ tự xếp hạng của chúng: `<h1>` - `<h6>`
- Không bỏ qua heading trong một phần
- Sử dụng thẻ heading thực tế thay vì định dạng văn bản để tạo ra giao diện trực quan của heading

[Đọc thêm về heading](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```vue-html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Main title</h1>
  <section aria-labelledby="section-title-1">
    <h2 id="section-title-1"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
  <section aria-labelledby="section-title-2">
    <h2 id="section-title-2"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
</main>
```

### Landmarks {#landmarks}

[Landmarks](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role) cung cấp quyền truy cập theo chương trình cho các phần trong ứng dụng. Người dùng phụ thuộc vào công nghệ hỗ trợ có thể điều hướng đến từng phần của ứng dụng và bỏ qua nội dung. Bạn có thể sử dụng [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) để giúp bạn đạt được điều này.

| HTML            | ARIA Role            | Landmark Purpose                                                                                                 |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| header          | role="banner"        | Prime heading: title of the page                                                                                 |
| nav             | role="navigation"    | Collection of links suitable for use when navigating the document or related documents                           |
| main            | role="main"          | The main or central content of the document.                                                                     |
| footer          | role="contentinfo"   | Information about the parent document: footnotes/copyrights/links to privacy statement                           |
| aside           | role="complementary" | Supports the main content, yet is separated and meaningful on its own content                                    |
| search          | role="search"        | This section contains the search functionality for the application                                               |
| form            | role="form"          | Collection of form-associated elements                                                                           |
| section         | role="region"        | Content that is relevant and that users will likely want to navigate to. Label must be provided for this element |

[Đọc thêm về landmarks](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

## Semantic Forms {#semantic-forms}

Khi tạo form, bạn có thể sử dụng các phần tử sau: `<form>`, `<label>`, `<input>`, `<textarea>`, và `<button>`

Labels thường được đặt ở trên hoặc bên trái của các trường form:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

Lưu ý cách bạn có thể bao gồm `autocomplete='on'` trên phần tử form và nó sẽ áp dụng cho tất cả các input trong form của bạn. Bạn cũng có thể đặt các [giá trị khác nhau cho thuộc tính autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) cho từng input.

### Labels {#labels}

Cung cấp labels để mô tả mục đích của tất cả các điều khiển form; liên kết `for` và `id`:

```vue-html
<label for="name">Name: </label>
<input type="text" name="name" id="name" v-model="name" />
```

Nếu bạn kiểm tra phần tử này trong Chrome DevTools và mở tab Accessibility bên trong tab Elements, bạn sẽ thấy cách input nhận tên của nó từ label:

![Chrome Developer Tools showing input accessible name from label](./images/AccessibleLabelChromeDevTools.png)

:::warning Cảnh báo:
Mặc dù bạn có thể đã thấy labels bao quanh các trường input như sau:

```vue-html
<label>
  Name:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

Thiết lập labels một cách rõ ràng với id tương ứng được hỗ trợ tốt hơn bởi công nghệ hỗ trợ.
:::

#### `aria-label` {#aria-label}

Bạn cũng có thể cung cấp cho input một tên có thể truy cập được với [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label).

```vue-html
<label for="name">Name: </label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

Hãy thoải mái kiểm tra phần tử này trong Chrome DevTools để xem cách tên có thể truy cập đã thay đổi:

![Chrome Developer Tools showing input accessible name from aria-label](./images/AccessibleARIAlabelDevTools.png)

#### `aria-labelledby` {#aria-labelledby}

Sử dụng [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) tương tự như `aria-label` ngoại trừ việc nó được sử dụng nếu văn bản label hiển thị trên màn hình. Nó được ghép nối với các phần tử khác bằng `id` của chúng và bạn có thể liên kết nhiều `id`:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Name: </label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

![Chrome Developer Tools showing input accessible name from aria-labelledby](./images/AccessibleARIAlabelledbyDevTools.png)

#### `aria-describedby` {#aria-describedby}

[aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) được sử dụng theo cách tương tự như `aria-labelledby` ngoại trừ việc nó cung cấp mô tả với thông tin bổ sung mà người dùng có thể cần. Điều này có thể được sử dụng để mô tả tiêu chí cho bất kỳ input nào:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Full Name: </label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Please provide first and last name.</p>
  </div>
  <button type="submit">Submit</button>
</form>
```

Bạn có thể xem mô tả bằng cách kiểm tra Chrome DevTools:

![Chrome Developer Tools showing input accessible name from aria-labelledby and description with aria-describedby](./images/AccessibleARIAdescribedby.png)

### Placeholder {#placeholder}

Tránh sử dụng placeholder vì chúng có thể gây nhầm lẫn cho nhiều người dùng.

Một trong những vấn đề với placeholder là chúng không đáp ứng [tiêu chí độ tương phản màu sắc](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) theo mặc định; sửa độ tương phản màu sắc làm cho placeholder trông giống như dữ liệu được điền sẵn trong các trường input. Nhìn vào ví dụ sau, bạn có thể thấy rằng placeholder Last Name đáp ứng tiêu chí độ tương phản màu sắc trông giống như dữ liệu được điền sẵn:

![Accessible placeholder](./images/AccessiblePlaceholder.png)

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      type="text"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
      :placeholder="item.placeholder"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

```css
/* https://www.w3schools.com/howto/howto_css_placeholder.asp */

#lastName::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

#lastName:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

#lastName::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
```

Tốt nhất là cung cấp tất cả thông tin người dùng cần để điền form bên ngoài bất kỳ input nào.

### Instructions {#instructions}

Khi thêm hướng dẫn cho các trường input của bạn, hãy đảm bảo liên kết nó đúng với input.
Bạn có thể cung cấp hướng dẫn bổ sung và liên kết nhiều id bên trong một [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby). Điều này cho phép thiết kế linh hoạt hơn.

```vue-html
<fieldset>
  <legend>Using aria-labelledby</legend>
  <label id="date-label" for="date">Current Date: </label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

Ngoài ra, bạn có thể đính kèm hướng dẫn vào input với [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby):

```vue-html
<fieldset>
  <legend>Using aria-describedby</legend>
  <label id="dob" for="dob">Date of Birth: </label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

### Hiding Content {#hiding-content}

Thông thường không được khuyến nghị ẩn labels về mặt thị giác, ngay cả khi input có tên có thể truy cập. Tuy nhiên, nếu chức năng của input có thể được hiểu với nội dung xung quanh, thì chúng ta có thể ẩn label thị giác.

Hãy xem trường tìm kiếm này:

```vue-html
<form role="search">
  <label for="search" class="hidden-visually">Search: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Search</button>
</form>
```

Chúng ta có thể làm điều này vì nút tìm kiếm sẽ giúp người dùng thị giác xác định mục đích của trường input.

Chúng ta có thể sử dụng CSS để ẩn các phần tử về mặt thị giác nhưng giữ chúng có sẵn cho công nghệ hỗ trợ:

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

#### `aria-hidden="true"` {#aria-hidden-true}

Thêm `aria-hidden="true"` sẽ ẩn phần tử khỏi công nghệ hỗ trợ nhưng giữ nó có sẵn về mặt thị giác cho người dùng khác. Không sử dụng nó trên các phần tử có thể focus, chỉ trên nội dung trang trí, trùng lặp hoặc ngoài màn hình.

```vue-html
<p>This is not hidden from screen readers.</p>
<p aria-hidden="true">This is hidden from screen readers.</p>
```

### Buttons {#buttons}

Khi sử dụng nút bên trong form, bạn phải đặt type để ngăn việc gửi form.
Bạn cũng có thể sử dụng input để tạo nút:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- Buttons -->
  <button type="button">Cancel</button>
  <button type="submit">Submit</button>

  <!-- Input buttons -->
  <input type="button" value="Cancel" />
  <input type="submit" value="Submit" />
</form>
```

### Functional Images {#functional-images}

Bạn có thể sử dụng kỹ thuật này để tạo hình ảnh chức năng.

- Input fields

  - Những hình ảnh này sẽ hoạt động như một nút kiểu submit trên form

  ```vue-html
  <form role="search">
    <label for="search" class="hidden-visually">Search: </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Search"
    />
  </form>
  ```

- Icons

```vue-html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Search: </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Search</span>
  </button>
</form>
```

## Standards {#standards}

World Wide Web Consortium (W3C) Web Accessibility Initiative (WAI) phát triển các tiêu chuẩn accessibility trên web cho các thành phần khác nhau:

- [User Agent Accessibility Guidelines (UAAG)](https://www.w3.org/WAI/standards-guidelines/uaag/)
  - trình duyệt web và trình phát media, bao gồm một số khía cạnh của công nghệ hỗ trợ
- [Authoring Tool Accessibility Guidelines (ATAG)](https://www.w3.org/WAI/standards-guidelines/atag/)
  - công cụ tạo tác
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
  - nội dung web - được sử dụng bởi các nhà phát triển, công cụ tạo tác và công cụ đánh giá accessibility

### Web Content Accessibility Guidelines (WCAG) {#web-content-accessibility-guidelines-wcag}

[WCAG 2.1](https://www.w3.org/TR/WCAG21/) mở rộng [WCAG 2.0](https://www.w3.org/TR/WCAG20/) và cho phép triển khai các công nghệ mới bằng cách giải quyết các thay đổi đối với web. W3C khuyến khích sử dụng phiên bản mới nhất của WCAG khi phát triển hoặc cập nhật các chính sách accessibility trên web.

#### WCAG 2.1 Four Main Guiding Principles (abbreviated as POUR): {#wcag-2-1-four-main-guiding-principles-abbreviated-as-pour}

- [Perceivable](https://www.w3.org/TR/WCAG21/#perceivable)
  - Người dùng phải có thể nhận thức được thông tin đang được trình bày
- [Operable](https://www.w3.org/TR/WCAG21/#operable)
  - Các biểu mẫu giao diện, điều khiển và điều hướng có thể hoạt động được
- [Understandable](https://www.w3.org/TR/WCAG21/#understandable)
  - Thông tin và hoạt động của giao diện người dùng phải dễ hiểu đối với tất cả người dùng
- [Robust](https://www.w3.org/TR/WCAG21/#robust)
  - Người dùng phải có thể truy cập nội dung khi công nghệ phát triển

#### Web Accessibility Initiative – Accessible Rich Internet Applications (WAI-ARIA) {#web-accessibility-initiative-–-accessible-rich-internet-applications-wai-aria}

WAI-ARIA của W3C cung cấp hướng dẫn về cách xây dựng nội dung động và các điều khiển giao diện người dùng nâng cao.

- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

## Resources {#resources}

### Documentation {#documentation}

- [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

### Assistive Technologies {#assistive-technologies}

- Screen Readers
  - [NVDA](https://www.nvaccess.org/download/)
  - [VoiceOver](https://www.apple.com/accessibility/mac/vision/)
  - [JAWS](https://www.freedomscientific.com/products/software/jaws/?utm_term=jaws%20screen%20reader&utm_source=adwords&utm_campaign=All+Products&utm_medium=ppc&hsa_tgt=kwd-394361346638&hsa_cam=200218713&hsa_ad=296201131673&hsa_kw=jaws%20screen%20reader&hsa_grp=52663682111&hsa_net=adwords&hsa_mt=e&hsa_src=g&hsa_acc=1684996396&hsa_ver=3&gclid=Cj0KCQjwnv71BRCOARIsAIkxW9HXKQ6kKNQD0q8a_1TXSJXnIuUyb65KJeTWmtS6BH96-5he9dsNq6oaAh6UEALw_wcB)
  - [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)
- Zooming Tools
  - [MAGic](https://www.freedomscientific.com/products/software/magic/)
  - [ZoomText](https://www.freedomscientific.com/products/software/zoomtext/)
  - [Magnifier](https://support.microsoft.com/en-us/help/11542/windows-use-magnifier-to-make-things-easier-to-see)

### Testing {#testing}

- Automated Tools
  - [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
  - [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
  - [ARC Toolkit](https://chrome.google.com/webstore/detail/arc-toolkit/chdkkkccnlfncngelccgbgfmjebmkmce?hl=en-US)
- Color Tools
  - [WebAim Color Contrast](https://webaim.org/resources/contrastchecker/)
  - [WebAim Link Color Contrast](https://webaim.org/resources/linkcontrastchecker)
- Other Helpful Tools
  - [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en…)
  - [Color Oracle](https://colororacle.org)
  - [NerdeFocus](https://chrome.google.com/webstore/detail/nerdefocus/lpfiljldhgjecfepfljnbjnbjfhennpd?hl=en-US…)
  - [Visual Aria](https://chrome.google.com/webstore/detail/visual-aria/lhbmajchkkmakajkjenkchhnhbadmhmk?hl=en-US)
  - [Silktide Website Accessibility Simulator](https://chrome.google.com/webstore/detail/silktide-website-accessib/okcpiimdfkpkjcbihbmhppldhiebhhaf?hl=en-US)

### Users {#users}

Tổ chức Y tế Thế giới ước tính rằng 15% dân số thế giới có một dạng khuyết tật nào đó, 2-4% trong số đó nghiêm trọng. Đó là khoảng 1 tỷ người trên toàn thế giới; khiến người khuyết tật trở thành nhóm thiểu số lớn nhất thế giới.

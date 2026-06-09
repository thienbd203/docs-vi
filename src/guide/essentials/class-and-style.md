# Class và Style Bindings {#class-and-style-bindings}

Một nhu cầu phổ biến của data binding là thao tác với danh sách class và inline styles của một phần tử. Vì `class` và `style` đều là các thuộc tính, chúng ta có thể sử dụng `v-bind` để gán cho chúng một giá trị chuỗi một cách động, tương tự như với các thuộc tính khác. Tuy nhiên, việc cố gắng tạo ra các giá trị đó bằng cách nối chuỗi có thể gây phiền toái và dễ mắc lỗi. Vì lý do này, Vue cung cấp các tính năng nâng cao đặc biệt khi `v-bind` được sử dụng với `class` và `style`. Ngoài chuỗi, các biểu thức cũng có thể đánh giá thành objects hoặc arrays.

## Binding HTML Classes {#binding-html-classes}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="Free Vue.js Dynamic CSS Classes Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="Free Vue.js Dynamic CSS Classes Lesson"/>
</div>

### Binding đến Objects {#binding-to-objects}

Chúng ta có thể truyền một object vào `:class` (viết tắt của `v-bind:class`) để chuyển đổi classes một cách động:

```vue-html
<div :class="{ active: isActive }"></div>
```

Cú pháp trên có nghĩa là sự hiện diện của class `active` sẽ được xác định bởi [truthiness](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) của thuộc tính dữ liệu `isActive`.

Bạn có thể có nhiều classes được chuyển đổi bằng cách có nhiều trường hơn trong object. Ngoài ra, directive `:class` cũng có thể cùng tồn tại với thuộc tính `class` thông thường. Vì vậy, với trạng thái sau:

<div class="composition-api">

```js
const isActive = ref(true)
const hasError = ref(false)
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

</div>

Và template sau:

```vue-html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

Nó sẽ render:

```vue-html
<div class="static active"></div>
```

Khi `isActive` hoặc `hasError` thay đổi, danh sách class sẽ được cập nhật tương ứng. Ví dụ, nếu `hasError` trở thành `true`, danh sách class sẽ trở thành `"static active text-danger"`.

Object được binding không nhất thiết phải là inline:

<div class="composition-api">

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

Điều này sẽ render:

```vue-html
<div class="active"></div>
```

Chúng ta cũng có thể binding đến một [computed property](./computed) trả về một object. Đây là một pattern phổ biến và mạnh mẽ:

<div class="composition-api">

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

### Binding đến Arrays {#binding-to-arrays}

Chúng ta có thể binding `:class` đến một array để áp dụng một danh sách classes:

<div class="composition-api">

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

</div>

```vue-html
<div :class="[activeClass, errorClass]"></div>
```

Sẽ render:

```vue-html
<div class="active text-danger"></div>
```

Nếu bạn muốn chuyển đổi một class trong danh sách một cách có điều kiện, bạn có thể làm điều đó với một biểu thức ternary:

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

Điều này sẽ luôn áp dụng `errorClass`, nhưng `activeClass` chỉ được áp dụng khi `isActive` là truthy.

Tuy nhiên, điều này có thể hơi dài dòng nếu bạn có nhiều classes có điều kiện. Đó là lý do tại sao cũng có thể sử dụng cú pháp object bên trong cú pháp array:

```vue-html
<div :class="[{ [activeClass]: isActive }, errorClass]"></div>
```

### Với Components {#with-components}

> Phần này giả định bạn đã có kiến thức về [Components](/guide/essentials/component-basics). Hãy thoải mái bỏ qua và quay lại sau.

Khi bạn sử dụng thuộc tính `class` trên một component có một phần tử gốc duy nhất, những classes đó sẽ được thêm vào phần tử gốc của component và được gộp với bất kỳ class nào đã có trên nó.

Ví dụ, nếu chúng ta có một component tên là `MyComponent` với template sau:

```vue-html
<!-- child component template -->
<p class="foo bar">Hi!</p>
```

Sau đó thêm một số classes khi sử dụng nó:

```vue-html
<!-- khi sử dụng component -->
<MyComponent class="baz boo" />
```

HTML được render sẽ là:

```vue-html
<p class="foo bar baz boo">Hi!</p>
```

Điều tương tự cũng đúng cho class bindings:

```vue-html
<MyComponent :class="{ active: isActive }" />
```

Khi `isActive` là truthy, HTML được render sẽ là:

```vue-html
<p class="foo bar active">Hi!</p>
```

Nếu component của bạn có nhiều phần tử gốc, bạn sẽ cần định nghĩa phần tử nào sẽ nhận class này. Bạn có thể làm điều này bằng cách sử dụng thuộc tính component `$attrs`:

```vue-html
<!-- MyComponent template sử dụng $attrs -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

```vue-html
<MyComponent class="baz" />
```

Sẽ render:

```html
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

Bạn có thể tìm hiểu thêm về kế thừa thuộc tính component trong phần [Fallthrough Attributes](/guide/components/attrs).

## Binding Inline Styles {#binding-inline-styles}

### Binding đến Objects {#binding-to-objects-1}

`:style` hỗ trợ binding đến các giá trị object JavaScript - nó tương ứng với [thuộc tính `style` của phần tử HTML](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style):

<div class="composition-api">

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

</div>

```vue-html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

Mặc dù các khóa camelCase được khuyến nghị, `:style` cũng hỗ trợ các khóa thuộc tính CSS kebab-cased (tương ứng với cách chúng được sử dụng trong CSS thực tế) - ví dụ:

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

Thường là một ý tưởng tốt để binding trực tiếp đến một style object để template sạch hơn:

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '30px'
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

</div>

```vue-html
<div :style="styleObject"></div>
```

Một lần nữa, object style binding thường được sử dụng kết hợp với computed properties trả về objects.

Directives `:style` cũng có thể cùng tồn tại với các thuộc tính style thông thường, giống như `:class`.

Template:

```vue-html
<h1 style="color: red" :style="'font-size: 1em'">hello</h1>
```

Nó sẽ render:

```vue-html
<h1 style="color: red; font-size: 1em;">hello</h1>
```

### Binding đến Arrays {#binding-to-arrays-1}

Chúng ta có thể binding `:style` đến một array của nhiều style objects. Các objects này sẽ được gộp và áp dụng cho cùng một phần tử:

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### Tự động thêm tiền tố {#auto-prefixing}

Khi bạn sử dụng một thuộc tính CSS yêu cầu [vendor prefix](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) trong `:style`, Vue sẽ tự động thêm tiền tố phù hợp. Vue thực hiện điều này bằng cách kiểm tra tại runtime để xem các thuộc tính style nào được hỗ trợ trong trình duyệt hiện tại. Nếu trình duyệt không hỗ trợ một thuộc tính cụ thể thì các biến thể có tiền tố khác nhau sẽ được kiểm tra để cố gắng tìm một cái được hỗ trợ.

### Nhiều Giá Trị {#multiple-values}

Bạn có thể cung cấp một array của nhiều giá trị (có tiền tố) cho một thuộc tính style, ví dụ:

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Điều này sẽ chỉ render giá trị cuối cùng trong array mà trình duyệt hỗ trợ. Trong ví dụ này, nó sẽ render `display: flex` cho các trình duyệt hỗ trợ phiên bản không có tiền tố của flexbox.

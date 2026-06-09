# Event Handling {#event-handling}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-events-in-vue-3" title="Free Vue.js Events Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-events-in-vue-3" title="Free Vue.js Events Lesson"/>
</div>

## Lắng nghe Sự kiện {#listening-to-events}

Chúng ta có thể sử dụng directive `v-on`, thường được viết tắt là ký hiệu `@`, để lắng nghe các sự kiện DOM và chạy một số JavaScript khi chúng được kích hoạt. Cách sử dụng sẽ là `v-on:click="handler"` hoặc với viết tắt, `@click="handler"`.

Giá trị handler có thể là một trong các sau:

1. **Inline handlers:** JavaScript inline để thực thi khi sự kiện được kích hoạt (tương tự như thuộc tính `onclick` gốc).

2. **Method handlers:** Tên thuộc tính hoặc đường dẫn trỏ đến một phương thức được định nghĩa trên component.

## Inline Handlers {#inline-handlers}

Inline handlers thường được sử dụng trong các trường hợp đơn giản, ví dụ:

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNo9jssKgzAURH/lko0tgrbbEqX+Q5fZaLxiqHmQ3LgJ+fdqFZcD58xMYp1z1RqRvRgP0itHEJCia4VR2llPkMDjBBkmbzUUG1oII4y0JhBIGw2hh2Znbo+7MLw+WjZ/C4TaLT3hnogPkcgaeMtFyW8j2GmXpWBtN47w5PWBHLhrPzPCKfWDXRHmPsCAaOBfgSOkdH3IGUhpDBWv9/e8vsZZ/gFFhFJN)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNo9jcEKgzAQRH9lyKlF0PYqqdR/6DGXaLYo1RjiRgrivzepIizLzu7sm1XUzuVLIFEKObe+d1wpS183eYahtw4DY1UWMJr15ZpmxYAnDt7uF0BxOwXL5Evc0kbxlmyxxZLFyY2CaXSDZkqKZROYJ4tnO/Tt56HEgckyJaraGNxlsVt2u6teHeF40s20EDo9oyGy+CPIYF1xULBt4H6kOZeFiwBZnOFi+wH0B1hk)

</div>

## Method Handlers {#method-handlers}

Logic cho nhiều event handler sẽ phức tạp hơn, và có thể không khả thi với inline handlers. Đó là lý do tại sao `v-on` cũng có thể chấp nhận tên hoặc đường dẫn của một phương thức component mà bạn muốn gọi.

Ví dụ:

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` là sự kiện DOM gốc
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // `this` bên trong methods trỏ đến instance hiện tại đang hoạt động
    alert(`Hello ${this.name}!`)
    // `event` là sự kiện DOM gốc
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` là tên của phương thức được định nghĩa ở trên -->
<button @click="greet">Greet</button>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNpVj0FLxDAQhf/KMwjtXtq7dBcFQS/qzVMOrWFao2kSkkkvpf/dJIuCEBgm771vZnbx4H23JRJ3YogqaM+IxMlfpNWrd4GxI9CMA3NwK5psbaSVVjkbGXZaCediaJv3RN1XbE5FnZNVrJ3FEoi4pY0sn7BLC0yGArfjMxnjcLsXQrdNJtFxM+Ys0PcYa2CEjuBPylNYb4THtxdUobj0jH/YX3D963gKC5WyvGZ+xR7S5jf01yPzeblhWr2ZmErHw0dizivfK6PV91mKursUl6dSh/4qZ+vQ/+XE8QODonDi)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNplUE1LxDAQ/StjEbYL0t5LXRQEvag3Tz00prNtNE1CMilC6X83SUkRhJDJfLz3Jm8tHo2pFo9FU7SOW2Ho0in8MdoSDHhlXhKsnQIYGLHyvL8BLJK3KmcAis3YwOnDY/XlTnt1i2G7i/eMNOnBNRkwWkQqcUFFByVAXUNPk3A9COXEgBkGRgtFDkgDTQjcWxuAwDiJBeMsMcUxszCJlsr+BaXUcLtGwiqut930579KST1IBd5Aqlgie3p/hdTIk+IK//bMGqleEbMjxjC+BZVDIv0+m9CpcNr6MDgkhLORjDBm1H56Iq3ggUvBv++7IhnUFZfnGNt6b4fRtj5wxfYL9p+Sjw==)

</div>

Một method handler tự động nhận đối tượng Event DOM gốc kích hoạt nó - trong ví dụ trên, chúng ta có thể truy cập phần tử gửi sự kiện thông qua `event.target`.

<div class="composition-api">

Xem thêm: [Typing Event Handlers](/guide/typescript/composition-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Xem thêm: [Typing Event Handlers](/guide/typescript/options-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>

### Method vs. Inline Detection {#method-vs-inline-detection}

Trình biên dịch template phát hiện method handlers bằng cách kiểm tra xem chuỗi giá trị `v-on` có phải là một định danh JavaScript hợp lệ hoặc đường dẫn truy cập thuộc tính hay không. Ví dụ, `foo`, `foo.bar` và `foo['bar']` được coi là method handlers, trong khi `foo()` và `count++` được coi là inline handlers.

## Calling Methods in Inline Handlers {#calling-methods-in-inline-handlers}

Thay vì bind trực tiếp đến tên phương thức, chúng ta cũng có thể gọi phương thức trong một inline handler. Điều này cho phép chúng ta truyền các đối số tùy chỉnh cho phương thức thay vì sự kiện gốc:

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNp9jTEOwjAMRa8SeSld6I5CBWdg9ZJGBiJSN2ocpKjq3UmpFDGx+Vn//b/ANYTjOxGcQEc7uyAqkqTQI98TW3ETq2jyYaQYzYNatSArZTzNUn/IK7Ludr2IBYTG4I3QRqKHJFJ6LtY7+zojbIXNk7yfmhahv5msvqS7PfnHGjJVp9w/hu7qKKwfEd1NSg==)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNptjUEKwjAQRa8yZFO7sfsSi57B7WzGdjTBtA3NVC2ldzehEFwIw8D7vM9f1cX742tmVSsd2sl6aXDgjx8ngY7vNDuBFQeAnsWMXagToQAEWg49h0APLncDAIUcT5LzlKJsqRBfPF3ljQjCvXcknEj0bRYZBzi3zrbPE6o0UBhblKiaKy1grK52J/oA//23IcmNBD8dXeVBtX0BF0pXsg==)

</div>

## Truy cập Đối số Sự kiện trong Inline Handlers {#accessing-event-argument-in-inline-handlers}

Đôi khi chúng ta cũng cần truy cập sự kiện DOM gốc trong một inline handler. Bạn có thể truyền nó vào một phương thức bằng biến đặc biệt `$event`, hoặc sử dụng một arrow function inline:

```vue-html
<!-- sử dụng biến đặc biệt $event -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- sử dụng arrow function inline -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // bây giờ chúng ta có quyền truy cập vào sự kiện gốc
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // bây giờ chúng ta có quyền truy cập vào sự kiện gốc
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## Event Modifiers {#event-modifiers}

Việc gọi `event.preventDefault()` hoặc `event.stopPropagation()` bên trong event handler là một nhu cầu rất phổ biến. Mặc dù chúng ta có thể thực hiện điều này dễ dàng bên trong các phương thức, nhưng sẽ tốt hơn nếu các phương thức chỉ tập trung vào logic dữ liệu thay vì phải xử lý các chi tiết sự kiện DOM.

Để giải quyết vấn đề này, Vue cung cấp **event modifiers** cho `v-on`. Nhớ rằng modifiers là hậu tố của directive được biểu thị bằng một dấu chấm.

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- the click event's propagation will be stopped -->
<a @click.stop="doThis"></a>

<!-- the submit event will no longer reload the page -->
<form @submit.prevent="onSubmit"></form>

<!-- modifiers can be chained -->
<a @click.stop.prevent="doThat"></a>

<!-- just the modifier -->
<form @submit.prevent></form>

<!-- only trigger handler if event.target is the element itself -->
<!-- i.e. not from a child element -->
<div @click.self="doThat">...</div>
```

::: tip
Order matters when using modifiers because the relevant code is generated in the same order. Therefore using `@click.prevent.self` will prevent **click's default action on the element itself and its children**, while `@click.self.prevent` will only prevent click's default action on the element itself.
:::

Các modifiers `.capture`, `.once`, và `.passive` phản ánh các [tùy chọn của phương thức `addEventListener` gốc](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options):

```vue-html
<!-- use capture mode when adding the event listener     -->
<!-- i.e. an event targeting an inner element is handled -->
<!-- here before being handled by that element           -->
<div @click.capture="doThis">...</div>

<!-- the click event will be triggered at most once -->
<a @click.once="doThis"></a>

<!-- the scroll event's default behavior (scrolling) will happen -->
<!-- immediately, instead of waiting for `onScroll` to complete  -->
<!-- in case it contains `event.preventDefault()`                -->
<div @scroll.passive="onScroll">...</div>
```

Modifier `.passive` thường được sử dụng với các trình lắng nghe sự kiện touch để [cải thiện hiệu suất trên thiết bị di động](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scroll_performance_using_passive_listeners).

::: tip
Do not use `.passive` and `.prevent` together, because `.passive` already indicates to the browser that you _do not_ intend to prevent the event's default behavior, and you will likely see a warning from the browser if you do so.
:::

## Key Modifiers {#key-modifiers}

Khi lắng nghe các sự kiện bàn phím, chúng ta thường cần kiểm tra các phím cụ thể. Vue cho phép thêm các key modifiers cho `v-on` hoặc `@` khi lắng nghe các sự kiện key:

```vue-html
<!-- only call `submit` when the `key` is `Enter` -->
<input @keyup.enter="submit" />
```

You can directly use any valid key names exposed via [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) as modifiers by converting them to kebab-case.

```vue-html
<input @keyup.page-down="onPageDown" />
```

Trong ví dụ trên, handler sẽ chỉ được gọi nếu `$event.key` bằng `'PageDown'`.

### Key Aliases {#key-aliases}

Vue provides aliases for the most commonly used keys:

- `.enter`
- `.tab`
- `.delete` (captures both "Delete" and "Backspace" keys)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### System Modifier Keys {#system-modifier-keys}

You can use the following modifiers to trigger mouse or keyboard event listeners only when the corresponding modifier key is pressed:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip Note
On Macintosh keyboards, meta is the command key (⌘). On Windows keyboards, meta is the Windows key (⊞). On Sun Microsystems keyboards, meta is marked as a solid diamond (◆). On certain keyboards, specifically MIT and Lisp machine keyboards and successors, such as the Knight keyboard, space-cadet keyboard, meta is labeled “META”. On Symbolics keyboards, meta is labeled “META” or “Meta”.
:::

Ví dụ:

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
Note that modifier keys are different from regular keys and when used with `keyup` events, they have to be pressed when the event is emitted. In other words, `keyup.ctrl` will only trigger if you release a key while holding down `ctrl`. It won't trigger if you release the `ctrl` key alone.
:::

### `.exact` Modifier {#exact-modifier}

Modifier `.exact` cho phép kiểm soát sự kết hợp chính xác của các system modifiers cần thiết để kích hoạt một sự kiện.

```vue-html
<!-- this will fire even if Alt or Shift is also pressed -->
<button @click.ctrl="onClick">A</button>

<!-- this will only fire when Ctrl and no other keys are pressed -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- this will only fire when no system modifiers are pressed -->
<button @click.exact="onClick">A</button>
```

## Mouse Button Modifiers {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

Các modifiers này giới hạn handler cho các sự kiện được kích hoạt bởi một nút chuột cụ thể.

Note, however, that `.left`, `.right`, and `.middle` modifier names are based on the typical right-handed mouse layout, but in fact represent "main", "secondary", and "auxiliary" pointing device event triggers, respectively, and not the actual physical buttons. So that for a left-handed mouse layout the "main" button might physically be the right one but would trigger the `.left` modifier handler. Or a trackpad might trigger the `.left` handler with a one-finger tap, the `.right` handler with a two-finger tap, and the `.middle` handler with a three-finger tap. Similarly, other devices and event sources generating "mouse" events might have trigger modes that are not related to "left" and "right" whatsoever.

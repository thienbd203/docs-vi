<script setup>
import Basic from './transition-demos/Basic.vue'
import SlideFade from './transition-demos/SlideFade.vue'
import CssAnimation from './transition-demos/CssAnimation.vue'
import NestedTransitions from './transition-demos/NestedTransitions.vue'
import JsHooks from './transition-demos/JsHooks.vue'
import BetweenElements from './transition-demos/BetweenElements.vue'
import BetweenComponents from './transition-demos/BetweenComponents.vue'
</script>

# Transition {#transition}

Vue cung cấp hai component tích hợp sẵn có thể giúp làm việc với transitions và animations để phản hồi thay đổi trạng thái:

- `<Transition>` để áp dụng animations khi một phần tử hoặc component đang vào và ra khỏi DOM. Nội dung này được đề cập trong trang này.

- `<TransitionGroup>` để áp dụng animations khi một phần tử hoặc component được chèn vào, xóa khỏi, hoặc di chuyển trong danh sách `v-for`. Nội dung này được đề cập trong [chương tiếp theo](/guide/built-ins/transition-group).

Ngoài hai component này, chúng ta cũng có thể áp dụng animations trong Vue bằng các kỹ thuật khác như chuyển đổi CSS classes hoặc animations dựa trên trạng thái thông qua style bindings. Các kỹ thuật bổ sung này được đề cập trong chương [Animation Techniques](/guide/extras/animation).

## Component `<Transition>` {#the-transition-component}

`<Transition>` là một component tích hợp sẵn: điều này có nghĩa là nó có sẵn trong template của bất kỳ component nào mà không cần phải đăng ký nó. Nó có thể được sử dụng để áp dụng enter và leave animations trên các phần tử hoặc component được truyền vào thông qua default slot của nó. Enter hoặc leave có thể được kích hoạt bởi một trong các cách sau:

- Conditional rendering thông qua `v-if`
- Conditional display thông qua `v-show`
- Dynamic components toggling thông qua special element `<component>`
- Thay đổi attribute đặc biệt `key`

Đây là ví dụ về cách sử dụng cơ bản nhất:

```vue-html
<button @click="show = !show">Toggle</button>
<Transition>
  <p v-if="show">hello</p>
</Transition>
```

```css
/* chúng ta sẽ giải thích các class này làm gì ngay sau đây! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

<Basic />

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNpVkEFuwyAQRa8yZZNWqu1sunFJ1N4hSzYUjRNUDAjGVJHluxcCipIV/OG/pxEr+/a+TwuykfGogvYEEWnxR2H17F0gWCHgBBtMwc2wy9WdsMIqZ2OuXtwfHErhlcKCb8LyoVoynwPh7I0kzAmA/yxEzsKXMlr9HgRr9Es5BTue3PlskA+1VpFTkDZq0i3niYfU6anRmbqgMY4PZeH8OjwBfHhYIMdIV1OuferQEoZOKtIJ328TgzJhm8BabHR3jeC8VJqusO8/IqCM+CnsVqR3V/mfRxO5amnkCPuK5B+6rcG2fydshks=)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNpVkMFuAiEQhl9lyqlNuouXXrZo2nfwuBeKs0qKQGBAjfHdZZfVrAmB+f/M/2WGK/v1vs0JWcdEVEF72vQWz94Fgh0OMhmCa28BdpLk+0etAQJSCvahAOLBnTqgkLA6t/EpVzmCP7lFEB69kYRFAYi/ROQs/Cij1f+6ZyMG1vA2vj3bbN1+b1Dw2lYj2yBt1KRnXRwPudHDnC6pAxrjBPe1n78EBF8MUGSkixnLNjdoCUMjFemMn5NjUGacnboqPVkdOC+Vpgus2q8IKCN+T+suWENwxyWJXKXMyQ5WNVJ+aBqD3e6VSYoi)

</div>

:::tip
`<Transition>` chỉ hỗ trợ một phần tử hoặc component duy nhất làm nội dung slot của nó. Nếu nội dung là một component, component đó cũng phải chỉ có một phần tử gốc duy nhất.
:::

Khi một phần tử trong component `<Transition>` được chèn vào hoặc xóa đi, những điều sau sẽ xảy ra:

1. Vue sẽ tự động phát hiện xem phần tử đích có CSS transitions hoặc animations được áp dụng hay không. Nếu có, một số [CSS transition classes](#transition-classes) sẽ được thêm / xóa vào thời điểm thích hợp.

2. Nếu có listeners cho [JavaScript hooks](#javascript-hooks), các hooks này sẽ được gọi vào thời điểm thích hợp.

3. Nếu không phát hiện CSS transitions / animations và không cung cấp JavaScript hooks, các thao tác DOM để chèn và/hoặc xóa sẽ được thực thi trong animation frame tiếp theo của trình duyệt.

## CSS-Based Transitions {#css-based-transitions}

### Transition Classes {#transition-classes}

Có sáu class được áp dụng cho enter / leave transitions.

![Transition Diagram](./images/transition-classes.png)

<!-- https://www.figma.com/file/rlOv0ZKJFFNA9hYmzdZv3S/Transition-Classes -->

1. `v-enter-from`: Trạng thái bắt đầu cho enter. Được thêm vào trước khi phần tử được chèn, xóa đi một frame sau khi phần tử được chèn.

2. `v-enter-active`: Trạng thái active cho enter. Được áp dụng trong suốt quá trình entering. Được thêm vào trước khi phần tử được chèn, xóa đi khi transition/animation kết thúc. Class này có thể được sử dụng để định nghĩa duration, delay và easing curve cho entering transition.

3. `v-enter-to`: Trạng thái kết thúc cho enter. Được thêm vào một frame sau khi phần tử được chèn (cùng thời điểm `v-enter-from` được xóa), xóa đi khi transition/animation kết thúc.

4. `v-leave-from`: Trạng thái bắt đầu cho leave. Được thêm vào ngay lập tức khi một leaving transition được kích hoạt, xóa đi sau một frame.

5. `v-leave-active`: Trạng thái active cho leave. Được áp dụng trong suốt quá trình leaving. Được thêm vào ngay lập tức khi một leaving transition được kích hoạt, xóa đi khi transition/animation kết thúc. Class này có thể được sử dụng để định nghĩa duration, delay và easing curve cho leaving transition.

6. `v-leave-to`: Trạng thái kết thúc cho leave. Được thêm vào một frame sau khi một leaving transition được kích hoạt (cùng thời điểm `v-leave-from` được xóa), xóa đi khi transition/animation kết thúc.

`v-enter-active` và `v-leave-active` cho phép chúng ta chỉ định các easing curves khác nhau cho enter / leave transitions, chúng ta sẽ thấy ví dụ trong các phần sau.

### Named Transitions {#named-transitions}

Một transition có thể được đặt tên thông qua prop `name`:

```vue-html
<Transition name="fade">
  ...
</Transition>
```

Đối với một transition có tên, các transition classes của nó sẽ được tiền tố bằng tên của nó thay vì `v`. Ví dụ, class được áp dụng cho transition ở trên sẽ là `fade-enter-active` thay vì `v-enter-active`. CSS cho fade transition sẽ trông như sau:

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### CSS Transitions {#css-transitions}

`<Transition>` thường được sử dụng kết hợp với [native CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions), như đã thấy trong ví dụ cơ bản ở trên. Property CSS `transition` là một shorthand cho phép chúng ta chỉ định nhiều khía cạnh của một transition, bao gồm các properties nên được animate, duration của transition, và [easing curves](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function).

Đây là một ví dụ nâng cao hơn mà transition nhiều properties, với các durations và easing curves khác nhau cho enter và leave:

```vue-html
<Transition name="slide-fade">
  <p v-if="show">hello</p>
</Transition>
```

```css
/*
  Enter và leave animations có thể sử dụng
  durations và timing functions khác nhau.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<SlideFade />

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNqFkc9uwjAMxl/F6wXQKIVNk1AX0HbZC4zDDr2E4EK0NIkStxtDvPviFQ0OSFzyx/m+n+34kL16P+lazMpMRBW0J4hIrV9WVjfeBYIDBKzhCHVwDQySdFDZyipnY5Lu3BcsWDCk0OKosqLoKcmfLoSNN5KQbyTWLZGz8KKMVp+LKju573ivsuXKbbcG4d3oDcI9vMkNiqL3JD+AWAVpoyadGFY2yATW5nVSJj9rkspDl+v6hE/hHRrjRMEdpdfiDEkBUVxWaEWkveHj5AzO0RKGXCrSHcKBIfSPKEEaA9PJYwSUEXPX0nNlj8y6RBiUHd5AzCOodq1VvsYfjWE4G6fgEy/zMcxG17B9ZTyX8bV85C5y1S40ZX/kdj+GD1P/zVQA56XStC9h2idJI/z7huz4CxoVvE4=)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNqFkc1uwjAMgF/F6wk0SmHTJNQFtF32AuOwQy+hdSFamkSJ08EQ776EbMAkJKTIf7I/O/Y+ezVm3HvMyoy52gpDi0rh1mhL0GDLvSTYVwqg4cQHw2QDWCRv1Z8H4Db6qwSyHlPkEFUQ4bHixA0OYWckJ4wesZUn0gpeainqz3mVRQzM4S7qKlss9XotEd6laBDu4Y03yIpUE+oB2NJy5QSJwFC8w0iIuXkbMkN9moUZ6HPR/uJDeINSalaYxCjOkBBgxeWEijnayWiOz+AcFaHNeU2ix7QCOiFK4FLCZPzoALnDXHt6Pq7hP0Ii7/EGYuag9itR5yv8FmgH01EIPkUxG8F0eA2bJmut7kbX+pG+6NVq28WTBTN+92PwMDHbSAXQhteCdiVMUpNwwuMassMP8kfAJQ==)

</div>

### CSS Animations {#css-animations}

[Native CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) được áp dụng theo cùng cách như CSS transitions, với sự khác biệt là `*-enter-from` không được xóa ngay lập tức sau khi phần tử được chèn, mà trên một sự kiện `animationend`.

Đối với hầu hết CSS animations, chúng ta có thể đơn giản khai báo chúng dưới các class `*-enter-active` và `*-leave-active`. Đây là một ví dụ:

```vue-html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Hello here is some bouncy text!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<CssAnimation />

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNqNksGOgjAQhl9lJNmoBwRNvCAa97YP4JFLbQZsLG3TDqzG+O47BaOezCYkpfB9/0wHbsm3c4u+w6RIyiC9cgQBqXO7yqjWWU9wA4813KH2toUpo9PKVEZaExg92V/YRmBGvsN5ZcpsTGGfN4St04Iw7qg8dkTWwF5qJc/bKnnYk7hWye5gm0ZjmY0YKwDlwQsTFCnWjGiRpaPtjETG43smHPSpqh9pVQKBrjpyrfCNMilZV8Aqd5cNEF4oFVo1pgCJhtBvnjEAP6i1hRN6BBUg2BZhKHUdvMmjWhYHE9dXY/ygzN4PasqhB75djM2mQ7FUSFI9wi0GCJ6uiHYxVsFUGcgX67CpzP0lahQ9/k/kj9CjDzgG7M94rT1PLLxhQ0D+Na4AFI9QW98WEKTQOMvnLAOwDrD+wC0Xq/Ubusw/sU+QL/45hskk9z8Bddbn)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNqNUs2OwiAQfpWxySZ66I8mXioa97YP4LEXrNNKpEBg2tUY330pqOvJmBBgyPczP1yTb2OyocekTJirrTC0qRSejbYEB2x4LwmulQI4cOLTWbwDWKTeqkcE4I76twSyPcaX23j4zS+WP3V9QNgZyQnHiNi+J9IKtrUU9WldJaMMrGEynlWy2em2lcjyCPMUALazXDlBwtMU79CT9rpXNXp4tGYGhlQ0d7UqAUcXOeI6bluhUtKmhEVhzisgPFPKpWhVCTUqQrt6ygD8oJQajmgRhAOnO4RgdQm8yd0tNzGv/D8x/8Dy10IVCzn4axaTTYNZymsSA8YuciU6PrLL6IKpUFBkS7cKXXwQJfIBPyP6IQ1oHUaB7QkvjfUdcy+wIFB8PeZIYwmNtl0JruYSp8XMk+/TXL7BzbPF8gU6L95hn8D4OUJnktsfM1vavg==)

</div>

### Custom Transition Classes {#custom-transition-classes}

Bạn cũng có thể chỉ định custom transition classes bằng cách truyền các props sau vào `<Transition>`:

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

Các props này sẽ ghi đè các tên class thông thường. Điều này đặc biệt hữu ích khi bạn muốn kết hợp hệ thống transition của Vue với một CSS animation library hiện có, chẳng hạn như [Animate.css](https://daneden.github.io/animate.css/):

```vue-html
<!-- giả định Animate.css được bao gồm trên trang -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNqNUctuwjAQ/BXXF9oDsZB6ogbRL6hUcbSEjLMhpn7JXtNWiH/vhqS0R3zxPmbWM+szf02pOVXgSy6LyTYhK4A1rVWwPsWM7MwydOzCuhw9mxF0poIKJoZC0D5+stUAeMRc4UkFKcYpxKcEwSenEYYM5b4ixsA2xlnzsVJ8Yj8Mt+LrbTwcHEgxwojCmNxmHYpFG2kaoxO0B2KaWjD6uXG6FCiKj00ICHmuDdoTjD2CavJBCna7KWjZrYK61b9cB5pI93P3sQYDbxXf7aHHccpVMolO7DS33WSQjPXgXJRi2Cl1xZ8nKkjxf0dBFvx2Q7iZtq94j5jKUgjThmNpjIu17ZzO0JjohT7qL+HsvohJWWNKEc/NolncKt6Goar4y/V7rg/wyw9zrLOy)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNqNUcFuwjAM/RUvp+1Ao0k7sYDYF0yaOFZCJjU0LE2ixGFMiH9f2gDbcVKU2M9+tl98Fm8hNMdMYi5U0tEEXraOTsFHho52mC3DuXUAHTI+PlUbIBLn6G4eQOr91xw4ZqrIZXzKVY6S97rFYRqCRabRY7XNzN7BSlujPxetGMvAAh7GtxXLtd/vLSlZ0woFQK0jumTY+FJt7ORwoMLUObEfZtpiSpRaUYPkmOIMNZsj1VhJRWeGMsFmczU6uCOMHd64lrCQ/s/d+uw0vWf+MPuea5Vp5DJ0gOPM7K4Ci7CerPVKhipJ/moqgJJ//8ipxN92NFdmmLbSip45pLmUunOH1Gjrc7ezGKnRfpB4wJO0ZpvkdbJGpyRfmufm+Y4Mxo1oK16n9UwNxOUHwaK3iQ==)

</div>

### Using Transitions and Animations Together {#using-transitions-and-animations-together}

Vue cần đính kèm event listeners để biết khi nào một transition đã kết thúc. Nó có thể là `transitionend` hoặc `animationend`, tùy thuộc vào loại CSS rules được áp dụng. Nếu bạn chỉ sử dụng một trong hai, Vue có thể tự động phát hiện loại chính xác.

Tuy nhiên, trong một số trường hợp bạn có thể muốn có cả hai trên cùng một phần tử, ví dụ có một CSS animation được kích hoạt bởi Vue, cùng với một CSS transition effect trên hover. Trong những trường hợp này, bạn sẽ phải khai báo rõ ràng loại mà bạn muốn Vue quan tâm bằng cách truyền prop `type`, với giá trị là `animation` hoặc `transition`:

```vue-html
<Transition type="animation">...</Transition>
```

### Nested Transitions và Explicit Transition Durations {#nested-transitions-and-explicit-transition-durations}

Mặc dù các transition classes chỉ được áp dụng cho phần tử con trực tiếp trong `<Transition>`, chúng ta có thể transition các phần tử lồng nhau bằng cách sử dụng nested CSS selectors:

```vue-html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Hello
    </div>
  </div>
</Transition>
```

```css
/* rules nhắm đến các phần tử lồng nhau */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... các CSS cần thiết khác được bỏ qua */
```

Chúng ta thậm chí có thể thêm một transition delay cho phần tử lồng nhau khi enter, điều này tạo ra một chuỗi enter animation có độ trễ:

```css{3}
/* delay enter của phần tử lồng nhau để tạo hiệu ứng staggered */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

Tuy nhiên, điều này tạo ra một vấn đề nhỏ. Theo mặc định, component `<Transition>` cố gắng tự động xác định khi nào transition đã kết thúc bằng cách lắng nghe sự kiện `transitionend` hoặc `animationend` **đầu tiên** trên phần tử transition gốc. Với một nested transition, hành vi mong muốn nên là đợi cho đến khi các transitions của tất cả các phần tử bên trong đã kết thúc.

Trong những trường hợp như vậy, bạn có thể chỉ định một transition duration rõ ràng (tính bằng mili-giây) bằng cách sử dụng prop `duration` trên component `<Transition>`. Tổng duration nên khớp với delay cộng với transition duration của phần tử bên trong:

```vue-html
<Transition :duration="550">...</Transition>
```

<NestedTransitions />

[Try it in the Playground](https://play.vuejs.org/#eNqVVd9v0zAQ/leO8LAfrE3HNKSFbgKmSYMHQNAHkPLiOtfEm2NHttN2mvq/c7bTNi1jgFop9t13d9995ziPyfumGc5bTLJkbLkRjQOLrm2uciXqRhsHj2BwBiuYGV3DAUEPcpUrrpUlaKUXcOkBh860eJSrcRqzUDxtHNaNZA5pBzCets5pBe+4FPz+Mk+66Bf+mSdXE12WEsdphMWQiWHKCicoLCtaw/yKIs/PR3kCitVIG4XWYUEJfATFFGIO84GYdRUIyCWzlra6dWg2wA66dgqlts7c+d8tSqk34JTQ6xqb9TjdUiTDOO21TFvrHqRfDkPpExiGKvBITjdl/L40ulVFBi8R8a3P17CiEKrM4GzULIOlFmpQoSgrl8HpKFpX3kFZu2y0BNhJxznvwaJCA1TEYcC4E3MkKp1VIptjZ43E3KajDJiUMBqeWUBmcUBUqJGYOT2GAiV7gJAA9Iy4GyoBKLH2z+N0W3q/CMC2yCCkyajM63Mbc+9z9mfvZD+b071MM23qLC69+j8PvX5HQUDdMC6cL7BOTtQXCJwpas/qHhWIBdYtWGgtDWNttWTmThu701pf1W6+v1Hd8Xbz+k+VQxmv8i7Fv1HZn+g/iv2nRkjzbd6npf/Rkz49DifQ3dLZBBYOJzC4rqgCwsUbmLYlCAUVU4XsCd1NrCeRHcYXb1IJC/RX2hEYCwJTvHYVMZoavbBI09FmU+LiFSzIh0AIXy1mqZiFKaKCmVhiEVJ7GftHZTganUZ56EYLL3FykjhL195MlMM7qxXdmEGDPOG6boRE86UJVPMki+p4H01WLz4Fm78hSdBo5xXy+yfsd3bpbXny1SA1M8c82fgcMyW66L75/hmXtN44a120ktDPOL+h1bL1HCPsA42DaPdwge3HcO/TOCb2ZumQJtA15Yl65Crg84S+BdfPtL6lezY8C3GkZ7L6Bc1zNR0=)

Nếu cần thiết, bạn cũng có thể chỉ định các giá trị riêng biệt cho enter và leave durations bằng cách sử dụng một object:

```vue-html
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
```

### Performance Considerations {#performance-considerations}

Bạn có thể nhận thấy rằng các animations được hiển thị ở trên chủ yếu sử dụng các properties như `transform` và `opacity`. Các properties này hiệu quả để animate vì:

1. Chúng không ảnh hưởng đến document layout trong quá trình animation, vì vậy chúng không kích hoạt tính toán CSS layout tốn kém trên mỗi animation frame.

2. Hầu hết các trình duyệt hiện đại có thể tận dụng GPU hardware acceleration khi animate `transform`.

So sánh với đó, các properties như `height` hoặc `margin` sẽ kích hoạt CSS layout, vì vậy chúng tốn kém hơn nhiều để animate, và nên được sử dụng một cách thận trọng.

## JavaScript Hooks {#javascript-hooks}

Bạn có thể hook vào quá trình transition với JavaScript bằng cách lắng nghe các sự kiện trên component `<Transition>`:

```vue-html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

<div class="composition-api">

```js
// được gọi trước khi phần tử được chèn vào DOM.
// sử dụng điều này để đặt trạng thái "enter-from" của phần tử
function onBeforeEnter(el) {}

// được gọi một frame sau khi phần tử được chèn.
// sử dụng điều này để bắt đầu entering animation.
function onEnter(el, done) {
  // gọi callback done để chỉ ra transition kết thúc
  // tùy chọn nếu sử dụng kết hợp với CSS
  done()
}

// được gọi khi enter transition đã kết thúc.
function onAfterEnter(el) {}

// được gọi khi enter transition bị hủy trước khi hoàn thành.
function onEnterCancelled(el) {}

// được gọi trước leave hook.
// Hầu hết thời gian, bạn chỉ nên sử dụng leave hook
function onBeforeLeave(el) {}

// được gọi khi leave transition bắt đầu.
// sử dụng điều này để bắt đầu leaving animation.
function onLeave(el, done) {
  // gọi callback done để chỉ ra transition kết thúc
  // tùy chọn nếu sử dụng kết hợp với CSS
  done()
}

// được gọi khi leave transition đã kết thúc và
// phần tử đã được xóa khỏi DOM.
function onAfterLeave(el) {}

// chỉ có sẵn với v-show transitions
function onLeaveCancelled(el) {}
```

</div>
<div class="options-api">

```js
export default {
  // ...
  methods: {
    // được gọi trước khi phần tử được chèn vào DOM.
    // sử dụng điều này để đặt trạng thái "enter-from" của phần tử
    onBeforeEnter(el) {},

    // được gọi một frame sau khi phần tử được chèn.
    // sử dụng điều này để bắt đầu animation.
    onEnter(el, done) {
      // gọi callback done để chỉ ra transition kết thúc
      // tùy chọn nếu sử dụng kết hợp với CSS
      done()
    },

    // được gọi khi enter transition đã kết thúc.
    onAfterEnter(el) {},

    // được gọi khi enter transition bị hủy trước khi hoàn thành.
    onEnterCancelled(el) {},

    // được gọi trước leave hook.
    // Hầu hết thời gian, bạn chỉ nên sử dụng leave hook.
    onBeforeLeave(el) {},

    // được gọi khi leave transition bắt đầu.
    // sử dụng điều này để bắt đầu leaving animation.
    onLeave(el, done) {
      // gọi callback done để chỉ ra transition kết thúc
      // tùy chọn nếu sử dụng kết hợp với CSS
      done()
    },

    // được gọi khi leave transition đã kết thúc và
    // phần tử đã được xóa khỏi DOM.
    onAfterLeave(el) {},

    // chỉ có sẵn với v-show transitions
    onLeaveCancelled(el) {}
  }
}
```

</div>

Các hooks này có thể được sử dụng kết hợp với CSS transitions / animations hoặc độc lập.

Khi sử dụng JavaScript-only transitions, thường là một ý tưởng tốt để thêm prop `:css="false"`. Điều này nói rõ với Vue để bỏ qua auto CSS transition detection. Ngoài việc hiệu quả hơn một chút, điều này cũng ngăn các CSS rules vô tình can thiệp vào transition:

```vue-html{3}
<Transition
  ...
  :css="false"
>
  ...
</Transition>
```

Với `:css="false"`, chúng ta cũng hoàn toàn chịu trách nhiệm kiểm soát khi nào transition kết thúc. Trong trường hợp này, các callbacks `done` là bắt buộc cho các hooks `@enter` và `@leave`. Nếu không, các hooks sẽ được gọi đồng bộ và transition sẽ kết thúc ngay lập tức.

Đây là một demo sử dụng [GSAP library](https://gsap.com/) để thực hiện các animations. Bạn tất nhiên có thể sử dụng bất kỳ animation library nào bạn muốn, ví dụ [Anime.js](https://animejs.com/) hoặc [Motion One](https://motion.dev/):

<JsHooks />

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNqNVMtu2zAQ/JUti8I2YD3i1GigKmnaorcCveTQArpQFCWzlkiCpBwHhv+9Sz1qKYckJ3FnlzvD2YVO5KvW4aHlJCGpZUZoB5a7Vt9lUjRaGQcnMLyEM5RGNbDA0sX/VGWpHnB/xEQmmZIWe+zUI9z6m0tnWr7ymbKVzAklQclvvFSG/5COmyWvV3DKJHTdQiRHZN0jAJbRmv9OIA432/UE+jODlKZMuKcErnx8RrazP8woR7I1FEryKaVTU8aiNdRfwWZTQtQwi1HAGF/YB4BTyxNY8JpaJ1go5K/WLTfhdg1Xq8V4SX5Xja65w0ovaCJ8Jvsnpwc+l525F2XH4ac3Cj8mcB3HbxE9qnvFMRzJ0K3APuhIjPefmTTyvWBAGvWbiDuIgeNYRh3HCCDNW+fQmHtWC7a/zciwaO/8NyN3D6qqap5GfVnXAC89GCqt8Bp77vu827+A+53AJrOFzMhQdMnO8dqPpMO74Yx4wqxFtKS1HbBOMdIX4gAMffVp71+Qq2NG4BCIcngBKk8jLOvfGF30IpBGEwcwtO6p9sdwbNXPIadsXxnVyiKB9x83+c3N9WePN9RUQgZO6QQ2sT524KMo3M5Pf4h3XFQ7NwFyZQpuAkML0doEtvEHhPvRDPRkTfq/QNDgRvy1SuIvpFOSDQmbkWTckf7hHsjIzjltkyhqpd5XIVNN5HNfGlW09eAcMp3J+R+pEn7L)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNqNVFFvmzAQ/is3pimNlABNF61iaddt2tukvfRhk/xiwIAXsJF9pKmq/PedDTSwh7ZSFLjvzvd9/nz4KfjatuGhE0ES7GxmZIu3TMmm1QahtLyFwugGFu51wRQAU+Lok7koeFcjPDk058gvlv07gBHYGTVGALbSDwmg6USPnNzjtHL/jcBK5zZxxQwZavVNFNqIHwqF8RUAWs2jn4IffCfqQz+mik5lKLWi3GT1hagHRU58aAUSshpV2YzX4ncCcbjZDp099GcG6ZZnEh8TuPR8S0/oTJhQjmQryLUSU0rUU8a8M9wtoWZTQtIwi0nAGJ/ZB0BwKxJYiJpblFko1a8OLzbhdgWXy8WzP99109YCqdIJmgifyfYuzmUzfFF2HH56o/BjAldx/BbRo7pXHKMjGbrl1IcciWn9fyaNfC8YsIueR5wCFFTGUVAEsEs7pOmDu6yW2f6GBW5o4QbeuScLbu91WdZiF/VlvgEtujdcWek09tx3qZ+/tXAzQU1mA8mCoeicneO1OxKP9yM+4ElmLaEFr+2AecVEn8sDZOSrSzv/1qk+sgAOa1kMOyDlu4jK+j1GZ70E7KKJAxRafKzdazi26s8h5dm+NLpTeQLvP27S6+urz/7T5aaUao26TWATt0cPPsgcK3f6Q1wJWVY4AVJtcmHWhueyo89+G38guD+agT5YBf39s25oIv5arehu8krYkLAs8BeG86DfuANYUCG2NomiTrX7Msx0E7ncl0bnXT04566M4PQPykWaWw==)

</div>

## Reusable Transitions {#reusable-transitions}

Transitions can be reused through Vue's component system. To create a reusable transition, we can create a component that wraps the `<Transition>` component and passes down the slot content:

```vue{6} [MyTransition.vue]
<script>
// JavaScript hooks logic...
</script>

<template>
  <!-- wrap the built-in Transition component -->
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave">
    <slot></slot> <!-- pass down slot content -->
  </Transition>
</template>

<style>
/*
  Necessary CSS...
  Note: avoid using <style scoped> here since it
  does not apply to slot content.
*/
</style>
```

Now `MyTransition` can be imported and used just like the built-in version:

```vue-html
<MyTransition>
  <div v-if="show">Hello</div>
</MyTransition>
```

## Transition khi Xuất Hiện {#transition-on-appear}

Nếu bạn cũng muốn áp dụng một transition trên render ban đầu của một nút, bạn có thể thêm prop `appear`:

```vue-html
<Transition appear>
  ...
</Transition>
```

## Transition Giữa Các Phần Tử {#transition-between-elements}

Ngoài việc toggle một phần tử với `v-if` / `v-show`, chúng ta cũng có thể transition giữa hai phần tử sử dụng `v-if` / `v-else` / `v-else-if`, miễn là chúng ta đảm bảo rằng chỉ có một phần tử được hiển thị tại bất kỳ thời điểm nào:

```vue-html
<Transition>
  <button v-if="docState === 'saved'">Edit</button>
  <button v-else-if="docState === 'edited'">Save</button>
  <button v-else-if="docState === 'editing'">Cancel</button>
</Transition>
```

<BetweenElements />

[Try it in the Playground](https://play.vuejs.org/#eNqdk8tu2zAQRX9loI0SoLLcFN2ostEi6BekmwLa0NTYJkKRBDkSYhj+9wxJO3ZegBGu+Lhz7syQ3Bd/nJtNIxZN0QbplSMISKNbdkYNznqCPXhcwwHW3g5QsrTsTGekNYGgt/KBBCEsouimDGLCvrztTFtnGGN4QTg4zbK4ojY4YSDQTuOiKwbhN8pUXm221MDd3D11xfJeK/kIZEHupEagrbfjZssxzAgNs5nALIC2VxNILUJg1IpMxWmRUAY9U6IZ2/3zwgRFyhowYoieQaseq9ElDaTRrkYiVkyVWrPiXNdiAcequuIkPo3fMub5Sg4l9oqSevmXZ22dwR8YoQ74kdsL4Go7ZTbR74HT/KJfJlxleGrG8l4YifqNYVuf251vqOYr4llbXz4C06b75+ns1a3BPsb0KrBy14Aymnerlbby8Vc8cTajG35uzFITpu0t5ufzHQdeH6LBsezEO0eJVbB6pBiVVLPTU6jQEPpKyMj8dnmgkQs+HmQcvVTIQK1hPrv7GQAFt9eO9Bk6fZ8Ub52Qiri8eUo+4dbWD02exh79v/nBP+H2PStnwz/jelJ1geKvk/peHJ4BoRZYow==)

## Chế Độ Transition {#transition-modes}

Trong ví dụ trước, các phần tử đang vào và đang ra được animated cùng một lúc, và chúng ta phải làm cho chúng `position: absolute` để tránh vấn đề layout khi cả hai phần tử có mặt trong DOM.

Tuy nhiên, trong một số trường hợp điều này không phải là một lựa chọn, hoặc đơn giản không phải là hành vi mong muốn. Chúng ta có thể muốn phần tử đang ra được animated ra trước, và phần tử đang vào chỉ được chèn **sau khi** animation ra đã hoàn thành. Điều phối các animation như vậy thủ công sẽ rất phức tạp - may mắn là, chúng ta có thể kích hoạt hành vi này bằng cách truyền cho `<Transition>` một prop `mode`:

```vue-html
<Transition mode="out-in">
  ...
</Transition>
```

Here's the previous demo with `mode="out-in"`:

<BetweenElements mode="out-in" />

`<Transition>` also supports `mode="in-out"`, although it's much less frequently used.

## Transition Between Components {#transition-between-components}

`<Transition>` can also be used around [dynamic components](/guide/essentials/component-basics#dynamic-components):

```vue-html
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

<BetweenComponents />

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNqtksFugzAMhl/F4tJNKtDLLoxWKnuDacdcUnC3SCGJiMmEqr77EkgLbXfYYZyI8/v77dinZG9M5npMiqS0dScMgUXqzY4p0RrdEZzAfnEp9fc7HuEMx063sPIZq6viTbdmHy+yfDwF5K2guhFUUcBUnkNvcelBGrjTooHaC7VCRXBAoT6hQTRyAH2w2DlsmKq1sgS8JuEwUCfxdgF7Gqt5ZqrMp+58X/5A2BrJCcOJSskPKP0v+K8UyvQENBjcsqTjjdAsAZe2ukHpI3dm/q5wXPZBPFqxZAf7gCrzGfufDlVwqB4cPjqurCChFSjeBvGRN+iTA9afdE+pUD43FjG/bSHsb667Mr9qJot89vCBMl8+oiotDTL8ZsE39UnYpRN0fQlK5A5jEE6BSVdiAdrwWtAAm+zFAnKLr0ydA3pJDDt0x/PrMrJifgGbKdFPfCwpWU+TuWz5omzfVCNcfJJ5geL8pqtFn5E07u7fSHFOj6TzDyUDNEM=)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNqtks9ugzAMxl/F4tJNamGXXVhWqewVduSSgStFCkkUDFpV9d0XJyn9t8MOkxBg5/Pvi+Mci51z5TxhURdi7LxytG2NGpz1BB92cDvYezvAqqxixNLVjaC5ETRZ0Br8jpIe93LSBMfWAHRBYQ0aGms4Jvw6Q05rFvSS5NNzEgN4pMmbcwQgO1Izsj5CalhFRLDj1RN/wis8olpaCQHh4LQk5IiEll+owy+XCGXcREAHh+9t4WWvbFvAvBlsjzpk7gx5TeqJtdG4LbawY5KoLtR/NGjYoHkw+PTSjIqUNWDkwOK97DHUMjVEdqKNMqE272E5dajV+JvpVlSLJllUF4+QENX1ERox0kHzb8m+m1CEfpOgYYgpqVHOmJNpgLQQa7BOdooO8FK+joByxLc4tlsiX6s7HtnEyvU1vKTCMO+4pWKdBnO+0FfbDk31as5HsvR+Hl9auuozk+J1/hspz+mRdPoBYtonzg==)

</div>

## Dynamic Transitions {#dynamic-transitions}

`<Transition>` props like `name` can also be dynamic! It allows us to dynamically apply different transitions based on state change:

```vue-html
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

Điều này có thể hữu ích khi bạn đã định nghĩa CSS transitions / animations sử dụng các quy ước class transition của Vue và muốn chuyển đổi giữa chúng.

Bạn cũng có thể áp dụng hành vi khác nhau trong JavaScript transition hooks dựa trên trạng thái hiện tại của component. Cuối cùng, cách tối thượng để tạo dynamic transitions là thông qua [reusable transition components](#reusable-transitions) chấp nhận props để thay đổi bản chất của transition(s) sẽ được sử dụng. Có thể nghe có vẻ sến, nhưng giới hạn thực sự chỉ là trí tưởng tượng của bạn.

## Transitions with the Key Attribute {#transitions-with-the-key-attribute}

Sometimes you need to force the re-render of a DOM element in order for a transition to occur.

Take this counter component for example:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);

setInterval(() => count.value++, 1000);
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 1,
      interval: null 
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.count++;
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>

Nếu chúng ta đã loại bỏ thuộc tính `key`, chỉ có text node sẽ được cập nhật và do đó không có transition nào sẽ xảy ra. Tuy nhiên, với thuộc tính `key` được đặt, Vue biết để tạo một phần tử `span` mới bất cứ khi nào `count` thay đổi và do đó component `Transition` có 2 phần tử khác nhau để transition giữa chúng.

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNp9UsFu2zAM/RVCl6Zo4nhYd/GcAtvQQ3fYhq1HXTSFydTKkiDJbjLD/z5KMrKgLXoTHx/5+CiO7JNz1dAja1gbpFcuQsDYuxtuVOesjzCCxx1MsPO2gwuiXnzkhhtpTYggbW8ibBJlUV/mBJXfmYh+EHqxuITNDYzcQGFWBPZ4dUXEaQnv6jrXtOuiTJoUROycFhEpAmi3agCpRQgbzp68cA49ZyV174UJKiprckxIcMJA84hHImc9oo7jPOQ0kQ4RSvH6WXW7JiV6teszfQpDPGqEIK3DLSGpQbazsyaugvqLDVx77JIhbqp5wsxwtrRvPFI7NWDhEGtYYVrQSsgELzOiUQw4I2Vh8TRgA9YJqeIR6upDABQh9TpTAPE7WN3HlxLp084Foi3N54YN1KWEVpOMkkO2ZJHsmp3aVw/BGjqMXJE22jml0X93STRw1pReKSe0tk9fMxZ9nzwVXP5B+fgK/hAOCePsh8dAt4KcnXJR+D3S16X07a9veKD3KdnZba+J/UbyJ+Zl0IyF9rk3Wxr7jJenvcvnrcz+PtweItKuZ1Np0MScMp8zOvkvb1j/P+776jrX0UbZ9A+fYSTP)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNp9U8tu2zAQ/JUFTwkSyw6aXlQ7QB85pIe2aHPUhZHWDhOKJMiVYtfwv3dJSpbbBgEMWJydndkdUXvx0bmi71CUYhlqrxzdVAa3znqCBtey0wT7ygA0kuTZeX4G8EidN+MJoLadoRKuLkdAGULfS12C6bSGDB/i3yFx2tiAzaRIjyoUYxesICDdDaczZq1uJrNETY4XFx8G5Uu4WiwW55PBA66txy8YyNvdZFNrlP4o/Jdpbq4M/5bzYxZ8IGydloR8Alg2qmcVGcKqEi9eOoe+EqnExXsvTVCkrBkQxoKTBspn3HFDmprp+32ODA4H9mLCKDD/R2E5Zz9+Ws5PpuBjoJ1GCLV12DASJdKGa2toFtRvLOHaY8vx8DrFMGdiOJvlS48sp3rMHGb1M4xRzGQdYU6REY6rxwHJGdJxwBKsk7WiHSyK9wFQhqh14gDyIVjd0f8Wa2/bUwOyWXwQLGGRWzicuChvKC4F8bpmrTbFU7CGL2zqiJm2Tmn03100DZUox5ddCam1ffmaMPJd3Cnj9SPWz6/gT2EbsUr88Bj4VmAljjWSfoP88mL59tc33PLzsdjaptPMfqP4E1MYPGOmfepMw2Of8NK0d238+JTZ3IfbLSFnPSwVB53udyX4q/38xurTuO+K6/Fqi8MffqhR/A==)

</div>

---

**Related**

- [`<Transition>` API reference](/api/built-in-components#transition)

# Components {#components}

Cho đến nay, chúng ta chỉ làm việc với một component duy nhất. Các ứng dụng Vue thực tế thường được tạo với các component lồng nhau.

Một component cha có thể render một component khác trong template của nó như một component con. Để sử dụng một component con, chúng ta cần import nó trước:

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

We also need to register the component using the `components` option. Here we are using the object property shorthand to register the `ChildComp` component under the `ChildComp` key.

</div>
</div>

<div class="sfc">

Then, we can use the component in the template as:

```vue-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

We also need to register the component using the `components` option. Here we are using the object property shorthand to register the `ChildComp` component under the `ChildComp` key.

Because we are writing the template in the DOM, it will be subject to browser's parsing rules, which is case-insensitive for tag names. Therefore, we need to use the kebab-cased name to reference the child component:

```vue-html
<child-comp></child-comp>
```

</div>


Now try it yourself - import the child component and render it in the template.

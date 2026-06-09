<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>Giao diện</template>
      <template #lead>Khám phá các giao diện, bộ UI và plugin. Bạn có thể xem cách một ứng dụng thực tế được xây dựng với Vue bởi các đối tác của chúng tôi.</template>
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      Bạn muốn hiển thị giao diện của mình ở đây? <a class="link" href="mailto:evan@vuejs.org?subject=Theme+affiliation">Liên hệ với chúng tôi!</a>
    </ThemeContact>
  </div>
</template>

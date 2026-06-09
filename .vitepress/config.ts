import fs from 'fs'
import path from 'path'
import {
  defineConfigWithTheme,
  type HeadConfig,
  type Plugin
} from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import llmstxt from 'vitepress-plugin-llms'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'

const nav: ThemeConfig['nav'] = [
  {
    text: 'Tài liệu',
    activeMatch: `^/(guide|tutorial|examples|api|glossary|error-reference)/`,
    items: [
      { text: 'Bắt đầu nhanh', link: '/guide/quick-start' },
      { text: 'Hướng dẫn', link: '/guide/introduction' },
      { text: 'Hướng dẫn tương tác', link: '/tutorial/' },
      { text: 'Ví dụ', link: '/examples/' },
      { text: 'API', link: '/api/' },
      // { text: 'Quy chuẩn phong cách (Style Guide)', link: '/style-guide/' },
      { text: 'Thuật ngữ', link: '/glossary/' },
      { text: 'Tra cứu lỗi', link: '/error-reference/' },
      {
        text: 'Tài liệu Vue 2',
        link: 'https://v2.vuejs.org'
      },
      {
        text: 'Di chuyển từ Vue 2',
        link: 'https://v3-migration.vuejs.org/'
      }
    ]
  },
  {
    text: 'Playground',
    link: 'https://play.vuejs.org'
  },
  {
    text: 'Hệ sinh thái',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: 'Tài nguyên',
        items: [
          { text: 'Theme', link: '/ecosystem/themes' },
          { text: 'Thư viện UI', link: 'https://ui-libs.vercel.app/' },
          {
            text: 'Bộ sưu tập plugin',
            link: 'https://www.vue-plugins.org/'
          },
          {
            text: 'Chứng chỉ',
            link: 'https://certificates.dev/vuejs/?ref=vuejs-nav'
          },
          { text: 'Việc làm', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'Cửa hàng áo thun', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: 'Thư viện chính thức',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/' },
          { text: 'Công cụ phát triển', link: '/guide/scaling-up/tooling.html' }
        ]
      },
      {
        text: 'Khóa học video',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: 'Trợ giúp',
        items: [
          {
            text: 'Discord',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'GitHub Discussions',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'Cộng đồng DEV', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: 'Tin tức',
        items: [
          { text: 'Blog', link: 'https://blog.vuejs.org/' },
          { text: 'X', link: 'https://x.com/vuejs' },
          { text: 'Sự kiện', link: 'https://events.vuejs.org/' },
          { text: 'Bản tin', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: 'Giới thiệu',
    activeMatch: `^/about/`,
    items: [
      { text: 'Câu hỏi thường gặp', link: '/about/faq' },
      { text: 'Đội ngũ', link: '/about/team' },
      { text: 'Phiên bản phát hành', link: '/about/releases' },
      {
        text: 'Hướng dẫn cộng đồng',
        link: '/about/community-guide'
      },
      { text: 'Quy tắc ứng xử', link: '/about/coc' },
      { text: 'Chính sách quyền riêng tư', link: '/about/privacy' },
      {
        text: 'Phim tài liệu',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: 'Ủng hộ',
    activeMatch: `^/(sponsor|partners)/`,
    items: [
      { text: 'Tài trợ', link: '/sponsor/' },
      { text: 'Đối tác', link: '/partners/' }
    ]
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: 'Bắt đầu',
      items: [
        { text: 'Giới thiệu', link: '/guide/introduction' },
        {
          text: 'Bắt đầu nhanh',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: 'Cốt lõi',
      items: [
        {
          text: 'Tạo ứng dụng',
          link: '/guide/essentials/application'
        },
        {
          text: 'Cú pháp template',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: 'Nền tảng về tính phản ứng',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: 'Thuộc tính computed',
          link: '/guide/essentials/computed'
        },
        {
          text: 'Ràng buộc class và style',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: 'Kết xuất có điều kiện',
          link: '/guide/essentials/conditional'
        },
        { text: 'Kết xuất danh sách', link: '/guide/essentials/list' },
        {
          text: 'Xử lý sự kiện',
          link: '/guide/essentials/event-handling'
        },
        { text: 'Ràng buộc form', link: '/guide/essentials/forms' },
        { text: 'Watcher', link: '/guide/essentials/watchers' },
        { text: 'Template ref', link: '/guide/essentials/template-refs' },
        {
          text: 'Kiến thức cơ bản về component',
          link: '/guide/essentials/component-basics'
        },
        {
          text: 'Hook vòng đời',
          link: '/guide/essentials/lifecycle'
        }
      ]
    },
    {
      text: 'Chuyên sâu về component',
      items: [
        {
          text: 'Đăng ký',
          link: '/guide/components/registration'
        },
        { text: 'Props', link: '/guide/components/props' },
        { text: 'Event', link: '/guide/components/events' },
        { text: 'v-model của component', link: '/guide/components/v-model' },
        {
          text: 'Thuộc tính kế thừa',
          link: '/guide/components/attrs'
        },
        { text: 'Slot', link: '/guide/components/slots' },
        {
          text: 'Provide / inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: 'Component bất đồng bộ',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: 'Tái sử dụng',
      items: [
        {
          text: 'Composable',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Directive tùy chỉnh',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'Plugin', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: 'Component dựng sẵn',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: 'Mở rộng ứng dụng',
      items: [
        { text: 'Single-File Component', link: '/guide/scaling-up/sfc' },
        { text: 'Công cụ phát triển', link: '/guide/scaling-up/tooling' },
        { text: 'Điều hướng', link: '/guide/scaling-up/routing' },
        {
          text: 'Quản lý state',
          link: '/guide/scaling-up/state-management'
        },
        { text: 'Kiểm thử', link: '/guide/scaling-up/testing' },
        {
          text: 'SSR (render phía máy chủ)',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Thực hành tốt nhất',
      items: [
        {
          text: 'Triển khai production',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'Hiệu năng',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'Khả năng truy cập',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'Bảo mật',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: 'Tổng quan', link: '/guide/typescript/overview' },
        {
          text: 'TypeScript với Composition API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TypeScript với Options API',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: 'Chủ đề mở rộng',
      items: [
        {
          text: 'Các cách sử dụng Vue',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'Câu hỏi thường gặp về Composition API',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'Chuyên sâu về tính phản ứng (reactivity)',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'Cơ chế render (kết xuất)',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'Render function và JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue và Web Components',
          link: '/guide/extras/web-components'
        },
        {
          text: 'Kỹ thuật animation',
          link: '/guide/extras/animation'
        }
        // {
        //   text: 'Building a Library for Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React Devs',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: 'API toàn cục',
      items: [
        { text: 'Ứng dụng', link: '/api/application' },
        {
          text: 'Chung',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: 'Tính phản ứng: Cốt lõi',
          link: '/api/reactivity-core'
        },
        {
          text: 'Tính phản ứng: Tiện ích',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Tính phản ứng: Nâng cao',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Hook vòng đời',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Dependency Injection (Cung cấp / nhận phụ thuộc)',
          link: '/api/composition-api-dependency-injection'
        },
        {
          text: 'Hàm trợ giúp',
          link: '/api/composition-api-helpers'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'Options: State', link: '/api/options-state' },
        { text: 'Options: Rendering', link: '/api/options-rendering' },
        {
          text: 'Options: Lifecycle',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Options: Composition',
          link: '/api/options-composition'
        },
        { text: 'Options: Khác', link: '/api/options-misc' },
        {
          text: 'Instance của component',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'Thành phần dựng sẵn',
      items: [
        { text: 'Directive', link: '/api/built-in-directives' },
        { text: 'Component', link: '/api/built-in-components' },
        {
          text: 'Phần tử đặc biệt',
          link: '/api/built-in-special-elements'
        },
        {
          text: 'Thuộc tính đặc biệt',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: 'Single-File Component',
      items: [
        { text: 'Đặc tả cú pháp', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'Tính năng CSS', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: 'API nâng cao',
      items: [
        { text: 'Custom Elements', link: '/api/custom-elements' },
        { text: 'Render function', link: '/api/render-function' },
        { text: 'SSR (render phía máy chủ)', link: '/api/ssr' },
        { text: 'Utility Types của TypeScript', link: '/api/utility-types' },
        { text: 'Tuỳ chọn render', link: '/api/custom-renderer' },
        { text: 'Cờ biên dịch', link: '/api/compile-time-flags' }
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Cơ bản',
      items: [
        {
          text: 'Hello World',
          link: '/examples/#hello-world'
        },
        {
          text: 'Xử lý input người dùng',
          link: '/examples/#handling-input'
        },
        {
          text: 'Ràng buộc thuộc tính',
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Điều kiện và vòng lặp',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Ràng buộc form',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Component đơn giản',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Ứng dụng thực tế',
      items: [
        {
          text: 'Trình soạn thảo Markdown',
          link: '/examples/#markdown'
        },
        {
          text: 'Tải dữ liệu',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Bảng có sắp xếp và lọc',
          link: '/examples/#grid'
        },
        {
          text: 'Cấu trúc cây',
          link: '/examples/#tree'
        },
        {
          text: 'Biểu đồ SVG',
          link: '/examples/#svg'
        },
        {
          text: 'Modal với transition',
          link: '/examples/#modal'
        },
        {
          text: 'Danh sách với transition',
          link: '/examples/#list-transition'
        }
      ]
    },
    {
      text: '7 GUIs',
      items: [
        {
          text: 'Bộ đếm',
          link: '/examples/#counter'
        },
        {
          text: 'Chuyển đổi nhiệt độ',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Đặt vé máy bay',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Bộ hẹn giờ',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Vẽ hình tròn',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Bảng tính',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Quy chuẩn phong cách (Style Guide)',
      items: [
        {
          text: 'Tổng quan',
          link: '/style-guide/'
        },
        {
          text: 'A - Thiết yếu',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Rất nên tuân theo',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Nên tuân theo',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Cần cân nhắc',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

const i18n: ThemeConfig['i18n'] = {
  search: 'Tìm kiếm',
  menu: 'Menu',
  toc: 'Trên trang này',
  returnToTop: 'Về đầu trang',
  appearance: 'Giao diện',
  previous: 'Trước',
  next: 'Tiếp',
  pageNotFound: 'Không tìm thấy trang',
  deadLink: {
    before: 'Bạn vừa truy cập một liên kết không tồn tại: ',
    after: '.'
  },
  deadLinkReport: {
    before: 'Vui lòng ',
    link: 'báo lỗi cho chúng tôi',
    after: ' để chúng tôi có thể sửa lại.'
  },
  footerLicense: {
    before: '',
    after: ''
  },

  ariaAnnouncer: {
    before: '',
    after: ' đã được tải'
  },
  ariaDarkMode: 'Chuyển sang chế độ tối',
  ariaSkipToContent: 'Bỏ qua để đến nội dung chính',
  ariaToC: 'Mục lục của trang hiện tại',
  ariaMainNav: 'Điều hướng chính',
  ariaMobileNav: 'Điều hướng trên thiết bị di động',
  ariaSidebarNav: 'Điều hướng thanh bên'
}

function inlineScript(file: string): HeadConfig {
  return [
    'script',
    {},
    fs.readFileSync(
      path.resolve(__dirname, `./inlined-scripts/${file}`),
      'utf-8'
    )
  ]
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  sitemap: {
    hostname: 'https://vuejs.org'
  },

  lang: 'vi',
  title: 'Vue.js',
  description: 'Vue.js - Framework Javascript linh hoạt',
  base: '/docs-vi/',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://vuejs.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.js' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue.js - Framework Javascript linh hoạt'
      }
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://automation.vuejs.org'
      }
    ],
    inlineScript('restorePreference.js'),
    inlineScript('uwu.js'),
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://media.bitterbrains.com/main.js?from=vuejs&type=top',
        async: 'true'
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,
    i18n,

    localeLinks: [
      {
        link: 'https://cn.vuejs.org',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: 'https://fa.vuejs.org',
        text: 'فارسی',
        repo: 'https://github.com/vuejs-translations/docs-fa'
      },
      {
        link: 'https://ru.vuejs.org',
        text: 'Русский',
        repo: 'https://github.com/vuejs-translations/docs-ru'
      },
      {
        link: 'https://cs.vuejs.org',
        text: 'Čeština',
        repo: 'https://github.com/vuejs-translations/docs-cs'
      },
      {
        link: 'https://zh-hk.vuejs.org',
        text: '繁體中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-hk'
      },
      {
        link: 'https://pl.vuejs.org',
        text: 'Polski',
        repo: 'https://github.com/vuejs-translations/docs-pl'
      },
      {
        link: '/translations/',
        text: 'Hãy cùng dịch Vue.js',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: '10e7a8b13e6aec4007343338ab134e05',
      searchParameters: {
        facetFilters: ['version:v3']
      }
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://x.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'vuejs-translations/docs-vi',
      text: 'Chỉnh sửa trang này trên GitHub'
    },

    footer: {
      license: {
        text: 'Giấy phép MIT',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Bản quyền © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin).use(groupIconMdPlugin)
      // .use(textAdPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        allow: ['../..']
      }
    },
    build: {
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    },
    plugins: [
      llmstxt({
        ignoreFiles: [
          'about/team/**/*',
          'about/team.md',
          'about/privacy.md',
          'about/coc.md',
          'developers/**/*',
          'ecosystem/themes.md',
          'examples/**/*',
          'partners/**/*',
          'sponsor/**/*',
          'index.md'
        ],
        customLLMsTxtTemplate: `\
# Vue.js

Vue.js - The Progressive JavaScript Framework

## Table of Contents

{toc}`
      }) as Plugin,
      groupIconVitePlugin({
        customIcon: {
          cypress: 'vscode-icons:file-type-cypress',
          'testing library': 'logos:testing-library'
        }
      }) as Plugin
    ]
  }
})
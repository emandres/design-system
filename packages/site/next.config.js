module.exports = {
  // TODO: read directory to make more dynamic
  exportPathMap: function() {
    return {
      '/': { page: '/' },
      '/install': { page: '/install' },
      '/contribute': { page: '/contribute' },
      '/contribute/code': { page: '/contribute/code' },
      '/roadmap': { page: '/roadmap' },
      '/components/actionmenu': { page: '/components/actionmenu' },
      '/components/badge': { page: '/components/badge' },
      '/components/button': { page: '/components/button' },
      '/components/card': { page: '/components/card' },
      '/components/icon': { page: '/components/icon' },
      '/components/link': { page: '/components/link' },
      '/components/row': { page: '/components/row' },
      '/components/tab': { page: '/components/tab' },
      '/components/text': { page: '/components/text' },
      '/components/theme': { page: '/components/theme' },
      '/core/build': { page: '/core/build' },
      '/core/usage': { page: '/core/usage' },
      '/core/color': { page: '/core/color' },
      '/core/spacing': { page: '/core/spacing' },
      '/core/typography': { page: '/core/typography' }
    }
  }
}

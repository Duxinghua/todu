module.exports = {
  presets: [
    ['@vue/app', {
      'modules': false,
      useBuiltIns: 'entry',
      polyfills: [
        'es6.promise',
        'es6.symbol'
      ]
    }]
  ]
}

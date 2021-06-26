//process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true;
module.exports = {
  presets: [
    //"@vue/app",
    "@vue/cli-plugin-babel/preset"
  ],
  plugins: [
      "@babel/plugin-transform-arrow-functions",
      // 双问号
      "@babel/plugin-proposal-nullish-coalescing-operator",
      // 可选链插件
      "@babel/plugin-proposal-optional-chaining"
  ]
}

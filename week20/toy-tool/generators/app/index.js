var Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }
  collecting () {
    this.log('collecting')
  }
  creating () {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { title: 'Templating with Yeoman' }
    );
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc')
    );
    this.fs.copyTpl(
      this.templatePath('nyc.config.js'),
      this.destinationPath('nyc.config.js')
    );
    this.fs.copyTpl(
      this.templatePath('createElement.js'),
      this.destinationPath('lib/createElement.js'),
    );
    this.fs.copyTpl(
      this.templatePath('gesture.js'),
      this.destinationPath('lib/gesture.js')
    );
    this.fs.copyTpl(
      this.templatePath('animation.js'),
      this.destinationPath('lib/animation.js')
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    );
    this.fs.copyTpl(
      this.templatePath('main.test.js'),
      this.destinationPath('test/main.js')
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html')
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
    this.npmInstall([
      'webpack',
      'webpack-cli',
      'webpack-dev-server',
      'babel-loader',
      '@babel/core',
      '@babel/register',
      '@babel/preset-env',
      '@babel/plugin-transfomr-react-jsx',
      'mocha',
      'babel-plugin-istanbul',
      '@istanbuljs/nyc-config-babel',
      'nyc',
    ], { 'save-dev': true })
    // this.fs.copyTpl(
    //   this.templatePath('index.html'),
    //   this.destinationPath('public/index.html'),
    //   {title: 'Templating with Yeoman'},
    // )
  }
}
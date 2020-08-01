var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  // async prompting() {
  //   this.answers = await this.prompt([
  //     {
  //       type: "input",
  //       name: "name",
  //       message: "Your project name",
  //       default: this.appname // Default to current folder name
  //     },
  //     {
  //       type: "confirm",
  //       name: "cool",
  //       message: "Would you like to enable the Cool feature?"
  //     }
  //   ]);
  //   // this.log("app name", answers.name)
  // }
  // writing() {
  //   this.log("cool feature", this.answers.cool)
  // }
  // installingLodash() {
  //   this.npmInstall(['lodash'], { 'save-dev': true });
  // }
  // async prompting() {
  //   this.dependency = await this.prompt([
  //     {
  //       type: "input",
  //       name: "name",
  //       message: "input dependency",
  //       // default: this.appname // Default to current folder name
  //     },
  //   ]);
  //   // this.log("app name", answers.name)
  // }

  // writing() {
  //   const pkgJson = {
  //     dependencies: {
  //       [this.dependency.name]: '*'
  //     }
  //   };

  //   // Extend or create package.json file in destination path
  //   this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  // }

  // install() {
  //   this.npmInstall();
  // }
  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: 'Templating with Yeoman' }
    );
  }
};
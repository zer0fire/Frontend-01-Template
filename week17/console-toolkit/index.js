var tty = require('tty')
var ttys = require('ttys')
var readline = require('readline')
var process = require('process')
// const { stdout } = require('process')

// let stdin = ttys.stdin
let stdout = ttys.stdout

// stdout.write('hello\n')
// stdout.write('\033[1A')
// stdout.write('wm')


// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// async function ask(question) {
//   return new Promise((resolve, reject) => {
//     rl.question(question, (answer) => {
//       // TODO: Log the answer in a database
//       // console.log(`Thank you for your valuable feedback: ${answer}`);
//       resolve(answer)
//       rl.close();
//     });
//   }) 
// }

// void async function () {
//   console.log(await ask('your proejct name?'))
// }()
var stdin = process.stdin
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf-8')





async function getChar () {
  return new Promise(resolve => {
    stdin.once('data', function ( key) {
      // if(key === '\u0003') {
      //   process.exit()
      // }
      resolve(key)
      // process.stdout.write(key.toString().charCodeAt(0).toString())
    })
  })
}

function up(n = 1) {
  stdout.write('\033['+n+'A')
}
function down(n = 1) {
  stdout.write('\033['+n+'B')
}
function right(n = 1) {
  stdout.write('\033['+n+'C')
}
function left(n = 1) {
  stdout.write('\033['+n+'D')
}

void async function () {
  stdout.write('whice frame\n')
  let answer = await select(["vue", "react", "angular"])
  stdout.write('\nYou selected ' + answer + '\n')
  process.exit()


  // while (true) {
  //   let char = await getChar()
  //   if(char === '\u0003') {
  //     process.exit()
  //     break
  //   }
  //   console.log(char.split('').map(c => c.charCodeAt(0)))
  // }
}()


async function select (choices) {
  let selected = 0
  for(let i = 0; i < choices.length; i++) {
    let choice = choices[i]
    if (i === selected) {
      stdout.write("[x] " + choice + '\n')
    } else {
      stdout.write("[ ] " + choice + '\n')
    }
  }
  up(choices.length)
  // down(choices.length)
  right()
  // left(choices.length)
  while (true) {
    let char = await getChar()
    if(char === '\u0003') {
      process.exit()
      break
    }
    if(char === 'w' && selected > 0) {
      stdout.write(' ')
      left()
      selected --
      up()
      stdout.write('x')
      left()
    }
    if(char === 's' && selected < choices.length - 1) {
      stdout.write(' ')
      left()
      selected ++
      down()
      stdout.write('x')
      left()
    }
    if(char === '\n') {
      down(choices.length -selected)
      left()
      return choices[selected]
    }
    if(char === '\r') {
      down(choices.length -selected)
      left()
      return choices[selected]
    }

    // console.log(char.split('').map(c => c.charCodeAt(0)))
  }
}
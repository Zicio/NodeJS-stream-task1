#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { join } from "path";
import { writeFile, appendFile } from "fs";

const argv = yargs(hideBin(process.argv)).parseSync();
const command = String(argv._[0]); //имя файла - аргумент
let newDir: string;
if (command) {
  newDir = join(__dirname, `${command}.txt`);
  appendFile(newDir, "\nРезультаты партии:\n", (err: any) => {
    if (err) {
      throw Error(err);
    }
  });
}

const rl = readline.createInterface({ input, output });

const game = async () => {
  const riddle = Math.ceil(Math.random() * 2);
  const answer = await rl.question("Отгадай: 1 или 2?\n");
  if (+answer !== 1 && +answer !== 2) {
    console.log('Введите "1" или "2"!\n');
    game();
    return;
  }
  if (+answer === riddle) {
    console.log(`Отгадано число ${riddle}! Поздравляю!`);
    appendFile(newDir, "• Победа;\n", (err: any) => {
      if (err) {
        throw Error(err);
      }
    });
    rl.close();
    return;
  }
  console.log(`Неверно! Играем, пока не угадаешь!`);
  appendFile(newDir, "• Проигрыш;\n", (err: any) => {
    if (err) {
      throw Error(err);
    }
  });
  game();
};
game();

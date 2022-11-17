#!/usr/bin/env node

import { IResult, IStatistics } from "./types";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { join } from "path";
import { writeFile, access, readFile } from "fs";

const argv = yargs(hideBin(process.argv)).parseSync();
const command = String(argv._[0]);
const newDir = join(__dirname, `${command}.json`);

let data: IStatistics;

//Проверка на существование выбранного файла статистики
access(newDir, (error) => {
  if (error) {
    //Создание файла статистики при его изначальном отсутствии
    writeFile(newDir, JSON.stringify({ results: [] } as IStatistics), (err) => {
      if (err) throw err;
    });
  }
  //Считывание статистики из файла
  readFile(newDir, { encoding: "utf-8" }, (err, database) => {
    if (err) throw err;
    data = JSON.parse(database);
  });
});

const rl = readline.createInterface({ input, output });

//Изначальный счет для партии
const result: IResult = {
  wins: 0,
  defeats: 0,
};

//Дефолтное количество доступных попыток
let attempt = 2;

//Рекурсивная функция геймплея
const game = async () => {
  //Проверка на окончание попыток и, если да, то запись в статистику
  if (attempt === 0) {
    data.results.push(result);
    writeFile(newDir, JSON.stringify(data), (err) => {
      if (err) throw err;
    });
    rl.close();
    console.log("Ты проиграл!\n");
    return;
  }

  const riddle = Math.ceil(Math.random() * 2);
  const answer = await rl.question("Отгадай: 1 или 2?\n");

  //Проверка на неликвидные значения
  if (+answer !== 1 && +answer !== 2) {
    console.log('Введите "1" или "2"!\n');
    game();
    return;
  }

  //Успех
  if (+answer === riddle) {
    result.wins++;
    data.results.push(result);
    writeFile(newDir, JSON.stringify(data), (err) => {
      if (err) throw err;
    });
    rl.close();
    console.log(`Отгадано число ${riddle}! Поздравляю!`);
    return;
  }

  //Поражение
  result.defeats++;
  attempt--;
  console.log(`Неверно! Осталось ${attempt} попыток(-ка)`);
  game();
};
game();

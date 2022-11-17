#!/usr/bin/env node

import { IStatistics } from "./types";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { join } from "path";
import { readFile } from "fs";

const argv = yargs(hideBin(process.argv)).parseSync();
const nameFile = argv._[0];

const dir = join(__dirname, nameFile + ".json");

let data: IStatistics;
readFile(dir, { encoding: "utf-8" }, (err, database) => {
  if (err) throw err;
  data = JSON.parse(database);
  const numberOfParties = data.results.length;
  let sumWinsParty = 0;
  let sumDefeatsParty = 0;
  for (const party of data.results) {
    party.wins !== 0 ? sumWinsParty++ : sumDefeatsParty++;
  }
  const efficiency = Math.round((sumWinsParty / numberOfParties) * 100) + "%";
  console.log(
    `Общее количество партий: ${numberOfParties};\nКоличество выигранных партий: ${sumWinsParty};\nКоличество проигранных партий: ${sumDefeatsParty};\nПроцентное соотношение выигранных партий: ${efficiency}`
  );
});

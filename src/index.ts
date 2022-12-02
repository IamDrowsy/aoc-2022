import { existsSync, writeFileSync, mkdirSync, copyFileSync } from "fs";
import config from "../aocconfig.json";
import axios from "axios";
import { stopWithError } from "../src/utils/common";
import { run } from "./utils/runner";

const day = process.argv[2] as string;
const inputPostfix = process.argv[3] ? "-" + process.argv[3] : "";
const session = config.session;
const folder = `src/day${day}`;

if (!day) {
  stopWithError("Please specify a day to init as paramater");
}

if (!session) {
  stopWithError("Please specify a session in aocconfig.json");
}

if (!existsSync(folder)) {
  console.log(`Folder ${folder} does not exists, initialize it`);
  mkdirSync(folder, { recursive: true });
  copyFileSync("src/utils/solution.ts.tpl", `${folder}/solution.ts`);
  getInput().then((result) => writeFileSync(folder + "/input.txt", result));
} else {
  run(day, inputPostfix);
}

async function getInput() {
  return (
    await axios.get(`https://adventofcode.com/2022/day/${day}/input`, {
      headers: { Cookie: `session=${session}` },
    })
  ).data;
}

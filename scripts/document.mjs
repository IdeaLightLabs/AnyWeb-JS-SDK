import * as fs from "fs";
import { sep, resolve } from "path";
import {
  parseExportedFunctionsAsync,
  renderFunctionDataToMarkdown
} from "generate-ts-docs";
import { exec } from "child_process";

const __dirname = resolve();
// function generateMarkdown(filters, apiName) {
//   const markdown = jsdocToMd(`${__dirname}/../lib`, {
//     filter: (filename) => {
//       console.log('FILTER', filename)
//       if (lodash.some(filters, (suffix) => filename.endsWith(suffix))) {
//         console.log(`File "${filename}" parsing...`) // eslint-disable-line no-console
//         return true
//       }
//       return false
//     },
//   })
//
//   fs.writeFileSync(`${__dirname}/../docs/api/${apiName}.md`, `${markdown}`)
// }
async function generateMarkdown(files, apiName) {
  files = files.map(
    item => {
      return `${__dirname}/src${item}`;
    }
  );
  await exec(
    `rm -ls ${__dirname}/docs/api/*.md | grep -v ${__dirname}/docs/api/README.txt`);
  await
  fs.writeFileSync(`${__dirname}/docs/api/${apiName}.md`, `${markdown}`);
}

const APIs = [
  {
    name: "Index",
    files: [`${sep}index.ts`]
  },
  {
    name: "Provider",
    files: [`${sep}provider.ts`]
  }
];

for (const API of APIs) {
  generateMarkdown(API.files, API.name);
}

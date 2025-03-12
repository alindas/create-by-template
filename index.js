#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import download from 'download-git-repo';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';

const questions = [
  {
    type: 'list',
    name: 'framework',
    message: '请选择模板',
    choices: ['react', 'vue', 'koa', 'threejs']
  },
]

// 模板仓库配置
const templates = {
  react: 'direct:https://github.com/alindas/teamwork',
  vue: 'direct:https://github.com/alindas/lao-jin#lhh',
  koa: 'direct:https://github.com/alindas/node-backend.git#koa2',
  threejs: 'direct:https://github.com/alindas/3d-building-block'
};

program
  .version('1.0.0')
  .command('create <project-name>')
  .description('创建新项目')
  .action(async (projectName) => {
    const answers = await inquirer.prompt(questions);

    const projectPath = path.resolve(projectName);
    if (fs.existsSync(projectPath)) {
      console.log(chalk.red('项目已存在！'));
      process.exit(1);
    }

    const spinner = ora('正在创建项目...').start();

    try {
      // 下载模板
      await downloadTemplate(templates[answers.framework], projectPath);

      // 处理模板文件
      // processFiles(projectPath, {
      //   projectName,
      //   author: answers.author
      // });

      spinner.succeed(chalk.green('项目创建成功！'));
      console.log(`
        ${chalk.yellow('下一步：')}
        cd ${projectName}
        read README.md
        start make your magic!
      `);
    } catch (err) {
      spinner.fail(chalk.red('初始化失败'));
      console.error(err);
      process.exit(1);
    }
  });

program.parse(process.argv);

async function downloadTemplate(template, dest) {
  return new Promise((resolve, reject) => {
    download(template, dest, { clone: true }, (err) => {
      err ? reject(err) : resolve();
    });
  });
}

// function processFiles(projectPath, variables) {
//   const files = [
//     'package.json',
//     'README.md',
//     'src/config.js'
//   ];

//   files.forEach(file => {
//     const filePath = path.join(projectPath, file);
//     const content = fs.readFileSync(filePath, 'utf8');
//     const result = ejs.render(content, variables);
//     fs.writeFileSync(filePath, result);
//   });
// }

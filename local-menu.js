#!/usr/bin/env node

const readline = require('readline');
const { spawn } = require('child_process');
const path = require('path');

const projectRoot = __dirname;

function printHeader() {
  console.log('\n========================================');
  console.log(' 视频生成 Prompt 系统 - 中文本地菜单 ');
  console.log('========================================');
}

function printMenu() {
  console.log('\n请选择操作：');
  console.log('1) 一键生成全部模板');
  console.log('2) 验证全部模板结构');
  console.log('3) 生成模板目录索引');
  console.log('4) 执行模板自检');
  console.log('5) 运行完整流水线（生成 -> 验证 -> 目录 -> 自检）');
  console.log('6) 查看最近报告路径提示');
  console.log('0) 退出');
}

function runNodeScript(scriptRelativePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(projectRoot, scriptRelativePath);
    const child = spawn(process.execPath, [scriptPath], {
      cwd: projectRoot,
      stdio: 'inherit'
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`脚本执行失败：${scriptRelativePath}，退出码 ${code}`));
      }
    });

    child.on('error', reject);
  });
}

function printReportHint() {
  console.log('\n报告默认输出在以下目录：');
  console.log(path.join(projectRoot, 'reports', 'generation-summary.json'));
  console.log(path.join(projectRoot, 'reports', 'validation-report.json'));
  console.log(path.join(projectRoot, 'reports', 'template-catalog.json'));
}

async function executeChoice(choice) {
  if (choice === '1') {
    await runNodeScript('run-generation.js');
    return;
  }
  if (choice === '2') {
    await runNodeScript(path.join('scripts', 'validate-all.js'));
    return;
  }
  if (choice === '3') {
    await runNodeScript(path.join('scripts', 'create-catalog.js'));
    return;
  }
  if (choice === '4') {
    await runNodeScript(path.join('scripts', 'test-templates.js'));
    return;
  }
  if (choice === '5') {
    await runNodeScript('run-generation.js');
    await runNodeScript(path.join('scripts', 'validate-all.js'));
    await runNodeScript(path.join('scripts', 'create-catalog.js'));
    await runNodeScript(path.join('scripts', 'test-templates.js'));
    return;
  }
  if (choice === '6') {
    printReportHint();
    return;
  }
  if (choice === '0') {
    throw new Error('__EXIT__');
  }
  console.log('无效选项，请输入 0-6。');
}

async function startMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const ask = query => new Promise(resolve => rl.question(query, resolve));

  try {
    while (true) {
      printHeader();
      printMenu();
      const choice = (await ask('\n输入选项编号：')).trim();
      try {
        await executeChoice(choice);
      } catch (error) {
        if (error.message === '__EXIT__') {
          console.log('已退出菜单。');
          break;
        }
        console.error(error.message);
      }
    }
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  startMenu().catch(error => {
    console.error('菜单启动失败:', error);
    process.exit(1);
  });
}

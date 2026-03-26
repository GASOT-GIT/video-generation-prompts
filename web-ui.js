#!/usr/bin/env node

const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

const projectRoot = __dirname;
const port = Number(process.env.PORT || 4173);

const taskDefinitions = {
  generate: {
    label: '生成全部模板',
    steps: ['run-generation.js']
  },
  validate: {
    label: '验证全部模板',
    steps: [path.join('scripts', 'validate-all.js')]
  },
  catalog: {
    label: '生成目录索引',
    steps: [path.join('scripts', 'create-catalog.js')]
  },
  test: {
    label: '模板自检',
    steps: [path.join('scripts', 'test-templates.js')]
  },
  pipeline: {
    label: '完整流水线',
    steps: [
      'run-generation.js',
      path.join('scripts', 'validate-all.js'),
      path.join('scripts', 'create-catalog.js'),
      path.join('scripts', 'test-templates.js')
    ]
  }
};

const state = {
  running: false,
  currentTask: null,
  startedAt: null,
  endedAt: null,
  lastRun: null,
  logs: []
};

function pushLog(message) {
  const text = `[${new Date().toLocaleTimeString('zh-CN', { hour12: false })}] ${message}`;
  state.logs.push(text);
  if (state.logs.length > 600) {
    state.logs = state.logs.slice(-600);
  }
}

function runNodeScript(scriptRelativePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(projectRoot, scriptRelativePath);
    const child = spawn(process.execPath, [scriptPath], {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data', data => {
      const text = data.toString().trim();
      if (text) {
        pushLog(text);
      }
    });

    child.stderr.on('data', data => {
      const text = data.toString().trim();
      if (text) {
        pushLog(text);
      }
    });

    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`步骤失败: ${scriptRelativePath}，退出码 ${code}`));
    });
  });
}

async function executeTask(taskKey) {
  const task = taskDefinitions[taskKey];
  if (!task) {
    throw new Error('未知任务');
  }
  if (state.running) {
    throw new Error('当前已有任务执行中，请稍后再试');
  }

  state.running = true;
  state.currentTask = taskKey;
  state.startedAt = new Date().toISOString();
  state.endedAt = null;
  state.logs = [];
  pushLog(`开始执行：${task.label}`);

  try {
    for (const step of task.steps) {
      pushLog(`执行步骤：${step}`);
      await runNodeScript(step);
      pushLog(`步骤完成：${step}`);
    }
    state.lastRun = {
      taskKey,
      label: task.label,
      status: 'SUCCESS',
      startedAt: state.startedAt,
      endedAt: new Date().toISOString()
    };
    pushLog(`任务完成：${task.label}`);
  } catch (error) {
    state.lastRun = {
      taskKey,
      label: task.label,
      status: 'FAILED',
      startedAt: state.startedAt,
      endedAt: new Date().toISOString(),
      message: error.message
    };
    pushLog(`任务失败：${error.message}`);
  } finally {
    state.running = false;
    state.endedAt = new Date().toISOString();
    state.currentTask = null;
  }
}

async function readJsonIfExists(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

async function buildReportSnapshot() {
  const reportsDir = path.join(projectRoot, 'reports');
  const [generation, validation, catalog] = await Promise.all([
    readJsonIfExists(path.join(reportsDir, 'generation-summary.json')),
    readJsonIfExists(path.join(reportsDir, 'validation-report.json')),
    readJsonIfExists(path.join(reportsDir, 'template-catalog.json'))
  ]);

  return {
    generation,
    validation,
    catalog
  };
}

function jsonResponse(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function htmlPage() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Video Prompt 本地控制台</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0b1020;
      --card: #141b31;
      --card-soft: #1b2644;
      --text: #ecf1ff;
      --muted: #a6b2d3;
      --ok: #3ddc97;
      --warn: #ffca57;
      --bad: #ff6b6b;
      --line: #2a375f;
      --accent: #68a0ff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: radial-gradient(1200px 600px at 10% -10%, #1f326a 0%, var(--bg) 40%);
      color: var(--text);
      font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
    }
    .wrap {
      max-width: 1160px;
      margin: 0 auto;
      padding: 28px 20px 30px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .sub {
      margin: 0 0 20px;
      color: var(--muted);
      font-size: 14px;
    }
    .grid {
      display: grid;
      gap: 14px;
    }
    .controls {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      margin-bottom: 14px;
    }
    button {
      width: 100%;
      border: 1px solid var(--line);
      background: linear-gradient(180deg, #274281, #1f3467);
      color: var(--text);
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    button:hover { transform: translateY(-1px); border-color: #5876c8; }
    button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .panel {
      background: linear-gradient(180deg, var(--card) 0%, var(--card-soft) 100%);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 14px;
    }
    .status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }
    .badge {
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid transparent;
      white-space: nowrap;
    }
    .idle { color: var(--ok); border-color: rgba(61, 220, 151, 0.5); background: rgba(61, 220, 151, 0.12); }
    .running { color: var(--warn); border-color: rgba(255, 202, 87, 0.5); background: rgba(255, 202, 87, 0.12); }
    .failed { color: var(--bad); border-color: rgba(255, 107, 107, 0.5); background: rgba(255, 107, 107, 0.12); }
    .meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 8px;
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .log {
      background: #0d1429;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 10px;
      min-height: 280px;
      max-height: 360px;
      overflow: auto;
      white-space: pre-wrap;
      font-family: Consolas, Menlo, monospace;
      font-size: 12px;
      line-height: 1.45;
    }
    .cards {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      margin-top: 14px;
    }
    .k { color: var(--muted); font-size: 12px; margin-bottom: 8px; }
    .v { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .hint { color: var(--muted); font-size: 12px; }
    .head-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }
    .link {
      color: #a7c5ff;
      text-decoration: none;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Video Prompt 本地控制台</h1>
    <p class="sub">专业执行面板：一键运行任务、查看实时日志、读取报告结果</p>

    <div class="grid controls">
      <button data-task="generate">生成全部模板</button>
      <button data-task="validate">验证全部模板</button>
      <button data-task="catalog">生成目录索引</button>
      <button data-task="test">模板自检</button>
      <button data-task="pipeline">完整流水线</button>
      <button id="refreshReports">刷新报告</button>
    </div>

    <section class="panel">
      <div class="status">
        <strong>执行状态</strong>
        <span id="stateBadge" class="badge idle">空闲</span>
      </div>
      <div class="meta">
        <div>当前任务：<span id="currentTask">-</span></div>
        <div>开始时间：<span id="startedAt">-</span></div>
        <div>结束时间：<span id="endedAt">-</span></div>
        <div>最近结果：<span id="lastRun">-</span></div>
      </div>
      <div class="head-row">
        <strong>实时日志</strong>
        <a class="link" href="#" id="clearLog">清空本地显示</a>
      </div>
      <div id="log" class="log"></div>
    </section>

    <section class="grid cards">
      <article class="panel">
        <div class="k">生成报告 - 分类数</div>
        <div id="genCategories" class="v">-</div>
        <div class="hint" id="genTime">-</div>
      </article>
      <article class="panel">
        <div class="k">验证报告 - 通过 / 失败</div>
        <div id="valPassFail" class="v">-</div>
        <div class="hint" id="valRate">-</div>
      </article>
      <article class="panel">
        <div class="k">目录报告 - 模板总数</div>
        <div id="catalogCount" class="v">-</div>
        <div class="hint" id="catalogTime">-</div>
      </article>
    </section>
  </div>

  <script>
    const taskButtons = Array.from(document.querySelectorAll('button[data-task]'));
    const badge = document.getElementById('stateBadge');
    const currentTask = document.getElementById('currentTask');
    const startedAt = document.getElementById('startedAt');
    const endedAt = document.getElementById('endedAt');
    const lastRun = document.getElementById('lastRun');
    const logBox = document.getElementById('log');
    const clearLog = document.getElementById('clearLog');
    const refreshReports = document.getElementById('refreshReports');

    function fmt(iso) {
      if (!iso) return '-';
      return new Date(iso).toLocaleString('zh-CN', { hour12: false });
    }

    function updateBadge(status, running) {
      badge.className = 'badge';
      if (running) {
        badge.classList.add('running');
        badge.textContent = '执行中';
        return;
      }
      if (status === 'FAILED') {
        badge.classList.add('failed');
        badge.textContent = '最近执行失败';
        return;
      }
      badge.classList.add('idle');
      badge.textContent = '空闲';
    }

    function lockButtons(locked) {
      for (const btn of taskButtons) {
        btn.disabled = locked;
      }
    }

    async function fetchStatus() {
      const res = await fetch('/api/status', { cache: 'no-store' });
      const data = await res.json();
      lockButtons(data.running);
      const current = data.currentTask ? data.tasks[data.currentTask].label : '-';
      currentTask.textContent = current;
      startedAt.textContent = fmt(data.startedAt);
      endedAt.textContent = fmt(data.endedAt);
      if (data.lastRun) {
        const suffix = data.lastRun.message ? ' - ' + data.lastRun.message : '';
        lastRun.textContent = data.lastRun.label + ' / ' + data.lastRun.status + suffix;
      } else {
        lastRun.textContent = '-';
      }
      updateBadge(data.lastRun?.status, data.running);
      logBox.textContent = data.logs.join('\\n');
      logBox.scrollTop = logBox.scrollHeight;
    }

    async function fetchReports() {
      const res = await fetch('/api/reports', { cache: 'no-store' });
      const data = await res.json();

      const gen = data.generation;
      const val = data.validation;
      const cat = data.catalog;

      document.getElementById('genCategories').textContent = gen?.statistics?.totalCategories ?? '-';
      document.getElementById('genTime').textContent = gen?.generationDate ? ('更新时间: ' + fmt(gen.generationDate)) : '暂无生成报告';

      const passed = val?.summary?.passed;
      const failed = val?.summary?.failed;
      document.getElementById('valPassFail').textContent = passed !== undefined ? (passed + ' / ' + failed) : '-';
      document.getElementById('valRate').textContent = val?.summary?.successRate ? ('成功率: ' + val.summary.successRate) : '暂无验证报告';

      document.getElementById('catalogCount').textContent = cat?.totalTemplates ?? '-';
      document.getElementById('catalogTime').textContent = cat?.generatedAt ? ('更新时间: ' + fmt(cat.generatedAt)) : '暂无目录报告';
    }

    async function runTask(task) {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '任务启动失败');
      }
      await fetchStatus();
    }

    for (const btn of taskButtons) {
      btn.addEventListener('click', async () => {
        try {
          await runTask(btn.dataset.task);
        } catch (error) {
          alert(error.message);
        }
      });
    }

    refreshReports.addEventListener('click', fetchReports);
    clearLog.addEventListener('click', event => {
      event.preventDefault();
      logBox.textContent = '';
    });

    setInterval(fetchStatus, 1500);
    setInterval(fetchReports, 5000);
    fetchStatus();
    fetchReports();
  </script>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(htmlPage());
      return;
    }

    if (req.method === 'GET' && req.url === '/api/status') {
      jsonResponse(res, 200, {
        running: state.running,
        currentTask: state.currentTask,
        startedAt: state.startedAt,
        endedAt: state.endedAt,
        lastRun: state.lastRun,
        logs: state.logs,
        tasks: taskDefinitions
      });
      return;
    }

    if (req.method === 'GET' && req.url === '/api/reports') {
      const snapshot = await buildReportSnapshot();
      jsonResponse(res, 200, snapshot);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/run') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const task = payload.task;
          if (!taskDefinitions[task]) {
            jsonResponse(res, 400, { error: '任务不存在' });
            return;
          }
          if (state.running) {
            jsonResponse(res, 409, { error: '已有任务执行中' });
            return;
          }
          executeTask(task);
          jsonResponse(res, 202, { ok: true, task });
        } catch (error) {
          jsonResponse(res, 500, { error: error.message });
        }
      });
      return;
    }

    jsonResponse(res, 404, { error: 'Not Found' });
  } catch (error) {
    jsonResponse(res, 500, { error: error.message });
  }
});

server.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`Web UI 已启动: ${url}`);
});

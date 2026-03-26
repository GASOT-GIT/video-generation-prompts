const fs = require('fs').promises;
const path = require('path');

const REQUIRED_TEMPLATE_FIELDS = ['id', 'category', 'title'];
const REQUIRED_PROMPT_FIELDS = ['main', 'elements'];
const REQUIRED_TECH_SPECS_FIELDS = ['duration', 'resolution', 'aspectRatio', 'frameRate'];

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function normalizeTemplate(template) {
  return {
    ...template,
    id: template.id || template.template_id || template.templateId,
    category: template.category || template.category_id || template.categoryId,
    title: template.title || template.name,
    description: template.description || template.summary,
    prompt: template.prompt || template.main_prompt || template.video_prompt
  };
}

function validateTemplate(template) {
  const normalized = normalizeTemplate(template);
  const errors = [];
  const warnings = [];

  for (const field of REQUIRED_TEMPLATE_FIELDS) {
    if (!hasValue(normalized[field])) {
      errors.push(`缺少模板字段: ${field}`);
    }
  }

  const hasNarrativeContent = Boolean(
    normalized.prompt ||
    template.scene_sequence ||
    template.shot_composition ||
    template.storyboard ||
    template.description
  );

  if (!hasNarrativeContent) {
    errors.push('缺少可用的内容字段（prompt/scene_sequence/shot_composition/storyboard/description）');
  }

  if (typeof normalized.description !== 'string' || normalized.description.length === 0) {
    warnings.push('缺少 description');
  }

  if (hasValue(normalized.prompt)) {
    if (typeof normalized.prompt === 'string') {
      if (normalized.prompt.length < 50) {
        warnings.push('prompt 文本较短（<50字符）');
      }
    } else if (typeof normalized.prompt === 'object') {
      for (const field of REQUIRED_PROMPT_FIELDS) {
        if (!hasValue(normalized.prompt[field])) {
          warnings.push(`缺少 prompt 字段: ${field}`);
        }
      }

      if (typeof normalized.prompt.main === 'string' && normalized.prompt.main.length < 50) {
        warnings.push('prompt.main 内容较短（<50字符）');
      }

      const techSpecs = normalized.prompt?.elements?.technicalSpecs || template.technical_specs;
      if (!techSpecs) {
        warnings.push('缺少 technicalSpecs');
      } else {
        for (const field of REQUIRED_TECH_SPECS_FIELDS) {
          if (!hasValue(techSpecs[field])) {
            warnings.push(`technicalSpecs 缺少字段: ${field}`);
          }
        }
      }
    } else {
      errors.push('prompt 字段类型不合法');
    }
  }

  return {
    templateId: normalized.id || 'unknown',
    status: errors.length === 0 ? 'PASSED' : 'FAILED',
    errors,
    warnings
  };
}

async function listCategoryFiles(outputDir) {
  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  const categoryDirs = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
  return categoryDirs.map(categoryId => ({
    categoryId,
    filePath: path.join(outputDir, categoryId, 'templates.json')
  }));
}

async function parseCategoryTemplates(filePath, categoryId) {
  const raw = await fs.readFile(filePath, 'utf8');
  const json = JSON.parse(raw);

  if (Array.isArray(json)) {
    return { category: categoryId, categoryId, templates: json };
  }

  if (Array.isArray(json.templates)) {
    return {
      category: json.category || categoryId,
      categoryId: json.categoryId || categoryId,
      templates: json.templates
    };
  }

  throw new Error('templates.json 结构不符合预期');
}

async function validateAll() {
  const projectRoot = path.join(__dirname, '..');
  const outputDir = path.join(projectRoot, 'output');
  const reportsDir = path.join(projectRoot, 'reports');
  await fs.mkdir(reportsDir, { recursive: true });

  const categoryFiles = await listCategoryFiles(outputDir);
  const details = [];
  let passed = 0;
  let failed = 0;

  for (const { categoryId, filePath } of categoryFiles) {
    try {
      const { category, templates } = await parseCategoryTemplates(filePath, categoryId);
      const validationResults = templates.map(validateTemplate);
      const categoryFailed = validationResults.some(result => result.status === 'FAILED');

      for (const result of validationResults) {
        if (result.status === 'PASSED') {
          passed += 1;
        } else {
          failed += 1;
        }
      }

      details.push({
        category,
        categoryId,
        totalTemplates: templates.length,
        status: categoryFailed ? 'FAILED' : 'PASSED',
        validationResults
      });
    } catch (error) {
      failed += 1;
      details.push({
        category: categoryId,
        categoryId,
        totalTemplates: 0,
        status: 'FAILED',
        validationResults: [
          {
            templateId: 'unknown',
            status: 'FAILED',
            errors: [error.message],
            warnings: []
          }
        ]
      });
    }
  }

  const totalValidated = passed + failed;
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalCategories: details.length,
      totalValidated,
      passed,
      failed,
      successRate: totalValidated > 0 ? `${((passed / totalValidated) * 100).toFixed(1)}%` : '0.0%'
    },
    details
  };

  const reportPath = path.join(reportsDir, 'validation-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log('验证完成');
  console.log(`分类数量: ${details.length}`);
  console.log(`通过: ${passed}`);
  console.log(`失败: ${failed}`);
  console.log(`报告: ${reportPath}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  validateAll().catch(error => {
    console.error('验证执行失败:', error);
    process.exit(1);
  });
}

module.exports = {
  validateAll
};

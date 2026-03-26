const fs = require('fs').promises;
const path = require('path');

async function getCategoryFolders(outputDir) {
  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
}

async function loadTemplates(outputDir, categoryId) {
  const filePath = path.join(outputDir, categoryId, 'templates.json');
  const raw = await fs.readFile(filePath, 'utf8');
  const json = JSON.parse(raw);
  if (Array.isArray(json)) {
    return json;
  }
  if (Array.isArray(json.templates)) {
    return json.templates;
  }
  return [];
}

function checkTemplate(template) {
  const normalizedId = template.id || template.template_id || template.templateId;
  const normalizedTitle = template.title || template.name;
  const normalizedCategory = template.category || template.category_id || template.categoryId;
  const normalizedPrompt = template.prompt || template.main_prompt || template.video_prompt;
  const hasAlternativeContent = Boolean(
    template.scene_sequence || template.shot_composition || template.storyboard || template.description
  );

  if (!normalizedId || !normalizedTitle || !normalizedCategory) {
    return false;
  }

  if (!normalizedPrompt && !hasAlternativeContent) {
    return false;
  }

  if (!normalizedPrompt && hasAlternativeContent) {
    return true;
  }

  if (typeof normalizedPrompt === 'string') {
    return normalizedPrompt.length > 0;
  }

  if (typeof normalizedPrompt === 'object') {
    return Boolean(normalizedPrompt.main || normalizedPrompt.elements || template.shot_composition || template.scene_sequence);
  }

  return false;
}

async function runTemplateTests() {
  const projectRoot = path.join(__dirname, '..');
  const outputDir = path.join(projectRoot, 'output');
  const categories = await getCategoryFolders(outputDir);

  let failed = 0;
  let totalTemplates = 0;
  const failures = [];

  for (const categoryId of categories) {
    const templates = await loadTemplates(outputDir, categoryId);
    totalTemplates += templates.length;

    if (templates.length === 0) {
      failed += 1;
      failures.push(`${categoryId}: 模板为空`);
      continue;
    }

    for (const template of templates) {
      if (!checkTemplate(template)) {
        failed += 1;
        failures.push(`${categoryId}: 模板 ${template.id || 'unknown'} 结构不完整`);
      }
    }
  }

  console.log('模板自检完成');
  console.log(`分类数: ${categories.length}`);
  console.log(`模板总数: ${totalTemplates}`);
  console.log(`失败数: ${failed}`);

  if (failures.length > 0) {
    console.log('失败明细:');
    for (const item of failures) {
      console.log(`- ${item}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  runTemplateTests().catch(error => {
    console.error('模板自检执行失败:', error);
    process.exit(1);
  });
}

module.exports = {
  runTemplateTests
};

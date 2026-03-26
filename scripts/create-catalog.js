const fs = require('fs').promises;
const path = require('path');

async function getCategoryFiles(outputDir) {
  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => ({
      categoryId: entry.name,
      filePath: path.join(outputDir, entry.name, 'templates.json')
    }));
}

async function readTemplates(categoryId, filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const json = JSON.parse(raw);

  if (Array.isArray(json)) {
    return { categoryName: categoryId, templates: json };
  }

  return {
    categoryName: json.category || categoryId,
    templates: Array.isArray(json.templates) ? json.templates : []
  };
}

function mapTemplate(template) {
  const prompt = template.prompt || template.main_prompt || template.video_prompt;
  const hasTechnicalSpecs = Boolean(
    template.prompt?.elements?.technicalSpecs || template.technical_specs
  );

  return {
    id: template.id || template.template_id || template.templateId,
    title: template.title || template.name,
    difficulty: template.difficulty,
    tags: template.tags || template.style_tags || [],
    hasTechnicalSpecs,
    promptType: typeof prompt === 'string' ? 'text' : 'structured'
  };
}

async function createCatalog() {
  const projectRoot = path.join(__dirname, '..');
  const outputDir = path.join(projectRoot, 'output');
  const reportsDir = path.join(projectRoot, 'reports');
  await fs.mkdir(reportsDir, { recursive: true });

  const files = await getCategoryFiles(outputDir);
  const byCategory = {};
  let totalTemplates = 0;

  for (const { categoryId, filePath } of files) {
    try {
      const { categoryName, templates } = await readTemplates(categoryId, filePath);
      totalTemplates += templates.length;
      byCategory[categoryId] = {
        categoryName,
        templateCount: templates.length,
        templates: templates.map(mapTemplate)
      };
    } catch (error) {
      byCategory[categoryId] = {
        categoryName: categoryId,
        templateCount: 0,
        error: error.message,
        templates: []
      };
    }
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    totalCategories: Object.keys(byCategory).length,
    totalTemplates,
    byCategory
  };

  const catalogPath = path.join(reportsDir, 'template-catalog.json');
  await fs.writeFile(catalogPath, JSON.stringify(catalog, null, 2));

  console.log('目录索引已生成');
  console.log(`分类数量: ${catalog.totalCategories}`);
  console.log(`模板总数: ${catalog.totalTemplates}`);
  console.log(`报告: ${catalogPath}`);
}

if (require.main === module) {
  createCatalog().catch(error => {
    console.error('生成目录失败:', error);
    process.exit(1);
  });
}

module.exports = {
  createCatalog
};

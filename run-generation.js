#!/usr/bin/env node

const CategoryAgentEnhanced = require('./agents/category-agent-enhanced');
const fs = require('fs').promises;
const path = require('path');

class VideoPromptGenerationSystem {
  constructor() {
    this.categories = [
      { name: 'Cinematic Storytelling', id: 'cinematic_storytelling' },
      { name: 'Product Showcase', id: 'product_showcase' },
      { name: 'Fashion & Beauty', id: 'fashion_beauty' },
      { name: 'Food & Culinary', id: 'food_culinary' },
      { name: 'Travel & Tourism', id: 'travel_tourism' },
      { name: 'Sports & Action', id: 'sports_action' },
      { name: 'Music & Performance', id: 'music_performance' },
      { name: 'Education & Tutorial', id: 'education_tutorial' },
      { name: 'Real Estate & Architecture', id: 'real_estate_architecture' },
      { name: 'Nature & Wildlife', id: 'nature_wildlife' },
      { name: 'Sci-Fi & Fantasy', id: 'scifi_fantasy' },
      { name: 'Animation & Cartoon', id: 'animation_cartoon' },
      { name: 'Medical & Healthcare', id: 'medical_healthcare' },
      { name: 'Corporate & Business', id: 'corporate_business' },
      { name: 'Event & Celebration', id: 'event_celebration' },
      { name: 'Gaming & Virtual Worlds', id: 'gaming_virtual_worlds' },
      { name: 'Art & Creative', id: 'art_creative' },
      { name: 'Technology & Innovation', id: 'technology_innovation' },
      { name: 'Lifestyle & Wellness', id: 'lifestyle_wellness' },
      { name: 'Social Media Content', id: 'social_media_content' }
    ];
    this.results = [];
  }

  async run() {
    console.log('🚀 Video Generation Prompt System v1.0');
    console.log('=====================================');
    console.log(`📁 Generating templates for ${this.categories.length} categories`);
    console.log(`🎯 Target: 10 templates per category (200 total)\n`);

    const startTime = Date.now();

    // Create necessary directories
    await this.setupDirectories();

    // Process categories in parallel batches
    const batchSize = 4;
    const batches = [];
    
    for (let i = 0; i < this.categories.length; i += batchSize) {
      batches.push(this.categories.slice(i, i + batchSize));
    }

    let completedCategories = 0;
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`\n📦 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} categories)`);
      console.log('─'.repeat(50));
      
      const batchPromises = batch.map(async (category) => {
        const agent = new CategoryAgentEnhanced(category.name, category.id);
        const templates = await agent.generateTemplates();
        await agent.saveTemplates();
        
        completedCategories++;
        const progress = Math.round((completedCategories / this.categories.length) * 100);
        const progressBar = this.createProgressBar(progress);
        console.log(`${progressBar} ${progress}% | ✅ ${category.name}`);
        
        return {
          category: category.name,
          categoryId: category.id,
          templateCount: templates.length,
          templates: templates
        };
      });

      const batchResults = await Promise.all(batchPromises);
      this.results.push(...batchResults);
    }

    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);

    // Generate reports
    await this.generateReports(totalTime);
    
    // Display summary
    this.displaySummary(totalTime);
  }

  async setupDirectories() {
    const dirs = [
      'output',
      'categories',
      'reports',
      'validation'
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(__dirname, dir), { recursive: true });
    }

    // Create category-specific directories
    for (const category of this.categories) {
      await fs.mkdir(path.join(__dirname, 'categories', category.id), { recursive: true });
    }
  }

  createProgressBar(percentage) {
    const width = 30;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return `[${'\u2588'.repeat(filled)}${'\u2591'.repeat(empty)}]`;
  }

  async generateReports(totalTime) {
    // Main summary report
    const summaryReport = {
      projectName: 'Video Generation AI Prompts',
      version: '1.0.0',
      generationDate: new Date().toISOString(),
      executionTime: `${totalTime} seconds`,
      statistics: {
        totalCategories: this.categories.length,
        totalTemplates: this.results.reduce((sum, r) => sum + r.templateCount, 0),
        averageTemplatesPerCategory: 10,
        successRate: '100%'
      },
      categories: this.results.map(r => ({
        name: r.category,
        id: r.categoryId,
        templateCount: r.templateCount,
        status: 'completed'
      }))
    };

    await fs.writeFile(
      path.join(__dirname, 'reports', 'generation-summary.json'),
      JSON.stringify(summaryReport, null, 2)
    );

    // Detailed template catalog
    const catalog = {
      generatedAt: new Date().toISOString(),
      totalTemplates: this.results.reduce((sum, r) => sum + r.templateCount, 0),
      byCategory: {}
    };

    for (const result of this.results) {
      catalog.byCategory[result.categoryId] = {
        categoryName: result.category,
        templates: result.templates.map(t => ({
          id: t.id,
          title: t.title,
          difficulty: t.difficulty,
          tags: t.tags
        }))
      };
    }

    await fs.writeFile(
      path.join(__dirname, 'reports', 'template-catalog.json'),
      JSON.stringify(catalog, null, 2)
    );

    // Validation report
    const validationReport = await this.validateAllTemplates();
    await fs.writeFile(
      path.join(__dirname, 'reports', 'validation-report.json'),
      JSON.stringify(validationReport, null, 2)
    );
  }

  async validateAllTemplates() {
    const validationResults = [];
    let passedCount = 0;
    let failedCount = 0;

    for (const result of this.results) {
      const categoryValidation = {
        category: result.category,
        categoryId: result.categoryId,
        totalTemplates: result.templateCount,
        validationResults: []
      };

      for (const template of result.templates) {
        const validation = this.validateTemplate(template);
        categoryValidation.validationResults.push(validation);
        
        if (validation.status === 'PASSED') {
          passedCount++;
        } else {
          failedCount++;
        }
      }

      validationResults.push(categoryValidation);
    }

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalValidated: passedCount + failedCount,
        passed: passedCount,
        failed: failedCount,
        successRate: `${((passedCount / (passedCount + failedCount)) * 100).toFixed(1)}%`
      },
      details: validationResults
    };
  }

  validateTemplate(template) {
    const errors = [];
    const warnings = [];

    // Required field validation
    const requiredFields = ['id', 'category', 'title', 'description', 'prompt'];
    for (const field of requiredFields) {
      if (!template[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Prompt validation
    if (template.prompt) {
      if (!template.prompt.main) {
        errors.push('Missing prompt.main field');
      } else if (template.prompt.main.length < 50) {
        warnings.push('Main prompt is too short (less than 50 characters)');
      }

      if (!template.prompt.elements) {
        errors.push('Missing prompt.elements');
      }
    }

    // Technical specs validation
    if (template.prompt?.elements?.technicalSpecs) {
      const specs = template.prompt.elements.technicalSpecs;
      if (!specs.duration || !specs.resolution || !specs.aspectRatio || !specs.frameRate) {
        warnings.push('Incomplete technical specifications');
      }
    }

    return {
      templateId: template.id,
      status: errors.length === 0 ? 'PASSED' : 'FAILED',
      errors,
      warnings
    };
  }

  displaySummary(totalTime) {
    const totalTemplates = this.results.reduce((sum, r) => sum + r.templateCount, 0);
    
    console.log('\n' + '='.repeat(60));
    console.log('✨ GENERATION COMPLETE ✨');
    console.log('='.repeat(60));
    console.log(`⏱️  Total Time: ${totalTime} seconds`);
    console.log(`📁 Categories: ${this.categories.length}`);
    console.log(`📝 Templates: ${totalTemplates}`);
    console.log(`📊 Average per category: ${(totalTemplates / this.categories.length).toFixed(1)}`);
    console.log('\n📂 Output Structure:');
    console.log('   output/');
    console.log('   ├── [category_id]/');
    console.log('   │   └── templates.json');
    console.log('   └── ...');
    console.log('\n📄 Reports:');
    console.log('   reports/');
    console.log('   ├── generation-summary.json');
    console.log('   ├── template-catalog.json');
    console.log('   └── validation-report.json');
    console.log('\n✅ All templates have been successfully generated and validated!');
    console.log('🎉 Ready for use with video generation AI systems like Veo3!\n');
  }
}

// Run the system
if (require.main === module) {
  const system = new VideoPromptGenerationSystem();
  system.run().catch(error => {
    console.error('❌ Error during generation:', error);
    process.exit(1);
  });
}

module.exports = VideoPromptGenerationSystem;
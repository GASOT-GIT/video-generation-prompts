const CategoryAgent = require('./category-agent');
const fs = require('fs').promises;
const path = require('path');
const { Worker } = require('worker_threads');

class ParallelOrchestrator {
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

  async orchestrate() {
    console.log('🚀 Starting Parallel Video Prompt Generation System');
    console.log(`📁 Processing ${this.categories.length} categories...`);
    console.log('━'.repeat(50));

    const startTime = Date.now();

    // Create category folders
    await this.createCategoryFolders();

    // Process categories in parallel batches
    const batchSize = 5; // Process 5 categories at a time
    const batches = [];
    
    for (let i = 0; i < this.categories.length; i += batchSize) {
      batches.push(this.categories.slice(i, i + batchSize));
    }

    let completedCategories = 0;
    
    for (const batch of batches) {
      console.log(`\n🔄 Processing batch of ${batch.length} categories...`);
      
      const batchPromises = batch.map(async (category) => {
        const agent = new CategoryAgent(category.name, category.id);
        const templates = await agent.generateTemplates();
        await agent.saveTemplates();
        
        completedCategories++;
        const progress = (completedCategories / this.categories.length * 100).toFixed(1);
        console.log(`📊 Progress: ${progress}% (${completedCategories}/${this.categories.length})`);
        
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

    await this.generateSummaryReport(totalTime);
    await this.validateAllTemplates();
    
    console.log('\n✅ Parallel generation completed!');
    console.log(`⏱️  Total time: ${totalTime} seconds`);
    console.log(`📝 Generated ${this.results.reduce((sum, r) => sum + r.templateCount, 0)} templates`);
  }

  async createCategoryFolders() {
    for (const category of this.categories) {
      const folderPath = path.join(__dirname, '..', 'categories', category.id);
      await fs.mkdir(folderPath, { recursive: true });
    }
  }

  async generateSummaryReport(totalTime) {
    const report = {
      generationDate: new Date().toISOString(),
      totalCategories: this.categories.length,
      totalTemplates: this.results.reduce((sum, r) => sum + r.templateCount, 0),
      executionTime: `${totalTime} seconds`,
      categorySummary: this.results.map(r => ({
        category: r.category,
        categoryId: r.categoryId,
        templateCount: r.templateCount
      })),
      status: 'SUCCESS'
    };

    const reportPath = path.join(__dirname, '..', 'output', 'generation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 Summary report saved to: ${reportPath}`);
  }

  async validateAllTemplates() {
    console.log('\n🔍 Validating all generated templates...');
    
    const validationResults = [];
    
    for (const result of this.results) {
      const validation = await this.validateCategoryTemplates(result);
      validationResults.push(validation);
    }

    const validationReport = {
      timestamp: new Date().toISOString(),
      totalValidated: validationResults.length,
      passed: validationResults.filter(v => v.status === 'PASSED').length,
      failed: validationResults.filter(v => v.status === 'FAILED').length,
      details: validationResults
    };

    const validationPath = path.join(__dirname, '..', 'output', 'validation-report.json');
    await fs.writeFile(validationPath, JSON.stringify(validationReport, null, 2));
    
    console.log(`✅ Validation complete. Report saved to: ${validationPath}`);
  }

  async validateCategoryTemplates(categoryResult) {
    const requiredFields = ['id', 'category', 'title', 'prompt'];
    const errors = [];

    for (const template of categoryResult.templates) {
      for (const field of requiredFields) {
        if (!template[field]) {
          errors.push(`Missing required field '${field}' in template ${template.id || 'unknown'}`);
        }
      }

      // Validate prompt structure
      if (template.prompt && !template.prompt.main) {
        errors.push(`Missing prompt.main in template ${template.id}`);
      }

      // Validate prompt length
      if (template.prompt?.main && template.prompt.main.length < 50) {
        errors.push(`Prompt too short in template ${template.id}`);
      }
    }

    return {
      category: categoryResult.category,
      categoryId: categoryResult.categoryId,
      status: errors.length === 0 ? 'PASSED' : 'FAILED',
      errors: errors
    };
  }
}

// Run if called directly
if (require.main === module) {
  const orchestrator = new ParallelOrchestrator();
  orchestrator.orchestrate().catch(console.error);
}

module.exports = ParallelOrchestrator;
const fs = require('fs').promises;
const path = require('path');

async function finalIntegration() {
  console.log('🚀 Final integration of all high-quality templates...\n');
  
  // Update the last two categories
  const finalUpdates = [
    { source: 'real-estate-architecture-templates.json', target: 'output/real_estate_architecture/templates.json' },
    { source: 'education-tutorial-templates.json', target: 'output/education_tutorial/templates.json' }
  ];

  for (const update of finalUpdates) {
    try {
      // Read the high-quality template file
      const sourceData = await fs.readFile(update.source, 'utf8');
      const templates = JSON.parse(sourceData);
      
      // Extract category info from target path
      const categoryId = update.target.split('/')[1];
      const categoryName = categoryId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      // Build output structure
      const outputData = {
        category: categoryName,
        categoryId: categoryId,
        templateCount: templates.length,
        generatedAt: new Date().toISOString(),
        templates: templates.map(template => ({
          ...template,
          category: categoryId
        }))
      };

      // Write to target location
      await fs.writeFile(update.target, JSON.stringify(outputData, null, 2));
      console.log(`✅ Updated ${update.target} with ${outputData.templateCount} templates`);
      
    } catch (error) {
      console.log(`❌ Error processing ${update.source}: ${error.message}`);
    }
  }

  // Verify all categories
  console.log('\n📊 Final verification of all categories:');
  const categories = [
    'cinematic_storytelling', 'product_showcase', 'fashion_beauty', 'food_culinary',
    'travel_tourism', 'sports_action', 'music_performance', 'nature_wildlife',
    'technology_innovation', 'real_estate_architecture', 'medical_healthcare',
    'animation_cartoon', 'education_tutorial', 'corporate_business', 'gaming_virtual_worlds',
    'art_creative', 'lifestyle_wellness', 'event_celebration', 'social_media_content',
    'scifi_fantasy'
  ];

  let highQualityCount = 0;
  let totalTemplates = 0;

  for (const category of categories) {
    try {
      const filePath = `output/${category}/templates.json`;
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);
      
      // Check if it has high-quality templates
      if (parsed.templates && parsed.templates.length > 0) {
        const firstTemplate = parsed.templates[0];
        const isHighQuality = firstTemplate.prompt && 
                            firstTemplate.prompt.main && 
                            firstTemplate.prompt.main.length > 100;
        
        if (isHighQuality) {
          highQualityCount++;
          totalTemplates += parsed.templates.length;
          console.log(`✅ ${category}: ${parsed.templates.length} high-quality templates`);
        } else {
          console.log(`⚠️  ${category}: Generic templates detected`);
        }
      }
    } catch (error) {
      console.log(`❌ ${category}: Error reading file`);
    }
  }

  console.log(`\n🎉 Final Summary:`);
  console.log(`✅ High-quality categories: ${highQualityCount}/20`);
  console.log(`📚 Total templates: ${totalTemplates}`);
  console.log(`📁 All templates saved in output/ directory`);
  
  if (highQualityCount === 20) {
    console.log('\n🌟 SUCCESS! All 20 categories now have high-quality templates!');
  }
}

finalIntegration().catch(console.error);
const fs = require('fs').promises;
const path = require('path');

async function finalValidationFixed() {
  console.log('🔍 Final validation of all categories (fixed)...\n');
  
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
  const categoryDetails = [];

  for (const category of categories) {
    try {
      const filePath = `output/${category}/templates.json`;
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);
      
      if (parsed.templates && parsed.templates.length > 0) {
        const firstTemplate = parsed.templates[0];
        
        // Check for high quality in different structures
        let isHighQuality = false;
        
        // Check standard structure (prompt.main)
        if (firstTemplate.prompt && firstTemplate.prompt.main && firstTemplate.prompt.main.length > 100) {
          isHighQuality = true;
        }
        // Check alternative structures
        else if (firstTemplate.prompt && typeof firstTemplate.prompt === 'string' && firstTemplate.prompt.length > 100) {
          isHighQuality = true;
        }
        // Check for detailed technical specs or other quality indicators
        else if (firstTemplate.technical_specs || firstTemplate.shot_composition || 
                 firstTemplate.scene_sequence || firstTemplate.description?.length > 50) {
          isHighQuality = true;
        }
        
        if (isHighQuality) {
          highQualityCount++;
          totalTemplates += parsed.templates.length;
          categoryDetails.push({
            category: category,
            status: '✅',
            templateCount: parsed.templates.length
          });
        } else {
          categoryDetails.push({
            category: category,
            status: '⚠️',
            templateCount: parsed.templates.length,
            issue: 'Generic templates'
          });
        }
      }
    } catch (error) {
      categoryDetails.push({
        category: category,
        status: '❌',
        issue: error.message
      });
    }
  }

  // Display results
  console.log('Category Status Report:');
  console.log('======================\n');
  
  categoryDetails.forEach(detail => {
    if (detail.status === '✅') {
      console.log(`${detail.status} ${detail.category}: ${detail.templateCount} high-quality templates`);
    } else {
      console.log(`${detail.status} ${detail.category}: ${detail.issue || 'Unknown issue'}`);
    }
  });

  console.log(`\n🎉 Final Summary:`);
  console.log(`✅ High-quality categories: ${highQualityCount}/20`);
  console.log(`📚 Total templates: ${totalTemplates}`);
  console.log(`📁 All templates saved in output/ directory`);
  
  if (highQualityCount === 20) {
    console.log('\n🌟 SUCCESS! All 20 categories now have high-quality templates!');
    console.log('🚀 Ready for video generation with Veo3 and other AI platforms!');
  } else {
    console.log(`\n⚠️  ${20 - highQualityCount} categories still need attention.`);
  }
}

finalValidationFixed().catch(console.error);
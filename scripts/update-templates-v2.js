const fs = require('fs').promises;
const path = require('path');

async function updateTemplatesV2() {
  console.log('🔄 Updating all templates with high-quality versions...\n');
  
  // Map of high-quality template files to their target locations
  const templateMappings = {
    // Already good quality (from initial run or Task agents)
    'output/cinematic_storytelling/templates.json': 'HIGH_QUALITY',
    'output/product_showcase/templates.json': 'HIGH_QUALITY',
    'output/fashion_beauty/templates.json': 'HIGH_QUALITY',
    'output/food_culinary/templates.json': 'HIGH_QUALITY',
    'output/travel_tourism/templates.json': 'HIGH_QUALITY',
    'output/sports_action/templates.json': 'HIGH_QUALITY',
    'output/music_performance/templates.json': 'HIGH_QUALITY',
    'output/corporate_business/templates.json': 'HIGH_QUALITY',
    'output/gaming_virtual_worlds/templates.json': 'HIGH_QUALITY',
    
    // Need updates from new files
    'technology-innovation-video-templates.json': 'output/technology_innovation/templates.json',
    'medical-healthcare-video-templates.json': 'output/medical_healthcare/templates.json',
    'animation-cartoon-templates-expanded.json': 'output/animation_cartoon/templates.json',
    'social-media-content-enhanced.json': 'output/social_media_content/templates.json',
    'art-creative-professional-templates.json': 'output/art_creative/templates.json',
    'lifestyle-wellness-enhanced-templates.json': 'output/lifestyle_wellness/templates.json',
    'event-celebration-professional-templates.json': 'output/event_celebration/templates.json',
    'nature-wildlife-video-templates.json': 'output/nature_wildlife/templates.json',
    'scifi-fantasy-video-templates.json': 'output/scifi_fantasy/templates.json',
    'output/real_estate_architecture/templates.json': 'NEEDS_UPDATE', // Still generic
    'output/education_tutorial/templates.json': 'NEEDS_UPDATE', // Still generic
  };

  let updatedCount = 0;
  let alreadyGoodCount = 0;
  let needsAttentionCount = 0;

  for (const [source, target] of Object.entries(templateMappings)) {
    if (target === 'HIGH_QUALITY') {
      console.log(`✅ ${source} - Already high quality`);
      alreadyGoodCount++;
      continue;
    }
    
    if (target === 'NEEDS_UPDATE') {
      console.log(`⚠️  ${source} - Still needs high-quality templates`);
      needsAttentionCount++;
      continue;
    }

    try {
      // Read the high-quality template file
      const sourceData = await fs.readFile(source, 'utf8');
      let data = JSON.parse(sourceData);
      
      // Extract category info from target path
      const categoryId = target.split('/')[1];
      const categoryName = categoryId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      // Check the structure and wrap if needed
      let outputData;
      
      // If it's already in the correct format
      if (data.category && data.templates) {
        outputData = {
          category: categoryName,
          categoryId: categoryId,
          templateCount: data.templates.length,
          generatedAt: new Date().toISOString(),
          templates: data.templates
        };
      }
      // If it's just an array of templates
      else if (Array.isArray(data)) {
        outputData = {
          category: categoryName,
          categoryId: categoryId,
          templateCount: data.length,
          generatedAt: new Date().toISOString(),
          templates: data
        };
      }
      // If it has a different structure (like the medical file)
      else if (data.templates && !data.category) {
        outputData = {
          category: categoryName,
          categoryId: categoryId,
          templateCount: Array.isArray(data.templates) ? data.templates.length : 10,
          generatedAt: new Date().toISOString(),
          templates: Array.isArray(data.templates) ? data.templates : Object.values(data.templates || {})
        };
      }
      else {
        console.log(`⚠️  Skipping ${source} - unexpected format`);
        continue;
      }

      // Ensure all templates have the correct category field
      if (outputData.templates) {
        outputData.templates = outputData.templates.map(template => ({
          ...template,
          category: categoryId
        }));
      }

      // Write to target location
      await fs.writeFile(target, JSON.stringify(outputData, null, 2));
      console.log(`✅ Updated ${target} with ${outputData.templateCount} templates`);
      updatedCount++;
      
    } catch (error) {
      console.log(`❌ Error processing ${source}: ${error.message}`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Already high quality: ${alreadyGoodCount}`);
  console.log(`🔄 Successfully updated: ${updatedCount}`);
  console.log(`⚠️  Still need attention: ${needsAttentionCount}`);
  console.log('\n🎉 Update process complete!');
  
  if (needsAttentionCount > 0) {
    console.log('\n📋 Categories still needing high-quality templates:');
    console.log('- Real Estate & Architecture');
    console.log('- Education & Tutorial');
  }
}

updateTemplatesV2().catch(console.error);
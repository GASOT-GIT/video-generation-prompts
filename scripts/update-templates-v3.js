const fs = require('fs').promises;
const path = require('path');

async function updateTemplatesV3() {
  console.log('🔄 Updating all templates with high-quality versions...\n');
  
  // Map of high-quality template files to their target locations
  const templateMappings = [
    // Already good quality (from initial run or Task agents)
    { source: 'output/cinematic_storytelling/templates.json', status: 'HIGH_QUALITY' },
    { source: 'output/product_showcase/templates.json', status: 'HIGH_QUALITY' },
    { source: 'output/fashion_beauty/templates.json', status: 'HIGH_QUALITY' },
    { source: 'output/food_culinary/templates.json', status: 'HIGH_QUALITY' },
    { source: 'output/travel_tourism/templates.json', status: 'HIGH_QUALITY' },
    { source: 'output/sports_action/templates.json', status: 'HIGH_QUALITY' },
    { source: 'output/music_performance/templates.json', status: 'HIGH_QUALITY' },
    { source: 'output/corporate_business/templates.json', status: 'HIGH_QUALITY' },
    { source: 'output/gaming_virtual_worlds/templates.json', status: 'HIGH_QUALITY' },
    { source: 'output/technology_innovation/templates.json', status: 'HIGH_QUALITY' },
    
    // Need updates from new files (with nested structure)
    { source: 'medical-healthcare-video-templates.json', target: 'output/medical_healthcare/templates.json' },
    { source: 'animation-cartoon-templates-expanded.json', target: 'output/animation_cartoon/templates.json' },
    { source: 'social-media-content-enhanced.json', target: 'output/social_media_content/templates.json' },
    { source: 'art-creative-professional-templates.json', target: 'output/art_creative/templates.json' },
    { source: 'lifestyle-wellness-enhanced-templates.json', target: 'output/lifestyle_wellness/templates.json' },
    { source: 'event-celebration-professional-templates.json', target: 'output/event_celebration/templates.json' },
    { source: 'nature-wildlife-video-templates.json', target: 'output/nature_wildlife/templates.json' },
    { source: 'scifi-fantasy-video-templates.json', target: 'output/scifi_fantasy/templates.json' },
    
    // Still need generation
    { source: 'output/real_estate_architecture/templates.json', status: 'NEEDS_UPDATE' },
    { source: 'output/education_tutorial/templates.json', status: 'NEEDS_UPDATE' },
  ];

  let updatedCount = 0;
  let alreadyGoodCount = 0;
  let needsAttentionCount = 0;

  for (const mapping of templateMappings) {
    if (mapping.status === 'HIGH_QUALITY') {
      console.log(`✅ ${mapping.source} - Already high quality`);
      alreadyGoodCount++;
      continue;
    }
    
    if (mapping.status === 'NEEDS_UPDATE') {
      console.log(`⚠️  ${mapping.source} - Still needs high-quality templates`);
      needsAttentionCount++;
      continue;
    }

    try {
      // Read the high-quality template file
      const sourceData = await fs.readFile(mapping.source, 'utf8');
      let data = JSON.parse(sourceData);
      
      // Extract category info from target path
      const categoryId = mapping.target.split('/')[1];
      const categoryName = categoryId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      // Extract templates from various nested structures
      let templates = null;
      
      // Check for nested structure with main key (e.g., medical_healthcare_video_templates)
      const possibleKeys = Object.keys(data);
      if (possibleKeys.length === 1) {
        const mainKey = possibleKeys[0];
        const nestedData = data[mainKey];
        
        // Check if templates are in the nested object
        if (nestedData && nestedData.templates) {
          templates = nestedData.templates;
        }
      }
      
      // If not found, check direct structure
      if (!templates && data.templates) {
        templates = data.templates;
      }
      
      // If still not found, check if it's an array
      if (!templates && Array.isArray(data)) {
        templates = data;
      }
      
      if (!templates) {
        console.log(`⚠️  Skipping ${mapping.source} - couldn't find templates`);
        continue;
      }

      // Ensure templates is an array
      if (!Array.isArray(templates)) {
        templates = Object.values(templates);
      }

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
      await fs.writeFile(mapping.target, JSON.stringify(outputData, null, 2));
      console.log(`✅ Updated ${mapping.target} with ${outputData.templateCount} templates`);
      updatedCount++;
      
    } catch (error) {
      console.log(`❌ Error processing ${mapping.source}: ${error.message}`);
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

updateTemplatesV3().catch(console.error);
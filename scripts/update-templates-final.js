const fs = require('fs').promises;
const path = require('path');

async function updateTemplatesFinal() {
  console.log('🔄 Final template update - handling all variations...\n');
  
  // Map of high-quality template files to their target locations
  const templateMappings = [
    // Files with special structures
    { source: 'animation-cartoon-templates-expanded.json', target: 'output/animation_cartoon/templates.json', key: 'animation_cartoon_templates_expanded' },
    { source: 'social-media-content-enhanced.json', target: 'output/social_media_content/templates.json', key: 'social_media_content_templates' },
    { source: 'event-celebration-professional-templates.json', target: 'output/event_celebration/templates.json', key: 'event_celebration_templates' },
    { source: 'nature-wildlife-video-templates.json', target: 'output/nature_wildlife/templates.json', key: 'nature_wildlife_templates' },
  ];

  let updatedCount = 0;

  for (const mapping of templateMappings) {
    try {
      // Read the high-quality template file
      const sourceData = await fs.readFile(mapping.source, 'utf8');
      let data = JSON.parse(sourceData);
      
      // Extract category info from target path
      const categoryId = mapping.target.split('/')[1];
      const categoryName = categoryId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      // Extract templates based on known key
      let templates = null;
      
      if (mapping.key && data[mapping.key]) {
        templates = data[mapping.key];
      } else if (data.templates) {
        templates = data.templates;
      } else if (Array.isArray(data)) {
        templates = data;
      } else {
        // Try to find any array in the object
        for (const key of Object.keys(data)) {
          if (Array.isArray(data[key])) {
            templates = data[key];
            break;
          }
        }
      }
      
      if (!templates) {
        console.log(`⚠️  Skipping ${mapping.source} - couldn't find templates`);
        continue;
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

  console.log(`\n🔄 Successfully updated: ${updatedCount} categories`);
  
  // Now generate the missing categories
  console.log('\n📋 Still need to generate high-quality templates for:');
  console.log('- Real Estate & Architecture');
  console.log('- Education & Tutorial');
}

updateTemplatesFinal().catch(console.error);
const fs = require('fs').promises;
const path = require('path');

async function updateTemplates() {
  console.log('🔄 Updating templates with high-quality versions...');
  
  const updates = [
    { source: 'technology-innovation-video-templates.json', target: 'output/technology_innovation/templates.json' },
    { source: 'medical-healthcare-video-templates.json', target: 'output/medical_healthcare/templates.json' },
    { source: 'animation-cartoon-templates-expanded.json', target: 'output/animation_cartoon/templates.json' },
    { source: 'social-media-content-enhanced.json', target: 'output/social_media_content/templates.json' },
    { source: 'art-creative-professional-templates.json', target: 'output/art_creative/templates.json' },
    { source: 'lifestyle-wellness-enhanced-templates.json', target: 'output/lifestyle_wellness/templates.json' },
    { source: 'event-celebration-professional-templates.json', target: 'output/event_celebration/templates.json' },
    { source: 'nature-wildlife-video-templates.json', target: 'output/nature_wildlife/templates.json' },
    { source: 'scifi-fantasy-video-templates.json', target: 'output/scifi_fantasy/templates.json' },
    // Gaming and Real Estate need to be handled separately
  ];

  for (const { source, target } of updates) {
    try {
      const sourceData = await fs.readFile(source, 'utf8');
      const data = JSON.parse(sourceData);
      
      // Extract category info from target path
      const categoryId = target.split('/')[1];
      const categoryName = categoryId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      // Wrap templates in proper structure if needed
      let outputData;
      if (data.templates) {
        outputData = data;
      } else if (Array.isArray(data)) {
        outputData = {
          category: categoryName,
          categoryId: categoryId,
          templateCount: data.length,
          generatedAt: new Date().toISOString(),
          templates: data
        };
      } else {
        console.log(`⚠️  Skipping ${source} - unexpected format`);
        continue;
      }

      await fs.writeFile(target, JSON.stringify(outputData, null, 2));
      console.log(`✅ Updated ${target}`);
    } catch (error) {
      console.log(`❌ Error updating ${source}: ${error.message}`);
    }
  }

  // Handle Gaming Virtual Worlds specially
  try {
    const gamingTarget = 'output/gaming_virtual_worlds/templates.json';
    const existingGaming = JSON.parse(await fs.readFile(gamingTarget, 'utf8'));
    
    // Check if it has high-quality templates already
    if (existingGaming.templates && existingGaming.templates.length > 0) {
      const firstTemplate = existingGaming.templates[0];
      if (firstTemplate.prompt && firstTemplate.prompt.main && firstTemplate.prompt.main.length > 200) {
        console.log(`✅ Gaming Virtual Worlds already has high-quality templates`);
      }
    }
  } catch (error) {
    console.log(`❌ Error checking gaming templates: ${error.message}`);
  }

  console.log('\n🎉 Template update complete!');
}

updateTemplates().catch(console.error);
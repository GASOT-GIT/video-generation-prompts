const fs = require('fs').promises;
const path = require('path');

async function finalFix() {
  console.log('🔧 Final fix for remaining categories...\n');
  
  // Check and update remaining categories
  const categoriesToCheck = [
    {
      category: 'nature_wildlife',
      possibleSources: ['nature-wildlife-video-templates.json']
    },
    {
      category: 'medical_healthcare',
      possibleSources: ['medical-healthcare-video-templates.json']
    },
    {
      category: 'animation_cartoon',
      possibleSources: ['animation-cartoon-templates-expanded.json', 'animation-cartoon-templates.json']
    },
    {
      category: 'lifestyle_wellness',
      possibleSources: ['lifestyle-wellness-enhanced-templates.json', 'lifestyle-wellness-video-templates.json']
    },
    {
      category: 'event_celebration',
      possibleSources: ['event-celebration-professional-templates.json', 'event-celebration-templates.json']
    },
    {
      category: 'social_media_content',
      possibleSources: ['social-media-content-enhanced.json', 'social-media-templates.json']
    },
    {
      category: 'scifi_fantasy',
      possibleSources: ['scifi-fantasy-video-templates.json']
    }
  ];

  for (const cat of categoriesToCheck) {
    const outputPath = `output/${cat.category}/templates.json`;
    
    try {
      // Check current status
      const currentData = await fs.readFile(outputPath, 'utf8');
      const parsed = JSON.parse(currentData);
      
      if (parsed.templates && parsed.templates.length > 0) {
        const firstTemplate = parsed.templates[0];
        const isHighQuality = firstTemplate.prompt && 
                            firstTemplate.prompt.main && 
                            firstTemplate.prompt.main.length > 100;
        
        if (isHighQuality) {
          console.log(`✅ ${cat.category}: Already has high-quality templates`);
          continue;
        }
      }
      
      // Try to find and update with high-quality templates
      let updated = false;
      for (const source of cat.possibleSources) {
        try {
          const sourceData = await fs.readFile(source, 'utf8');
          const data = JSON.parse(sourceData);
          
          let templates = null;
          
          // Find templates in various structures
          if (data.templates) {
            templates = data.templates;
          } else if (Array.isArray(data)) {
            templates = data;
          } else {
            // Look for nested structure
            const keys = Object.keys(data);
            for (const key of keys) {
              if (data[key] && data[key].templates) {
                templates = data[key].templates;
                break;
              } else if (Array.isArray(data[key])) {
                templates = data[key];
                break;
              }
            }
          }
          
          if (templates && templates.length > 0) {
            // Build output structure
            const categoryName = cat.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            const outputData = {
              category: categoryName,
              categoryId: cat.category,
              templateCount: templates.length,
              generatedAt: new Date().toISOString(),
              templates: templates.map(template => ({
                ...template,
                category: cat.category
              }))
            };
            
            await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2));
            console.log(`✅ Updated ${cat.category} with ${templates.length} templates from ${source}`);
            updated = true;
            break;
          }
        } catch (err) {
          // Try next source
        }
      }
      
      if (!updated) {
        console.log(`⚠️  ${cat.category}: Still needs high-quality templates`);
      }
      
    } catch (error) {
      console.log(`❌ Error checking ${cat.category}: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Final fix complete!');
}

finalFix().catch(console.error);
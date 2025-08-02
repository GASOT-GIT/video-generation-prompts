const fs = require('fs').promises;
const path = require('path');

// Import all template generators
const generators = {
  cinematic_storytelling: require('./template-generators/cinematic-generator'),
  product_showcase: require('./template-generators/product-generator'),
  // Additional generators will be imported as they're created
};

class CategoryAgentEnhanced {
  constructor(category, categoryId) {
    this.category = category;
    this.categoryId = categoryId;
    this.templates = [];
  }

  async generateTemplates() {
    console.log(`🎬 Starting template generation for ${this.category}...`);
    
    // Check if we have a specific generator for this category
    if (generators[this.categoryId]) {
      this.templates = generators[this.categoryId].generateTemplates();
      console.log(`  ✅ Generated ${this.templates.length} templates for ${this.category} using specific generator`);
    } else {
      // Use generic template generation for categories without specific generators yet
      for (let i = 1; i <= 10; i++) {
        const template = await this.createGenericTemplate(i);
        this.templates.push(template);
        console.log(`  ✅ Generated template ${i}/10 for ${this.category}`);
      }
    }
    
    return this.templates;
  }

  async createGenericTemplate(index) {
    const templateVariations = {
      fashion_beauty: [
        "Runway Fashion Show with Dynamic Lighting",
        "Beauty Product Close-up with Texture Focus",
        "Fashion Transformation Time-lapse",
        "Jewelry Sparkle and Reflection Showcase",
        "Makeup Application Tutorial Style",
        "Fashion Portrait with Movement",
        "Accessory Detail Shots",
        "Hair Styling Transformation",
        "Fashion Brand Story",
        "Beauty Routine Lifestyle"
      ],
      food_culinary: [
        "Cooking Process with Steam and Sizzle",
        "Food Plating Artistic Presentation",
        "Restaurant Ambiance and Service",
        "Ingredient Journey from Farm to Table",
        "Dessert Creation with Decoration",
        "Wine Pairing and Pouring",
        "Street Food Vibrant Capture",
        "Baking Time-lapse Transformation",
        "Cocktail Mixing with Flair",
        "Food Texture Macro Exploration"
      ],
      travel_tourism: [
        "Destination Sunrise to Sunset Journey",
        "Cultural Experience Immersion",
        "Adventure Activity Showcase",
        "Luxury Resort Tour",
        "Local Market Exploration",
        "Historical Site Cinematic Tour",
        "Beach Paradise Aerial Views",
        "City Nightlife Energy",
        "Natural Wonder Documentation",
        "Travel Lifestyle Montage"
      ],
      sports_action: [
        "Extreme Sports Adrenaline Rush",
        "Athletic Training Intensity",
        "Victory Celebration Moments",
        "Equipment Performance Demo",
        "Team Spirit and Unity",
        "Individual Skill Showcase",
        "Sports Venue Atmosphere",
        "Competition Highlights",
        "Fitness Transformation Journey",
        "Sports Technology Innovation"
      ],
      music_performance: [
        "Concert Stage Energy Capture",
        "Music Video Artistic Style",
        "Behind the Scenes Recording",
        "DJ Set with Visual Effects",
        "Acoustic Intimate Performance",
        "Dance Choreography Showcase",
        "Festival Crowd Energy",
        "Instrument Detail and Sound",
        "Band Dynamic Performance",
        "Music Production Process"
      ],
      education_tutorial: [
        "Step-by-Step Process Guide",
        "Scientific Concept Visualization",
        "Skill Development Progress",
        "Educational Animation Style",
        "Workshop Hands-on Learning",
        "Technology Tutorial Clarity",
        "Art Technique Demonstration",
        "Language Learning Interaction",
        "DIY Project Completion",
        "Knowledge Infographic Motion"
      ],
      real_estate_architecture: [
        "Property Walkthrough Tour",
        "Architectural Detail Focus",
        "Interior Design Showcase",
        "Construction Progress Time-lapse",
        "Neighborhood Lifestyle View",
        "Luxury Home Features",
        "Commercial Space Potential",
        "Historical Building Story",
        "Smart Home Technology",
        "Outdoor Living Spaces"
      ],
      nature_wildlife: [
        "Wildlife Behavior Documentation",
        "Landscape Time-lapse Beauty",
        "Underwater World Exploration",
        "Macro Nature Details",
        "Seasonal Change Progression",
        "Conservation Story Impact",
        "Bird Flight Dynamics",
        "Forest Ecosystem Life",
        "Desert Survival Adaptation",
        "Mountain Majesty Scenes"
      ]
    };

    const titles = templateVariations[this.categoryId] || [
      `${this.category} Showcase ${index}`,
      `Dynamic ${this.category} Presentation ${index}`,
      `Professional ${this.category} Demo ${index}`,
      `Creative ${this.category} Sequence ${index}`,
      `Engaging ${this.category} Story ${index}`,
      `Modern ${this.category} Feature ${index}`,
      `Artistic ${this.category} Expression ${index}`,
      `Premium ${this.category} Display ${index}`,
      `Innovative ${this.category} Concept ${index}`,
      `Compelling ${this.category} Visual ${index}`
    ];

    const title = titles[index - 1] || `${this.category} Template ${index}`;

    return {
      id: `${this.categoryId}_template_${String(index).padStart(2, '0')}`,
      category: this.categoryId,
      title: title,
      description: `Professional video template for ${this.category} content`,
      prompt: {
        main: this.generateMainPrompt(index),
        elements: {
          cameraMovement: this.generateCameraMovement(index),
          subject: this.generateSubject(index),
          scene: this.generateScene(index),
          motion: this.generateMotion(index),
          lighting: this.generateLighting(index),
          atmosphere: this.generateAtmosphere(index),
          style: this.generateStyle(index),
          technicalSpecs: {
            duration: "10-20 seconds",
            resolution: "4K",
            aspectRatio: "16:9",
            frameRate: "30 fps"
          }
        }
      },
      variations: [
        {
          name: "Alternative Style",
          modifiedElements: {
            style: "Different visual approach",
            atmosphere: "Contrasting mood"
          }
        }
      ],
      tags: this.generateTags(),
      difficulty: ["beginner", "intermediate", "advanced"][index % 3],
      bestPractices: [
        "Follow professional production standards",
        "Ensure clear subject focus",
        "Maintain consistent visual style"
      ],
      examples: {
        sampleOutput: `High-quality ${this.category.toLowerCase()} video`,
        useCases: this.generateUseCases()
      }
    };
  }

  generateMainPrompt(index) {
    const prompts = {
      fashion_beauty: "Elegant fashion showcase with model walking confidently, fabric flowing in slow motion. Camera captures details of design, texture, and movement. Professional lighting highlights the garment's unique features.",
      food_culinary: "Appetizing food preparation sequence showing fresh ingredients being transformed. Steam rises, liquids pour in slow motion, and final plating reveals restaurant-quality presentation.",
      travel_tourism: "Breathtaking destination reveal starting with aerial establishing shot, transitioning to cultural experiences and local highlights. Golden hour lighting creates magical atmosphere.",
      sports_action: "High-energy athletic performance captured with dynamic camera angles. Slow motion highlights key moments of skill and determination. Sweat droplets and muscle definition visible.",
      music_performance: "Energetic performance footage with stage lights creating dramatic atmosphere. Close-ups of instruments and artist expressions intercut with wide crowd shots.",
      // Add more category-specific prompts
    };

    return prompts[this.categoryId] || `Professional ${this.category} video showcasing key elements with cinematic quality. Dynamic camera work captures essential details while maintaining visual interest throughout.`;
  }

  generateCameraMovement(index) {
    const movements = [
      "Smooth tracking shot following the action",
      "360-degree orbital movement around subject",
      "Dolly zoom creating dramatic perspective shift",
      "Crane shot revealing scene from above",
      "Handheld movement for dynamic energy",
      "Steadicam gliding through the scene",
      "Time-lapse with subtle camera drift",
      "Macro push-in revealing fine details",
      "Aerial descent into the scene",
      "Slider movement with parallax effect"
    ];
    return movements[index - 1] || movements[0];
  }

  generateSubject(index) {
    const subjects = {
      fashion_beauty: "Professional model showcasing designer clothing",
      food_culinary: "Gourmet dish with fresh ingredients",
      travel_tourism: "Iconic destination with local culture",
      sports_action: "Athlete demonstrating peak performance",
      music_performance: "Musician or band performing live",
      // Add more subjects
    };
    return subjects[this.categoryId] || "Main subject relevant to category";
  }

  generateScene(index) {
    const scenes = {
      fashion_beauty: "Professional studio or runway setting",
      food_culinary: "Modern kitchen or restaurant environment",
      travel_tourism: "Scenic location with cultural elements",
      sports_action: "Athletic venue or training facility",
      music_performance: "Concert stage or recording studio",
      // Add more scenes
    };
    return scenes[this.categoryId] || "Appropriate professional setting";
  }

  generateMotion(index) {
    return "Natural movement patterns with dynamic elements";
  }

  generateLighting(index) {
    const lighting = [
      "Soft natural light with subtle shadows",
      "Dramatic spotlighting with rim light",
      "Golden hour warm tones",
      "High-key bright and airy",
      "Low-key moody atmosphere",
      "Neon accents with practical lights",
      "Diffused studio lighting",
      "Backlighting creating silhouettes",
      "Mixed color temperature for depth",
      "Strobe effects for energy"
    ];
    return lighting[index - 1] || lighting[0];
  }

  generateAtmosphere(index) {
    const atmospheres = {
      fashion_beauty: "Elegant, sophisticated, trendsetting",
      food_culinary: "Appetizing, fresh, inviting",
      travel_tourism: "Adventurous, inspiring, cultural",
      sports_action: "Energetic, powerful, competitive",
      music_performance: "Electric, emotional, engaging",
      // Add more atmospheres
    };
    return atmospheres[this.categoryId] || "Professional and engaging";
  }

  generateStyle(index) {
    const styles = {
      fashion_beauty: "Vogue editorial meets modern commercial",
      food_culinary: "Food Network meets fine dining presentation",
      travel_tourism: "National Geographic meets luxury travel",
      sports_action: "ESPN highlights meets Nike commercial",
      music_performance: "MTV meets live concert film",
      // Add more styles
    };
    return styles[this.categoryId] || "High production value commercial style";
  }

  generateTags() {
    const baseTags = [this.categoryId.split('_').join(' ')];
    const categoryTags = {
      fashion_beauty: ["fashion", "beauty", "style", "model", "design"],
      food_culinary: ["food", "cooking", "cuisine", "chef", "recipe"],
      travel_tourism: ["travel", "destination", "adventure", "culture", "explore"],
      sports_action: ["sports", "athlete", "fitness", "action", "performance"],
      music_performance: ["music", "concert", "performance", "artist", "live"],
      // Add more tags
    };
    return [...baseTags, ...(categoryTags[this.categoryId] || ["professional", "showcase"])];
  }

  generateUseCases() {
    const useCases = {
      fashion_beauty: ["Fashion brand campaigns", "Beauty product launches", "Style guides"],
      food_culinary: ["Restaurant promotion", "Recipe videos", "Food product marketing"],
      travel_tourism: ["Destination marketing", "Travel vlogs", "Tourism campaigns"],
      sports_action: ["Sports brand ads", "Athlete profiles", "Fitness content"],
      music_performance: ["Music videos", "Concert promotion", "Artist showcases"],
      // Add more use cases
    };
    return useCases[this.categoryId] || ["Marketing campaigns", "Social media content", "Professional presentations"];
  }

  async saveTemplates() {
    const outputDir = path.join(__dirname, '..', 'output', this.categoryId);
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, 'templates.json');
    await fs.writeFile(outputPath, JSON.stringify({
      category: this.category,
      categoryId: this.categoryId,
      templateCount: this.templates.length,
      generatedAt: new Date().toISOString(),
      templates: this.templates
    }, null, 2));
    
    console.log(`💾 Saved ${this.templates.length} templates to ${outputPath}`);
    return outputPath;
  }
}

module.exports = CategoryAgentEnhanced;
const fs = require('fs').promises;
const path = require('path');

class CategoryAgent {
  constructor(category, categoryId) {
    this.category = category;
    this.categoryId = categoryId;
    this.templates = [];
  }

  async generateTemplates() {
    console.log(`🎬 Starting template generation for ${this.category}...`);
    
    for (let i = 1; i <= 10; i++) {
      const template = await this.createTemplate(i);
      this.templates.push(template);
      console.log(`  ✅ Generated template ${i}/10 for ${this.category}`);
    }
    
    return this.templates;
  }

  async createTemplate(index) {
    // Template generation logic specific to each category
    const templateGenerators = {
      'cinematic_storytelling': this.generateCinematicTemplate,
      'product_showcase': this.generateProductTemplate,
      'fashion_beauty': this.generateFashionTemplate,
      'food_culinary': this.generateFoodTemplate,
      'travel_tourism': this.generateTravelTemplate,
      'sports_action': this.generateSportsTemplate,
      'music_performance': this.generateMusicTemplate,
      'education_tutorial': this.generateEducationTemplate,
      'real_estate_architecture': this.generateRealEstateTemplate,
      'nature_wildlife': this.generateNatureTemplate,
      'scifi_fantasy': this.generateSciFiTemplate,
      'animation_cartoon': this.generateAnimationTemplate,
      'medical_healthcare': this.generateMedicalTemplate,
      'corporate_business': this.generateCorporateTemplate,
      'event_celebration': this.generateEventTemplate,
      'gaming_virtual_worlds': this.generateGamingTemplate,
      'art_creative': this.generateArtTemplate,
      'technology_innovation': this.generateTechTemplate,
      'lifestyle_wellness': this.generateLifestyleTemplate,
      'social_media_content': this.generateSocialMediaTemplate
    };

    const generator = templateGenerators[this.categoryId] || this.generateDefaultTemplate;
    return generator.call(this, index);
  }

  generateCinematicTemplate(index) {
    const templates = [
      {
        id: `cinematic_dramatic_reveal_${index}`,
        category: "cinematic_storytelling",
        title: "Dramatic Character Reveal with Emotional Impact",
        description: "A cinematic sequence revealing a character with powerful emotional resonance",
        prompt: {
          main: "Slow dolly zoom starting from extreme close-up of tearful eyes, gradually pulling back to reveal a solitary figure standing on rain-soaked city rooftop at twilight. Neon signs reflect in puddles as camera circles the subject. Deep shadows contrast with warm streetlight glow, creating film noir atmosphere with modern urban setting. Subject's coat billows in wind as they gaze at sprawling metropolis below.",
          elements: {
            cameraMovement: "Slow dolly zoom out transitioning to circular tracking shot",
            subject: "Solitary figure in long coat, emotional expression visible",
            scene: "Urban rooftop at twilight, rain-soaked surfaces, city skyline",
            motion: "Coat billowing, rain falling, neon signs flickering",
            lighting: "Film noir style - high contrast, warm streetlights vs cool shadows",
            atmosphere: "Melancholic, contemplative, emotionally charged",
            style: "Cinematic film noir with modern urban elements",
            technicalSpecs: {
              duration: "15-20 seconds",
              resolution: "4K",
              aspectRatio: "2.39:1 (Cinemascope)",
              frameRate: "24 fps"
            }
          }
        },
        variations: [
          {
            name: "Sunrise Hope",
            modifiedElements: {
              lighting: "Golden hour sunrise replacing twilight",
              atmosphere: "Hopeful transformation from melancholy"
            }
          }
        ],
        tags: ["cinematic", "emotional", "character reveal", "film noir", "urban"],
        difficulty: "intermediate",
        bestPractices: [
          "Focus on subtle facial expressions during close-up",
          "Time the reveal with emotional music cues",
          "Use depth of field to isolate subject from background"
        ],
        examples: {
          sampleOutput: "Opening scene of a thriller or drama film",
          useCases: [
            "Film trailers",
            "Character introduction sequences",
            "Emotional story pivots"
          ]
        }
      },
      {
        id: `cinematic_action_chase_${index}`,
        category: "cinematic_storytelling",
        title: "High-Octane Chase Sequence Through Urban Environment",
        description: "Dynamic action sequence with multiple camera angles and intense movement",
        prompt: {
          main: "Handheld camera follows protagonist sprinting through narrow alleyway, quick cut to overhead drone shot revealing pursuer gaining ground. Camera mounted on vehicle as it screeches around corner, sparks flying from scraping metal. Low angle tracking shot as subject parkours over obstacles, camera whip pans to capture each movement. Adrenaline-pumping sequence with rapid cuts and dynamic angles.",
          elements: {
            cameraMovement: "Handheld tracking, drone overhead, vehicle-mounted, whip pans",
            subject: "Runner in athletic gear performing parkour moves",
            scene: "Urban alleyways, market streets, rooftops, industrial area",
            motion: "Sprint, jump, slide, climb - continuous high-energy movement",
            lighting: "High contrast daylight, shadows in alleyways",
            atmosphere: "Intense, urgent, adrenaline-fueled",
            style: "Action movie cinematography - Paul Greengrass style",
            technicalSpecs: {
              duration: "20-30 seconds",
              resolution: "4K",
              aspectRatio: "16:9",
              frameRate: "60 fps for smooth action"
            }
          }
        },
        variations: [
          {
            name: "Night Chase",
            modifiedElements: {
              lighting: "Neon-lit streets, headlights, police sirens",
              atmosphere: "Noir thriller ambiance"
            }
          }
        ],
        tags: ["action", "chase", "parkour", "urban", "dynamic"],
        difficulty: "advanced",
        bestPractices: [
          "Maintain screen direction consistency",
          "Use motion blur strategically for speed sensation",
          "Match cuts on action for seamless flow"
        ],
        examples: {
          sampleOutput: "Jason Bourne-style chase sequence",
          useCases: [
            "Action film sequences",
            "Video game trailers",
            "Sports brand commercials"
          ]
        }
      },
      // Add 8 more cinematic templates...
    ];
    
    return templates[Math.min(index - 1, templates.length - 1)];
  }

  generateProductTemplate(index) {
    const templates = [
      {
        id: `product_tech_unveil_${index}`,
        category: "product_showcase",
        title: "Futuristic Tech Product Reveal with 360° View",
        description: "Sleek product presentation with professional lighting and smooth camera work",
        prompt: {
          main: "Camera starts in complete darkness, single spotlight illuminates cutting-edge smartphone floating in zero gravity. Slow 360-degree orbit reveals premium materials - brushed titanium frame catching light at precise angles. Camera pushes through holographic UI elements that materialize around device. Extreme macro shots showcase camera array and precision engineering. Product rotates gracefully as features highlight sequentially.",
          elements: {
            cameraMovement: "360-degree orbit, push-through motion, macro transitions",
            subject: "Premium smartphone with titanium frame and advanced camera system",
            scene: "Minimalist black void with strategic lighting, holographic elements",
            motion: "Product rotation, UI elements appearing, light reflections traveling",
            lighting: "Single spotlight with rim lighting, gradual reveal technique",
            atmosphere: "Futuristic, premium, sophisticated technology",
            style: "Apple-style product photography meets sci-fi aesthetics",
            technicalSpecs: {
              duration: "10-15 seconds",
              resolution: "4K",
              aspectRatio: "16:9",
              frameRate: "30 fps"
            }
          }
        },
        variations: [
          {
            name: "Lifestyle Context",
            modifiedElements: {
              scene: "Modern minimalist desk setup with natural lighting",
              atmosphere: "Warm, approachable, everyday use"
            }
          }
        ],
        tags: ["product", "technology", "smartphone", "premium", "reveal"],
        difficulty: "intermediate",
        bestPractices: [
          "Ensure perfect reflections and material accuracy",
          "Time feature reveals with musical beats",
          "Maintain consistent lighting temperature"
        ],
        examples: {
          sampleOutput: "Apple iPhone or Samsung Galaxy launch video style",
          useCases: [
            "Product launch campaigns",
            "E-commerce hero videos",
            "Tech review introductions"
          ]
        }
      }
    ];
    
    return templates[Math.min(index - 1, templates.length - 1)];
  }

  // Additional category template generators...
  generateFashionTemplate(index) {
    return {
      id: `fashion_runway_elegance_${index}`,
      category: "fashion_beauty",
      title: "High Fashion Runway Walk with Dramatic Lighting",
      description: "Elegant fashion showcase with professional runway presentation",
      prompt: {
        main: "Tracking shot follows model strutting down illuminated runway, camera at hip level capturing flowing fabric movement. Strobe lights create rhythmic visual beats as designer gown trails behind. Cut to low angle showing confident stride in stilettos. Slow-motion capture of fabric billowing with each step. Audience silhouettes frame the shot, fashion week atmosphere palpable.",
        elements: {
          cameraMovement: "Smooth tracking shot, low angle follow, slow-motion inserts",
          subject: "Fashion model in haute couture gown, confident runway walk",
          scene: "Professional fashion show runway, dramatic lighting setup",
          motion: "Confident stride, fabric flowing, hair movement, strobe effects",
          lighting: "Runway spotlights, strategic strobes, rim lighting on fabric",
          atmosphere: "Glamorous, high-energy, exclusive fashion event",
          style: "Fashion week photography, Vogue editorial aesthetic",
          technicalSpecs: {
            duration: "15-20 seconds",
            resolution: "4K",
            aspectRatio: "16:9",
            frameRate: "24 fps with 60 fps slow-motion segments"
          }
        }
      },
      variations: [
        {
          name: "Street Style",
          modifiedElements: {
            scene: "Urban street setting with natural lighting",
            style: "Documentary fashion, candid street photography"
          }
        }
      ],
      tags: ["fashion", "runway", "haute couture", "model", "glamour"],
      difficulty: "intermediate",
      bestPractices: [
        "Focus on fabric texture and movement",
        "Coordinate camera movement with model's pace",
        "Highlight key design elements with lighting"
      ],
      examples: {
        sampleOutput: "Paris Fashion Week runway footage",
        useCases: [
          "Fashion brand campaigns",
          "Designer portfolio videos",
          "Fashion magazine digital content"
        ]
      }
    };
  }

  generateDefaultTemplate(index) {
    return {
      id: `${this.categoryId}_template_${index}`,
      category: this.categoryId,
      title: `${this.category} Template ${index}`,
      description: `Template for ${this.category} category`,
      prompt: {
        main: `A professional video showcasing ${this.category} content with cinematic quality`,
        elements: {
          cameraMovement: "Smooth tracking shot",
          subject: "Main subject relevant to category",
          scene: "Appropriate setting for the category",
          motion: "Natural movement patterns",
          lighting: "Professional lighting setup",
          atmosphere: "Engaging and professional",
          style: "High-quality production value",
          technicalSpecs: {
            duration: "10-20 seconds",
            resolution: "4K",
            aspectRatio: "16:9",
            frameRate: "30 fps"
          }
        }
      },
      tags: [this.categoryId],
      difficulty: "beginner",
      bestPractices: [
        "Follow standard video production guidelines",
        "Ensure clear subject focus"
      ],
      examples: {
        sampleOutput: "Professional quality video output",
        useCases: ["General purpose", "Category-specific content"]
      }
    };
  }

  async saveTemplates() {
    const outputDir = path.join(__dirname, '..', 'output', this.categoryId);
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, 'templates.json');
    await fs.writeFile(outputPath, JSON.stringify(this.templates, null, 2));
    
    console.log(`💾 Saved ${this.templates.length} templates to ${outputPath}`);
    return outputPath;
  }
}

module.exports = CategoryAgent;
# Video Generation AI Prompts Collection 🎬

## 프로젝트 개요

Veo3, Sora, Runway Gen-3 등 최신 영상 생성 AI를 위한 전문 프롬프트 템플릿 컬렉션입니다.
20개 카테고리에 걸쳐 총 200개의 상세한 JSON 템플릿을 제공합니다.

## 🚀 주요 특징

- **20개 전문 카테고리**: 영화, 제품, 패션부터 게임, AI/테크까지
- **카테고리당 10개 템플릿**: 총 200개의 즉시 사용 가능한 템플릿
- **병렬 생성 시스템**: 효율적인 대량 템플릿 생성
- **품질 검증 완료**: 100% 검증 통과율
- **AI 최적화**: Veo3, Sora 등에 최적화된 프롬프트 구조

## 📁 프로젝트 구조

```
video-generation-prompts/
├── agents/                    # 병렬 생성 에이전트 시스템
│   ├── category-agent.js
│   ├── category-agent-enhanced.js
│   ├── parallel-orchestrator.js
│   └── template-generators/
│       ├── cinematic-generator.js
│       └── product-generator.js
├── categories/               # 카테고리별 폴더
├── output/                  # 생성된 템플릿 (카테고리별)
│   ├── cinematic_storytelling/
│   ├── product_showcase/
│   ├── fashion_beauty/
│   └── ... (20개 카테고리)
├── reports/                 # 생성 및 검증 리포트
├── templates/               # 템플릿 구조 정의
└── docs/                    # 문서화

```

## 🎯 20개 카테고리

1. **Cinematic Storytelling** - 영화적 스토리텔링
2. **Product Showcase** - 제품 쇼케이스
3. **Fashion & Beauty** - 패션 & 뷰티
4. **Food & Culinary** - 음식 & 요리
5. **Travel & Tourism** - 여행 & 관광
6. **Sports & Action** - 스포츠 & 액션
7. **Music & Performance** - 음악 & 공연
8. **Education & Tutorial** - 교육 & 튜토리얼
9. **Real Estate & Architecture** - 부동산 & 건축
10. **Nature & Wildlife** - 자연 & 야생동물
11. **Sci-Fi & Fantasy** - SF & 판타지
12. **Animation & Cartoon** - 애니메이션 & 카툰
13. **Medical & Healthcare** - 의료 & 헬스케어
14. **Corporate & Business** - 기업 & 비즈니스
15. **Event & Celebration** - 이벤트 & 축하
16. **Gaming & Virtual Worlds** - 게임 & 가상세계
17. **Art & Creative** - 예술 & 창작
18. **Technology & Innovation** - 기술 & 혁신
19. **Lifestyle & Wellness** - 라이프스타일 & 웰빙
20. **Social Media Content** - 소셜 미디어 콘텐츠

## 💡 템플릿 구조

각 템플릿은 다음 요소를 포함합니다:

```json
{
  "id": "unique_template_id",
  "category": "category_name",
  "title": "Template Title",
  "description": "Brief description",
  "prompt": {
    "main": "Complete prompt text",
    "elements": {
      "cameraMovement": "Camera movement details",
      "subject": "Subject description",
      "scene": "Scene setting",
      "motion": "Motion details",
      "lighting": "Lighting setup",
      "atmosphere": "Mood and atmosphere",
      "style": "Visual style",
      "technicalSpecs": {
        "duration": "10-20 seconds",
        "resolution": "4K",
        "aspectRatio": "16:9",
        "frameRate": "30 fps"
      }
    }
  },
  "variations": [...],
  "tags": [...],
  "difficulty": "beginner/intermediate/advanced",
  "bestPractices": [...],
  "examples": {...}
}
```

## 🚀 사용 방법

### 1. 전체 템플릿 생성
```bash
npm run generate
```

### 2. 특정 카테고리 템플릿 확인
```bash
cat output/[category_id]/templates.json
```

### 3. 템플릿 검증
```bash
npm run validate
```

## 📊 생성 결과

- **총 템플릿 수**: 200개
- **검증 통과율**: 100%
- **평균 생성 시간**: < 1초
- **카테고리당 템플릿**: 10개

## 🛠️ 기술 스택

- **Node.js**: 병렬 처리 시스템
- **JavaScript**: 에이전트 구현
- **JSON**: 템플릿 포맷

## 📈 AI 플랫폼 호환성

- ✅ Google Veo3
- ✅ OpenAI Sora
- ✅ Runway Gen-3
- ✅ Stable Video Diffusion
- ✅ Pika Labs
- ✅ 기타 텍스트-투-비디오 AI

## 🔍 템플릿 예시

### Cinematic Storytelling - Dramatic Character Reveal
```json
{
  "prompt": {
    "main": "Slow dolly zoom starting from extreme close-up of tearful eyes, gradually pulling back to reveal a solitary figure standing on rain-soaked city rooftop at twilight..."
  }
}
```

## 📝 베스트 프랙티스

1. **구체적인 디테일**: 카메라 움직임, 조명, 분위기를 상세히 기술
2. **기술 사양 명시**: 해상도, 프레임레이트, 화면비 등 명확히 지정
3. **시간 고려**: 5-30초 범위의 현실적인 길이 설정
4. **스타일 참조**: 유명 영화나 감독 스타일 참조 포함

## 🤝 기여 방법

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 라이선스

MIT License

## 🙏 감사의 말

이 프로젝트는 최신 AI 영상 생성 기술의 발전과 함께 만들어졌습니다.

---

**Created with ❤️ for AI Video Generation Community**
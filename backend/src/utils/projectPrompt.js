const buildProjectPrompt = (user) => `
You are a senior software engineering mentor.

Generate exactly 3 project ideas for a user with:
- Skill level: ${user.skillLevel}
- Domain: ${user.domain}
- Goal: ${user.goal}
- Tech stack: ${user.techStack}

Return ONLY valid JSON in the following format:

[
  {
    "title": "",
    "description": "",
    "difficulty": "",
    "concepts": [],
    "estimatedTime": ""
  }
]

Do not include explanations or markdown.
`;

module.exports = buildProjectPrompt;

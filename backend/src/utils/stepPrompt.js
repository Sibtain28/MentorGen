const buildStepPrompt = (project) => `
You are a senior software mentor.

Create a step-by-step implementation guide for this project:

Title: ${project.title}
Description: ${project.description}
Difficulty: ${project.difficulty}

Return ONLY valid JSON in this format:

[
  {
    "order": 1,
    "title": "",
    "description": "",
    "why": ""
  }
]

No explanations. No markdown.
`;

module.exports = buildStepPrompt;

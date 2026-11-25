# AGENTS.md

## Project

Homework 3 is a static Traditional Chinese kinship-title calculator named **過年親戚聚會好幫手**. Users select their gender, enter a relationship path, and press `=` to get the kinship title.

This file is the self-contained maintenance specification. Do not rely on the original assignment slides.

## Required files

```text
hw3/
├── .gitattributes
├── .gitignore
├── AGENTS.md
├── README.md
├── s1151538_HW3.html
└── S1151538_HW3.js
```

- Keep the exact filename casing.
- Only the HTML and JavaScript files are browser-facing source files.
- Keep all CSS and the favicon inside the HTML file.
- Do not add a framework, package manager, backend, external asset, or CDN without explicit approval.
- Keep README.md human-facing; implementation and deployment notes belong here.
- Keep README.md's Mermaid flowchart focused on and synchronized with the kinship calculation logic.

## Interface and content

The interface has exactly 16 buttons:

1. 爸爸
2. 媽媽
3. 哥哥
4. 弟弟
5. 姊姊
6. 妹妹
7. 丈夫
8. 妻子
9. 兒子（較年長）
10. 兒子（較年輕）
11. 女兒（較年長）
12. 女兒（較年輕）
13. 我（男）
14. 我（女）
15. `=`
16. 返回

- `我（男）` and `我（女）` are one required, mutually exclusive choice.
- Relationship buttons and `=` stay disabled until a gender is selected.
- The hero description is exactly `「叫人啊，看到人都不會叫喔？」`.
- The how-to panel contains only the three usage steps; do not add a separate example card or the removed scope disclaimer.
- Preserve semantic buttons, keyboard access, visible focus, sufficient contrast, and responsive layouts without horizontal overflow.
- Idle text such as `等待輸入` must remain visually distinct from a successful answer.

## Behavior

- Store the relationship path as structured JavaScript state, not rendered text.
- Each relationship button appends one step and refreshes the displayed path.
- `=` resolves and displays the final title.
- A short press on `返回` undoes exactly one action without clearing the selected gender.
- Holding `返回` for about 700 ms clears the relationship path, result, and history while preserving gender.
- Long press must work with pointer, touch, Enter, and Space without also triggering a short back action.
- Enter and Space repeat events must prevent browser defaults without restarting the long-press timer or causing extra back actions.
- Preserve the existing family-graph evaluator, supported titles, gender rules, parental side, marriage direction, and older/younger distinctions.
- Great-grandparent generations, consecutive sibling steps, and unsupported same-sex spouse paths are outside the assignment scope.
- Do not use `eval()`, infer a missing gender, or replace the evaluator with a few hard-coded full strings.
- Invalid, empty, incomplete, or unsupported input must fail safely without crashing.

Required baseline results:

```text
我的妻子 = 妻
哥哥的爸爸 = 父親
媽媽的爸爸的女兒（較年輕） = 姨媽
我的爸爸的妻子的爸爸的妻子 = 外祖母
妻子的爸爸的兒子（較年輕）的女兒的哥哥的媽媽 = 妻弟媳
```

## Deployment

Cloudflare Pages deploys directly from the GitHub repository. Use:

```text
Framework preset: None
Production branch: main
Build command: mkdir -p dist && cp s1151538_HW3.html dist/index.html && cp S1151538_HW3.js dist/S1151538_HW3.js
Build output directory: dist
Root directory: repository root
Custom domain: hw3.chuen666666.com
```

- Do not commit `dist/`.
- The deployed output contains only `index.html` and `S1151538_HW3.js`.
- Do not commit credentials, tokens, editor state, or machine-specific paths.
- Push only when the user explicitly requests it.

## Formatting and verification

- Use the active VS Code global formatting and lint settings; do not add repository-local formatter or linter configuration.
- Format and lint changed files with those settings before pushing.
- Keep every repository text file LF-only with one final newline.
- Development-only checks stay outside the repository and are removed afterward.

Before completion, verify:

- the page and JavaScript load without errors or missing requests;
- all 16 buttons and both gender options work;
- short and long `返回` behavior works;
- the five baseline results pass;
- desktop and mobile layouts have no horizontal overflow;
- only the two allowed browser-facing source files remain;
- formatting, lint, LF, and Git diff checks pass;
- AGENTS.md still matches the implementation.

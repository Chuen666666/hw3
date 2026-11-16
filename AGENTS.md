# AGENTS.md

## Project overview

This repository contains Homework 3, **過年親戚聚會好幫手**: a browser-based Chinese kinship-title helper implemented with JavaScript. The user builds a relationship path by pressing buttons and then presses `=` to display the resulting kinship title.

This file is the complete and authoritative working specification for implementation, review, and testing.

## Project scope

This is a frontend JavaScript assignment. Unless the user explicitly expands the scope:

- Do not add PHP, a database, an API, or server-side state.
- Do not add a frontend framework, package manager, build pipeline, or large third-party library.
- Prefer semantic HTML, inline project-owned CSS, and vanilla JavaScript.
- Do not copy unrelated HW2 application features such as registration, PDF/email generation, PWA support, or Discord integration into HW3.

## Repository structure

```text
hw3/
├── .gitattributes
├── .gitignore
├── AGENTS.md
├── README.md
├── s1151538_HW3.html
└── S1151538_HW3.js
```

Only `s1151538_HW3.html` and `S1151538_HW3.js` are browser-facing source files. Keep their exact casing. Documentation and repository metadata may remain beside them, but do not add another HTML, CSS, JavaScript, image, font, or other public asset without explicit approval. Put all project CSS and the favicon inside the HTML file.

## Current implementation

- `s1151538_HW3.html` contains the accessible calculator interface, exactly 16 required buttons, all project CSS, and an inline favicon.
- `.gitattributes` enforces LF line endings for all text files across development and deployment environments.
- `README.md` is a concise Traditional Chinese guide for human visitors and repository readers. Keep implementation, architecture, testing, and deployment internals in this file instead of the README.
- `S1151538_HW3.js` contains both the family-graph evaluator and DOM interaction logic. It exposes `globalThis.KinshipEngine` so the evaluator can be tested without a browser.
- The site does not require external fonts, images, stylesheets, scripts, or CDNs.
- Automated checks are development-only. Create temporary test scripts outside the repository, run them, and remove them after validation. The ignored `tests/` path is only a safeguard against accidentally committing temporary checks.

## Deployment target

The source repository is published with Cloudflare Pages by connecting the GitHub repository directly. Cloudflare builds the production branch after a push; this project does not use a school server, XAMPP as a production origin, or Cloudflare Tunnel.

Use these Cloudflare Pages settings:

```text
Framework preset: None
Production branch: main
Build command: mkdir -p dist && cp s1151538_HW3.html dist/index.html && cp S1151538_HW3.js dist/S1151538_HW3.js
Build output directory: dist
Root directory: leave blank (repository root)
Custom domain: hw3.chuen666666.com
```

The build command creates Cloudflare's uncommitted `dist/` output so the required source filename can remain `s1151538_HW3.html` while the custom-domain root serves it as `index.html`. The deployed directory must contain only `index.html` and `S1151538_HW3.js`.

- Use relative web paths instead of machine-specific absolute paths.
- Treat deployed filenames and URL paths as case-sensitive.
- Keep all required frontend code in the two browser-facing source files.
- Do not commit `dist/`, secrets, credentials, editor state, OS metadata, or local-only configuration.
- Deployment and Git pushes are valid project tasks, but perform them only when the user explicitly requests that action.

## Required interface

The page needs a display area similar to a calculator screen. It shows the relationship path while the user is entering it and the final answer after `=` is pressed.

Idle states such as `等待輸入` and `尚未選擇視角` must use subdued status styling. A successfully resolved kinship title must use a clearly different, prominent color, typeface, size, and weight so users can distinguish status from answer at a glance.

The assignment has exactly **16 buttons**:

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

An older assignment note incorrectly said there were 15 buttons. That was a teacher typo. Implementation and testing must use all 16 controls above; neither `=` nor `返回` may be omitted.

Button typography may adjust spaces or bracket style for layout, but button meanings must not change.

`我（男）` and `我（女）` form one required, mutually exclusive choice. Exactly one must be selected before relationship entry or evaluation is allowed.

## Core interaction contract

### Relationship input

- Before entering a relationship, the user must select exactly one of `我（男）` or `我（女）`.
- Relationship and `=` buttons remain disabled until the required root-gender choice is complete.
- Selecting one root-gender button deselects the other. Selecting either option starts a new empty query and keeps that option selected.
- Pressing an enabled relationship button immediately appends that step to the current path and refreshes the display.
- The full chain remains readable, for example `爸爸的媽媽`.
- `我（男）` and `我（女）` establish the gender of “me,” because some answers depend on it.
- Older/younger child variants carry required sibling-order information. Do not merge them into generic `兒子` or `女兒` inputs.

### Equals

- `=` ends the current query.
- After `=` is pressed, the display directly shows the final kinship title.
- A query that cannot produce a valid answer is not considered successfully completed.

### Back

- `返回` goes back exactly one action.
- Each press removes only the most recent relationship step and rerenders the remaining path.
- `返回` must never undo the required root-gender selection or return the UI to an unselected state.
- Holding `返回` for approximately 700 ms clears the complete relationship path, result, and undo history while preserving the selected root gender.
- Long-press clear must work with pointer, touch, Enter, and Space input and must not trigger an extra short-back action when released.
- Example: after entering `爸爸` and then `媽媽`, the display reads `爸爸的媽媽`; pressing `返回` changes it to `爸爸`.
- Implement back behavior from explicit state/history. Do not guess the previous action with fragile string truncation.

## Evaluation domain

The evaluator will stay within the family domain and restrictions defined in this file:

- No great-grandparent generation is required. Inputs such as `媽媽的媽媽的媽媽` and answers such as `曾祖父` are outside scope.
- Consecutive sibling steps such as `哥哥的弟弟` are not used.
- A path may contain an intermediate person whose exact older/younger identity is ambiguous when that ambiguity does not change the final answer. For example, `爸爸的爸爸的兒子的哥哥的爸爸` still resolves to `祖父`.
- Special same-sex spouse paths such as `我的爸爸的丈夫` are not used.
- Do not invent additional generations, relationship categories, or colloquial titles outside this specification.

## Relationship semantics

Each input button is an edge from the current person to another person:

| Button           | Meaning                                                       |
| ---------------- | ------------------------------------------------------------- |
| `爸爸`           | That person's father                                          |
| `媽媽`           | That person's mother                                          |
| `哥哥`           | That person's older brother                                   |
| `弟弟`           | That person's younger brother                                 |
| `姊姊`           | That person's older sister                                    |
| `妹妹`           | That person's younger sister                                  |
| `丈夫`           | That person's husband                                         |
| `妻子`           | That person's wife                                            |
| `兒子（較年長）` | An older son relative to another relevant child/sibling       |
| `兒子（較年輕）` | A younger son relative to another relevant child/sibling      |
| `女兒（較年長）` | An older daughter relative to another relevant child/sibling  |
| `女兒（較年輕）` | A younger daughter relative to another relevant child/sibling |
| `我（男）`       | Set the root person to male                                   |
| `我（女）`       | Set the root person to female                                 |

The evaluator must preserve gender, generation, blood/marriage direction, parental side, and relative age. It must not determine an answer from only the last button.

Shared-family identity rules are required. Examples include:

- A sibling's father is the root person's `父親`, so `哥哥的爸爸 = 父親`.
- A father's wife is the root person's mother in the supported domain.
- A mother's husband is the root person's father in the supported domain.
- A child's father/mother is resolved through the current family identity rather than treated as an unrelated person.

## Canonical result vocabulary

Use the following exact Chinese titles for final results. Button labels may be more conversational than result labels; for example, the `爸爸` button resolves to `父親` when the father is the final person.

### Immediate family

| Relationship to root  | Result |
| --------------------- | ------ |
| father                | `父親` |
| mother                | `母親` |
| older brother         | `哥哥` |
| younger brother       | `弟弟` |
| older sister          | `姊姊` |
| younger sister        | `妹妹` |
| male root's wife      | `妻`   |
| female root's husband | `夫`   |
| son                   | `兒子` |
| daughter              | `女兒` |

### Grandparents

| Relationship to root | Result   |
| -------------------- | -------- |
| father's father      | `祖父`   |
| father's mother      | `祖母`   |
| mother's father      | `外祖父` |
| mother's mother      | `外祖母` |

### Parents' siblings and their spouses

| Relationship to root            | Result |
| ------------------------------- | ------ |
| father's older brother          | `伯父` |
| father's older brother's wife   | `伯母` |
| father's younger brother        | `叔父` |
| father's younger brother's wife | `嬸嬸` |
| father's sister                 | `姑媽` |
| father's sister's husband       | `姑丈` |
| mother's brother                | `舅舅` |
| mother's brother's wife         | `舅媽` |
| mother's sister                 | `姨媽` |
| mother's sister's husband       | `姨丈` |

### Cousins

Children of a paternal uncle (`伯父` or `叔父`) use `堂`; children of a paternal aunt, maternal uncle, or maternal aunt use `表`.

| Cousin type                  | Older  | Younger |
| ---------------------------- | ------ | ------- |
| paternal-uncle male cousin   | `堂兄` | `堂弟`  |
| paternal-uncle female cousin | `堂姊` | `堂妹`  |
| other male first cousin      | `表兄` | `表弟`  |
| other female first cousin    | `表姊` | `表妹`  |

### Siblings' spouses and children

| Relationship to root     | Result   |
| ------------------------ | -------- |
| older brother's wife     | `嫂嫂`   |
| younger brother's wife   | `弟媳`   |
| older sister's husband   | `姊夫`   |
| younger sister's husband | `妹夫`   |
| brother's son            | `姪子`   |
| brother's daughter       | `姪女`   |
| sister's son             | `外甥`   |
| sister's daughter        | `外甥女` |

### Children, their spouses, and grandchildren

| Relationship to root | Result |
| -------------------- | ------ |
| son's wife           | `媳婦` |
| daughter's husband   | `女婿` |
| son's son            | `孫子` |
| son's daughter       | `孫女` |
| daughter's child     | `外孫` |

For this assignment, use `外孫` for a daughter's child. Do not return `外孫女`.

### Husband's family, viewed from a female root

Use the assignment's normalized `夫…` titles:

| Relationship to root               | Result   |
| ---------------------------------- | -------- |
| husband's father                   | `夫父`   |
| husband's mother                   | `夫母`   |
| husband's older brother            | `夫兄`   |
| husband's older brother's wife     | `夫兄嫂` |
| husband's younger brother          | `夫弟`   |
| husband's younger brother's wife   | `夫弟媳` |
| husband's older sister             | `夫姊`   |
| husband's older sister's husband   | `夫姊夫` |
| husband's younger sister           | `夫妹`   |
| husband's younger sister's husband | `夫妹夫` |

### Wife's family, viewed from a male root

Use the assignment's normalized `妻…` titles:

| Relationship to root            | Result   |
| ------------------------------- | -------- |
| wife's father                   | `妻父`   |
| wife's mother                   | `妻母`   |
| wife's older brother            | `妻兄`   |
| wife's older brother's wife     | `妻兄嫂` |
| wife's younger brother          | `妻弟`   |
| wife's younger brother's wife   | `妻弟媳` |
| wife's older sister             | `妻姊`   |
| wife's older sister's husband   | `妻姊夫` |
| wife's younger sister           | `妻妹`   |
| wife's younger sister's husband | `妻妹夫` |

If a supported path reaches the child of a spouse's sibling, use `外甥` for a male child and `外甥女` for a female child.

## Relative-age rules

Age qualifiers can change the result and must survive every simplification. Examples:

```text
爸爸的爸爸的兒子（較年輕） = 叔父
我（女）的媽媽的女兒（較年長） = 姊姊
```

Interpret `較年長` and `較年輕` relative to the family member established by the path. Do not globally sort people or assume that every child button refers to the root person's child.

## Required acceptance examples

The following are mandatory baseline tests:

```text
我的妻子 = 妻
哥哥的爸爸 = 父親
媽媽的爸爸的女兒（較年輕） = 姨媽
我的爸爸的妻子的爸爸的妻子 = 外祖母
妻子的爸爸的兒子（較年輕）的女兒的哥哥的媽媽 = 妻弟媳
```

The UI must require `我（男）` or `我（女）` before running any example. The evaluated relationship and answer must preserve each example's meaning.

## JavaScript implementation guidance

- Store current input as structured state, such as an array of relationship steps. Render display text from that state.
- Separate the responsibilities for adding a step, going back, resetting/selecting the root, and evaluating the answer.
- Reject evaluation when root gender is missing; do not fall back to automatic gender inference.
- Treat root-gender selection as required state outside the undoable relationship history.
- Keep kinship rules centralized and reviewable instead of scattering them across DOM event handlers.
- A family-graph or constraint-based representation is preferred over a flat list of full query strings.
- Do not hard-code only the five complete acceptance examples. The program must answer other combinations within this specification.
- Do not use `eval()`.
- Do not use rendered DOM text as the only application state.
- Handle empty, incomplete, or unknown input consistently. It must not cause an exception, blank page, or infinite loop.

## HTML and CSS conventions

- Use semantic HTML. Controls must be real `<button>` elements.
- Give buttons `type="button"` so they do not accidentally submit a form.
- Preserve keyboard access and visible focus states; do not support mouse input only.
- Keep sufficient contrast in the display. Consider an appropriate ARIA live region for dynamic results.
- Support desktop, tablet, and mobile widths without horizontal overflow.
- Prefer Flexbox or Grid for the keypad. Avoid fixed-position layouts and manual offset hacks.
- Put all project styles in the `<style>` element in `s1151538_HW3.html`; do not create a separate CSS file.
- Prefer scoped selectors over `!important`.

## Formatting and validation

The developer's active VS Code global settings are the formatting source of truth. Do not add repository-local formatter, linter, workspace, package, or editor configuration merely to override them.

- Format HTML and JavaScript with the globally selected Prettier extension and its global options.
- Use four spaces, no tabs, a 120-column print width, single quotes in JavaScript, semicolons, no spaces inside object braces, no trailing commas, and parentheses around arrow-function parameters.
- Keep HTML attribute quotes double and let Prettier format the embedded CSS.
- Format Markdown with the globally selected Markdownlint formatter and validate it against the global Markdownlint rules.
- Use VS Code-compatible HTML, CSS, and JavaScript language-service checks for linting and diagnostics.
- Preserve one final newline and LF line endings in every repository text file.

## Security and stability

This assignment does not require collecting or transmitting personal data. If free-form user text is introduced later:

- Update plain text with `textContent`; do not pass untrusted content directly to `innerHTML`.
- Do not add secrets, passwords, tokens, or real personal data.
- Do not introduce unnecessary remote scripts or CDN dependencies.

## Testing checklist

Before considering implementation or a meaningful change complete, verify:

```text
The source page loads through a local static server
The Cloudflare build command creates only dist/index.html and dist/S1151538_HW3.js
The built page loads at the deployment root
Source and deployed filename casing is exact
The repository has exactly two browser-facing source files
CSS and the favicon are embedded in s1151538_HW3.html
All 16 required buttons exist and work
Exactly one of 我（男） and 我（女） can be selected at a time
Relationship and = buttons remain disabled until root gender is selected
返回 never clears the required root-gender selection
Long-pressing 返回 clears the complete relationship and history but preserves root gender
Releasing after a long press does not also trigger a short back action
The relationship path updates after every input
= ends input and displays an answer
返回 removes exactly one action per press
Gender affects answers that require gender information
Older/younger qualifiers affect answers that require relative age
All five required acceptance examples return the specified answers
Other supported relationships are not implemented as example-only string matches
Empty or incomplete input does not crash the application
Desktop, tablet, and mobile layouts remain usable
Every button is keyboard accessible
DevTools Console has no unexpected errors
The JavaScript request does not return 404 and no external CSS or image is requested
Idle display text is visually distinct from a successful kinship answer
```

The demo has 10 questions worth 10 points each. Invalid or missing program answers receive no credit. The bonus condition is a top-10% demo result with an original score of at least 90, so correctness and reliability take priority over decorative features.

## Change discipline

1. Read this file and inspect the current source before editing.
2. Treat this file as the self-contained assignment specification.
3. Treat the current working tree as the source of truth; do not assume an older copy is current.
4. Make the smallest change that fully solves the request. Do not rewrite unrelated areas.
5. Preserve the specified button meanings, kinship titles, and interaction flow.
6. Do not substitute personal assumptions for the canonical vocabulary in this file.
7. Do not add a framework, backend, or build system unless explicitly requested.
8. Prefer readable, reviewable rules over clever abstractions.
9. If this specification is internally ambiguous, preserve compatible behavior and explain the ambiguity instead of silently inventing a rule.
10. Preserve user changes unrelated to the active task.
11. Keep all repository text files normalized to LF; do not commit CRLF line endings.

## Guidance for coding agents

- Read this `AGENTS.md` first whenever working in this repository.
- Inspect the existing HTML and JavaScript before implementation; do not assume the directory is still empty.
- Use only the requirements and canonical relationship vocabulary in this file.
- If a title cannot be established from this specification, report the missing rule instead of guessing.
- Keep development-only tests outside the repository and remove them after use; do not ship test files with the static site.
- Keep the project ready for GitHub-connected Cloudflare Pages deployment. Push only when the user explicitly requests it.
- Do not write into HW2 unless the user explicitly requests a cross-project change.
- After changes, report which files changed, which acceptance examples were verified, and any remaining limitations.

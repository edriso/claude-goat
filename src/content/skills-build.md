# Build Your First Skill

Let's build a real, useful Skill together, step by step. We will make one that teaches Claude to write React components the way your project likes them. By the end you will understand the whole pattern and can build any Skill you want.

## Step 1: Create the folder and file

Skills live in a folder named after the Skill, with a `SKILL.md` inside:

```bash
mkdir -p .claude/skills/react-component
```

Then create `.claude/skills/react-component/SKILL.md`.

## Step 2: Write the frontmatter

The frontmatter is a small block at the top between `---` lines. It needs a name and a description. The description is the most important line in the whole file, because it decides when Claude reaches for this Skill.

```yaml
---
name: react-component
description: Create React components following our project conventions. Use whenever adding or editing a React component.
---
```

Notice the description says both *what* it does and *when* to use it. Vague descriptions lead to the Skill never triggering, or triggering at the wrong time.

## Step 3: Write the instructions

Below the frontmatter, write clear, specific guidance. Pretend you are briefing a capable new hire:

```text
# React Component Conventions

When creating a React component in this project:

- Use function components with hooks. Never class components.
- One component per file. Name the file the same as the component.
- Props: destructure them in the function signature.
- Styling is Tailwind utility classes only.
- Co-locate a simple test file next to the component.
```

And it helps enormously to include a short example so Claude matches your format and tone exactly:

```jsx
export default function PriceTag({ amount, currency = "USD" }) {
  return (
    <span className="font-mono text-sm text-stone-700">
      {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)}
    </span>
  )
}
```

## Step 4: Try it

Start a session and ask for something that should trigger it:

```text
Add a Badge component that shows a small colored label.
```

Claude should recognize the task matches your Skill's description, load the instructions, and produce a component that follows your rules. If it does not trigger, sharpen the description to name the situation more directly.

## Step 5: Add supporting files (optional)

Skills can include more than instructions. You can drop reference files or scripts in the folder and point to them from `SKILL.md`. Claude only loads them when the task actually needs them, which keeps things efficient.

```text
.claude/skills/react-component/
  SKILL.md
  templates/component.jsx
  checklist.md
```

Then in `SKILL.md` you might write: "Use `templates/component.jsx` as the starting structure."

## Tips for Skills that actually work

- **Be specific in the description.** It is the trigger. Name the tasks and situations.
- **Keep instructions focused.** One Skill, one clear job. Do not build a giant everything-Skill.
- **Show an example.** A short example teaches format and tone better than a paragraph of rules.
- **Test it.** Ask for the thing and see if it triggers and behaves. Iterate.
- **Share it.** Commit project Skills so your whole team benefits.

That is genuinely all there is to it. A folder, a markdown file, a good description, clear instructions. Next, see how Skills compare to the other ways of extending Claude in [Skills vs Everything](/docs/skills-vs).

# Shortcuts and Speed

Speed as a developer is not about frantic typing. It is about removing the friction between what you want and getting it done. The 10x effect is really hundreds of tiny delays, each removed. This page is your friction-removal starter kit.

> The one rule that ties everything together: the moment you reach for the mouse or retype something, stop and learn the faster way.

## Claude Code shortcuts worth memorizing

| Key | What it does |
|---|---|
| `Shift+Tab` | Cycle permission modes (default, accept edits, plan) |
| `Esc` | Interrupt Claude mid-task, keeping the work so far |
| `Esc` `Esc` | Clear your draft, or open the rewind menu if empty |
| `Ctrl+R` | Reverse-search your command history |
| `Ctrl+B` | Send a running task to the background |
| `Ctrl+G` | Open your prompt (or a plan) in your editor |
| `Ctrl+O` | Toggle the detailed transcript view |
| `Tab` | Autocomplete commands and accept the grayed-out suggestion |
| `Up` / `Down` | Walk through your history |

Line editing works like a standard shell: `Ctrl+A` and `Ctrl+E` jump to line start and end, `Ctrl+W` deletes a word, `Ctrl+U` clears the line.

Quick prefixes to remember: `/` for commands, `!` to run a shell command directly, `@` to autocomplete a file path.

## Typing: make it invisible

The goal is not to win races. It is for typing to stop competing for your attention so your brain stays on the problem. And since you now talk to AI tools constantly, writing as fast as you think pays off twice.

Rough benchmarks: an average working dev types around 60 to 70 words per minute, strong ones 80 to 90. But for code, **accuracy matters more than raw speed**, because one typo breaks a build. Aim for touch typing first (all ten fingers, eyes on the screen), then speed.

Practice tools:

- [keybr.com](https://www.keybr.com) drills your weakest letters. Best for your first few weeks.
- [monkeytype.com](https://monkeytype.com) for daily practice, and it has a code mode.
- [SpeedCoder](https://www.speedcoder.net) is built for typing code and symbols.
- [TypeRacer](https://play.typeracer.com) to race real people when you want motivation.

Drill the symbols developers actually use: `{ } [ ] ( ) ; : => && || !== ?.` Regular prose practice will not fix your weakest area.

## VS Code shortcuts with the most payoff

| Action | Mac | Windows / Linux |
|---|---|---|
| Command Palette (run any command) | `Cmd+Shift+P` | `Ctrl+Shift+P` |
| Go to File | `Cmd+P` | `Ctrl+P` |
| Multi-cursor (select next match) | `Cmd+D` | `Ctrl+D` |
| Rename symbol everywhere | `F2` | `F2` |
| Quick Fix (auto-import, refactor) | `Cmd+.` | `Ctrl+.` |
| Go to Definition | `F12` | `F12` |
| Toggle terminal | `` Ctrl+` `` | `` Ctrl+` `` |
| Comment line | `Cmd+/` | `Ctrl+/` |
| Move line up/down | `Opt+Up/Down` | `Alt+Up/Down` |
| Search across files | `Cmd+Shift+F` | `Ctrl+Shift+F` |

Tip: the Command Palette lists the shortcut next to each action. That is how you discover the key combo for anything you currently do with the mouse.

## Terminal fluency

The terminal composes: you combine small tools and script anything you repeat. It is also where Claude Code lives, so getting comfortable here directly multiplies how well you drive it.

A few modern tools worth installing first:

- [ripgrep](https://github.com/BurntSushi/ripgrep) (`rg`): search code far faster than grep, and it respects `.gitignore`.
- [fzf](https://github.com/junegunn/fzf): fuzzy-find files, history, anything.
- [zoxide](https://github.com/ajeetdsouza/zoxide): jump to your most-used folders with `z projectname`.

Add aliases to your shell config for the commands you type all day:

```bash
alias gs="git status"
alias gc="git commit -m"
alias ll="ls -lah"
alias dev="npm run dev"
```

## A 30-day starter plan

- **Week 1:** touch typing basics, plus Command Palette, Go to File, and multi-cursor. Add five git aliases.
- **Week 2:** Quick Fix, Rename Symbol, Go to Definition, terminal toggle, and `Ctrl+R`.
- **Week 3:** install ripgrep, fzf, and zoxide. Try Monkeytype code mode.
- **Week 4:** save your dotfiles to a git repo, add a few editor snippets.

Learn one new shortcut a day and one new CLI tool a week. Accept that you will feel slower for a bit. That dip is the muscle memory forming.

Next: configure and personalize with [settings](/docs/settings).

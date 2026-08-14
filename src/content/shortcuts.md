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

## Two ways the CLI draws to your terminal

Half of the shortcuts above behave differently depending on which renderer you are running, so it is worth knowing which one you have. Run `/tui` with no argument and it prints the answer.

- **Classic renderer.** Claude Code writes into your terminal's normal scrollback, the way any command does. Your terminal's own search (`Cmd+F`, tmux copy mode) works, and so does native click and drag to copy.
- **Fullscreen rendering.** Claude Code takes over the drawing surface, the way `vim` or `htop` does, using the alternate screen buffer. Switch with `/tui fullscreen`, and back with `/tui default`. The name is about how it draws, not about maximizing your window: it works at any size.

Which one you get by default depends on when you started. If you first used Claude Code on or after 6 May 2026 you are in fullscreen already. If you started earlier you kept the classic renderer.

What fullscreen actually buys you, and it is not "less condensed output":

- **No flicker.** Only the cells that changed get redrawn, so the screen stops flashing while tool output streams in.
- **Flat memory in long conversations.** Only the messages currently on screen stay in the render tree, so a four-hour session costs what a four-minute one does. This is the real fix if your terminal gets sluggish late in a session.
- **The input box stops moving.** It stays pinned to the bottom. That is the quickest way to tell which renderer is active.
- **Mouse support.** Scroll wheel, click a suggestion to accept it, click a collapsed tool result to expand it, `Ctrl`-click (or `Cmd`-click on macOS) a URL or file path to open it.
- **Scrollback survives compaction.** You can scroll back to the first message even after several `/compact` runs.

The difference is most visible where the terminal itself is the bottleneck: the VS Code integrated terminal, tmux, and iTerm2.

**The trade-off nobody mentions until it bites.** Your conversation now lives in the alternate screen buffer, so your terminal cannot see it. `Cmd+F` and tmux search find nothing. The recovery is two keys: press `Ctrl+O` for transcript mode, then `[` to dump the whole conversation into your terminal's real scrollback, where native search works again. Inside transcript mode you also get `less`-style keys: `/` to search, `n` and `N` between matches, `{` and `}` to jump between prompts, `q` to leave.

Mouse capture is the other friction point, because it replaces your terminal's native copy-on-select. Two escape hatches:

- Hold your terminal's override key while dragging for a one-off native selection: `Option` in iTerm2, `Fn` in Terminal.app, `Shift` almost everywhere else.
- Or turn capture off permanently and keep the flicker-free rendering: `CLAUDE_CODE_DISABLE_MOUSE=1`.

A few more knobs worth knowing: `/focus` collapses the view to your last prompt, a one-line tool summary and the final response (fullscreen only). `/scroll-speed` fixes a mouse wheel that feels glacial, which is common in the VS Code terminal because it sends exactly one event per notch. And in tmux you need `set -g mouse on` or wheel events never reach Claude Code at all.

Fullscreen is a research preview. If something renders wrong, `/tui default` puts you back.

## Terminal or the editor extension?

Both exist and both are the same engine, so this is genuinely a preference rather than a capability question. The practical answer most people land on: keep your editor open for reading code, and drive Claude from the terminal.

The reason is usually `Shift+Tab`. Once you can cycle permission modes from the keyboard, plan mode and accept-edits mode are one key away, and the chat panel stops offering anything the terminal does not. The terminal also composes with everything else you already have: pipes, `!` shell commands, tmux, ssh into a box.

The honest case for the extension is inline diffs against the file you are looking at, and that is a real thing to want. It is just a smaller thing than the mode switching.

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

**Official links:** [Fullscreen rendering](https://code.claude.com/docs/en/fullscreen) · [Commands reference](https://code.claude.com/docs/en/commands) · [Keybindings](https://code.claude.com/docs/en/keybindings)

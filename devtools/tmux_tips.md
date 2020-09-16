# tmux

> Global

```
tmux kill-server

tmux info

tmux list-commands

tmux source-file ~/.tmux.conf
```

> Prefix key: `ctrl-b`



> Session Manager

```bash
# 创建一个名为`demo`的session
tmux new -s demo

tmux ls

tmux attach -t demo

tmux kill-session -t demo

tmux detach

tmux switch -t demo2

tmux reaname-session -t demo demo3
```

> Window Manager

```
tmux split-window

tmux split-window -h
```

```
Ctrl+b c：创建一个新窗口，状态栏会显示多个窗口的信息。
Ctrl+b p：切换到上一个窗口（按照状态栏上的顺序）。
Ctrl+b n：切换到下一个窗口。
Ctrl+b <number>：切换到指定编号的窗口，其中的<number>是状态栏上的窗口编号。
Ctrl+b w：从列表中选择窗口。
Ctrl+b ,：窗口重命名。
```

> Pane Manager

```
%: |
": -
arrow: 移动光标到其他Pane
x: Close Pane
```


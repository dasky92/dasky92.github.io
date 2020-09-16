

# VIM TIPS


## Get Help

`:h vimtutor`, you can get tutorial from vim by yourself.

Of course, you can use `:h *` and click `<tab>`, it will complete commands.

### Technical Term Explanation

- C : Ctrl
- M : Alt
- S : Shift
- CR: Enter

## NORMAL MODE

> In this mode, any `alpha` is shortcut. These commands will improve your input efficiency.

> NORMAL command law: `Action Region`

For Example:

1. `d2w`: `delete` until second word.

    `2w`: Region (from current cursor to 2 word).
    `d` : delete (Action).

2. `d0`: `delete` to start of the line.

    `0`: Region (from current cursor to start of line).
    `d` : delete (Action).

3. `5yy`: `copy` the following 5 lines (including current line).

    `yy`: `copy` current line.
    `5`: `copy` 5 times.

### Action

NORMAL key | Explain
:---: | :---
a | `append` the `cursor`
A | `append` the `end` of the `line`
i | `insert` the `cursor`
I| `insert` the `start` of the `line`
o | move to the `above` line of the current `line`
O | move to the `folloing` line of the current `line`
y | `yank`, `copy`
yy | `copy` the current line
p | `paste`
d | `delete` `word,line...`
dd | `delete` the current line
x | `delete` the cursor
c | `change` the `word...`
C | `change` to the `end` of the `line`

### Region(Move)

> Region, from cursor to the move. So `Move` is `Region`.

#### Cursor Move

normal key | explain
:----: | :-----
h | cursor move to `left`
l | cursor move to `right`
j | curosr move to `up`
k | cursor move to `down`

#### Word Move

NORMAL key | explain
:---: | :---
w | move to `start` of `word`
e | move to `end` of `word`
b | move to `begin` of `word` reverse

#### Line Move

NORMAL key | explain
:---: | :---
0, ^ | move to `start` of `line`
E, $ | move to `end` of `line`


#### Search Move

NORMAL key | explain
:---: | :---
f | `search` forward(cursor in the dest)
F | `search` backward
t | `search` till(cursor before the dest)
T | `search` till backward

### Screen Move

|ShortCut | Explain|
| :------: | :------------ |
| \<C-d\> | `down ` half of screen|
| \<C-u\> | `up ` half of screen|
| H | move to `top(high)` of the screen
| M | move to `mid` of the screen
| L | move to `botton(low)` of the screen

### File Move

NORMAL key | Explain
:---: | :---
gg | move to first line of file
G | move to last line of line
NG | move to num of line(`N`: number)


### Jump File

- `gf`, `<C-w>f`: go to file
- `<C-o>`: return last file


### edit

### text object


text object: ciw,diw,caw,daw,si'",sa'"
vi": select

## System Action

NORMAL key | Explain
:---: | :---
u | `undo` last `command`
\<esc\>, \<C-[\> | into `NORMAL Mode`
:w | write file, save file
:q | quit
:q! | quit without save
zz | quit
:e | `edit`, `open` filename

## COMMAND MODE

> completation automatic

### windows manager

Ex Mode | Explain
:---: | :---
:split | `split` the window to `up and down`
:vsplit | `split` the window to `left and right`


### tabs manager

Ex Mode | Explain
:---: | :---
:tabs | `tab list`
:tabn, :tabnext | next `tab`
:tabp, :tabprevious | previous `tab`
:tabfirst | first `tab`
:tablast | last `tab`
:tabnew | new `tab`
:tabclose | close `tab`
:tabonly | clos other `tab` expect current tab


### buffers manager

> Be similar with tab.

### Search and Replace



## VISUAL MODE



## VISUAL-BLOCK MODE

> multi line edit.

1. <C-v>, into `VISUAL-BLOCK` mode.
2. `do some thing`.
3. <ESC>, trigger, vim will do something for selected multilines.

## Tips

`gu`: `example` -> `EXAMPLE`
`gU`: `EXAMPLE` -> `example`

### mcro - 宏录制

1. `qa`: start the macro `a`.
2. `do some commands`.
3. `q`: end the `a` macro.
4. `@a`: call micro `a`.

### Plugins Mechanism



gU, gu


## Reference

- [GitHub-Learn-Vim](https://github.com/iggredible/Learn-Vim)

## TODO

- \<C-r>
- \<C-e>
- \<C-y>
- {,}
- ]], [[,%,*,v

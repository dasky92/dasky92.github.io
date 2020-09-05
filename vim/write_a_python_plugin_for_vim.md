
## Table Of Contents


<!-- vim-markdown-toc Redcarpet -->

* [check vim support for python](#check-vim-support-for-python)
* [add support for python to control vim](#add-support-for-python-to-control-vim)
    * [python-vim installation](#python-vim-installation)
    * [Simple Usage](#simple-usage)
* [create python-plugins for vim](#create-python-plugins-for-vim)
    * [write in vim script](#write-in-vim-script)
    * [write in python file](#write-in-python-file)
* [script help](#script-help)
* [Reference](#reference)

<!-- vim-markdown-toc -->

## check vim support for python

```vim
" check python
:have(python)

" or pythons
:have(python3)
```


## add support for python to control vim

### python-vim installation

> pip install vim

### Simple Usage

```vim
import vim


vim.command()
vim.eval()

# 访问vim预定义变量
# example: 访问`v:version`,可以这样`vim.vvars("version")`
vim.vvars()

# 访问vim全局变量
# exmple: 访问`s:plugin_enable`,可以这样`vim.vars("plugin_enable")`
vim.vars()

# 访问当前vim对象
vim.current

# 访问vim中的global-option
# example: `vim.options["autochdir"] = True`
vim.options

# 访问vim中的local-option
# example: `vim.current.window.options["number"] = 4`
```


> vim.current当前对象的属性:

```markdown
| 属性                | 含义                       | 类型    |
|---------------------|----------------------------|---------|
| vim.current.line    | The current line (RW)      | String  |
| vim.current.buffer  | The current buffer (RW)    | Buffer  |
| vim.current.window  | The current window (RW)    | Window  |
| vim.current.tabpage | The current tab page (RW)  | TabPage |
| vim.current.range   | The current line range (RO)| Range   | 
```


## create python-plugins for vim

### write in vim script

```vim
# file: demo.vim 

" define Demo function

function! Demo()
" python script start
py << EOF
import vim
for line in vim.current.buffer:
    print line
EOF
" python script end
endfunction

" call function: Demo()
call Demo()
```

### write in python file

```python
# file: demo.py
import vim

def demo():
    for line in vim.current.buffer:
        print line
```

你可以在`vim script`中调用这个demo.py

## script help

> If you have any problem about vim'support for python, could use`:h python*`.

## Reference

[知乎-如何使用Python编写vim 插件](https://zhuanlan.zhihu.com/p/89243293)

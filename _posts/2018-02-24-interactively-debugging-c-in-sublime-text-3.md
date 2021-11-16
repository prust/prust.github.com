---
title: Interactively debugging C in Sublime Text 3
tags: C, gdb, sublime text
author: prust
subhead: Stepping through C code.
---

I had a bit of an journey yesterday getting `gdb`, (an interactive debugger for `gcc`) compiling and working in Sublime Text 3 (via the SublimeGDB package), so I thought I should document the issues I ran into & what finally worked, for others and perhaps my future self.

When I first installed the SublimeGDB package and tried to run it, nothing seemed to happen, so I went to `View -> Show Console` and saw a `the directory is invalid` error. I googled a bit and ended up following the instructions [here](https://webcache.googleusercontent.com/search?q=cache:Sx-cz28zDmMJ:https://forum.sublimetext.com/t/sublime-text-3-build-3047-with-sublimegdb/11356+&cd=2&hl=en&ct=clnk&gl=us) to get it to work: instead of setting the `workingdir` to `${folder:${file}}` or `${folder:${project_path:your_executable_name}}`, as the default settings seem to suggest -- or even `~/...`, I ended up using an absolute path (`"/Users/my-user-name/...`) and specifying these other settings in my `*.sublime-project` file:

```
{
	"folders":
	[
		{
			"path": "."
		}
	],
    "settings": {
		"sublimegdb_commandline": "gdb --interpreter=mi ./beast",
		"sublimegdb_workingdir": "/Users/prust/repos/beast.c",
		"sublimegdb_exec_cmd": "-exec-run",
		"tab_size": 8,
		"sublimegdb_i_know_how_to_use_gdb_thank_you_very_much": true
	}
}
```

Then I got an error about it not being able to find `gdb` (`command not found`, I think), which indicated the `gdb` wasn't installed on my system. I tried installing it via Homebrew (`brew install gdb`), which appeared to work, but when I tried to use it, it failed with [this error](https://stackoverflow.com/questions/48847148/cannot-run-gdb-on-macs-terminal-even-after-codesign):

```
dyld: Library not loaded: /usr/local/opt/mpfr/lib/libmpfr.6.dylib
  Referenced from: /usr/local/bin/gdb
  Reason: image not found
```

This `*.dylib` library wasn't on my machine; I'm guessing (and this is just speculation; I don't actually know how Homebrew works) that Homebrew installed a pre-compiled version of `gdb` which depended on a library that existed on the machine it was compiled with, but did not exist on my machine.

I was able to address this by compiling `gdb` myself -- first, I downloaded & tried to compile the latest version (8.1) from http://ftp.gnu.org/gnu/gdb/. There were 150 warnings and 1 error, which was buried in the warnings & I couldn't find by searching the console because the warnings had the word "error" in them too. Then I downloaded & compiled the previous version (7.12), via running `./configure` and `make` and, in spite of a ton of warnings, it compiled! I installed it (I think via `sudo make install`) and then followed the instructions [here](https://sourceware.org/gdb/wiki/BuildingOnDarwin) to generate a CodeSigning certificate on macOS, to configure the OS to always trust the cert and to sign the newly-installed `gdb` executable with the cert.

So, after over an hour of wrestling, I was finally able to run the `gdb` debugger from Sublime. It ran to the breakpoint and then I was able to use the `step` and `next` commands to walk through the code. It took about 60 seconds to find & fix the bug in [my game](https://github.com/prust/beast.c) (a clone of the classic action/block-pushing game, Beast).

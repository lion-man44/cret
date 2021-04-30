## Cret

cret is simple version manager for [Deno](https://github.com/denoland/deno)

NOTE:
  This doesn't test for windows and linux.
  I'm glad if you could look into that for me.

### Install

```bash
# For mac
wget https://github.com/lion-man44/cret/releases/download/v1.0.0/cret-x86_64-apple-darwin.zip -P /tmp/ && unzip /tmp/cret-x86_64-apple-darwin.zip && mv /tmp/cret /usr/local/bin/cret && rm /tmp/cret-x86_64-apple-darwin.zip
# or
wget https://github.com/lion-man44/cret/releases/download/v1.0.0/cret-aarch64-apple-darwin.zip -P /tmp/ && unzip /tmp/cret-aarch64-apple-darwin.zip && mv /tmp/cret /usr/local/bin/cret && rm /tmp/cret-aarch64-apple-darwin.zip

# For linux
wget https://github.com/lion-man44/cret/releases/download/v1.0.0/cret-x86_64-unknown-linux-gnu.zip -P /tmp/ && unzip /tmp/cret-x86_64-unknown-linux-gnu.zip && mv /tmp/cret /usr/local/bin/cret && rm /tmp/cret-x86_64-unknown-linux-gnu.zip
```

### Usage

This package is very simple.
You need to remember 5 command.

`install`, `uninstall`, `use`, `ls`, `ls-remote`

#### install
Most basic command.
Enter you the version you want.
```bash
cret install

// Enter for you needed version.
// If no problem it should be installed the version.
```

#### uninstall
If you don't need you can remove the version.
```bash
cret uninstall <version>
```

#### use
You can't use the deno version just installed.
So, you need to select the version.
```bash
cret use <version>
```

#### ls
You can see installed versions.
```bash
cret ls
```

#### ls-remote
You can see released versions.
```bash
cret ls-remote
```

This is the place where all the images and scripts are stored. If you are looking for the main application, please visit [here](https://github.com/EXALAB/AnLinux-App)

To open an issue, please visit [here](https://github.com/EXALAB/AnLinux-App/issues)

## Version 2.0

Version 2.0 brings expanded distro support, a universal auto-detecting Arch Linux installer, and a new Alpine Linux bootstrap script.

### Supported Distributions

| Distribution | Installer | Bootstrap |
|---|---|---|
| [Ubuntu](https://www.ubuntu.com/) | ✓ | ✓ |
| [Debian](https://www.debian.org/) | ✓ | ✓ |
| [Kali Linux](https://www.kali.org/) | ✓ | ✓ |
| [Parrot Security OS](https://www.parrotsec.org/) | ✓ | ✓ |
| [BackBox](https://www.backbox.org) | ✓ | ✓ |
| [Alpine Linux](https://alpinelinux.org/) | ✓ | ✓ |
| [Arch Linux](https://archlinux.org/) | ✓ | — |
| [Fedora](https://getfedora.org/) | ✓ | — |
| [CentOS Stream](https://www.centos.org/) | ✓ | — |
| [openSUSE](https://www.opensuse.org/) | ✓ | — |
| [Void Linux](https://voidlinux.org/) | ✓ | — |
| [NetHunter](https://www.kali.org/kali-linux-nethunter/) | ✓ | — |

## Bootstrapping System

Note: Only [Ubuntu](https://www.ubuntu.com/), [Debian](https://www.debian.org/), [Kali](https://www.kali.org/), [Parrot Security OS](https://www.parrotsec.org/), [BackBox](https://www.backbox.org), and [Alpine Linux](https://alpinelinux.org/) are bootstrapped using the script. Others use official images without modification.

Scripts located at Scripts/Bootstrap are used to bootstrap the system.

You will need to install some packages first:

**For Debian/Ubuntu-based distros:**
> sudo apt-get install qemu-user-static debian-archive-keyring debootstrap

**For Alpine Linux:**
> sudo apt-get install wget

Then go to [Bootstrap](https://github.com/EXALAB/Anlinux-Resources/tree/master/Scripts/Bootstrap) and download the bootstrap.sh script for your chosen distro. (It is important to follow any instructions before running bootstrap.sh if there are any.)

To bootstrap a system, simply run:

> ./bootstrap.sh architecture /path/to/bootstrap
   
For example: 

> ./bootstrap.sh armhf /home/user/ubuntu/armhf

### Alpine Linux Bootstrap Example

> ./bootstrap.sh aarch64 /home/user/alpine/aarch64

Supported Alpine architectures: `x86`, `x86_64`, `armhf`, `aarch64`, `ppc64le`, `s390x`, `riscv64`

### Arch Linux Universal Installer

The universal Arch Linux installer (`Scripts/Installer/Arch/arch.sh`) automatically detects your device architecture (aarch64, armv7, x86_64, i686) and downloads the correct rootfs.

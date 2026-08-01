This is the place where all the images and scripts are stored. If you are looking for the main application, please visit [here](https://github.com/EXALAB/AnLinux-App)

To open an issue, please visit [here](https://github.com/EXALAB/AnLinux-App/issues)

## Bootstrapping System

Note: Only [Ubuntu](https://www.ubuntu.com/), [Debian](https://www.debian.org/), [Kali](https://www.kali.org/), [Parrot Security OS](https://www.parrotsec.org/), [BackBox](https://www.backbox.org) are bootstrapped using the script; others are official images without modification.

Scripts located at `Scripts/Bootstrap` are used to bootstrap the system.

You will need to install some packages first:

```bash
sudo apt-get install qemu-user-static debian-archive-keyring debootstrap
```

Then go to [Bootstrap](https://github.com/EXALAB/AnLinux-Resources/tree/master/Scripts/Bootstrap) and download the `bootstrap.sh` script. (Follow any instructions in that directory before running the script.)

To bootstrap a system, run:

```bash
./bootstrap.sh <architecture> /path/to/bootstrap
```

Example:

```bash
./bootstrap.sh armhf /home/user/ubuntu/armhf
```

---

## Dubkami

**Dubkami** is an AI-powered dubbing and localization platform for Indian anime and video content. It automates the dubbing pipeline from upload through final export, supporting multiple languages with per-speaker voice synthesis.

See the [Dubkami documentation](Dubkami/README.md) for the full master blueprint, execution schedule, and task board.

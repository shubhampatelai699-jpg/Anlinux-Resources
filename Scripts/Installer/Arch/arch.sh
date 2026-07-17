#!/data/data/com.termux/files/usr/bin/bash
folder=arch-fs
if [ -d "$folder" ]; then
	first=1
	echo "skipping downloading"
fi

if [ "$first" != 1 ];then
	echo "Download Rootfs, this may take a while base on your internet speed."
	case `dpkg --print-architecture` in
	aarch64)
		archtype="arm"
		archurl="aarch64"
		tarball="arch-rootfs.tar.gz"
		rootfsurl="http://os.archlinuxarm.org/os/ArchLinuxARM-${archurl}-latest.tar.gz" ;;
	arm)
		archtype="arm"
		archurl="armv7"
		tarball="arch-rootfs.tar.gz"
		rootfsurl="http://os.archlinuxarm.org/os/ArchLinuxARM-${archurl}-latest.tar.gz" ;;
	amd64|x86_64)
		archtype="x86"
		archurl="x86_64"
		tarball="arch-rootfs.tar.zst"
		rootfsurl="https://mirror.arizona.edu/archlinux/iso/latest/archlinux-bootstrap-x86_64.tar.zst" ;;
	i*86|x86)
		archtype="x86"
		archurl="i686"
		tarball="arch-rootfs.tar.zst"
		rootfsurl="https://mirror.arizona.edu/archlinux/iso/latest/archlinux-bootstrap-i686.tar.zst" ;;
	*)
		echo "unknown architecture"; exit 1 ;;
	esac

	if [ ! -f $tarball ]; then
		wget "$rootfsurl" -O $tarball
	fi
	cur=`pwd`
	mkdir -p "$folder"
	cd "$folder"
	echo "Decompressing Rootfs, please be patient."
	if [ "$tarball" = "arch-rootfs.tar.zst" ]; then
		proot --link2symlink tar --zstd -xf ${cur}/${tarball}||:
	else
		proot --link2symlink tar -xf ${cur}/${tarball}||:
	fi
	cd "$cur"
fi
mkdir -p arch-binds
mkdir -p arch-fs/tmp
bin=start-arch.sh
echo "writing launch script"
cat > $bin <<- EOM
#!/bin/bash
echo " "
echo " "
echo " "
echo "If you are first time starting Arch Linux, run: chmod 755 additional.sh && ./additional.sh"
echo "This will fix pacman-key and network issues."
echo " "
echo " "
echo " "
cd \$(dirname \$0)
pulseaudio --start
## For rooted user: pulseaudio --start --system
## unset LD_PRELOAD in case termux-exec is installed
unset LD_PRELOAD
command="proot"
command+=" --link2symlink"
command+=" -0"
command+=" -r $folder"
if [ -n "\$(ls -A arch-binds)" ]; then
    for f in arch-binds/* ;do
      . \$f
    done
fi
command+=" -b /dev"
command+=" -b /proc"
command+=" -b arch-fs/root:/dev/shm"
## uncomment the following line to have access to the home directory of termux
#command+=" -b /data/data/com.termux/files/home:/root"
## uncomment the following line to mount /sdcard directly to /
#command+=" -b /sdcard"
command+=" -w /root"
command+=" /usr/bin/env -i"
command+=" HOME=/root"
command+=" PATH=/usr/local/sbin:/usr/local/bin:/bin:/usr/bin:/sbin:/usr/sbin:/usr/games:/usr/local/games"
command+=" TERM=\$TERM"
command+=" LANG=C.UTF-8"
command+=" /bin/bash --login"
com="\$@"
if [ -z "\$1" ];then
    exec \$command
else
    \$command -c "\$com"
fi
EOM

echo "Setting up pulseaudio so you can have music in distro."

pkg install pulseaudio -y

if grep -q "anonymous" ~/../usr/etc/pulse/default.pa;then
    echo "module already present"
else
    echo "load-module module-native-protocol-tcp auth-ip-acl=127.0.0.1 auth-anonymous=1" >> ~/../usr/etc/pulse/default.pa
fi

echo "exit-idle-time = -1" >> ~/../usr/etc/pulse/daemon.conf
echo "Modified pulseaudio timeout to infinite"
echo "autospawn = no" >> ~/../usr/etc/pulse/client.conf
echo "Disabled pulseaudio autospawn"
echo "export PULSE_SERVER=127.0.0.1" >> arch-fs/etc/profile
echo "Setting Pulseaudio server to 127.0.0.1"

echo "fixing shebang of $bin"
termux-fix-shebang $bin
echo "making $bin executable"
chmod +x $bin
echo "removing image for some space"
rm $tarball
echo "You can now launch Arch Linux with the ./${bin} script"
echo "Preparing additional component for the first time, please wait..."

# Fetch arch-specific helper files
if [ "$archtype" = "arm" ]; then
    subdir="armhf"
    populate_arg="archlinuxarm"
else
    subdir="amd64"
    populate_arg="archlinux"
fi
wget "https://raw.githubusercontent.com/EXALAB/AnLinux-Resources/master/Scripts/Installer/Arch/${subdir}/resolv.conf" -P arch-fs/root
wget "https://raw.githubusercontent.com/EXALAB/AnLinux-Resources/master/Scripts/Installer/Arch/${subdir}/additional.sh" -P arch-fs/root
echo "done"

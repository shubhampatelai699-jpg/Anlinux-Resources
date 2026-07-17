#!/usr/bin/env bash

# Bootstrap Alpine Linux minimal rootfs
# Usage: ./bootstrap.sh <architecture> <output-directory>
# Supported architectures: x86, x86_64, armhf, aarch64, ppc64le, s390x, riscv64

ARCH=$1
OUTDIR=$2
ALPINE_VERSION="3.22.2"
MIRROR="https://dl-cdn.alpinelinux.org/alpine"

if [ -z "$ARCH" ] || [ -z "$OUTDIR" ]; then
  echo "Usage: $0 <architecture> <output-directory>"
  echo "  Supported architectures: x86 x86_64 armhf aarch64 ppc64le s390x riscv64"
  exit 1
fi

case "$ARCH" in
  x86|x86_64|armhf|aarch64|ppc64le|s390x|riscv64) ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1 ;;
esac

TARBALL="alpine-minirootfs-${ALPINE_VERSION}-${ARCH}.tar.gz"
DOWNLOAD_URL="${MIRROR}/v${ALPINE_VERSION%.*}/releases/${ARCH}/${TARBALL}"

echo "==> Bootstrapping Alpine Linux ${ALPINE_VERSION} for ${ARCH}"

rm -rf "$OUTDIR"
mkdir -p "$OUTDIR"

echo "==> Downloading ${TARBALL}"
wget -q --show-progress "$DOWNLOAD_URL" -O "/tmp/${TARBALL}"

echo "==> Extracting rootfs"
tar -xzf "/tmp/${TARBALL}" -C "$OUTDIR"
rm -f "/tmp/${TARBALL}"

echo "==> Setting up DNS"
echo "nameserver 8.8.8.8"  > "$OUTDIR/etc/resolv.conf"
echo "nameserver 8.8.4.4" >> "$OUTDIR/etc/resolv.conf"

echo "==> Setting hostname"
echo "AnLinux-Alpine" > "$OUTDIR/etc/hostname"

echo "==> Configuring APK repositories"
cat > "$OUTDIR/etc/apk/repositories" <<EOF
${MIRROR}/v${ALPINE_VERSION%.*}/main
${MIRROR}/v${ALPINE_VERSION%.*}/community
EOF

echo "==> Running initial apk update and upgrade"
chroot "$OUTDIR" /bin/sh -c "apk update && apk upgrade"

echo "==> Cleaning up apk cache"
rm -rf "$OUTDIR/var/cache/apk"/*

echo "==> Setting permissions"
chmod 777 -R "$OUTDIR"

echo "==> Creating rootfs archive"
cd "$OUTDIR"
rm -rf ../alpine-rootfs-${ARCH}.tar.xz
rm -rf dev/*
XZ_OPT=-9 tar -cJvf ../alpine-rootfs-${ARCH}.tar.xz ./*

echo "==> Done. Rootfs saved to: $(dirname $OUTDIR)/alpine-rootfs-${ARCH}.tar.xz"

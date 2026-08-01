---
name: anlinux-resources-maintainer
description: Maintain AnLinux resource scripts safely and consistently. Use this skill when adding or updating installer, uninstaller, bootstrap, or desktop-environment scripts in this repository.
---

# AnLinux Resources Maintainer

Use this skill when working in `Scripts/`, `Rootfs/`, `Tools/`, or related resource files for AnLinux.

## Goals

- Keep changes minimal and focused on the requested distribution or environment.
- Preserve existing shell style and behavior used across neighboring scripts.
- Avoid introducing breaking command changes for Termux/proot workflows.

## Required checks

1. Touch only files needed for the specific request.
2. Verify script paths, filenames, and download URLs match existing patterns.
3. Keep launch/uninstall script naming consistent (`start-*.sh`, `UNI-*.sh`) when relevant.
4. Do a quick safety check for destructive commands and accidental credential leaks.

## Output expectations

- Provide a concise summary of changed files.
- Mention manual verification steps a maintainer can run in Termux.

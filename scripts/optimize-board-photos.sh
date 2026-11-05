#!/usr/bin/env bash
# Makes a shrunk .webp copy of every .jpg/.jpeg/.png under assets/images/board/
# (next to the original, which is kept) and updates the matching path in
# constants/board.ts. Photos that already have a .webp are skipped — delete the
# .webp to redo one.
#
#   Portraits / photoshoots: shorter side capped at 800px
#   Group photos (filename starts with "board"): shorter side capped at 1200px
#   Smaller images are never upscaled.
#
# Usage:  ./scripts/optimize-board-photos.sh
# Needs macOS (uses sips) and cwebp:  brew install webp
set -euo pipefail
cd "$(dirname "$0")/.."

command -v cwebp >/dev/null || { echo "cwebp not found — run: brew install webp" >&2; exit 1; }

DATA=constants/board.ts
count=0
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# prints the JPEG EXIF orientation (1–8), or 1 if there isn't one
exif_orientation() {
  /usr/bin/python3 - "$1" <<'PY'
import struct, sys
d = open(sys.argv[1], "rb").read(256 * 1024)
o = 1
i = d.find(b"Exif\x00\x00")
if d[:2] == b"\xff\xd8" and i != -1:
    t = d[i + 6:]
    e = "<" if t[:2] == b"II" else ">"
    try:
        ifd = struct.unpack(e + "I", t[4:8])[0]
        for k in range(struct.unpack(e + "H", t[ifd:ifd + 2])[0]):
            p = ifd + 2 + 12 * k
            if struct.unpack(e + "H", t[p:p + 2])[0] == 0x0112:
                o = struct.unpack(e + "H", t[p + 8:p + 10])[0]
                break
    except struct.error:
        pass
print(o)
PY
}

while IFS= read -r -d '' src; do
  out="${src%.*}.webp"
  [ -f "$out" ] && continue
  name="$(basename "$src")"
  case "$name" in board*) max=1200 ;; *) max=800 ;; esac

  # Phone photos are often stored sideways with an EXIF "rotate me" tag. Browsers
  # honor it for .jpg but cwebp drops it, so bake the rotation into a temp copy.
  input="$src"
  case "$(exif_orientation "$src")" in
    3) deg=180 ;; 6) deg=90 ;; 8) deg=270 ;; *) deg=0 ;;
  esac
  if [ "$deg" -ne 0 ]; then
    input="$TMP/rotated.${src##*.}"
    sips -r "$deg" "$src" --out "$input" >/dev/null
  fi

  w=$(sips -g pixelWidth "$input" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$input" | awk '/pixelHeight/{print $2}')

  resize=()
  if [ "$w" -le "$h" ]; then
    [ "$w" -gt "$max" ] && resize=(-resize "$max" 0)
  else
    [ "$h" -gt "$max" ] && resize=(-resize 0 "$max")
  fi

  cwebp -quiet -q 80 -metadata none ${resize[@]+"${resize[@]}"} "$input" -o "$out"
  before=$(du -k "$src" | cut -f1)
  after=$(du -k "$out" | cut -f1)

  # point constants/board.ts at the new file
  sed -i '' "s#${src}\"#${out}\"#g" "$DATA"

  echo "  ${src} → $(basename "$out")  (${before}K → ${after}K)"
  count=$((count + 1))
done < <(find assets/images/board -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0)

if [ "$count" -eq 0 ]; then
  echo "Nothing to convert — every board photo already has a .webp."
else
  echo "Converted $count image(s)."
fi

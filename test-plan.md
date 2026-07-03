# party-wall PR #1 test plan

App: Next.js dev server on http://localhost:3000, filesystem storage in `data/` (empty at start).

## Test 1: It should upload a photo from the guest page and confirm
1. Open `/upload`. Assert: title "Happy 3rd Birthday!", dashed photo picker, disabled "Send it to the wall" button.
2. Pick `/tmp/photo-red.jpg`, caption "Cake time!", name "Devin", memory month 2025-09. Assert: image preview visible, submit enabled.
3. Submit. Assert: confetti + "It's on the wall! 🎈" and an "Add another" button. Fail if error text or unchanged form.

## Test 2: It should show new photos live on the wall with celebration
1. Open `/wall` with 1 photo present. Assert: red "CAKE TIME" photo full screen with caption "Cake time! — Devin", counter "1 photo 🎈".
2. While wall is open, upload `/tmp/photo-blue.jpg` (caption "First steps", month 2025-11) from `/upload` in a second tab.
3. Return to wall within ~13s. Assert: blue "FIRST STEPS" photo shown with confetti burst, counter now "2 photos 🎈". Fail if counter stays 1 or the new photo never appears without reload.

## Test 3: It should auto-build the timeline grouped by month
1. Upload `/tmp/photo-green.jpg` (caption "Park day", month 2026-03).
2. Open `/timeline`. Assert: title "Her Year in Three"; three month sections in chronological order: "September 2025" (red photo), "November 2025" (blue), "March 2026" (green); each with its caption. Fail if photos lumped in one group or ordered incorrectly.

## Test 4 (API guard): It should reject non-image uploads
- `curl -F "photo=@/etc/hostname;type=text/plain" http://localhost:3000/api/photos` → expect HTTP 400 `{"error":"Unsupported image type"}`.

## Test 5 (home page): QR + navigation
- Open `/`. Assert: QR code rendered (white card), three buttons: "Open the Wall (TV)", "Her Year in Three", "Add a Photo".

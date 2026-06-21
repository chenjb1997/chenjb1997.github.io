# Footprint Photo Loading Guide

Use this file as the standing contract when adding user-supplied footprint photos.

## Source Of Truth

- UI/data file: `src/pages/Footprint.tsx`
- Static images: `public/footprint/`
- Browser route: `/footprint`

## Rules

- Preserve the user-provided order and map files to locations exactly as described in the latest message.
- Do not rotate, auto-orient, crop, compress, rename by EXIF, or otherwise transform images. Copy files as-is.
- Top-level entries in `Footprint.tsx` should follow a travel-perception unit (`旅行感知单元`) rule: prefer cities/localities, but do not merge places mechanically by administrative city if they feel like distinct travel destinations.
- A travel-perception unit can be a city, district, island, mountain, lake, pass, scenic area, or other place that a traveler would naturally treat as its own stop. Examples: Shunde, Conghua, Zengcheng, Qinghai Lake, Yumen Pass, and Dunhuang Yardang can be independent entries even though they may belong administratively to a larger city or region.
- Before adding a new top-level entry, check whether the user-provided label is a meaningful travel-perception unit. If it is only a landmark, temple, shrine, neighborhood, campus, venue, or filming location inside an existing unit, do not create a top-level entry for that label.
- Put smaller specifics in captions or notes instead. Examples: Kiyomizu-dera and Rurikoin belong under Kyoto; Shimokitazawa and Suga Shrine belong under Tokyo; Songshan Lake European Town belongs under Dongguan.
- If a city is not already present in `Footprint.tsx`, add a new city entry.
- Add landmark/building names in captions when identifiable.
- For repeated photos in an existing city, append new `city-slug-XX.jpg` files using the next available number.
- For a new city, use `city-slug-01.jpg`, `city-slug-02.jpg`, etc.
- Keep captions short, factual, and warm. Prefer bilingual `caption` and `zhCaption` to match existing data.
- For speed, after each batch only check that the number of newly added photos is correct, and that a new place name appears on the page/data when a new place is needed.
- Do not compute or compare file hashes unless the user explicitly asks for it.

## Batch Workflow

1. Inspect the current highest image number for each target city in `public/footprint/`.
2. Copy source images into `public/footprint/` with the naming convention above.
3. Update `src/pages/Footprint.tsx`:
   - Append to existing city `photos` when the city exists.
   - Add a new place object when the target is a missing travel-perception unit.
   - Do not add a top-level object for smaller landmarks, neighborhoods, venues, or filming locations inside an existing unit.
4. Verify:
   - Count the newly added image files/references and confirm the count matches the user's request.
   - If a new city/place was added, confirm the new place name/id appears in `Footprint.tsx`.
   - Open or refresh `http://127.0.0.1:4173/footprint` if preview is requested or already in use.

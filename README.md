**TLDR**: it's a small, good-looking file explorer with search and a view of
what's eating your storage.

If you have an issue, just open an [Issue](../../issues)!

## What it does

- **Browse.** Walk through your phone's folders, with quick places for
  Downloads, Camera, Documents and friends (and your SD card, if you have
  one). A path bar on top shows where you are; tap any part of it to jump back.
  Pictures show a small preview.
- **Open anything.** Tap a file and it opens in whichever app Android thinks
  is right for it. If more than one fits, Android asks you.
- **Search.** Type in the search box and it looks through the current folder
  and everything below it. Accents and capitals don't matter, and every word
  you type has to be in the name ("trip 2026" finds "2026 summer trip.jpg").
- **Storage.** The second tab shows how full your phone is, and, if you tap
  **Analyze**, what is using the space: by type (images, videos, audio...) and
  by biggest folders. Tap a folder to jump to it.
- **Languages.** Settings > Language: "System default" follows the phone (and
  uses English when the phone's language isn't available), or pick one.
- **Hidden files.** Files and folders whose name starts with a dot are kept
  out of the list and the search. Settings > Files > **Show hidden files**
  (off by default) brings them back.
- **Haptics.** Optional vibrations when you tap things (off by default), where
  each moment has its own switch.
- **Make it yours.** A few ready-made themes, or choose each color yourself.
  Themes can be shared as text.
- **Big screens too.** Tablets and landscape get a multi-column list (in
  theory, don't have a Tablet to test it).

## What it doesn't do

- It only reads. It never moves, renames, deletes or changes your files.
- No accounts, no sync, no cloud, nothing leaves your phone.
- Android only for now. There's no iPhone version available.
- On Android 11 and newer it needs the **All files access** permission to see
  your folders. The app asks for it the first time; it's one switch in the
  system settings.
- The Storage tab only counts what the app is allowed to read, so its numbers
  can be a little different from Android's own.

## Getting it on your phone

The easy way is [Obtainium](https://obtainium.imranr.dev/), which installs
apps straight from GitHub and tells you when there's an update.

1. Install Obtainium.
2. Open it, tap **Add App**, and paste the address of this very page.
3. Tap **Add**, then install. Android will ask you to allow installing apps
   from Obtainium. Say yes.

Prefer to do it by hand? Open the [Releases](../../releases) page, download
the latest `.apk` and open it on your phone.

## For tinkerers

It's an [Expo](https://expo.dev) app. `npm install`, then `npm start` to run
it, and `npm run check` to run the type check and the tests. It needs a
development build (or the APK), not Expo Go, because of the storage
permission.

## Credits

[Ionicons](https://ionic.io/ionicons) by [@ionic](https://ionic.io/).

Made by [@knownyurimaxxer](https://www.tumblr.com/knownyurimaxxer).

If you ever feel like it, I have a [Ko-fi](https://ko-fi.com/knownyurimaxxer)!

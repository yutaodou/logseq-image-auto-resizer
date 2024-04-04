## If you ❤ what i'm doing - you can support my work! ☕

<a href="https://www.buymeacoffee.com/dytes"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=yutaodou&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff" /></a>


<h1 align="center">Logseq image auto resizer</h1>
<p align="center">
    <a href="https://github.com/yutaodou/logseq-image-auto-resizer">
        <img src="https://raw.githubusercontent.com/yutaodou/logseq-image-auto-resizer/main/icon.png" alt="logo" width="128" height="128" />
    </a>
</p>

A plugin to automatically resize image to your preferred size

## Usage
By default, resizer sets image default width & height to 800px. To change the default size, go to `Settings -> Plugins -> Logseq image auto resizer`.

## Development
1.  Fork the repo.
2.  Install dependencies and build the dev version:

        yarn install && yarn run dev

3.  Open Logseq and navigate to the plugins dashboard: `t` `p`.
4.  Click `Load unpacked plugin button`, then select the repo directory to load it.

After every change you make in the code:
1.  Rebuild the dev version:

        yarn run dev

2.  Open Logseq and navigate to the plugins dashboard: `t` `p`.
3.  Find the plugin and click on "Reload".
4.  Ignore the error messages about keyboard shortcut conflicts.

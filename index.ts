import "@logseq/libs";
import { BlockEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { isSized, parseMarkdownImage } from "./src/markdownImage";

const settings: SettingSchemaDesc[] = [
  {
    key: "defaultWidth",
    description: "Default image width",
    type: "number",
    default: 0,
    title: "Default image width",
  },
  {
    key: "defaultHeight",
    description: "Default image height",
    type: "number",
    default: 0,
    title: "Default image height",
  },
];
logseq.useSettingsSchema(settings);

var lastSavedBlock = null;

const resizeImage = (block: BlockEntity) => {
  if (!logseq.settings?.defaultWidth && !logseq.settings?.defaultHeight) {
    return;
  }

  const dimension = {
    width: logseq.settings?.defaultWidth,
    height: logseq.settings?.defaultHeight,
  };

  const size = Object.entries(dimension)
    .filter(([_, value]) => value)
    .map(([key, value]) => `:${key} ${value}`)
    .join(",");

  console.log(`Resizing block ${block.uuid} with content: ${block.content} to ${size}`);

  var newContent = `${block.content}{${size}}`;
  logseq.Editor.updateBlock(block.uuid, newContent);
};

const main = async () => {
  logseq.DB.onChanged(async (e) => {
    if (e.txMeta?.outlinerOp === "insertBlocks") {
      const block = await logseq.Editor.getBlock(lastSavedBlock);
      const image = parseMarkdownImage(block.content);
      if (!image || isSized(image)) {
        return;
      }

      resizeImage(block);
    } else if (e.txMeta?.outlinerOp === "saveBlock") {
      const block = e.blocks[0];

      const image = parseMarkdownImage(block.content);
      if (image && !isSized(image)) {
        lastSavedBlock = block.uuid;
      }
    }
  });
};
logseq.ready(main).catch(console.error);

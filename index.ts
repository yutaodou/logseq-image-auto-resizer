import "@logseq/libs";
import { BlockEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { isSized, parseMarkdownImage } from "./src/markdownImage";

const DEFAULT_SIZE = 800;

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

var lastSavedImageBlock = null;

const resizeImage = async (block: BlockEntity) => {
  if (!logseq.settings?.defaultWidth && !logseq.settings?.defaultHeight) {
    return;
  }

  const dimension = {
    width: logseq.settings?.defaultWidth || DEFAULT_SIZE,
    height: logseq.settings?.defaultHeight || DEFAULT_SIZE,
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
    if (e.txMeta?.outlinerOp === "insert-blocks") {
      const current = await logseq.Editor.getCurrentBlock();
      if (current?.uuid === lastSavedImageBlock) {
        return;
      }

      const block = await logseq.Editor.getBlock(lastSavedImageBlock);
      if (!block) {
        return;
      }

      const image = parseMarkdownImage(block.content);
      if (!image || isSized(image)) {
        return;
      }

      await resizeImage(block);
    } else if (e.txMeta?.outlinerOp === "save-block") {
      const block = e.blocks[0];

      const image = parseMarkdownImage(block.content);
      if (image && !isSized(image)) {
        lastSavedImageBlock = block.uuid;
      }
    }
  });
};
logseq.ready(main).catch(console.error);

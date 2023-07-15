import "@logseq/libs";
import { BlockEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

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

interface MarkdownImage {
  markdown: string;
  title: string;
  link: string;
  width?: string;
  height?: string;
}

var parseMarkdownImage = (markdown: string): MarkdownImage | null => {
  const regex = /^!\[(.*?)\]\((.*?)\)(\{(.*?)\})?$/;
  const match = markdown.match(regex);
  if (!match) {
    return null;
  }

  const prop = match[3] || "";
  const properties = prop
    .split(":")
    .map((pair) => pair.toLowerCase().trim())
    .reduce((agg, curr) => {
      const [key, value] = curr.split(/\s+/);
      agg[key] = value;
      return agg;
    }, {});

  return {
    markdown: match[0],
    title: match[1],
    link: match[2],
    width: properties["width"],
    height: properties["height"],
  };
};

var lastSavedBlock = null;

const resizeImage = (block: BlockEntity) => {
  console.log(`Resizing block ${block.uuid} with content: ${block.content}`);

  const dimension = {
    width: logseq.settings?.defaultWidth,
    height: logseq.settings?.defaultHeight,
  };

  const size = Object.entries(dimension)
    .filter(([_, value]) => value)
    .map(([key, value]) => `:${key} ${value}`)
    .join(",");

  var newContent = `${block.content}{${size}}`;
  logseq.Editor.updateBlock(block.uuid, newContent);
};

const isSized = (image: MarkdownImage): boolean => {
  return !!image.width || !!image.height;
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

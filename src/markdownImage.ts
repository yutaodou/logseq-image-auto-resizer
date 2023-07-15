export interface MarkdownImage {
  markdown: string;
  title: string;
  link: string;
  width?: string;
  height?: string;
}

export const parseMarkdownImage = (markdown: string): MarkdownImage | null => {
  const regex = /^!\[(.*?)\]\((.*?)\)(\{(.*?)\})?$/;
  const match = markdown.match(regex);
  if (!match) {
    return null;
  }

  const prop = match[4] || "";
  const properties = prop
    .split(",")
    .map((pair) => pair.toLowerCase().trim())
    .reduce((agg, curr) => {
      const [key, value] = curr.split(/\s+/);
      agg[key.slice(1)] = value;
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

export const isSized = (image: MarkdownImage): boolean => {
  return !!image.width || !!image.height;
};

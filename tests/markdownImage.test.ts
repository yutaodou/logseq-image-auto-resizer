import { isSized, parseMarkdownImage } from "../src/markdownImage";
describe("markdownImage", () => {
  it("should parse markdown image", () => {
    var image = parseMarkdownImage("![Screenshot.png](../assets/Screenshot.png)");

    expect(image.markdown).toEqual("![Screenshot.png](../assets/Screenshot.png)");
    expect(image.title).toEqual("Screenshot.png");
    expect(image.link).toEqual("../assets/Screenshot.png");
    expect(image.height).toBeUndefined();
    expect(image.width).toBeUndefined();
  });

  it("should parse markdown image with size", () => {
    var image = parseMarkdownImage("![Screenshot.png](../assets/Screenshot.png){:width 200, :height 300}");

    console.log(JSON.stringify(image));
    expect(image.markdown).toEqual("![Screenshot.png](../assets/Screenshot.png){:width 200, :height 300}");
    expect(image.title).toEqual("Screenshot.png");
    expect(image.link).toEqual("../assets/Screenshot.png");
    expect(image.height).toEqual("300");
    expect(image.width).toEqual("200");
  });

  it("should not return null if not markdown image", () => {
    var image = parseMarkdownImage("[Screenshot.png](../assets/Screenshot.png){:width 200, :height 300}");
    expect(image).toBeNull();

    image = parseMarkdownImage(
      "this looks like one, but not ![Screenshot.png](../assets/Screenshot.png){:width 200, :height 300}"
    );
    expect(image).toBeNull();

    image = parseMarkdownImage("![Screenshot.png](../assets/Screenshot.png){:width 200, :height 300} this too");
    expect(image).toBeNull();
  });

  it("should return true if image is sized", () => {
    const base = {
      markdown: "markdown",
      title: "title",
      link: "link",
    };
    expect(isSized(base)).toBeFalsy();
    expect(isSized({ ...base, width: "100" })).toBeTruthy();
    expect(isSized({ ...base, height: "100" })).toBeTruthy();
    expect(isSized({ ...base, height: "100", width: "100" })).toBeTruthy();
  });
});

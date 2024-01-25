import puppeteer from "puppeteer"


export const getImagesData = async (req, res) => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    await page.goto("https://bloggingguide.com/best-health-and-fitness-blog-examples/", {
        waitUntil: "domcontentloaded",
    });

    const images = await page.evaluate(() => {
        const imageElems = document.querySelectorAll("img");
        const imagesSrcs = []
        for (img of imageElems) {
            imagesSrcs.push({ src: img.getAttribute('src'), width: img.width, height: img.height });
        }

        return imagesSrcs;

    });

    await browser.close();
    res.status(200);
    res.json({ images, length: images.length });
}
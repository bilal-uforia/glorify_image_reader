import puppeteer from "puppeteer"


export const getImagesData = async (req, res) => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    await page.goto("https://www.quicksprout.com/types-of-images-you-should-use-within-your-blog-posts/", {
        waitUntil: "load",
    });

    await page.setViewport({ width: 1440, height: 1024 });


    await autoScroll(page);

    const images = await page.evaluate(() => {
        const imageElems = document.querySelectorAll("img");
        const imagesSrcs = []
        for (img of imageElems) {
            imagesSrcs.push({ image: img.src, width: img.width, height: img.height });
        }

        return imagesSrcs;

    });

    const screenshot = await page.screenshot({
        path: 'screenshot.png',
        fullPage: true
    });

    await browser.close();

    res.status(200);
    res.json({ images, screenshot: Boolean(screenshot), length: images.length });
}

const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0
            let distance = 100
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 150)
        })
    })
}

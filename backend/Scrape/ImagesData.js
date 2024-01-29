import puppeteer from "puppeteer"


export const getImagesData = async (req, res) => {
    let browser = await puppeteer.launch({
        defaultViewport: null
    });
    let page = await browser.newPage();

    await page.goto("https://www.techtarget.com/whatis/definition/weblog", {
        waitUntil: "load",
    });


    await page.setViewport({ width: 1440, height: 867 });

    await autoScroll(page);

    const images = await page.evaluate(() => {
        const imageElems = document.querySelectorAll("img");
        const imagesSrcs = []
        for (img of imageElems) {
            let imgRect = img.getBoundingClientRect();
            imagesSrcs.push({ image: img.src, width: imgRect.width, height: imgRect.height });
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

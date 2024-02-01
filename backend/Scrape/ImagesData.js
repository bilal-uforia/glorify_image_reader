import puppeteer from "puppeteer"


export const getImagesData = async (req, res) => {

    try {
        console.log(req?.body);
        const { url, screen_width, screen_height } = req?.body;

        let browser = await puppeteer.launch();
        let page = await browser.newPage();

        await page.goto(url, {
            waitUntil: "load",
        });


        await page.setViewport({ width: screen_width, height: screen_height });

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
    catch (err) {
        console.log("Errror Occured: ", err);
    }
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

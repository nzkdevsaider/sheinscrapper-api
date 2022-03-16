const { Router } = require('express');
const router = Router();
const cloudscraper = require("cloudscraper");
const cheerio = require("cheerio");

// Funciones

async function getItem(url) {
    const html = await cloudscraper.post(
      "https://try.playwright.tech/service/control/run",
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: "const playwright = require('playwright');\n(async () => {\n    const browser = await playwright['firefox'].launch();\n    const context = await browser.newContext();\n    const page = await context.newPage();\n    await page.goto('"+url+"');\n    const content = await page.content();\n   console.log(content)\n    await browser.close();\n})();",
          language: "javascript",
        }),
      }
    );
    const parsed = JSON.parse(html).output;
    const $ = cheerio.load(parsed);
    const product_name = $(".product-intro__head").children("h1").text().trim();
    const product_price = $(
      "html body div.c-outermost-ctn.j-outermost-ctn div.j-goods-detail-v2 div.goods-detailv2 div.goods-detailv2__media div.goods-detailv2__media-inner div.product-intro div.product-intro__info div.product-intro__info-sticky div.product-intro__head.j-expose__product-intro__head div.product-intro__head-price.j-expose__product-intro__head-price div.original div.from span"
    ).text();
  
    return { name: product_name, price: product_price };
  }


//Raiz
router.get('/shein/', (req, res) => {    
    res.send("shein")
})

router.post("/shein/get-item", (req, res) => {
getItem(req.body.url).then(r => {

    console.log(r);
    res.json({
        "name": r.name,
        "price": r.price,
    })

});


})
 
module.exports = router;
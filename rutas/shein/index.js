const { Router } = require("express");
const router = Router();
const cloudscraper = require("cloudscraper");
const cheerio = require("cheerio");

// Funciones

/* 
API Error Codes

e101 - Item doesn't exist/cannot match this item.
e105 - URL isn't from Shein.
e107 - Cannot retrieve data. (Temporaly disable)

*/
async function getItem(url) {
  let urlRegex = /(https?:\/\/(.+?\.)?shein\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/g;

  if(!url || !url.match(urlRegex)) return { code: "e105", message: "Invalid URL." }

  const html = await cloudscraper.post(
    "https://try.playwright.tech/service/control/run",
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code:
          "const playwright = require('playwright');\n(async () => {\n    const browser = await playwright['firefox'].launch();\n    const context = await browser.newContext();\n    const page = await context.newPage();\n    await page.goto('" +
          url +
          "');\n    const content = await page.content();\n   console.log(content)\n    await browser.close();\n})();",
        language: "javascript",
      }),
    }
  );
  
  if(!html) return { code: "e107", message: "Server error." }
  
  const parsed = JSON.parse(html).output;
  const $ = cheerio.load(parsed);

  // Basic Info
  const product_name = $(".product-intro__head").children("h1").text().trim();
  const product_price = $(
    "html body div.c-outermost-ctn.j-outermost-ctn div.j-goods-detail-v2 div.goods-detailv2 div.goods-detailv2__media div.goods-detailv2__media-inner div.product-intro div.product-intro__info div.product-intro__info-sticky div.product-intro__head.j-expose__product-intro__head div.product-intro__head-price.j-expose__product-intro__head-price div.original div.from span"
  ).text();
  const product_image = $(
    "html body div.c-outermost-ctn.j-outermost-ctn div.j-goods-detail-v2 div.goods-detailv2 div.goods-detailv2__media div.goods-detailv2__media-inner div.product-intro div.product-intro__galleryWrap div.product-intro__gallery div.product-intro__main div.swiper-container div.swiper-slide > img"
  ).attr("src");
  let product_sku = $(".product-intro__head-sku").text();
  product_sku = product_sku.replace("SKU: ", "");

  if(!product_name || !product_price) return { code: "e101", message: "Item not found." }

  return {
    generalInfo: {
      name: product_name,
      price: product_price,
      image: product_image,
      sku: product_sku,
      url,
    },
  };
}

//Raiz
router.get("/shein/", (req, res) => {
  res.send("shein");
});

router.post("/shein/get-item", (req, res) => {
  getItem(req.body.url).then((r) => {
    res.json(r);
  });
});

module.exports = router;

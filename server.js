const express = require("express");
const path = require("path");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;
const UPSTREAM_HOST = "skilletmenuswebapi.joeyrestaurants.com";

app.get("/api/Companies/:storeId/BeerMenus", (req, res) => {
  const storeId = req.params.storeId.replace(/[^A-Za-z0-9]/g, "");
  const apiKey = req.headers["apikey"] || req.query.apikey || "";

  const upstream = https.request(
    {
      hostname: UPSTREAM_HOST,
      path: `/api/Companies/${storeId}/BeerMenus`,
      method: "GET",
      headers: {
        APIKey: apiKey,
        Accept: "application/json",
        Origin: "https://beerboard.localpubliceatery.com",
        Referer: "https://beerboard.localpubliceatery.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
    },
    (r) => {
      res.status(r.statusCode || 502);
      res.setHeader("Content-Type", r.headers["content-type"] || "application/json");
      res.setHeader("Cache-Control", "no-store");
      r.pipe(res);
    }
  );

  upstream.on("error", (err) => {
    console.error("Upstream error:", err.message);
    if (!res.headersSent) res.status(502).json({ error: "upstream_unreachable", detail: err.message });
  });

  upstream.end();
});

app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Beerboard running on :${PORT}`));

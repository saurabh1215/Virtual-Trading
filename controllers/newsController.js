const Axios = require("axios");

exports.getNewsData = async (req, res) => {
  try {
    console.log("API is Called");
    const token = process.env.NEWS_API_KEY;
    if (!token) throw new Error("No News API Key");
    const url2 = `https://newsapi.org/v2/everything?q=stocks+OR+finance+OR+market+OR+economy&sortBy=publishedAt&apiKey=${token}&language=en&pageSize=9&page=${req.params.page}`;
    const response2 = await Axios.get(url2);

    const destructure_data = (response2.data.articles || []).map(({ url, title, description, urlToImage, source }) => ({
      url: url || "https://finance.yahoo.com",
      headline: title || description || "Financial market updates and stock market performance summary.",
      source: source ? source.name : "Financial News",
      image: urlToImage || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500"
    }));

    return res.status(200).json({ status: "success", data: destructure_data, });


  } catch (error) {
    const fallbackNews = [
      {
        url: "https://finance.yahoo.com",
        headline: "Tech stocks rally as quarterly earnings exceed analyst expectations across key growth sectors.",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500"
      },
      {
        url: "https://finance.yahoo.com",
        headline: "Federal Reserve interest rate commentary drives market volatility and investor portfolio rebalancing.",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500"
      },
      {
        url: "https://finance.yahoo.com",
        headline: "Global stock markets reach milestone highs following robust retail sales and employment numbers.",
        image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=500"
      }
    ];
    return res.status(200).json({ status: "success", data: fallbackNews, });
  }
};

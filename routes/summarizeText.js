const { HfInference } = require("@huggingface/inference");
require("dotenv").config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const summarizeTextHandler = async (req, res) => {
	try {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			const { input } = JSON.parse(body);
			const result = await hf.summarization({
				model: "facebook/bart-large-cnn",
				inputs: input,
			});

			res.writeHead(200, { "Content-Type": "application/json" });
			return res.end(JSON.stringify({ summary: result.summary_text }));
		});
	} catch (error) {
		console.error("Error generating summary:", error);
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "Failed to generate summary" }));
	}
};

module.exports = summarizeTextHandler;

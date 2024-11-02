const { HfInference } = require("@huggingface/inference");
require("dotenv").config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const generateLegalResponseHandler = async (req, res) => {
	try {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			const { input } = JSON.parse(body);

			// Interact with the Hugging Face model
			const result = await hf.textGeneration({
				model: "Merdeka-LLM/merdeka-llm-lawyer-3b-128k-instruct",
				inputs: input,
				parameters: { max_new_tokens: 50 },
			});

			// Send the model's response back to the client
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ response: result.generated_text }));
		});
	} catch (error) {
		console.error("Error generating response:", error);
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "Failed to generate response" }));
	}
};

module.exports = generateLegalResponseHandler;

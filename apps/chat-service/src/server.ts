import app from "./app"

const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Chat service is running on http://localhost:${PORT}`)
}).on("error", (err: Error) => {
    console.error("Chat service failed to start:", err)
    process.exit(1)
});
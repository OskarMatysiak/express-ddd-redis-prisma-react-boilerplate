import app from './app';
const PORT = process.env.DATABASE_URL || 3000

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });
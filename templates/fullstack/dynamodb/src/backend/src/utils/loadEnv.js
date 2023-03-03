import path from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import dotenv from "dotenv-defaults"

export function loadEnv() {
  dotenv.config({
    path: path.resolve(__dirname, "../../secrets/.env"),
    defaults: path.resolve(__dirname, "../../secrets/.env.defaults")
  })
}

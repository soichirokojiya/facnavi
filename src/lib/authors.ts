import fs from "fs";
import path from "path";

export interface Author {
  id: string;
  name: string;
  description: string;
  expertise: string[];
  image: string;
}

const authorsDir = path.join(process.cwd(), "content/authors");

export function getAuthorById(id: string): Author | undefined {
  const filePath = path.join(authorsDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Author;
}

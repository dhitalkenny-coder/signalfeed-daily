import type { IncomingMessage, ServerResponse } from "node:http";
import { pathToFileURL } from "node:url";
import path from "node:path";

async function readNodeRequestBody(req: IncomingMessage, method: string) {
  if (method === "GET" || method === "HEAD") return undefined;

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    if (typeof chunk === "string") {
      chunks.push(Buffer.from(chunk));
    } else {
      chunks.push(chunk);
    }
  }
  return Buffer.concat(chunks);
}

function toHeaders(req: IncomingMessage) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "undefined") continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }
  return headers;
}

async function toWebRequest(req: IncomingMessage) {
  const host = req.headers.host ?? "localhost";
  const protocol = (req.headers["x-forwarded-proto"] as string | undefined) ?? "https";
  const url = new URL(req.url ?? "/", `${protocol}://${host}`);
  const method = req.method ?? "GET";
  const body = await readNodeRequestBody(req, method);
  const headers = toHeaders(req);

  return new Request(url, {
    method,
    headers,
    body,
    // Required by Node's fetch for streamed request bodies.
    duplex: body ? "half" : undefined,
  } as RequestInit);
}

async function sendWebResponse(res: ServerResponse, response: Response) {
  res.statusCode = response.status;

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const body = response.body ? Buffer.from(await response.arrayBuffer()) : undefined;
  res.end(body);
}

type TanStackServerEntry = {
  fetch: (request: Request) => Promise<Response>;
};

let appPromise: Promise<TanStackServerEntry> | null = null;

function loadServerEntry() {
  if (!appPromise) {
    const serverPath = path.join(process.cwd(), "dist", "server", "index.js");
    const serverUrl = pathToFileURL(serverPath).href;
    appPromise = import(serverUrl).then((mod) => mod.default as TanStackServerEntry);
  }
  return appPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await loadServerEntry();
  const request = await toWebRequest(req);
  const response = await app.fetch(request);
  await sendWebResponse(res, response);
}

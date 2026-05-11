import { Readable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";
import { pathToFileURL } from "node:url";
import path from "node:path";

function toWebRequest(req: IncomingMessage) {
  const host = req.headers.host ?? "localhost";
  const protocol = (req.headers["x-forwarded-proto"] as string | undefined) ?? "https";
  const url = new URL(req.url ?? "/", `${protocol}://${host}`);
  const method = req.method ?? "GET";
  const hasBody = method !== "GET" && method !== "HEAD";

  return new Request(url, {
    method,
    headers: req.headers as HeadersInit,
    body: hasBody ? (req as unknown as BodyInit) : undefined,
    // Required by Node's fetch for streamed request bodies.
    duplex: hasBody ? "half" : undefined,
  } as RequestInit);
}

async function sendWebResponse(res: ServerResponse, response: Response) {
  res.statusCode = response.status;

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  Readable.fromWeb(response.body as unknown as ReadableStream).pipe(res);
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
  const request = toWebRequest(req);
  const response = await app.fetch(request);
  await sendWebResponse(res, response);
}

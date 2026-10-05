import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Monorepo: multiple lockfiles exist (moviemix/, moviemix/admin/). Pin tracing root to the admin app.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;

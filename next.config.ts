import type { NextConfig } from "next";
const config: NextConfig = { experimental: { serverActions: { bodySizeLimit: "20mb" } } }; // car photo uploads
export default config;

'use client'

import Navbar from "@/components/Navbar";
import { Box, CssBaseline } from "@mui/material";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="description" content="KeyWords" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body>
          <CssBaseline />
          <Navbar />
          {children}
      </body>
    </html>
  );
}

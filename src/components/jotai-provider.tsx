"use client";

import { Provider } from "jotai";
import React, { PropsWithChildren } from "react";

export default function JotaiProvider({ children }: PropsWithChildren) {
  return <Provider>{children}</Provider>;
}

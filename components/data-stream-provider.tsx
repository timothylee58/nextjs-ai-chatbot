/**
 * @file data-stream-provider.tsx
 * @description Data stream React context. Provides a shared context for the AI
 * response stream so multiple components (chat, artifacts, sidebar) can react
 * to the same stream events. Exposes the DataStreamProvider wrapper and a
 * useDataStream hook for consuming the stream state.
 */

"use client";

import type { DataUIPart } from "ai";
import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { CustomUIDataTypes } from "@/lib/types";

type DataStreamContextValue = {
  dataStream: DataUIPart<CustomUIDataTypes>[];
  setDataStream: React.Dispatch<
    React.SetStateAction<DataUIPart<CustomUIDataTypes>[]>
  >;
};

const DataStreamContext = createContext<DataStreamContextValue | null>(null);

export function DataStreamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dataStream, setDataStream] = useState<DataUIPart<CustomUIDataTypes>[]>(
    []
  );

  const value = useMemo(() => ({ dataStream, setDataStream }), [dataStream]);

  return (
    <DataStreamContext.Provider value={value}>
      {children}
    </DataStreamContext.Provider>
  );
}

export function useDataStream() {
  const context = useContext(DataStreamContext);
  if (!context) {
    throw new Error("useDataStream must be used within a DataStreamProvider");
  }
  return context;
}

"use client";
import React from "react";

type SearchContext = {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchContext = React.createContext<SearchContext>({
  globalFilter: "",
  setGlobalFilter: () => null,
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const value = React.useMemo(
    () => ({
      globalFilter,
      setGlobalFilter,
    }),
    [globalFilter]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

"use client";
import React from "react";
import Header from "./Header";
import CharacterList from "./CharacterList";
import ViewToggle from "./ViewToggle";
import StudioStats from "./StudioStats";
import CharacterCreateBanner from "./CharacterCreateBanner";
import SortFilter from "./SortFilter";

const StudioContents = () => {
  return (
    <section className="@container mx-auto w-full max-w-175 pt-7.5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 p-5 rounded-3xl border border-border-main bg-bg-darker">
            <Header />
            <hr className="text-border-main" />
            <StudioStats />
          </div>

          <CharacterCreateBanner />
        </div>

        <div className="flex flex-col gap-2">
          <header className="flex items-center justify-between py-1.5 px-2.5">
            <span className="text-font-2 text-sm">작품목록 2</span>

            <div className="flex gap-1 items-center">
              <ViewToggle />
              <SortFilter />
            </div>
          </header>
          <CharacterList />
        </div>
      </div>
    </section>
  );
};

export default StudioContents;

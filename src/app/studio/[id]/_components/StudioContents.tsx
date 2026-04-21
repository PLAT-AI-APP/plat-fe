"use client";
import React, { useRef, useState } from "react";
import Header from "./Header";
import CharacterList from "./CharacterList";
import ViewToggle from "./ViewToggle";
import StudioStats from "./StudioStats";
import CharacterCreateBanner from "./CharacterCreateBanner";
import { Sort } from "@/icons";
import CharacterSortPopover from "@/components/popover/CharacterSortPopover";

const StudioContents = () => {
  const [sort, setSort] = useState<"최신순" | "채팅순">("최신순");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
              <div id="sort-filter-container" className="relative">
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center py-1 px-1.5 gap-1.5 text-sm text-font-2 font-medium cursor-pointer"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                >
                  <Sort className="w-4 h-4 text-font-2" />
                  {sort}
                </button>

                {isSortOpen && (
                  <CharacterSortPopover
                    onChange={setSort}
                    onClose={() => setIsSortOpen(false)}
                    triggerRef={
                      triggerRef as React.RefObject<HTMLButtonElement>
                    }
                    value={sort}
                  />
                )}
              </div>
            </div>
          </header>
          <CharacterList />
        </div>
      </div>
    </section>
  );
};

export default StudioContents;

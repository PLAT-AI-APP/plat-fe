import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

interface PreviewDragHandleProps {
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}

const PreviewDragHandle = ({ dragHandleProps }: PreviewDragHandleProps) => {
  return (
    // Figma uses a compact 27x15 handle instead of the shared 24px Dots icon.
    <div
      {...dragHandleProps}
      className="flex h-[15px] w-[27px] cursor-grab items-center justify-center gap-0.5 rounded-full active:cursor-grabbing"
      aria-hidden="true"
    >
      <span className="size-[3px] rounded-full bg-font-disabled" />
      <span className="size-[3px] rounded-full bg-font-disabled" />
      <span className="size-[3px] rounded-full bg-font-disabled" />
    </div>
  );
};

export default PreviewDragHandle;

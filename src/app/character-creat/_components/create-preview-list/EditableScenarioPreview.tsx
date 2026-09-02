interface EditableScenarioPreviewProps {
  value: string;
  onChange: (value: string) => void;
}

const EditableScenarioPreview = ({
  value,
  onChange,
}: EditableScenarioPreviewProps) => {
  return (
    // Scenario text is edited as a full-width block to match the preview canvas.
    <div className="flex flex-1 gap-2 rounded-2xl bg-card p-3">
      <textarea
        autoFocus
        rows={5}
        className="focus-ring-none body-4 min-h-[152px] w-full resize-none rounded-xl border border-main bg-darker px-4 py-3 text-font-1 outline-none transition-colors focus:field-focus"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default EditableScenarioPreview;

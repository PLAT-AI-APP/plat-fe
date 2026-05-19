import React, { useState, ChangeEvent } from "react";
import { Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { ArrowDown, Dots, Trash, ImageIcon } from "@/icons";
import CopyFill from "@/icons/CopyFill";
import { CharacterCreateFormValues } from "@/type/character";
import SmartInput from "@/components/smart-input";

interface AssetItemProps {
  id: string;
  index: number;
  remove: (index: number) => void;
  copyAsset: (index: number) => void;
}

const AssetItem = ({ id, index, remove, copyAsset }: AssetItemProps) => {
  const { register, setValue, control } =
    useFormContext<CharacterCreateFormValues>();
  const [isActive, setIsActive] = useState(false);

  const assetImage = useWatch({ control, name: `asset.${index}.assetImage` });
  const assetName = useWatch({ control, name: `asset.${index}.assetName` });
  const assetSituation = useWatch({
    control,
    name: `asset.${index}.assetSituation`,
  });

  const toggleActive = () => setIsActive((prev) => !prev);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("jpg, png, webp 이미지 파일만 가능합니다.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("파일 용량은 최대 5MB까지 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue(`asset.${index}.assetImage`, reader.result as string, {
        shouldValidate: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="p-2.5 pt-0.75 bg-bg-darkest border border-border-main rounded-xl"
        >
          {/* 드래그 핸들 */}
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-center pb-0.75 h-3 mb-0.75 cursor-grab active:cursor-grabbing"
          >
            <Dots className="text-font-disabled w-5.75" />
          </div>

          <article className="flex justify-between">
            <div className="flex gap-2.5">
              <label
                htmlFor={`asset-image-${index}`}
                className="relative w-15 h-15 rounded-lg bg-card flex items-center justify-center overflow-hidden cursor-pointer"
              >
                {assetImage ? (
                  <Image
                    src={typeof assetImage === "string" ? assetImage : ""}
                    alt="asset 이미지"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="text-font-disabled w-6 h-6" />
                )}
                <input
                  id={`asset-image-${index}`}
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageChange}
                />
              </label>

              <p className="flex gap-1 body-4">
                {assetName || "에셋이름"}
                {/* 추후 백엔드가 넘겨주는 에셋의 코드 */}
                <span className="text-font-disabled">#3Eabde</span>
              </p>
            </div>

            <div className="flex gap-2 text-font-2">
              <button
                type="button"
                onClick={() => copyAsset(index)}
                className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-card"
              >
                <CopyFill className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-card"
              >
                <Trash className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={toggleActive}
                className={`flex items-center justify-center w-7 h-7 rounded-full hover:bg-card transition-transform ${
                  isActive ? "rotate-180" : ""
                }`}
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </article>

          {isActive && (
            <div className="flex flex-col gap-4 mt-4">
              <SmartInput
                {...register(`asset.${index}.assetName` as const)}
                label="에셋명"
                required
                placeholder="에셋명을 입력해주세요."
                maxLength={15}
                value={assetName}
                labelFontSize="title-5"
              />
              <SmartInput
                {...register(`asset.${index}.assetSituation` as const)}
                label="상황"
                type="textarea"
                required
                placeholder="이미지와 어울리는 상황을 설명해주세요."
                maxLength={50}
                maxLine={3}
                minLine={3}
                description="작성하신 상황이 되면 이미지를 띄워드려요."
                value={assetSituation}
                labelFontSize="title-5"
                descFontSize="body-6"
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default AssetItem;

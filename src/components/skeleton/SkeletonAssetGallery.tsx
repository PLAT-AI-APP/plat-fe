import React from "react";

/**
 * 채팅방 에셋 갤러리 로딩 자리표시자.
 *
 * 실제 항목(AssetGalleryItem)과 같은 정사각형·rounded-xl 이고, 부모 그리드의 2열 안에 그대로 들어간다.
 */
const SkeletonAssetGallery = () => {
  return (
    <>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="skeleton aspect-square w-full rounded-xl"
        />
      ))}
    </>
  );
};

export default SkeletonAssetGallery;

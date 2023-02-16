import React, { useRef } from "react";
import Image, { ImageProps } from "next/image";
import { useTranslation } from "next-i18next";
import styles from "./image.module.css";
import { getImageUrl } from "@components/containers/menu.helpers";

interface IProps extends ImageProps {
  onImageSelected: (src: string) => void;
  editedImage: string;
}

function SelectImageInput({ src, onImageSelected, editedImage, ...props }: IProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  function onSelectFile({ target }: React.ChangeEvent<HTMLInputElement>) {
    if (target.files && target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        onImageSelected(reader.result?.toString() || "");
      });
      reader.readAsDataURL(target.files[0]);
    }
  }

  function getImage(modifiedSrc: string, originalSrc: string) {
    if (originalSrc.length === 0 && modifiedSrc.length === 0) return "/empty.jpg";
    if (modifiedSrc.length !== 0 && originalSrc !== modifiedSrc) return modifiedSrc;
    return getImageUrl(originalSrc);
  }

  return (
    <div
      className={styles.container}
      onClick={
        () => {
          inputRef.current?.click();
        }
      }
    >
      <input
        type={"file"}
        ref={inputRef}
        accept="image/*"
        onChange={onSelectFile}
        style={{
          display: "none",
        }}
        value={""}
      />
      <Image
        {...props}
        src={getImage(editedImage, src as string)}
        alt={"select input"}
      />
      <div className={styles.cover}>
        <div className={styles.border}>
          {t("admin.edit.image")}
        </div>
      </div>
    </div>
  );
}

export default SelectImageInput;

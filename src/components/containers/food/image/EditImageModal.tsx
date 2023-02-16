import React, { useRef, useState } from "react";
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from "react-image-crop";
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import {
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { MdClose, MdDone, MdRotateLeft, MdRotateRight } from "react-icons/md";
import { imgPreview } from "@components/containers/food/image/image.helpers";
import styles from "./image.module.css";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

interface IProps {
  imgSrc: string;
  onFinishEditing: (imgSrc: string, imgBlob: Blob) => void;
  isOpen: boolean;
  onClose: () => void;
}

function EditImageModal(props: IProps) {
  const {
    imgSrc,
    onFinishEditing,
    isOpen,
    onClose,
  } = props;
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [aspect, _] = useState<number | undefined>(16 / 9);

  function rotate(degrees: number) {
    return () => {
      const newRotation = rotation + degrees;
      setRotation(newRotation);
    };
  }

  async function onSave() {
    if (imgRef.current && completedCrop) {
      const imageResult = await imgPreview(imgRef.current, completedCrop, scale, rotation);
      if (imageResult) {
        onFinishEditing(imageResult.previewUrl, imageResult.blob);
        onClose();
      }
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function handleScaleChange(_: string, valueAsNumber: React.SetStateAction<number>) {
    setScale(valueAsNumber);
  }

  if (imgSrc.length === 0) return <></>;
  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      size={"sm"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent={"flex-end"} gap={5}>
            <Flex flex={2} gap={3}>
              <NumberInput
                flex={1}
                defaultValue={1}
                precision={2}
                step={0.05}
                min={0.1}
                max={4}
                value={scale}
                onChange={handleScaleChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Slider
                flex={2}
                defaultValue={1}
                step={0.05}
                min={0.1}
                max={4}
                focusThumbOnChange={false}
                value={scale}
                onChange={setScale}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb fontSize="sm" boxSize="32px">
                  {scale}
                </SliderThumb>
              </Slider>
            </Flex>
            <IconButton
              aria-label={"rotateleft"}
              icon={<MdRotateLeft />}
              onClick={rotate(-90)}
              colorScheme={"orange"}
            />
            <IconButton
              aria-label={"rotateright"}
              icon={<MdRotateRight />}
              onClick={rotate(90)}
              colorScheme={"orange"}
            />
          </Flex>
        </ModalHeader>
        {
          !!imgSrc && isOpen && (
            <div className={styles["reactcrop-container"]}>
              <ReactCrop
                onChange={(_, percentageCrop) => setCrop(percentageCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                crop={crop}
                className={styles["react-crop"]}
                style={{ height: "inherit" }}
                keepSelection={true}
              >
                <img
                  ref={imgRef}
                  alt={"cropped image"}
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className={styles.cropped}
                  style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}
                />
              </ReactCrop>
            </div>
          )
        }
        <ModalFooter>
          <Flex gap={3}>
            <IconButton
              aria-label={"cancel"}
              icon={<MdClose />}
              onClick={onClose}
              colorScheme={"red"}
            />
            <IconButton
              aria-label={"confirm"}
              icon={<MdDone />}
              onClick={onSave}
              colorScheme={"green"}
            />
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default React.memo(EditImageModal);

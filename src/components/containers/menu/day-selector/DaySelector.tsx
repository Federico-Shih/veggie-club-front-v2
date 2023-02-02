import { IconButton } from "@chakra-ui/react";
import { useState } from "react";
import styles from "./DaySelector.module.css";

interface Props {
  setDay: (day: number) => void;
  initialDay: number;
}

export const dayMapper = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

export function DaySelector({ setDay, initialDay }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.fab}>
      {
        dayMapper.map((day, index) => {
          return (
            <div
              key={index}
              className={styles.fabSub}
              style={{
                position: "absolute",
                transition: "all .2s ease-in-out",
                bottom: open ? index * 50 + 10 : -45,
                left: 4,
              }}
            >
              <IconButton
                colorScheme="orange"
                aria-label="dia individual"
                icon={
                  <>
                    {day}
                  </>
                }
                onClick={() => {
                  setOpen(false);
                  setDay(index);
                }}
                isRound
              />
            </div>
          );
        })
      }
      <IconButton
        style={{ position: "absolute", top: 0, left: 0 }}
        size="lg"
        isRound
        aria-label="day-selector"
        icon={<>{dayMapper[initialDay]}</>}
        onClick={() => setOpen(!open)}
        colorScheme="orange"
      />
    </div>
  );
}

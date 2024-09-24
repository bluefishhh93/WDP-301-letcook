"use client";

import { ReactNode, createContext, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/use-media-query";

type ToggleContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  preventCloseRef: React.MutableRefObject<boolean>;
};

export const ToggleContext = createContext<ToggleContextType>({
  isOpen: false,
  setIsOpen: () => {},
  preventCloseRef: { current: false },
});

export function InteractiveOverlay({
  isOpen,
  setIsOpen,
  title,
  description,
  form,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  form: ReactNode;
  title: string;
  description: string;
}) {
  const { isMobile } = useMediaQuery();
  const preventCloseRef = useRef(false);

  return (
    <ToggleContext.Provider
      value={{
        isOpen,
        setIsOpen,
        preventCloseRef,
      }}
    >
      {!isMobile ? (
        <Dialog
          open={isOpen}
          onOpenChange={(value) => {
            if (preventCloseRef.current) return;
            setIsOpen(value);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[80vh] pr-8 pt-4 pb-8">{form}</ScrollArea>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={isOpen}
          onOpenChange={(value) => {
            if (preventCloseRef.current) return;
            setIsOpen(value);
          }}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="overflow-y-auto px-8 pb-8">
              {form}
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </ToggleContext.Provider>
  );
}
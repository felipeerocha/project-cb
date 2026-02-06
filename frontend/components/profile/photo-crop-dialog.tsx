"use client";

import React, { useState } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Camera, Loader2 } from "lucide-react";
import { getCroppedImg } from "@/lib/canvasUtils";

interface PhotoCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  onSave: (croppedImageBlob: Blob) => Promise<void>;
  loading: boolean;
}

export function PhotoCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onSave,
  loading,
}: PhotoCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImageBlob) {
        await onSave(croppedImageBlob);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-gray-200 rounded-2xl">
        <DialogHeader className="p-4 bg-gray-50 border-b border-gray-200">
          <DialogTitle className="text-gray-800 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Camera className="h-4 w-4 text-[#eea13e]" /> Ajustar Foto
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-black">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={(_, croppedPixels) =>
                setCroppedAreaPixels(croppedPixels)
              }
              onZoomChange={setZoom}
              showGrid={true}
              cropShape="round"
            />
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-200 space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Zoom
            </span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(vals: number[]) => setZoom(vals[0])}
              className="flex-1"
            />
          </div>

          <DialogFooter className="flex gap-3 sm:justify-between w-full">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-[#eea13e] text-[#472017] font-bold hover:bg-[#d68b2d] rounded-lg"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

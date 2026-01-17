"use client";

import {
  Download,
  Shield,
  Smartphone,
  Copy,
  Check,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* =========================================================
   STEP DRAWER (APK DOWNLOAD)
========================================================= */

interface StepDrawerProps {
  stepNumber: number;
  title: string;
  description: string;
  downloadUrl: string;
  fileName: string;
  sha256: string;
  instructions?: string[];
  className?: string;
  triggerClassName?: string;
}

export function StepDrawer({
  stepNumber,
  title,
  description,
  downloadUrl,
  fileName,
  sha256,
  instructions = [
    "Download the APK file",
    "Allow installation from unknown sources if prompted",
    "Complete the installation",
  ],
  className,
  triggerClassName,
}: StepDrawerProps) {
  const [copied, setCopied] = useState(false);

  const stepLabel = stepNumber.toString().padStart(2, "0");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Drawer>
      {/* Trigger */}
      <DrawerTrigger asChild>
        <button
          className={cn(
            "flex flex-col items-center text-center rounded-xl p-4 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
            triggerClassName
          )}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-semibold">
            {stepLabel}
          </div>

          <h4 className="text-base font-semibold text-foreground mb-1.5">
            {title}
          </h4>

          <p className="text-sm text-muted-foreground mb-3 max-w-[240px]">
            {description}
          </p>

          <div className="inline-flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-1.5">
            <Download className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium">View details</span>
          </div>
        </button>
      </DrawerTrigger>

      {/* Drawer */}
      <DrawerContent className="mx-auto max-w-[420px] rounded-t-2xl border-t border-border/60 p-6">
        <div className={cn("space-y-5", className)}>
          {/* Header */}
          <DrawerHeader className="px-0 text-center space-y-2">
            <DrawerTitle className="text-xl font-semibold">
              {title}
            </DrawerTitle>
            <DrawerDescription className="text-sm leading-relaxed">
              {description}
            </DrawerDescription>
          </DrawerHeader>

          {/* Download Section */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
            <div className="flex items-center gap-3 ">
              <div className="rounded-lg bg-accent/10 p-2">
                <Smartphone className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h5 className="text-sm font-medium">Android APK</h5>
                <p className="text-xs text-muted-foreground">
                  {fileName}
                </p>
              </div>
            </div>

                          <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
              >

              <Button
              asChild
              className="w-full h-10 rounded-lg bg-accent hover:bg-accent/90"
            >
              <a href={downloadUrl} download={fileName}>
                <Download className="mr-2 h-4 w-4" />
                Download APK
              </a>
            </Button>
            </a>

            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3" />
              Android will request installation permission
            </p>
          </div>

          {/* SHA Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              <h5 className="text-sm font-medium">
                File integrity (optional)
              </h5>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
              <p className="text-xs text-muted-foreground">
                Advanced users can verify this SHA-256 hash to ensure the file
                hasn’t been modified.
              </p>

              <code className="block text-[11px] break-all font-mono bg-background/70 p-2 rounded">
                {sha256}
              </code>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="mx-auto flex items-center gap-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Hash copied" : "Copy hash"}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <DrawerFooter className="px-0 pt-2">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full h-10 rounded-lg">
                Got it
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/* =========================================================
   INFO STEP (NON-DOWNLOAD)
========================================================= */

interface InfoStepProps {
  stepNumber: number;
  title: string;
  description: string;
  details: string[];
  className?: string;
}

export function InfoStep({
  stepNumber,
  title,
  description,
  details,
  className,
}: InfoStepProps) {
  const stepLabel = stepNumber.toString().padStart(2, "0");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          className={cn(
            "flex flex-col items-center text-center rounded-xl p-4 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]",
            className
          )}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-semibold">
            {stepLabel}
          </div>

          <h4 className="text-base font-semibold mb-1.5">
            {title}
          </h4>

          <p className="text-sm text-muted-foreground mb-3 max-w-[240px]">
            {description}
          </p>

          <div className="inline-flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium">Learn more</span>
          </div>
        </button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-w-[400px] rounded-t-2xl border-t border-border/60 p-6">
        <div className="space-y-5">
          <DrawerHeader className="px-0 text-center space-y-2">
            <DrawerTitle className="text-xl font-semibold">
              {title}
            </DrawerTitle>
            <DrawerDescription className="text-sm">
              {description}
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-2">
            {details.map((d, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center font-semibold">
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>

          <DrawerFooter className="px-0 pt-2">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full h-10 rounded-lg">
                Got it
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

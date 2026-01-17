"use client";

import { motion } from "motion/react";
import { Download, CheckCircle, Shield, Smartphone, Copy, Check } from "lucide-react";
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

// Reduced, optimized animation variants
const drawerVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      staggerChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 35 },
  },
};

const pulseRing = {
  scale: [1, 1.15, 1],
  opacity: [0.4, 0.1, 0.4],
};

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
  size?: "sm" | "md" | "lg";
}

export function StepDrawer({
  stepNumber,
  title,
  description,
  downloadUrl,
  fileName,
  sha256,
  instructions = [
    "Download the APK file above",
    "Open the downloaded file on your device",
    "Allow installation from unknown sources if prompted",
    "Follow the on-screen installation steps",
  ],
  className,
  triggerClassName,
  size = "md",
}: StepDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const sizeClasses = {
    sm: "max-w-[340px]",
    md: "max-w-[400px]",
    lg: "max-w-[480px]",
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const stepLabel = stepNumber.toString().padStart(2, "0");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex flex-col items-center text-center group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-xl p-4",
            triggerClassName
          )}
        >
          {/* Step Number Badge */}
          <div className="relative mb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent text-base font-semibold group-hover:bg-accent/20 transition-colors">
              {stepLabel}
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent/30"
              animate={pulseRing}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Title & Description */}
          <h4 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-accent transition-colors">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground mb-3 max-w-[240px]">
            {description}
          </p>

          {/* CTA Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 group-hover:bg-accent/10 transition-colors">
            <Download className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium">View Details</span>
          </div>
        </motion.button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-w-fit rounded-t-2xl p-6 border-t">
        <motion.div
          animate="visible"
          className={cn("mx-auto w-full space-y-5", sizeClasses[size], className)}
          initial="hidden"
          variants={drawerVariants}
        >
          {/* Header */}
          <DrawerHeader className="space-y-3 px-0 pb-0">
            <DrawerTitle className="flex items-center justify-center gap-3 text-xl font-semibold">
              <div className="relative rounded-full bg-accent/15 p-2.5">
                <span className="text-accent font-bold text-lg">{stepLabel}</span>
              </div>
              <span>{title}</span>
            </DrawerTitle>
            <DrawerDescription className="text-center text-sm leading-relaxed">
              {description}
            </DrawerDescription>
          </DrawerHeader>

          {/* Download Section */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border p-4 space-y-3"
          >
            {/* File Info */}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Smartphone className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-sm">APK Package</h5>
                <p className="text-xs text-muted-foreground truncate">{fileName}</p>
              </div>
            </div>

            {/* Download Button */}
            <motion.a
              href={downloadUrl}
              download={fileName}
              onClick={handleDownload}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="block"
            >
              <Button className="w-full h-10 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm">
                {downloaded ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download APK
                  </>
                )}
              </Button>
            </motion.a>

            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3" />
              System will prompt for installation permission
            </p>
          </motion.div>

          {/* Security Hash */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              <h5 className="text-sm font-medium">Security Verification</h5>
            </div>

            <div className="rounded-lg bg-muted/40 p-3 border space-y-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3" />
                SHA-256 Hash
              </p>
              
              <div className="relative group/hash">
                <code className="block text-[11px] leading-relaxed text-foreground/90 break-all font-mono bg-background/80 p-2.5 pr-10 rounded border">
                  {sha256}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1.5 top-1.5 h-7 w-7 opacity-0 group-hover/hash:opacity-100 transition-opacity"
                  onClick={handleCopy}
                  title="Copy hash"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-green-600 dark:text-green-400 font-medium"
                >
                  ✓ Copied to clipboard
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Installation Steps */}
          <motion.div variants={itemVariants} className="space-y-2.5">
            <h5 className="text-sm font-medium text-center">Installation Steps</h5>
            <div className="space-y-1.5">
              {instructions.map((instruction, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {instruction}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <DrawerFooter className="px-0 pt-3 pb-0">
            <DrawerClose asChild>
              <Button
                className="w-full h-10 rounded-lg font-medium"
                variant="outline"
              >
                Got it!
              </Button>
            </DrawerClose>
            <p className="text-center text-xs text-muted-foreground pt-2">
              Need help?{" "}
              <a
                href="mailto:prashanthkumarsvpl@gmail.com"
                className="text-accent hover:underline font-medium transition-colors"
              >
                Contact support
              </a>
            </p>
          </DrawerFooter>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}

// Informational Step Component (non-downloadable)
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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex flex-col items-center text-center group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-xl p-4",
            className
          )}
        >
          {/* Step Number Badge */}
          <div className="relative mb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent text-base font-semibold group-hover:bg-accent/20 transition-colors">
              {stepLabel}
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent/30"
              animate={pulseRing}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Title & Description */}
          <h4 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-accent transition-colors">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground mb-3 max-w-[240px]">
            {description}
          </p>

          {/* CTA Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 group-hover:bg-accent/10 transition-colors">
            <CheckCircle className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium">Learn More</span>
          </div>
        </motion.button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-w-fit rounded-t-2xl p-6 border-t">
        <motion.div
          animate="visible"
          className="mx-auto w-full space-y-5 max-w-[400px]"
          initial="hidden"
          variants={drawerVariants}
        >
          {/* Header */}
          <DrawerHeader className="space-y-3 px-0 pb-0">
            <DrawerTitle className="flex items-center justify-center gap-3 text-xl font-semibold">
              <div className="relative rounded-full bg-accent/15 p-2.5">
                <span className="text-accent font-bold text-lg">{stepLabel}</span>
              </div>
              <span>{title}</span>
            </DrawerTitle>
            <DrawerDescription className="text-center text-sm leading-relaxed">
              {description}
            </DrawerDescription>
          </DrawerHeader>

          {/* Details Section */}
          <motion.div variants={itemVariants} className="space-y-2.5">
            <h5 className="text-sm font-medium text-center">How It Works</h5>
            <div className="space-y-1.5">
              {details.map((detail, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {detail}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <DrawerFooter className="px-0 pt-3 pb-0">
            <DrawerClose asChild>
              <Button
                className="w-full h-10 rounded-lg font-medium"
                variant="outline"
              >
                Got it!
              </Button>
            </DrawerClose>
            <p className="text-center text-xs text-muted-foreground pt-2">
              Need help?{" "}
              <a
                href="mailto:prashanthkumarsvpl@gmail.com"
                className="text-accent hover:underline font-medium transition-colors"
              >
                Contact support
              </a>
            </p>
          </DrawerFooter>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}

// Example Usage
export default function StepsExample() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="grid md:grid-cols-3 gap-12">
        <StepDrawer
          stepNumber={1}
          title="Install APK"
          description="Download and install the OffGriid APK directly — no app stores, no accounts."
          downloadUrl="/apk/offgriid-1.0.0.apk"
          fileName="offgriid-1.0.0.apk"
          sha256="42ADF9BA6D0D3ED4A359936C9687C975EA4AB1ADD6C775F434D40A1981FC52AD"
        />
        
        <InfoStep
          stepNumber={2}
          title="Generate Identity"
          description="On first launch, OffGriid automatically creates a secure cryptographic identity, no sign-up required."
          details={[
            "Open OffGriid app for the first time",
            "App generates Ed25519 key pair locally on your device",
            "Your identity is created - no server communication",
            "Keys are stored securely in device keystore",
          ]}
        />
        
        <InfoStep
          stepNumber={3}
          title="Auto-Mesh"
          description="Nearby devices are discovered automatically using Bluetooth Low Energy and form a secure peer-to-peer mesh."
          details={[
            "BLE scanning discovers nearby OffGriid devices",
            "Secure handshake establishes encrypted connection",
            "Devices automatically relay messages across the mesh",
            "Works completely offline - no internet needed",
          ]}
        />
      </div>
    </div>
  );
}
# OffGriid: The Complete Manual

**Version:** 1.0.0
**Date:** January 16, 2026
**Project:** OffGriid (Formerly Bitchat)

---

## Table of Contents
1.  [Executive Summary](#1-executive-summary)
2.  [User Guide](#2-user-guide)
3.  [Developer Guide](#3-developer-guide)
4.  [Technical Architecture](#4-technical-architecture)
5.  [Codebase Navigation](#5-codebase-navigation)
6.  [Website & Distribution](#6-website--distribution)
7.  [Troubleshooting & FAQ](#7-troubleshooting--faq)

---

## 1. Executive Summary

**OffGriid** is a fully autonomous, offline-first messaging network for Android. It allows devices to communicate directly with one another using Bluetooth Low Energy (BLE) mesh networking, eliminating the need for internet access, cellular data, or central servers.

### Core Value Proposition
*   **Resilience**: Works during blackouts, natural disasters, and internet censorship.
*   **Privacy**: Zero-knowledge identity system. No phone numbers, emails, or servers.
*   **Security**: Military-grade encryption (Noise Protocol) for every packet.

---

## 2. User Guide

### 2.1 Getting Started
1.  **Installation**: Download and install the `OffGriid.apk`.
2.  **Permissions**: On first launch, grant **Location** (required for BLE scanning) and **Bluetooth** permissions.
3.  **Identity Creation**: The app automatically generates your "Identity" (a cryptographic key pair). You do not need to sign up.

### 2.2 detailed Workflow
*   **Discovery**: The app automatically scans for nearby OffGriid users. When a user comes within range (approx. 10-50 meters), they will appear in your "Nearby" list.
*   **Chatting**: Tap on a user to start a session. The first connection establishes a secure encrypted tunnel.
*   **Verification**: To ensure you are talking to the right person, you can compare the "Security Fingerprint" (a visual representation of their public key) in the chat settings.

### 2.3 Settings
*   **Display Name**: You can set a local display name. Note that this is not global; other users see you by your public key unless they save your name contact.
*   **Theme**: Toggle between Light and Dark mode (Dark mode is optimized for battery saving in emergencies).

---

## 3. Developer Guide

### 3.1 Prerequisites
*   **OS**: Windows, macOS, or Linux.
*   **IDE**: Android Studio Koala Feature Drop (or newer).
*   **Java**: JDK 17+.
*   **Android SDK**: API Level 35 (minimum API 26).

### 3.2 Build Instructions
1.  **Clone**:
    ```bash
    git clone https://github.com/bitchat-android-main/offgriid.git
    cd offgriid
    ```
2.  **Clean & Build**:
    ```bash
    ./gradlew clean
    ./gradlew assembleDebug
    ```
3.  **Output**:
    The APK will be located at: `app/build/outputs/apk/debug/app-universal-debug.apk`.

### 3.3 Running Tests
*   **Unit Tests**: `./gradlew test`
*   **Instrumented Tests**: `./gradlew connectedAndroidTest` (Requires connected device/emulator).

---

## 4. Technical Architecture

OffGriid is built on a custom stack designed for low-bandwidth, high-latency ad-hoc networks.

### 4.1 Networking Layer (Mesh)
*   **Protocol**: Bluetooth Low Energy (BLE).
*   **Role Management**: Devices dynamically switch between *Central* (Client) and *Peripheral* (Server) modes to maximize connectivity.
*   **Fragmentation**: Large messages are split into 512-byte chunks (or smaller, depending on negotiated MTU) to fit within BLE packet limits.

### 4.2 specific Cryptography
*   **Identity**: Ed25519 (Elliptic Curve Signature Scheme). Users are identified by their Public Key (`npub`).
*   **Transport Encryption**: **Noise Protocol Framework** (Pattern `XX`).
    *   **Cipher**: ChaCha20-Poly1305.
    *   **Hash**: BLAKE2b.
    *   **Key Exchange**: X25519.
*   **Forward Secrecy**: Session keys are ephemeral and rotate, ensuring past messages cannot be decrypted even if long-term keys are compromised.

### 4.3 Data Format (Nostr)
We utilize the **Nostr (NIP-01)** event structure for compatibility and extensibility.
*   **Event Object**:
    ```json
    {
      "id": "sha256_hash",
      "pubkey": "sender_public_key",
      "created_at": 1709823456,
      "kind": 4,
      "tags": [],
      "content": "encrypted_base64_string",
      "sig": "schnorr_signature"
    }
    ```

---

## 5. Codebase Navigation

A map of the project structure (`app/src/main/java/com/bitchat/android/`):

| Package | Description |
| :--- | :--- |
| **`mesh/`** | **The Implementation Core.** Handles BLE scanning, advertising, connection management (`BluetoothConnectionManager`), and packet fragmentation (`BluetoothPacketBroadcaster`). |
| **`noise/`** | **Security Layer.** Implements the Noise Protocol state machine (`NoiseSession`) and handshake logic. |
| **`nostr/`** | **Data Protocol.** Handles Nostr event creation, signing (`NostrClient`), and serialization. |
| **`identity/`**| Key management and secure storage (`SecureIdentityStateManager`). |
| **`ui/`** | Jetpack Compose screens (`ChatScreen`, `NearbyScreen`) and Verify UI. |
| **`crypto/`** | Legacy wrappers and utility functions for encryption. |

---

## 6. Website & Distribution

A dedicated landing page is included in the `website/` directory for easy distribution.

### 6.1 Website Contents
*   `index.html`: Main landing page with "Download" CTA.
*   `style.css`: Premium dark-mode styling.
*   `OffGriid.apk`: The self-hosted installer file.

### 6.2 Deployment
To launch the download site:
1.  Navigate to the `website/` folder.
2.  Upload the entire folder to a static host (e.g., GitHub Pages, Netlify, Vercel).
3.  Users can visit the URL and click "Download APK".

**Note**: To update the app version, simply replace the `OffGriid.apk` file in the website folder and update the version text in `index.html`.

---

## 7. Troubleshooting & FAQ

**Q: Why can't I see nearby devices?**
A: Ensure **Location Services** are enabled. Android requires Location permission to scan for BLE devices. Also, check that both devices have the app open in the foreground.

**Q: Is it compatible with iPhones?**
A: Currently, OffGriid is Android-only due to restrictions on iOS background Bluetooth advertising.

**Q: Can I send images?**
A: Not in v1.0. Text-only to ensure reliability over low-bandwidth BLE connections.

**Q: How do I verify a build?**
A: Run `./gradlew test` to ensure all unit tests pass. Inspect `app/build.gradle.kts` to verify dependencies.

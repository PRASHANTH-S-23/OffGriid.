# OffGriid

**De-Centralized. Offline. Secure.**

OffGriid is a flagship, peer-to-peer (P2P) mesh messaging application for Android. It enables reliable, secure, and private communication **without the internet**, cellular networks, or central servers. Built for resilience, it creates a self-healing local network using your device's Bluetooth Low Energy (BLE) capabilities.

---

## Problem Statement

In our hyper-connected world, true communication resilience is rare:
*   **Centralization**: WhatsApp, Telegram, and Signal rely on central servers. If they go down, you go offline.
*   **Censorship**: Internet shutdowns and ISP blocking can silence entire populations.
*   **Disasters**: Hurricanes, floods, and earthquakes often destroy cellular towers, leaving survivors isolated when communication is most critical.
*   **Surveillance**: Metadata (who talks to whom) is often logged by service providers.

## The Solution: OffGriid

OffGriid completely decouples communication from infrastructure.
*   **No Internet Required**: Works in the middle of a desert, on a plane, or during a total blackout.
*   **Zero Metadata**: No phone numbers, no emails, no central user database. You are just a cryptographic key.
*   **Mesh Networking**: Messages hop from device to device to reach their destination (Store-and-Forward relay).

---

## Use Cases

*   **Disaster Relief**: Coordination between rescue teams and survivors when power/cell service is lost.
*   **Privacy Advocates**: Zero-knowledge communication for whistleblowers and activists.
*   **Remote Adventures**: Hiking groups, camping trips, and maritime convoys.
*   **Hyper-Local Events**: Festivals, conferences, and protests where local decongestion is needed.

---

## Tech Stack

Built with modern, cutting-edge Android technologies:

*   **Language**: Kotlin (100% Native)
*   **UI Framework**: Jetpack Compose (Material 3 Design)
*   **Architecture**: MVVM + Clean Architecture
*   **Dependency Injection**: Hilt (Dagger)
*   **Concurrency**: Kotlin Coroutines & Flow
*   **Local Database**: Room (SQLite)
*   **Networking**: Android Bluetooth Low Energy (BLE)
    *   Central & Peripheral Modes
    *   Custom GATT Server/Client implementation
*   **Cryptography**:
    *   **Noise Protocol Framework** (ChaCha20-Poly1305, Curve25519, BLAKE2b)
    *   **Ed25519** (Signatures & Identity)
    *   **Argon2id** (Key Derivation)
    *   **BouncyCastle** (Crypto Primitives)

---

## Security & Cryptography

OffGriid prioritizes **Verification** and **Encryption**.

### 1. Identity (Zero-Knowledge)
*   Identities are generated locally on the device.
*   **Key Pair**: Ed25519 (Edwards-curve Digital Signature Algorithm).
*   **Fingerprint**: Users are identified by the SHA-256 hash of their public key. No centralized registry.

### 2. Transport Encryption (Noise Protocol)
We use the **Noise Protocol Framework** (specifically `Noise_XX_25519_ChaChaPoly_BLAKE2b`) for Authenticated Key Exchange (AKE).
*   **Forward Secrecy**: New session keys are derived for every session. Compromising a long-term key does not compromise past messages.
*   **Bidirectional Secrecy**: Both parties authenticate each other via the handshake.

### 3. MITM Mitigation (Verification)
To prevent Man-In-The-Middle (MITM) attacks where an attacker impersonates a peer:
*   **QR Verification**: Users can scan each other's QR code on the "Verification Screen".
*   **Fingerprint Comparison**: The app verifies the cryptographic fingerprint of the scanned peer against the connected session.
*   **Verified Badge**: Once verified, the peer gets a "Verified" badge in the UI.

---

## How It Works (Under the Hood)

### 1. Discovery & Handshake
Devices constantly advertise their presence (via BLE Advertising) and scan for others. When discovered:

1.  **Connection**: GATT Client connects to GATT Server.
2.  **Reverse Connection**: Server initiates a connection back to the Client for bidirectional flow.
3.  **Identity Handshake**: Both devices exchange a `PEER_ANNOUNCEMENT` packet containing their Ed25519 Public Key and a challenge signature.
4.  **Encryption Handshake**: The **Noise Protocol** handshake ensues to derive shared secret keys.

### Sequence Diagram

![Sequence Diagram](/public/sequence.png)

### 2. Mesh Relay (Packet Routing)
If Alice wants to send a message to Charlie, but Charlie is out of range:
`Alice -> Bob -> Charlie`
*   Packets have a **Time-To-Live (TTL)** to prevent infinite loops.
*   Bob's device receives the packet, checks if he is the recipient. If not, he rebroadcasts it to his connected peers.

---

## Key Features

### Rich Messaging
*   **Text**: Instant secure text messaging.
*   **Voice Notes**: Record and send compressed AAC voice notes (optimized for low bandwidth BLE).
*   **Images**: Share compressed images securely.

### Favorites & Personalization
*   **Add to Favorites**: Long-press any peer in the Home Screen to star them. They appear at the top.
*   **Nicknames**: Assign local nicknames to complex cryptographic IDs (e.g., "Mom" instead of "a1b2...").

### Device Verification (Anti-MITM)
1.  Go to **Profile** -> **Show QR**.
2.  Your friend goes to **Scan QR**.
3.  Camera scans the code.
4.  App validates the Public Key matches the active BLE session.
5.  **Secure!** No one is intercepting your chat.

---

## Project Structure

```
com.offgrid.app
├── data
│   ├── local         # Room Database (Messages, Peers)
│   └── repository    # Repository Implementations
├── domain
│   ├── model         # Data Classes (Packet, Peer, Message)
│   ├── network       # BLE Logic (BleManager, PacketRouter)
│   └── repository    # Interfaces
├── ui
│   ├── components    # Reusable UI (Bubbles, TopBars)
│   ├── screens
│   │   ├── chat      # Chat Screen & ViewModel
│   │   ├── home      # Peer List
│   │   ├── welcome   # Permissions & Onboarding
│   │   └── verification # QR Code Scanning
│   └── theme         # Theme & Color Palette
└── di                # Hilt Modules
```

*Privacy is not a crime. It is a prerequisite for freedom.*

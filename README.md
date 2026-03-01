# 🟢 PayOnce.cash  
### The Sovereign Commerce Layer on Bitcoin Cash

<div align="center">
  <a href="https://payonce-cash.vercel.app">
    <img src="https://payonce-cash.vercel.app/logo.png" alt="PayOnce Logo" width="120" height="120">
  </a>

  <p><b>PayOnce enables creators, developers, and merchants to accept Bitcoin Cash globally with zero fees, zero custody, and zero databases.</b></p>
  <p><i>Stripe-level UX. Bitcoin-level sovereignty.</i></p>

  [![Live App](https://img.shields.io/badge/🚀_Live_App-Launch-success?style=for-the-badge)](https://payonce-cash.vercel.app)
  [![Powered by BCH](https://img.shields.io/badge/⚡_Powered_By-Bitcoin_Cash-green?style=for-the-badge)](https://bch.info)
  
</div>

---

## 🧩 The Problem: Global Commerce is Broken
Digital commerce today is controlled by centralized payment platforms that extract value and impose friction:

- **High fees:** 5–15% lost to processing and marketplace taxes.  
- **Data Slavery:** Platforms own your customer data. You are just a renter in their garden.  
- **Custodial risk:** Permissioned gateways (PayPal/Stripe) can freeze funds, ban accounts, and demand endless KYC/KYB.  
- **The "Crypto-UX" Gap:** Accepting crypto usually requires manual address copying, awkward exchange rates, and waiting 10+ minutes for confirmation.

Bitcoin Cash was designed for peer-to-peer payments — yet most commerce tools still behave like Web2 gatekeepers. We replaced the "Middleman" with Bitcoin Cash.

---

## ✅ The Solution: PayOnce Protocol
**PayOnce.cash** is the first **Stateless Merchant Protocol** built entirely on Bitcoin Cash’s 0-conf logic and IPFS.

It enables a developer in Nigeria to sell code to a company in Japan instantly, without asking anyone for permission. PayOnce is not a marketplace; it is a **payment primitive** that creators and merchants truly own.

### 🔑 Core Capabilities

| Capability | Web2 Platforms (Stripe/Gumroad) | PayOnce Protocol |
|----------|----------------|---------|
| Platform Fees | 3–15% | **0%** |
| Settlement | Days / Weeks | **Instant (0-conf)** |
| Custody | Platform-held | **Wallet-to-Wallet** |
| Data Storage | Centralized DBs | **100% IPFS (Zero DB)** |
| Access | Bank + KYC | **Permissionless** |
| Growth | Ads & Algorithms | **On-chain Viral Protocol** |

---

## 🔥 What We Built (Execution & Features)

### 1. The IPFS Commerce Protocol (Zero Database)
Traditional platforms lock merchant data in centralized servers. PayOnce bypasses this entirely:
* Product creation generates a JSON payload containing pricing, addresses, affiliate logic, and encrypted content.
* This payload is uploaded immutably to the decentralized **IPFS** network.
* The resulting CID becomes your checkout link. PayOnce is purely a stateless client that reads IPFS, fetches real-time BCH prices, and verifies on-chain data.

### 2. Web3 Token-Gated Commerce (CashTokens Integration)
We have transformed PayOnce into a Web3 Loyalty Hub by natively integrating Bitcoin Cash **CashTokens**. Merchants can launch zero-friction loyalty programs without emails or passwords:
* **Discount Mode:** Offer secret percentage discounts. If the buyer holds the merchant's specific Token ID, the fiat-to-BCH price drops automatically.
* **Gated Mode (Required):** Lock digital content entirely. Only users who can mathematically prove they hold the required CashToken can access the checkout.
* **Absolute Transparency:** Checkout pages display the required Token ID with a direct verification link to the SalemKode CashToken Explorer.

### 3. Instant Checkout Protocol (0-Conf Smart Pay)
* **Smart Deep Linking:** Auto-detects the user's wallet (Electron Cash, Bitcoin.com, Paytaca) and triggers the payment intent instantly.
* **Real-time Fiat Oracle:** Live USD, EUR, CNY, JOD, etc. to BCH conversion at checkout.
* **On-Device Receipts:** Generates downloadable, text-based official receipts dynamically after payment confirmation.

### 4. Viral Commerce (On-Chain Affiliate Protocol)
Sellers can enable **Viral Mode** to empower affiliate-driven sales.
* Revenue is split atomically on-chain (e.g., 90% Seller / 10% Promoter).
* Promoters receive funds instantly — no dashboards, no withdrawal delays.

### 5. Developer-First SDK
We turned PayOnce into a protocol. Developers can embed non-custodial checkout buttons into **any app, game, or website** with a single line of code. No backend required.
* **Tamper-Proof:** Includes HMAC-SHA256 signatures to prevent client-side price manipulation.
* **Generate buttons instantly at:** [payonce-cash.vercel.app/developers](https://payonce-cash.vercel.app/developers)

---

## 📦 The PayOnce Suite (Real-World Solutions)

We built specialized, IPFS-backed storefronts for every type of merchant:

| Category | Supported Assets & Use Cases |
|----------|----------------|
| 🏪 **Retail / POS** | Dual-mode WebPOS for cafes. Generates instant Smart QR. |
| 👤 **Freelancers** | Shareable invoice links (WhatsApp/Email). Paid instantly. |
| 💻 **Code & Dev** | Sell Source Code, Scripts, Plugins, App Licenses. |
| 📄 **Content** | Sell PDFs, E-books, Reports, Mini-Courses. |
| 🎬 **Media** | Sell Video Tutorials, Exclusive Clips. |
| 📁 **Data** | Sell Secure Archives (ZIP), Bulk Data. |
| 🎟️ **Access** | Sell Game Assets, Activation Keys, Event Tickets. |
| 🔗 **Secure Links** | Sell access to Zoom, unlisted YouTube, Telegram Invites. |

---

## 🔐 Security & Trust Model: The Atomic Guard
We don't just "hope" 0-conf works; we visualize it. Our checkout engine bridges the gap between "Broadcast" and "Confirmation" to eliminate double-spend anxiety:

1. **Mempool Detection:** Instantly detects the transaction on the BCH network.
2. **Double-Spend Analysis:** Analyzes node propagation to ensure transaction safety.
3. **UX Feedback:** Displays a satisfying "Securing Transaction" animation before decrypting and releasing the IPFS asset.

> *We optimize for honest-majority commerce, not adversarial edge cases that break real-world usability.*

---

## 🌍 Borderless Interface (Localization)
Money has no language. PayOnce is fully localized to onboard the world's largest BCH communities:
* 🇺🇸 **Universal English:** The global standard.
* 🇨🇳 **Native Chinese (中文):** Optimized for the Asian market.
* 🇯🇴 **Arabic (العربية):** Full RTL (Right-to-Left) UI adaptation for the Middle East.

---

##  PayOnce Hub: The Decentralized Web3 Storefront

Stop renting your storefront. **PayOnce Hub** is the ultimate decentralized alternative to Linktree, built specifically for sovereign creators and Web3 merchants. 

Instead of sharing scattered payment links, creators can now group all their digital assets, products, and POS terminals into one beautifully customized, uncensorable profile.

###  Key Features of The Hub:
* **The Ultimate Web3 Linktree:** Aggregate all your PayOnce checkout links into a single, elegant landing page. One link for your entire business.
* **100% IPFS Hosted:** Your storefront identity lives on IPFS. It is immutable, uncensorable, and no centralized platform can ever take it down.
* **Pay Once, Own Forever:** Zero monthly subscriptions and zero platform rent. Deploy your complete Hub permanently with a single micro-payment.
* **Fully Customizable Identity:** Tailor your brand with custom avatars, titles, descriptions, and beautifully designed UI themes.
* **Ecosystem Ready:** Seamlessly integrates with our *Viral Affiliate Mode* and *Automated Asset Delivery*, turning your Hub into a self-sustaining Web3 economy.

---

## 🛣️ Future Roadmap: The Sovereign Economy

We are executing a focused strategy to make Bitcoin Cash the default rail for global commerce.

- [x] **Phase 1: Foundation** (Retail POS, Invoicing, Viral Protocol, Security Visualizer).
- [x] **Phase 2: Developer Tooling** (PayOnce SDK, Embeddable Buttons, HMAC Protection).
- [x] **Phase 3: Decentralization & Identity** (100% IPFS Architecture, CashTokens Token-Gated Commerce, Web3 Hub).

- [ ] **Phase 4: Enterprise Security & Official Launch (Top Priority)**
    * Migrating from client-side validation to a robust **Server-Side Watchtower Architecture** using `rpckit` and Electrum/Fulcrum servers.
    * Ensuring 100% tamper-proof, zero-trust SPV payment verification.
    * **Production Launch:** Migrating from Vercel to a premium, dedicated domain (e.g., PayOnce.cash) with scaled backend infrastructure.

- [ ] **Phase 5: Automated Web3 Cashback (Smart Contract Airdrops)**
    * Using BCH Covenants, merchants will lock loyalty CashTokens in a smart contract. When a checkout is completed, the atomic swap automatically air-drops loyalty tokens to the buyer, creating a "Shop-to-Earn" economy.

- [ ] **Phase 6: The Hub Evolution (NFTs & Social Commerce)**
    * Integrating **CashTokens NFT Showcases** directly into the PayOnce Hub. Merchants can mint, display, and sell unique digital assets and memberships alongside regular products.

- [ ] **Phase 7: Web2 Mass Adoption & Ecosystem**
    * Native Stablecoin Support via CashTokens (e.g., integrating PUSD upon mainnet maturity).
    * **WordPress/WooCommerce Plugin:** Bringing 100% non-custodial P2P crypto settlements to traditional Web2 merchants via a seamless 1-click integration.. 

---

> **"We didn't just build an app; we built the engine for the Sovereign Economy. PayOnce is not merely a gateway—it is the infrastructure Bitcoin Cash has been waiting for. The protocol is live. The rails are built. Today, we unleash decentralized commerce."**

---

## 🔗 Links
- **Live App:** https://payonce-cash.vercel.app  
- **X (Twitter):** [@PayOnceCash](https://x.com/PayOnceCash)  
- **Telegram:** [@PayOnceCash](https://t.me/PayOnceCash)  

---
**PayOnce.cash — Commerce without permission.**

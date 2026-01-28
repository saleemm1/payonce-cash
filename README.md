# 🟢 PayOnce.cash — The Sovereign Commerce Protocol

<div align="center">
  <img src="https://payonce-cash.vercel.app/logo.png" alt="PayOnce Logo" width="120" height="120" />
  <br />
  <h1>Kill the Middleman. Unlock Your Financial Empire.</h1>
  <p>
    <b>The First Non-Custodial, Instant-Settlement Digital Asset Marketplace on Bitcoin Cash.</b>
  </p>
  
  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-PayOnce.cash-2ea44f?style=for-the-badge)](https://payonce-cash.vercel.app)
  [![Track](https://img.shields.io/badge/🏆_Track-Applications-blue?style=for-the-badge)](https://dorahacks.io/hackathon/bch-1/detail)
  [![Network](https://img.shields.io/badge/⚡_Network-Bitcoin_Cash_(BCH)-green?style=for-the-badge)](https://bch.info)
</div>

---

## 📖 Introduction
**PayOnce** is a financial liberation tool built for the **BCH-1 Hackcelerator**. It dismantles the high-fee, censorship-heavy regime of legacy platforms like Stripe, Gumroad, and PayPal.

We utilize the legendary speed of **Bitcoin Cash 0-Conf** to allow creators to sell digital goods, tickets, and services instantly, without ever giving up custody of their funds. **No accounts. No KYC. No waiting.**

---

## ⚡ Key Differentiators (Why We Win)

### 1. The "Viral Mode" Engine (Social Momentum) 🧬
PayOnce turns every customer into a salesperson. Sellers can enable **Viral Mode**, which embeds an on-chain affiliate protocol directly into the payment link.
* **Mechanism:** When a promoter shares a link, the payment is split **atomically** at the moment of transaction.
* **The Split:** 90% to Creator / 10% to Promoter.
* **Innovation:** No affiliate dashboards, no "payout requests," no minimum thresholds. The commission hits the promoter's wallet the **millisecond** the sale is made.

### 2. Zero-Conf Instant Fulfillment 🚀
While other crypto apps wait for block confirmations (10+ mins), PayOnce utilizes a custom **Mempool Listener**.
* We detect the unconfirmed transaction instantly.
* We verify the output script matches the price and seller address.
* **Result:** The digital asset unlocks in **< 2 seconds**, providing a UX faster than credit cards.

### 3. Dynamic Fiat Oracle 💹
Solving the "Crypto Volatility" problem for merchants.
* Sellers set prices in **USD**.
* Our engine calculates the exact **BCH Satoshi** amount in real-time at the moment of checkout.
* Merchants get the purchasing power they asked for; buyers pay fair market rates.

---

## 🛠️ The Solution Suite
PayOnce is not just a file host; it is a complete **Commerce Operating System** supporting 10+ asset types:

| 📦 Asset Class | 🎯 Use Case |
| :--- | :--- |
| **Merchant Invoice** | **NEW!** Retail POS system for Restaurants, Cafes, & Freelancers. |
| **Source Code** | Sell scripts, plugins, and SaaS codebases. |
| **Secure Folder** | Bulk data archives, asset packs, and project files. |
| **Event Tickets** | PDF/QR tickets for webinars or IRL events. |
| **Video Content** | Masterclasses, tutorials, and exclusive clips. |
| **Mini-Courses** | Structured learning materials and lesson plans. |
| **Digital Books** | E-books, reports, and guides. |
| **App Licenses** | Software activation keys and serial numbers. |
| **Game Cards** | In-game assets, skins, and loot codes. |

---

## 🏗️ Technical Architecture

PayOnce is built with a focus on **Performance**, **Security**, and **Decentralization**.

* **Frontend:** Next.js 14 (App Router) with Tailwind CSS & Framer Motion for a polished, "Web2-like" smooth experience.
* **Blockchain Interaction:** `mainnet-js` for interacting with the Bitcoin Cash network.
* **Storage (Hybrid):** * Metadata and encryption logic run client-side.
    * Heavy assets utilize IPFS (InterPlanetary File System) via Pinata gateways for censorship-resistant storage.
* **Payment Protocol:** Custom BIP-70 style payment URI construction with multi-output support for the Affiliate System.

### The "Viral" Transaction Flow:
```mermaid
graph LR
    A[Buyer] -- Sends BCH --> B{Smart Splitter}
    B -- 90% Value --> C[Seller Wallet]
    B -- 10% Value --> D[Promoter Wallet]
    B -- 0% (Data) --> E[PayOnce Oracle]
    E -- Triggers --> F[Unlock Content]

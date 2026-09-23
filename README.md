# BLOND Website

A responsive website built for **BLOND**, a neighbourhood bakery, with a focus on warm visual design, simple navigation, and a streamlined pre-order experience.

**Live Website:** [blondthebakery.com](https://www.blondthebakery.com/?utm_source=chatgpt.com)

## Overview

The BLOND Bakery Website provides customers with an easy way to explore the bakery's menu, add products to a cart, select a pickup date and time, and place a pre-order through WhatsApp.

The project was designed around BLOND's friendly neighbourhood bakery identity, combining a warm visual style with a straightforward mobile-first experience.

## Features

* Responsive design for desktop, tablet, and mobile
* Bakery menu with product details and pricing
* Shopping cart with quantity management
* Automatic subtotal and tax calculation
* Pickup date and time selection
* Pickup availability validation
* WhatsApp pre-order integration
* Interactive image gallery
* Responsive navigation
* Bakery information and FAQ sections
* Google Maps location integration
* Mobile-friendly touch and drag interactions

## Tech Stack

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **React Router**
* **Lucide React**
* **WhatsApp integration**
* **Google Maps**

## Website Structure

The website is organized around several key sections:

* **Home** — Introduction to BLOND and featured content
* **Our Story** — Bakery background and identity
* **Our Menu** — Products and pricing
* **Pre-Order** — Customer ordering flow
* **FAQ** — Frequently asked questions
* **Inquiries** — Contact and location information
* **Cart** — Order summary and pickup scheduling

## Pre-Order Flow

The ordering experience is designed to keep the process simple:

```text
Browse Menu
    ↓
Add Items to Cart
    ↓
Review Order
    ↓
Select Pickup Date & Time
    ↓
Validate Pickup Availability
    ↓
Place Pre-Order via WhatsApp
```

The website handles the cart and pickup information on the frontend before generating the WhatsApp order message.

## Responsive Design

The interface adapts to different screen sizes with particular attention to mobile users.

Responsive behavior includes:

* Mobile navigation menu
* Flexible product layouts
* Responsive typography
* Touch-friendly controls
* Horizontal draggable gallery on smaller screens
* Responsive cart and checkout layout

## Design

The visual direction uses a warm, understated palette to reflect BLOND's neighbourhood bakery identity.

Primary brand color:

```text
#9E8465
```

Background:

```text
#FFF9F1
```

The design emphasizes:

* Warm neutral tones
* Large food photography
* Simple typography
* Spacious layouts
* Friendly interactions
* Minimal visual clutter

## Getting Started

### Prerequisites

Make sure you have **Node.js** and **npm** installed.

### Installation

Clone the repository:

```bash
git clone https://github.com/BeatrixBlaine/Blond-Website.git
```

Navigate to the project:

```bash
cd Blond-Website
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will then be available through the local development URL provided by Vite.

## Environment Variables

The WhatsApp ordering functionality uses an environment variable for the bakery's phone number.

Create a `.env` file:

```env
VITE_PHONE=your_whatsapp_number
```

Do not commit private credentials or sensitive configuration to the repository.

## Deployment

The website is deployed as a production web application and is available at:

[www.blondthebakery.com](https://www.blondthebakery.com/?utm_source=chatgpt.com)

## Project Purpose

This project was developed as a freelance website project for a local bakery.

The primary goal was to create a polished online presence while making it easy for customers to browse products and place bakery pre-orders without requiring a traditional online payment system.

## Author

**Irsyad**

Built with React, TypeScript, Vite, and Tailwind CSS.

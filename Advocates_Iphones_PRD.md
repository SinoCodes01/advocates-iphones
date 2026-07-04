**PRODUCT REQUIREMENTS DOCUMENT (PRD)**

**Advocates iPhones Website**

*Version 1.0 \| 2026-05-19*

| **Purpose: Launch a premium, mobile-first ecommerce site for verified iPhone sales with trust-focused branding, WhatsApp-assisted checkout, and a scalable foundation for future expansion.** |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

# 1. Product Overview {#product-overview}

Advocates iPhones is a premium ecommerce website for selling iPhones and related accessories. The site should communicate trust, authenticity, and value while keeping the buying journey simple enough for mobile users and first-time customers.

The first release should prioritize a clean storefront, strong product presentation, a cart and checkout flow, and a WhatsApp-assisted order handoff that supports manual confirmation of stock and payment.

# 2. Goals and Success Criteria {#goals-and-success-criteria}

- Make it easy for customers to browse iPhones, understand device condition, and place an order on mobile.

- Increase trust through strong visual identity, clear warranty and authenticity messaging, and transparent product details.

- Reduce checkout friction by allowing guest checkout and a simple order confirmation flow.

- Create a foundation that can later support online payments, order tracking, and admin automation.

**Success metrics (initial):** product page conversion rate, cart-to-order completion rate, WhatsApp click-through rate, and percentage of completed orders confirmed within 24 hours.

# 3. Target Users {#target-users}

- Primary: mobile-first shoppers looking for premium or refurbished iPhones at competitive prices.

- Secondary: students and young professionals who value legitimacy, delivery convenience, and direct support.

- Internal: store admins who manage products, stock, orders, customer communications, and promotional content.

# 4. Brand Positioning and Aesthetic Direction {#brand-positioning-and-aesthetic-direction}

The visual identity should feel premium, minimal, trustworthy, and Apple-inspired without copying Apple branding or assets. The design language should communicate law, trust, and technology through a polished blue-and-white system, strong typography, and lots of whitespace.

## 4.1 Visual Style {#visual-style}

- Primary palette: deep navy, electric blue, clean white, and soft cool gray.

- Use blue gradients sparingly for emphasis, headers, CTA buttons, and accent backgrounds.

- Favor rounded cards, subtle shadows, smooth transitions, and a glass-like premium feel.

- Avoid visual clutter, overly loud colors, and heavy decorative illustrations.

## 4.2 Typography {#typography}

- Use a modern sans-serif font family such as Inter, Manrope, or SF Pro-style system fonts.

- Headings should be bold, highly legible, and spaced for premium editorial impact.

- Body text should remain compact but readable on small screens.

## 4.3 UI Components {#ui-components}

- Prominent hero section with store value proposition and CTA.

- Product cards with image, price, storage, condition, and availability badges.

- Trust badge strip for authenticity, service, and pricing.

- Sticky cart access and simplified checkout panels.

# 5. Scope {#scope}

| **In Scope (MVP)**                                                                                                                                           | **Out of Scope (Later Releases)**                                                                                                                      |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| Product catalog, product detail pages, cart, checkout, order confirmation, WhatsApp handoff, admin product management, stock status, basic order management. | Loyalty points, financing, marketplace features, advanced AI recommendations, multi-vendor support, complex shipping integrations, and ERP automation. |

# 6. Core User Journeys {#core-user-journeys}

## 6.1 Shopper Journey {#shopper-journey}

- User lands on homepage or category page.

- User views products and filters by model, price, storage, condition, or color.

- User opens a product page, reviews details, and selects a variant.

- User adds the item to cart and proceeds to checkout.

- User submits contact and delivery details.

- System creates an order, shows confirmation, and offers a WhatsApp follow-up option.

## 6.2 Admin Journey {#admin-journey}

- Admin signs into dashboard.

- Admin creates or edits products, images, variants, stock, and pricing.

- Admin reviews incoming orders and updates status.

- Admin confirms availability, payment, and delivery progress.

# 7. Functional Requirements {#functional-requirements}

## 7.1 Public Website {#public-website}

- Responsive homepage with clear value proposition and featured products.

- Category and search functionality for quick browsing.

- Product detail pages with gallery, specifications, condition notes, warranty, and call-to-action buttons.

- FAQ, contact, warranty, delivery, and return policy pages.

## 7.2 Cart and Checkout {#cart-and-checkout}

- Guest checkout must be supported.

- Cart must support quantity changes, variant selection, subtotal calculation, and removal of items.

- Checkout should collect name, phone number, email optionally, delivery location, and address.

- Order review step must summarize product, price, delivery information, and payment method.

- After order submission, the system must display a confirmation page and WhatsApp call-to-action.

## 7.3 Order Handling {#order-handling}

- Orders should be stored immediately in the database.

- Each order must have a unique identifier and status lifecycle such as pending, confirmed, packed, shipped, completed, or cancelled.

- Stock should be decremented or reserved only after validated order submission.

- Admin should be able to manually confirm payment and availability.

## 7.4 Admin Dashboard {#admin-dashboard}

- Secure login for store staff.

- Product CRUD with image upload and variant management.

- Order list with filtering by status, date, and payment state.

- Ability to mark stock low, out of stock, or hidden.

- Ability to generate WhatsApp-ready messages for order follow-up.

# 8. Content Requirements {#content-requirements}

- Each product must include model name, storage, color, price, condition, battery health if applicable, and warranty.

- Every product page must show authenticity and service reassurance copy.

- Homepage must clearly state the store location (KuGompo City, Eastern Cape) and delivery availability.

- Policies must be written in plain language and kept visible.

# 9. Technical Requirements {#technical-requirements}

## 9.1 Recommended Stack {#recommended-stack}

- Frontend: Next.js.

- Styling: Tailwind CSS.

- UI components: shadcn/ui.

- Backend services: Supabase (PostgreSQL, Auth, Storage, Realtime).

- Hosting: Vercel for the web application.

- Messaging: WhatsApp Business link-out integration.

## 9.2 Architecture {#architecture}

Recommended MVP architecture:

User -\> Next.js app on Vercel -\> Supabase database/auth/storage

## 9.3 Data Model (Minimum) {#data-model-minimum}

- products: id, name, slug, price, stock, condition, storage, color, images, warranty_months, active.

- orders: id, customer_name, phone, email, delivery_address, payment_method, status, total, created_at.

- order_items: id, order_id, product_id, quantity, unit_price.

- users/admins: id, role, auth identity, last_login.

## 9.4 Performance and Quality {#performance-and-quality}

- Mobile pages should load quickly over average South African network conditions.

- Images should be optimized and lazy-loaded.

- The checkout flow should feel fast and avoid unnecessary page reloads.

- System should log failed checkout attempts and payment handoff events.

## 9.5 Security and Reliability {#security-and-reliability}

- Use authenticated admin access with role-based permissions.

- Validate all checkout and order inputs server-side.

- Protect against duplicate submissions and basic abuse.

- Store secrets in environment variables only.

- Use HTTPS across the entire site.

# 10. SEO and Marketing Requirements {#seo-and-marketing-requirements}

- Each product page must have a unique title, meta description, and slug.

- Homepage should clearly include the business location and main value proposition.

- Open Graph metadata should be configured for social sharing.

- Add structured data for products where possible.

- Support promotional banners for launches, deals, and new stock.

# 11. Analytics and Tracking {#analytics-and-tracking}

- Track page views, product clicks, add-to-cart events, checkout starts, order submissions, and WhatsApp button clicks.

- Measure cart abandonment and product-level conversion.

- Track top searched products and most-viewed categories.

# 12. Launch Plan {#launch-plan}

- Phase 1: Build core storefront, cart, checkout, order confirmation, and admin dashboard.

- Phase 2: Add online payment integration, order status updates, and automated notifications.

- Phase 3: Add customer accounts, wishlists, reviews, and advanced inventory logic.

# 13. Risks and Mitigations {#risks-and-mitigations}

- Risk: Low trust from new customers. Mitigation: strong branding, authenticity proof, warranty, and WhatsApp support.

- Risk: Stock inconsistency. Mitigation: real-time inventory updates and manual confirmation before fulfillment.

- Risk: Checkout drop-off. Mitigation: guest checkout, short forms, and clear order reassurance.

# 14. Open Questions {#open-questions}

- Will initial orders be pay-on-confirmation, EFT, or card payment?

- Will the first launch support delivery only, collection only, or both?

- Will the business sell new phones, refurbished phones, or both at launch?

*End of document*

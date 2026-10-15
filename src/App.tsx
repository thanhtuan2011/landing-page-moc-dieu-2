/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { GiftProductSection } from './components/GiftProductSection';
import { OrderFormSection } from './components/OrderFormSection';
import { BottomCTASection } from './components/BottomCTASection';
import { Footer } from './components/Footer';
import { MobileStickyCTA } from './components/MobileStickyCTA';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminGoalDashboard } from './components/AdminGoalDashboard';
import { MOC_DIEU_PRODUCTS } from './data/config';
import { OrderRecord, ProductItem } from './types';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(MOC_DIEU_PRODUCTS[0]);
  const [quantity, setQuantity] = useState<number>(1);

  // Send pageview analytics on initial mount with UTM source
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const utm_source = searchParams.get('utm_source');
    let source = utm_source || 'direct';

    if (!utm_source && document.referrer) {
      if (document.referrer.includes('facebook')) source = 'facebook';
      else if (document.referrer.includes('tiktok')) source = 'tiktok';
      else if (document.referrer.includes('zalo')) source = 'zalo';
      else if (document.referrer.includes('google')) source = 'google';
    }

    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pageview', source }),
    }).catch(() => {});
  }, []);

  const handleCtaClick = () => {
    // Record CTA click in analytics
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'cta_click' }),
    }).catch(() => {});

    const formElement = document.getElementById('dat-hang');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
  };

  const handleOrderSuccess = (order: OrderRecord) => {
    setConfirmedOrder(order);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EA] text-[#252525] relative selection:bg-[#2F5D7E] selection:text-white pb-16 md:pb-0 font-sans">
      {/* 1. Header: Sleek brand bar with logo and quick order trigger */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onCtaClick={handleCtaClick}
      />

      <main className="flex-1">
        {/* 2. Direct Product Collection (Flagship Spotlight + 4 Curated Sets) */}
        <GiftProductSection
          selectedProduct={selectedProduct}
          onSelectProduct={handleSelectProduct}
        />

        {/* 3. Streamlined Order Form */}
        <OrderFormSection
          selectedProduct={selectedProduct}
          onSelectProduct={handleSelectProduct}
          onOrderSuccess={handleOrderSuccess}
          onFormFocus={() => {}}
          quantity={quantity}
          setQuantity={setQuantity}
        />

        {/* 4. Bottom Call to Action */}
        <BottomCTASection onCtaClick={handleCtaClick} />
      </main>

      {/* 5. Minimal Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA
        selectedProduct={selectedProduct}
        onCtaClick={handleCtaClick}
      />

      {/* Order Confirmation Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}

      {/* Internal Goal 100-Order KPI Dashboard Modal */}
      <AdminGoalDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

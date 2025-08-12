'use client';
import React from 'react';
import { Designer } from '@/components/Designer';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ImageDesignerPage() {
  return (
    <>
      <Navbar />
      <Designer />
      <Footer />
    </>
  );
}

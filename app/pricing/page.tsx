import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Pricing } from '@/components/Pricing';

export const metadata = {
    title: 'Pricing | Certificate Generator',
    description: 'Choose a plan that fits your certificate generation needs.'
};

export default function PricingPage() {
    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-12">
                <Pricing />
            </main>
            <Footer />
        </>
    );
}
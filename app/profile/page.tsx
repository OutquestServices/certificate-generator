import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import ProfileSection from '@/components/profile/profile';

export const metadata = {
    title: 'Profile | InstantCertMailer',
    description: 'Manage account details and verified sender emails.'
};

export default function ProfilePage() {
    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-12">
                <ProfileSection />
            </main>
            <Footer />
        </>
    );
}
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Markini - Medical Appointment Platform',
    description: 'Book appointments with doctors, manage your health records, and access teleconsultations',
}

/**
 * Root layout component
 * Wraps all pages with providers and global components
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    {children}
                    <ToastContainer position="top-right" autoClose={3000} />
                </Providers>
            </body>
        </html>
    )
}

import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                    <ToastContainer position="top-center" autoClose={3000} />
                </AuthProvider>
            </body>
        </html>
    );
}

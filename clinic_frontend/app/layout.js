import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppGoogleOAuthProvider from "@/components/GoogleOAuthProvider";
import { THEME_STORAGE_KEY } from "@/lib/constants";

export const metadata = {
  title: "MediBook Clinic - Appointment Booking",
  description:
    "Schedule clinic appointments, manage doctor schedules, and receive notifications.",
};

const themeScript = `
(function() {
  try {
    var key = "${THEME_STORAGE_KEY}";
    var stored = localStorage.getItem(key);
    var dark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AppGoogleOAuthProvider>
            <AuthProvider>{children}</AuthProvider>
          </AppGoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface Settings {
  siteName: string;
  brandTitle: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  whatsappNumber: string;
  contactEmail: string;
  address: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  dbError: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/settings");
      if (res.data) {
        setSettings(res.data);
        setDbError(false);
      } else {
        console.warn("Empty settings received, using defaults if available");
      }
    } catch (error) {
      console.error("Failed to fetch settings, using local defaults", error);
      setDbError(true);
      // Fallback for UI during DB connection issues
      setSettings({
        siteName: "Prexious Vouge",
        brandTitle: "PREXIOUS VOUGE",
        tagline: "Luxury Fashion Heritage",
        heroTitle: "THE PINNACLE OF HIGH-END FASHION",
        heroSubtitle: "Discover the exclusive collection where tradition meets modernity.",
        heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
        whatsappNumber: "2347045001991",
        contactEmail: "concierge@prexiousvouge.com",
        address: "Luxury Estate, Victoria Island, Lagos",
        socialLinks: {}
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, dbError }}>
      {dbError && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white text-[10px] uppercase tracking-[0.2em] font-bold py-2 px-4 shadow-2xl flex justify-between items-center animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-white rounded-full" />
            <span>CRITICAL: Database Offline (Check MongoDB IP Whitelist)</span>
          </div>
          <button onClick={() => window.location.reload()} className="underline hover:no-underline">Retry Connection</button>
        </div>
      )}
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

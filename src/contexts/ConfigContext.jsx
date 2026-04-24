import { createContext, useEffect, useState } from "react";
import { getConfig } from "../services/configService";

export const ConfigContext = createContext();

const setFavicon = (url) => {
  let link = document.querySelector("link[rel~='icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = url;
};

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();

        setConfig(data);

        // 🔥 TITLE GLOBAL
        if (data?.app_name) {
          document.title = data.app_name;
        }

        // 🔥 FAVICON GLOBAL
        if (data?.logo_url) {
          const faviconUrl = `${import.meta.env.VITE_API_URL}${data.logo_url}`;
          setFavicon(faviconUrl);
        }

      } catch (err) {
        console.error("Erro ao carregar config", err);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
}
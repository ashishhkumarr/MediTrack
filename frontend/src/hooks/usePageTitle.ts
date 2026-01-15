import { useEffect } from "react";

import { APP_NAME } from "../config/brand";

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ${APP_NAME}`;
  }, [title]);
};

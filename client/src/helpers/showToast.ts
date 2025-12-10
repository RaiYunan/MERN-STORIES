import toast from "react-hot-toast";
import type { ToastOptions } from "react-hot-toast";

type ToastType = "success" | "error" | "info" | "default";

const config: ToastOptions = {
  position: "top-center",
  duration: 2500,
  style: {
    borderRadius: "16px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: "500",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    color: "dark",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: `
      0 8px 32px 0 rgba(0, 0, 0, 0.37),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 0 20px rgba(255, 255, 255, 0.03)
    `,
    maxWidth: "90%",
    margin: "0 auto 24px auto",
  },
};


export const showToast = (type: ToastType, message: string): void => {
  switch (type) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "info":
      toast(message, config);
      break;
    default:
      toast(message, config);
      break;
  }
};

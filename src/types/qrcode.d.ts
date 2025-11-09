declare module "qrcode" {
    export function toDataURL(
      text: string,
      opts?: {
        errorCorrectionLevel?: "L" | "M" | "Q" | "H";
        width?: number;
        margin?: number;
        color?: { dark?: string; light?: string };
      }
    ): Promise<string>;
  }
  
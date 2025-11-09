declare module "qrcode" {
    export interface QRCodeToDataURLOptions {
      errorCorrectionLevel?: "L" | "M" | "Q" | "H";
      version?: number;
      width?: number;
      margin?: number;
      color?: { dark?: string; light?: string };
      scale?: number;
      maskPattern?: number;
      toSJISFunc?: (codePoint: number) => number;
      rendererOpts?: { quality?: number };
    }
    export function toDataURL(
      text: string,
      options?: QRCodeToDataURLOptions
    ): Promise<string>;
  }
  
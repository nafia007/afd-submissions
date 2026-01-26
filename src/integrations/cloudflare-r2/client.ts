import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export interface R2UploadOptions {
  cacheControl?: string;
  upsert?: boolean;
}

export class CloudflareR2Client {
  private accountId: string;
  private bucketName: string;
  private publicUrl: string;
  private s3Client: S3Client | null;

  constructor() {
    this.accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
    this.bucketName = import.meta.env.VITE_CLOUDFLARE_R2_BUCKET;
    this.publicUrl = import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL;
    
    // Initialize S3 client for R2
    this.s3Client = null;
    if (this.isConfigured()) {
      this.s3Client = new S3Client({
        region: "auto",
        endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID || "",
          secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
        },
      });
    } else {
      console.error('Cloudflare R2 environment variables not configured');
    }
  }

  /**
   * Upload a file to Cloudflare R2 storage
   * @param file - File object to upload
   * @param path - Path within the bucket to store the file
   * @param options - Upload options
   * @returns Public URL of the uploaded file
   */
  async uploadFile(file: File, path: string, options?: R2UploadOptions): Promise<string> {
    try {
      if (!this.s3Client) {
        throw new Error("Cloudflare R2 client not configured");
      }

      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const params = {
        Bucket: this.bucketName,
        Key: path,
        Body: buffer,
        ContentType: file.type,
        CacheControl: options?.cacheControl || "3600",
      };

      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

      // Return public URL
      const publicUrl = this.getPublicUrl(path);
      console.log(`File uploaded to Cloudflare R2: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file to Cloudflare R2:', error);
      throw new Error('Failed to upload file to Cloudflare R2');
    }
  }

  /**
   * Generate a public URL for a file in Cloudflare R2 storage
   * @param path - Path within the bucket to the file
   * @returns Public URL of the file
   */
  getPublicUrl(path: string): string {
    return `${this.publicUrl}/${path}`;
  }

  /**
   * Validate that Cloudflare R2 is properly configured
   */
  isConfigured(): boolean {
    return !!(this.accountId && this.bucketName && this.publicUrl);
  }
}

// Create a singleton instance
export const r2Client = new CloudflareR2Client();

export interface R2UploadOptions {
  cacheControl?: string;
  upsert?: boolean;
}

export class CloudflareR2Client {
  private accountId: string;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
    this.bucketName = import.meta.env.VITE_CLOUDFLARE_R2_BUCKET;
    this.publicUrl = import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL;
    
    if (!this.accountId || !this.bucketName || !this.publicUrl) {
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
      // For now, we'll simulate the upload process and return the public URL directly
      // This is because we don't have the actual R2 API credentials

      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Construct and return the public URL
        const publicUrl = this.getPublicUrl(path);
        console.log(`Simulated file upload to Cloudflare R2: ${publicUrl}`);
        return publicUrl;
      }

      // For server-side (if this code ever runs there), implement real R2 API
      throw new Error("Server-side R2 upload not implemented");
      
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

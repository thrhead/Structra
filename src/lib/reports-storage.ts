/**
 * Rapor üretimi (Client-side'a geri dönmek için)
 * Vercel (serverless) ortamında "fs" ile static yazma desteklenmediğinden
 * doğrudan buffer objesini Base64'e sarıp frontend'e paslıyoruz. Veya
 * Nextjs Response.blob olarak dönebilir.
 */
export async function saveReportToStorage(jobId: string, buffer: ArrayBuffer) {
    const filename = `JobReport_${jobId}_${Date.now()}.pdf`;

    // Convert ArrayBuffer to Base64 String so frontend can create an anchor link easily
    const base64Data = Buffer.from(buffer).toString('base64');

    return {
        filename,
        base64: base64Data, // We deliver base64 to frontend directly instead of physical file URL
        url: null // Deprecated local path storage
    };
}

/**
 * Lists all stored reports.
 * [Deprecation Notice]: For serverless (Vercel) environments, local storage enumeration
 * causes an 'ENOENT' error. The reporting model has been switched to download-on-demand 
 * via jobs. We return an empty array here temporarily so old endpoints don't crash with 500.
 */
export async function listStoredReports() {
    return [];
}
